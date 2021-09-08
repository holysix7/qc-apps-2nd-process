import {Image, View, TextInput, TouchableWithoutFeedback, Keyboard, KeyboardAvoidingView, ScrollView, ActivityIndicator, Alert, VirtualizedList, TouchableOpacity} from 'react-native';
import React, {useEffect, useState} from 'react';
import { Container, Text, Button, Picker } from 'native-base';
import sampah from '../../../Assets/tong-sampah.png';
import cameraicon from '../../../Assets/cameraicon.png';
import AsyncStorage from "@react-native-community/async-storage";
import Axios from 'axios';
import moment from 'moment';
import app_version from	'../../../System/app_version';
import base_url from	'../../../System/base_url';
import {launchCamera} from 'react-native-image-picker';
import header_form from '../../../Templates/HeaderForm';

const new_lot_out = ({route, navigation}) => {
  const {sys_plant_id, line_id, line_name, line_number, eng_product_id, mkt_customer_id, mkt_customer_name, product_name, product_internal_part_id, product_customer_part_number, product_model, date} = route.params
	// console.log(qc_screen)
	const [user_name, setUserName] 	      				            = useState(null)
	const [data, setdata] 	      				            				= useState(null)
	const [records, setRecords] 	      				            	= useState([])
	const [loading, setLoading] 									            = useState(false)


  /**
   * leader parameter
   */
  const [category_processes, setCategoryProcesses]  = useState(0)
  const [shift, setShift]                           = useState(0)
  const [hour, setHour]                             = useState(0)
  const [category_ng_id, setCategoryNgId]						= useState(0)
  const [ng_can_rework, setNgCanRework]							= useState([])
  const [ng_cannot_rework, setNgCannotRework]				= useState([])
  const [img_base64_full, setImage]									= useState(null)

	/**
	 * qc paramater
	 */
  const [check_appearance_pn, setAppearancePN]			= useState(0)
  const [inspection_time, setInspectionTime]				= useState(null)
  const [check_packing, setCheckPacking]						= useState('OK')
  const [final_judgement, setFinalJudgement]				= useState('OK')

	useEffect(() => {
		get_data()
		FixInspectionTime()
		let isMounted = true
		return () => {
			isMounted = false
		}
		function FixInspectionTime() {
			let initialDate    = moment();
			var inspection     = setInterval(() => {
				var currentDate    = moment();    
				var second         = parseInt((currentDate - initialDate)/1000);
				var minutes        = parseInt(second/60);
				var hour           = parseInt(minutes/60);
				var second_kedua   = second - (minutes*60); 
				var menit_kedua    = minutes - (hour*60);
				var second_asli    = (second >= 60 ? second_kedua : second);
				var menit_asli     = (minutes >= 60 ? menit_kedua : minutes);
				var CombiningTime  = (hour + ":" + menit_asli + ":" + second_asli);
				if(isMounted) setInspectionTime(CombiningTime)
			}, 1000);
		}
	}, [])
	const object_header = {
		id: 3, 
		type: 'create',
		title: 'Form Rework Lot Out', 
		line_name: line_name != null ? line_name : '-', 
		date: date, 
		current_hour: null, 
		mkt_customer_name: mkt_customer_name != null ? mkt_customer_name : '-',
		product_name: product_name != null ? product_name : '-', 
		product_internal_part_id: product_internal_part_id != null ? product_internal_part_id : '-', 
		product_customer_part_number: product_customer_part_number != null ? product_customer_part_number : '-', 
		product_model: product_model != null ? product_model : '-'
	}
	const chooseImage = (i) => {
		const options = {
			includeBase64: true,
			maxHeight: 1000,
			maxWidth: 1000
		};
		launchCamera(options, (response) => {
			if (response.didCancel) {
				console.log('User cancelled image picker');
			} else if (response.error) {
				console.log('ImagePicker Error: ', response.error);
			} else if (response.customButton) {
				console.log('User tapped custom button: ', response.customButton);
			} else {
				const source = {counter_image: 1, uri: 'data:image/jpeg;base64;,' + response.assets[0].base64, status: 'active', ext: response.assets[0].fileName }
        var newArray = source.uri
        setImage(newArray)
			}
		})
  }

	const submit = async(type) => {
		// console.log(type)
		// setLoading(false)
		const user_id = await AsyncStorage.getItem('id')
		const token = await AsyncStorage.getItem("key")
		var ng_log_id = records.length > 0 ? records[0].ng_log_id : null
		var object_qc = null
		if(records.length > 0){
			if(records[0].next_screen == 'qc_form'){
				object_qc = {
					check_appearance_pn: parseInt(check_appearance_pn),
					check_appearance_n: records[0].verification_qc.check_appearance_n,
					check_packing: check_packing,
					final_judgement: final_judgement,
					verificated_by: parseInt(user_id),
					note_unnormal: records[0].verification_qc.note_unnormal,
					inspection_time: inspection_time
				}
			}
		}
		var body = {
			sys_plant_id: sys_plant_id,
			app_version: app_version,
			user_id: parseInt(user_id),
			tbl: 'daily_inspection_item_category_process_ng_log',
			ng_log_id: parseInt(ng_log_id),
			hour: parseInt(JSON.parse(hour)),
			shift: parseInt(shift),
			category_process_id: parseInt(category_processes),
			ng_category_id: parseInt(category_ng_id),
			ng_can_be_reworked: (records.length > 0 ? records[0].next_screen == 'qc_form' ? records[0].ng_can_be_reworked : ng_can_rework : null),
			ng_cannot_be_reworked: (records.length > 0 ? records[0].next_screen == 'qc_form' ? records[0].ng_cannot_be_reworked : ng_cannot_rework : null),
			verification_qc: (records.length > 0 ? records[0].next_screen == 'qc_form' ? object_qc : records[0].verification_qc : null)
		}
		console.log(body)
		var config = {
			method: (records.length > 0 ? records[0].next_screen == 'qc_form' ? 'put' : 'post' : null),
			url: (records.length > 0 ? records[0].next_screen == 'qc_form' ? `${base_url}/api/v2/secproc_update` : `${base_url}/api/v2/secprocs` : null),
			headers: { 
				'Authorization': token, 
				'Content-Type': 'application/json', 
				'Cookie': '_denapi_session=ubcfq3AHCuVeTlxtg%2F1nyEa3Ktylg8nY1lIEPD7pgS3YAWwlKOxwA0S9pw7JhvZ2mNkrYl0j62wAWJWJZd7AbfolGuHCwXgEMeJH6EoLiQ%3D%3D--M%2BjBb0uJeHmOf%2B3o--%2F2Fjw57x0Fyr90Ec9FVibQ%3D%3D'
			},
			data : body
		};
		Axios(config)
		.then(function (response){
			console.log("Res: ", response.status, " Ok")
			setLoading(true)
			Alert.alert(
				"Success Send Data",
				"Berhasil Menyimpan Data",
				[
					{ 
						text: "OK", 
						onPress: () => navigation.navigate('LotOut')
					}
				],
				{ cancelable: false }
			)
		})
		.catch(function (error){
			setLoading(true)
			Alert.alert(
				"Failed Send Data",
				"Gagal Kirim Data, Hubungi IT Department",
				[
					{ 
						text: "OK", 
						onPress: () => console.log(error) 
					}
				],
				{ cancelable: false }
			)
		})
	}

	const get_data = async() => {
		const token = await AsyncStorage.getItem("key")
		const user_id = await AsyncStorage.getItem('id')
		const name = await AsyncStorage.getItem('name')
		setUserName(name)
		const headers = {
			'Authorization': token
		}
		const params = {
      date: date,
			tbl: 'daily_inspection_item_category_process_ng_log',
			app_version: app_version,
			sys_plant_id: sys_plant_id,
			user_id: user_id,
      secproc_part_line_id: line_id,
      type: 'category_process'
		}
		Axios.get(`${base_url}/api/v2/secprocs?`, {params: params, headers: headers})
		.then(response => {
			setLoading(true)
			setdata(response.data.data)
			console.log(response.data.status)
		})
		.catch(error => {
			console.log(error)
		})
	}

  const catProcessItem = () => {
    var records = []
		if(data != null){
			if(data.list_category_process.length > 0){
				records.push(
					<Picker.Item key={'CatProc'} label={'Pilih'} value={'0'} />
				)
				data.list_category_process.map((v, k) => {
					records.push(
						<Picker.Item key={k} label={v.category_process_name} value={v.category_process_id} />
					)
				})
			}
		}
    return records
  }

  const shiftItem = () => {
    var records = []
		if(data != null){
			if(data.list_shift.length > 0){
				records.push(
					<Picker.Item key={'ShiftItem'} label={'Pilih'} value={'0'} />
				)
				data.list_shift.map((v, k) => {
					records.push(
						<Picker.Item key={k} label={JSON.stringify(v.shift)} value={JSON.stringify(v.shift)} />
					)
				})
			}
		}
    return records
  }

  const hourItem = () => {
    var records = []
		if(data != null){
			if(data.list_hours.length > 0){
				records.push(
					<Picker.Item key={'HourItem'} label={'Pilih'} value={'0'} />
				)
				data.list_hours.map((v, k) => {
					records.push(
						<Picker.Item key={k} label={v.hour} value={JSON.stringify(v.hour)} />
					)
				})
			}
		}
    return records
  }

  const ngItem = () => {
    var records = []
		if(data != null){
			if(data.list_ng.length > 0){
				records.push(
					<Picker.Item key={'HourItem'} label={'Pilih'} value={'0'} />
				)
				data.list_ng.map((v, k) => {
					records.push(
						<Picker.Item key={k} label={v.ng_category_name} value={JSON.stringify(v.ng_category_id)} />
					)
				})
			}
		}
    return records
  }

	const LoadData = async(value) => {
		if(parseInt(JSON.parse(value)) > 0){
			const token = await AsyncStorage.getItem("key")
			const user_id = await AsyncStorage.getItem('id')
			const headers = {
				'Authorization': token
			}
			const params = {
				date: date,
				tbl: 'daily_inspection_item_category_process_ng_log',
				app_version: app_version,
				sys_plant_id: sys_plant_id,
				user_id: user_id,
				secproc_part_line_id: line_id,
				hour: parseInt(JSON.parse(hour)),
				shift: parseInt(shift),
				category_process_id: category_processes,
				type: 'load_data',
				ng_category_id: parseInt(JSON.parse(value))
			}
			Axios.get(`${base_url}/api/v2/secprocs?`, {params: params, headers: headers})
			.then(response => {
				setLoading(true)
				setRecords(response.data.data)
				// console.log(response.data.data)
				console.log(response.data.message)
			})
			.catch(error => {
				console.log(error)
			})
		}
		setCategoryNgId(value)
	}
	
	const content = () => {
		return (
			<ScrollView key={'content'} style={{flexDirection: 'column'}}>
				<View style={{flexDirection: 'row', marginTop: 15}}>
					<View style={{flexDirection: 'column', width: '40%', marginLeft: 5, marginTop: 10}}>
						<Text>Tanggal</Text>
					</View>
					<View style={{flexDirection: 'column', marginLeft: 5, marginTop: 10}}>
						<Text>:</Text>
					</View>
					<View style={{flexDirection: 'column', margin: 5, justifyContent: 'center', height: 40, borderWidth: 1, paddingLeft: 5, borderRadius: 5, flex: 1, backgroundColor: '#b8b8b8'}}>
            <Text>{date}</Text>
          </View>
				</View>
				<View style={{flexDirection: 'row', marginTop: 5}}>
					<View style={{flexDirection: 'column', width: '40%', marginLeft: 5, marginTop: 10}}>
						<Text>Category Process</Text>
					</View>
					<View style={{flexDirection: 'column', marginLeft: 5, marginTop: 10}}>
						<Text>:</Text>
					</View>
					<View style={{flexDirection: 'column', margin: 5, justifyContent: 'center', height: 40, borderWidth: 1, paddingLeft: 5, borderRadius: 5, flex: 1}}>
						<Picker
							selectedValue={category_processes}
							onValueChange={(value) => setCategoryProcesses(value)}
						>					
              {catProcessItem()}
						</Picker>
					</View>
				</View>
				<View style={{flexDirection: 'row', marginTop: 5}}>
					<View style={{flexDirection: 'column', width: '40%', marginLeft: 5, marginTop: 10}}>
						<Text>Shift</Text>
					</View>
					<View style={{flexDirection: 'column', marginLeft: 5, marginTop: 10}}>
						<Text>:</Text>
					</View>
            {
              parseInt(category_processes) > 0 ?
              <View style={{flexDirection: 'column', margin: 5, justifyContent: 'center', height: 40, borderWidth: 1, paddingLeft: 5, borderRadius: 5, flex: 1}}>
                <Picker
                  selectedValue={shift}
                  onValueChange={(value) => setShift(value)}
                  >					
                  {shiftItem()}
                </Picker>
              </View> :
              <View style={{flexDirection: 'column', margin: 5, justifyContent: 'center', height: 40, borderWidth: 1, paddingLeft: 5, borderRadius: 5, flex: 1, backgroundColor: '#b8b8b8'}}>
                <Text>-</Text>
              </View>
            }
				</View>
				<View style={{flexDirection: 'row', marginTop: 5}}>
					<View style={{flexDirection: 'column', width: '40%', marginLeft: 5, marginTop: 10}}>
						<Text>Jam</Text>
					</View>
					<View style={{flexDirection: 'column', marginLeft: 5, marginTop: 10}}>
						<Text>:</Text>
					</View>
            {
              shift > 0 ?
              <View style={{flexDirection: 'column', margin: 5, justifyContent: 'center', height: 40, borderWidth: 1, paddingLeft: 5, borderRadius: 5, flex: 1}}>
                <Picker
                  selectedValue={hour}
                  onValueChange={(value) => setHour(value)}
                  >					
                  {hourItem()}
                </Picker>
              </View> :
              <View style={{flexDirection: 'column', margin: 5, justifyContent: 'center', height: 40, borderWidth: 1, paddingLeft: 5, borderRadius: 5, flex: 1, backgroundColor: '#b8b8b8'}}>
                <Text>-</Text>
              </View>
            }
				</View>
				<View style={{flexDirection: 'row', marginTop: 5}}>
					<View style={{flexDirection: 'column', width: '40%', marginLeft: 5, marginTop: 10}}>
						<Text>Category NG</Text>
					</View>
					<View style={{flexDirection: 'column', marginLeft: 5, marginTop: 10}}>
						<Text>:</Text>
					</View>
            {
              parseInt(JSON.parse(hour)) > 0 ?
              <View style={{flexDirection: 'column', margin: 5, justifyContent: 'center', height: 40, borderWidth: 1, paddingLeft: 5, borderRadius: 5, flex: 1}}>
                <Picker
                  selectedValue={category_ng_id}
                  onValueChange={(value) => LoadData(value)}
                  >					
                  {ngItem()}
                </Picker>
              </View> :
              <View style={{flexDirection: 'column', margin: 5, justifyContent: 'center', height: 40, borderWidth: 1, paddingLeft: 5, borderRadius: 5, flex: 1, backgroundColor: '#b8b8b8'}}>
                <Text>-</Text>
              </View>
            }
				</View>
				<View style={{flexDirection: 'row', marginTop: 5}}>
					<View style={{flexDirection: 'column', width: '40%', marginLeft: 5, marginTop: 10}}>
						<Text>Lot Number</Text>
					</View>
					<View style={{flexDirection: 'column', marginLeft: 5, marginTop: 10}}>
						<Text>:</Text>
					</View>
            {
              records.length > 0 ?
              <View style={{flexDirection: 'column', margin: 5, justifyContent: 'center', height: 40, borderWidth: 1, paddingLeft: 5, borderRadius: 5, flex: 1, backgroundColor: '#b8b8b8'}}>
                <Text>{records[0].lot_number}</Text>
              </View> :
              <View style={{flexDirection: 'column', margin: 5, justifyContent: 'center', height: 40, borderWidth: 1, paddingLeft: 5, borderRadius: 5, flex: 1, backgroundColor: '#b8b8b8'}}>
                <Text>-</Text>
              </View>
            }
				</View>
				<View style={{flexDirection: 'row', marginTop: 5}}>
					<View style={{flexDirection: 'column', width: '40%', marginLeft: 5, marginTop: 10}}>
						<Text>Leader</Text>
					</View>
					<View style={{flexDirection: 'column', marginLeft: 5, marginTop: 10}}>
						<Text>:</Text>
					</View>
            {
              records.length > 0 ?
              <View style={{flexDirection: 'column', margin: 5, justifyContent: 'center', height: 40, borderWidth: 1, paddingLeft: 5, borderRadius: 5, flex: 1, backgroundColor: '#b8b8b8'}}>
                {
									user_name.length > 26 ?
									<Text style={{fontSize: 13.5}}>{user_name}</Text> : 
									<Text>{user_name}</Text>
								}
              </View> :
              <View style={{flexDirection: 'column', margin: 5, justifyContent: 'center', height: 40, borderWidth: 1, paddingLeft: 5, borderRadius: 5, flex: 1, backgroundColor: '#b8b8b8'}}>
                <Text>-</Text>
              </View>
            }
				</View>
				<View style={{flexDirection: 'row', marginTop: 5}}>
					<View style={{flexDirection: 'column', width: '40%', marginLeft: 5, marginTop: 10}}>
						<Text>Quantity</Text>
					</View>
					<View style={{flexDirection: 'column', marginLeft: 5, marginTop: 10}}>
						<Text>:</Text>
					</View>
            {
              records.length > 0 ?
              <View style={{flexDirection: 'column', margin: 5, justifyContent: 'center', height: 40, borderWidth: 1, paddingLeft: 5, borderRadius: 5, flex: 1, backgroundColor: '#b8b8b8'}}>
								<Text>{records[0].quantity}</Text>
              </View> :
              <View style={{flexDirection: 'column', margin: 5, justifyContent: 'center', height: 40, borderWidth: 1, paddingLeft: 5, borderRadius: 5, flex: 1, backgroundColor: '#b8b8b8'}}>
                <Text>-</Text>
              </View>
            }
				</View>
				<View style={{flexDirection: 'row', marginTop: 5}}>
					<View style={{flexDirection: 'column', width: '40%', marginLeft: 5, marginTop: 10}}>
						<Text>Jumlah OK</Text>
					</View>
					<View style={{flexDirection: 'column', marginLeft: 5, marginTop: 10}}>
						<Text>:</Text>
					</View>
            {
              records.length > 0 ?
              <View style={{flexDirection: 'column', margin: 5, justifyContent: 'center', height: 40, borderWidth: 1, paddingLeft: 5, borderRadius: 5, flex: 1, backgroundColor: '#b8b8b8'}}>
								<Text>{records[0].quantity_ok}</Text>
              </View> :
              <View style={{flexDirection: 'column', margin: 5, justifyContent: 'center', height: 40, borderWidth: 1, paddingLeft: 5, borderRadius: 5, flex: 1, backgroundColor: '#b8b8b8'}}>
                <Text>-</Text>
              </View>
            }
				</View>
				<View style={{flexDirection: 'row', marginTop: 5}}>
					<View style={{flexDirection: 'column', width: '40%', marginLeft: 5, marginTop: 10}}>
						<Text>Jumlah NG</Text>
					</View>
					<View style={{flexDirection: 'column', marginLeft: 5, marginTop: 10}}>
						<Text>:</Text>
					</View>
            {
              records.length > 0 ?
              <View style={{flexDirection: 'column', margin: 5, justifyContent: 'center', height: 40, borderWidth: 1, paddingLeft: 5, borderRadius: 5, flex: 1, backgroundColor: '#b8b8b8'}}>
								<Text>{records[0].quantity_ng}</Text>
              </View> :
              <View style={{flexDirection: 'column', margin: 5, justifyContent: 'center', height: 40, borderWidth: 1, paddingLeft: 5, borderRadius: 5, flex: 1, backgroundColor: '#b8b8b8'}}>
                <Text>-</Text>
              </View>
            }
				</View>
				<View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
					<View style={{flexDirection: 'column', justifyContent: 'center', borderBottomWidth: 1, borderTopWidth: 1, flex: 1, marginTop: 30}}>
						<Text style={{textAlign: 'center', fontSize: 20, fontWeight: 'bold', paddingVertical: 10}}>Detail NG</Text>
					</View>
				</View>
				{funcContent('ng_details')}
				{
					records.length > 0 ? 
					<View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
						<View style={{flexDirection: 'column', justifyContent: 'center', borderBottomWidth: 1, borderTopWidth: 1, flex: 1, marginTop: 30}}>
							<Text style={{textAlign: 'center', fontSize: 20, fontWeight: 'bold', paddingVertical: 10}}>Verifikasi QC</Text>
						</View>
					</View> :
					null 
				}
				{
					records.length > 0 ?
					records[0].next_screen  == 'qc_form' ?
					funcContent('verifikasi_qc') :
					<View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
						<View style={{flexDirection: 'column', alignItems: 'center', borderWidth: 1, borderRadius: 10, width: 400, marginTop: 30, backgroundColor: '#c9c9c9'}}>
							<View style={{width: 200}}>
								<Text style={{textAlign: 'center', fontWeight: 'bold', paddingVertical: 10}}>Hubungi Leader Agar Segera Melakukan Input</Text>
							</View>
						</View>
					</View> :
					null 
				}
				{
					records.length > 0 ?
					records[0].next_screen  == 'qc_form' ?
					records[0].verification_qc.inspection_time == null  ?
					<View style={{flexDirection: 'row', justifyContent: 'center', marginVertical: 10}}>
						<Button style={{borderRadius: 5}} onPress={() => submit('qc_form')}>
							<Text>Simpan</Text>
						</Button>
					</View> :
					null :
					<View style={{flexDirection: 'row', justifyContent: 'center', marginVertical: 10}}>
						<Button style={{borderRadius: 5}} onPress={() => submit('Leader')}>
							<Text>Simpan</Text>
						</Button>
					</View> :
					null 
				}
			</ScrollView>
		)
	}

	const verificationQcFunc = () => {
		if(records.length > 0){
			if(records[0].verification_qc != null){
				// console.log(records[0].verification_qc)
				if(records[0].verification_qc.verificated_by == null){
					if(user_name.length > 26){
						return(
							<Text style={{fontSize: 13.5}}>{user_name}</Text>
						)
					}else{
						return(
							<Text>{user_name}</Text>
						)
					}
				}else{
					if(user_name.length > 26){
						return(
							<Text style={{fontSize: 13.5}}>{records[0].verification_qc.verificated_name}</Text>
						)
					}else{
						return(
							<Text>{records[0].verification_qc.verificated_name}</Text>
						)
					}
				}
			}
		}else{
			<Text>-</Text>
		}
	}

	const updateFinalJudgmentByPN = (value) => { 
		setAppearancePN(value)
		if(parseInt(value) > 0 || check_packing == 'NG'){
			setFinalJudgement('NG')
		}else{
			setFinalJudgement('OK')
		}
	}

	const updateFinalJudgmentByCheckPacking = (value) => {
		console.log(value)
		setCheckPacking(value)
		if(value == 'NG' || check_appearance_pn > 0){
			setFinalJudgement('NG')
		}else{
			setFinalJudgement('OK')
		}
	}

	const funcContent = (type) => {
		var content = []
		if(records.length > 0){
			if(records[0].next_screen == 'qc_form'){
				if(type == 'ng_details'){
					var header 			= [
						<View key={'header'} style={{flexDirection: 'row', padding: 5, flex: 1, justifyContent: 'center'}}>
							<View style={{flexDirection: 'column', padding: 10, width: '13%', borderBottomWidth: 1}}>
								<Text style={{fontWeight: 'bold'}}>No.</Text>
							</View>
							<View style={{flexDirection: 'column', padding: 10, flex: 1, alignItems: 'center', borderBottomWidth: 1}}>
								<Text style={{fontWeight: 'bold'}}>Nama NG</Text>
							</View>
							<View style={{flexDirection: 'column', padding: 10, width: '21%', borderBottomWidth: 1}}>
								<Text style={{fontWeight: 'bold'}}>QTY NG</Text>
							</View>
						</View>
					]
					var bisa_rework_body 	= []
					var gabisa_rework_body 	= []
					if(records[0].ng_can_be_reworked.length > 0){
						records[0].ng_can_be_reworked.map((v, k) => {
							var ganjil = false
							var style = {flexDirection: 'row', paddingHorizontal: 5, flex: 1, justifyContent: 'center'}
							if(k % 2 != 0){
								var ganjil = true
							}
							if(ganjil == true){
								style = {flexDirection: 'row', paddingHorizontal: 5, flex: 1, justifyContent: 'center', backgroundColor: '#c9c9c9'} 
							}
							bisa_rework_body.push(
								<View key={k} style={style}>
									<View style={{width: '13%'}}>
										<View style={{borderBottomWidth: 1, height: 40, alignItems: 'center', justifyContent: 'center', paddingLeft: 5}}>
											<Text style={{fontSize: 15}}> {k + 1}. </Text>
										</View>
									</View>
									<View style={{flex: 1}}>
										<View style={{borderBottomWidth: 1, height: 40, justifyContent: 'center', alignItems: 'center', paddingLeft: 5}}>
											<Text>{v.qc_ng_category_name}</Text>
										</View>
									</View>
									<View style={{width: '21%'}}>
										<View style={{borderBottomWidth: 1, height: 40, justifyContent: 'center', alignItems: 'center', paddingLeft: 5}}>
											<Text>{v.quantity}</Text>
										</View>
									</View>
								</View>	
							)
						})
					}else{
						bisa_rework_body.push(
							<View key={'bisa_rework'} style={{flexDirection: 'row', paddingHorizontal: 5, flex: 1, justifyContent: 'center'}}>
								<Text style={{textAlign: 'center'}}>User Tidak Melakukan Input Can Be Rework</Text>
							</View>	
						)
					}
					if(records[0].ng_cannot_be_reworked.length > 0){
						records[0].ng_cannot_be_reworked.map((v, k) => {
							var ganjil = false
							var style = {flexDirection: 'row', paddingHorizontal: 5, flex: 1, justifyContent: 'center'}
							if(k % 2 != 0){
								var ganjil = true
							}
							if(ganjil == true){
								style = {flexDirection: 'row', paddingHorizontal: 5, flex: 1, justifyContent: 'center', backgroundColor: '#c9c9c9'} 
							}
							gabisa_rework_body.push(
								<View key={k} style={style}>
									<View style={{width: '13%'}}>
										<View style={{borderBottomWidth: 1, height: 40, alignItems: 'center', justifyContent: 'center', paddingLeft: 5}}>
											<Text style={{fontSize: 15}}> {k + 1}. </Text>
										</View>
									</View>
									<View style={{flex: 1}}>
										<View style={{borderBottomWidth: 1, height: 40, justifyContent: 'center', alignItems: 'center', paddingLeft: 5}}>
											<Text>{v.qc_ng_category_name}</Text>
										</View>
									</View>
									<View style={{width: '21%'}}>
										<View style={{borderBottomWidth: 1, height: 40, justifyContent: 'center', alignItems: 'center', paddingLeft: 5}}>
											<Text>{v.quantity}</Text>
										</View>
									</View>
								</View>	
							)
						})
					}else{
						gabisa_rework_body.push(
							<View key={'bisa_rework'} style={{flexDirection: 'row', paddingHorizontal: 5, flex: 1, justifyContent: 'center'}}>
								<Text style={{textAlign: 'center'}}>User Tidak Melakukan Input Cannot Be Rework</Text>
							</View>	
						)
					}
					content.push(
						<View key={'content_1'}>
							<View style={{flexDirection: 'row', padding: 5}}>
								<Text style={{fontSize: 13, borderBottomWidth: 1}}>NG Bisa Dirework</Text>
							</View>
							{header}
							{bisa_rework_body}		
							<View style={{flexDirection: 'row', padding: 5}}>
								<Text style={{fontSize: 13, borderBottomWidth: 1}}>NG Tidak Bisa Dirework</Text>
							</View>
							{records[0].ng_cannot_be_reworked.length > 0 ? header : null}
							{gabisa_rework_body}		
						</View>
					)
				}else{
					content.push(
						<View key={'content_2'} style={{marginBottom: 25}}>
							<View style={{flexDirection: 'row', marginTop: 10}}>
								<View style={{flexDirection: 'column', width: '40%', marginLeft: 5}}>
									<View style={{flexDirection: 'row', flex: 1, alignItems: 'center'}}>
										<Text>Inspector</Text>
									</View>
								</View>
								<View style={{flexDirection: 'column', marginLeft: 5}}>
									<View style={{flexDirection: 'row', flex: 1, alignItems: 'center'}}>
										<Text>:</Text>
									</View>
								</View>
								<View style={{flexDirection: 'column', margin: 5, justifyContent: 'center', paddingLeft: 5, flex: 1}}>
									<View style={{justifyContent: 'center', borderWidth: 1, borderRadius: 5, height: 40, backgroundColor: '#b8b8b8', paddingLeft: 5}}>
										{
											verificationQcFunc()
										}
									</View>
								</View>
							</View>
							<View style={{flexDirection: 'row', marginTop: 15}}>
								<View style={{flexDirection: 'column', width: '40%', marginLeft: 5}}>
									<View style={{flexDirection: 'row', flex: 1, alignItems: 'center'}}>
										<Text>Check Appearance</Text>
									</View>
								</View>
								<View style={{flexDirection: 'column', marginLeft: 5}}>
									<View style={{flexDirection: 'row', flex: 1, alignItems: 'center'}}>
										<Text>:</Text>
									</View>
								</View>
								<View style={{flexDirection: 'column', margin: 5, justifyContent: 'center', paddingLeft: 5, flex: 1}}>
										{
											records.length > 0 ?
											records[0].verification_qc.check_appearance_pn != null ?
											<View style={{flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderRadius: 5, height: 40, backgroundColor: '#b8b8b8', paddingLeft: 5}}>
												<Text>{records[0].verification_qc.check_appearance_pn}</Text> 
											</View> :
											<View style={{flexDirection: 'row', borderWidth: 1, borderRadius: 5, height: 40}}>
												<TextInput placeholder={'PN'} onChangeText={(value) => updateFinalJudgmentByPN(value)} keyboardType='numeric' />
											</View> :
											null
										}
									<View style={{flexDirection: 'row', borderWidth: 1, borderRadius: 5, height: 40, marginTop: 5, paddingLeft: 5, alignItems: 'center', backgroundColor: '#b8b8b8'}}>
										{
											records.length > 0 ?
											records[0].verification_qc.check_appearance_n != null ?
											<Text>{records[0].verification_qc.check_appearance_n}</Text> :
											<Text>-</Text> :
											null
										}
									</View>
								</View>
							</View>
							<View style={{flexDirection: 'row', marginTop: 10}}>
								<View style={{flexDirection: 'column', width: '40%', marginLeft: 5}}>
									<View style={{flexDirection: 'row', flex: 1, alignItems: 'center'}}>
										<Text>Check Packing</Text>
									</View>
								</View>
								<View style={{flexDirection: 'column', marginLeft: 5}}>
									<View style={{flexDirection: 'row', flex: 1, alignItems: 'center'}}>
										<Text>:</Text>
									</View>
								</View>
								<View style={{flexDirection: 'column', margin: 5, justifyContent: 'center', paddingLeft: 5, flex: 1}}>
									{
										records.length > 0 ?
										records[0].verification_qc.check_appearance_pn == null ?
										<View style={{justifyContent: 'center', borderWidth: 1, borderRadius: 5, height: 40}}>
											<Picker
												selectedValue={check_packing}
												onValueChange={(value) => updateFinalJudgmentByCheckPacking(value)}
												>					
												<Picker.Item label={'OK'} value={'OK'} />
												<Picker.Item label={'NG'} value={'NG'} />
											</Picker>
										</View> :
										<View style={{justifyContent: 'center', borderWidth: 1, borderRadius: 5, height: 40, backgroundColor: '#b8b8b8', paddingLeft: 5}}>
											<Text>{records[0].verification_qc.check_packing}</Text>
										</View> :
										null
									}
								</View>
							</View>
							<View style={{flexDirection: 'row', marginTop: 10}}>
								<View style={{flexDirection: 'column', width: '40%', marginLeft: 5}}>
									<View style={{flexDirection: 'row', flex: 1, alignItems: 'center'}}>
										<Text>Status</Text>
									</View>
								</View>
								<View style={{flexDirection: 'column', marginLeft: 5}}>
									<View style={{flexDirection: 'row', flex: 1, alignItems: 'center'}}>
										<Text>:</Text>
									</View>
								</View>
								<View style={{flexDirection: 'column', margin: 5, justifyContent: 'center', paddingLeft: 5, flex: 1}}>
									<View style={{justifyContent: 'center', borderWidth: 1, borderRadius: 5, height: 40, backgroundColor: '#b8b8b8', paddingLeft: 5}}>
										<Text>{final_judgement}</Text>
									</View>
								</View>
							</View>
							<View style={{flexDirection: 'row', marginTop: 10}}>
								<View style={{flexDirection: 'column', width: '40%', marginLeft: 5}}>
									<View style={{flexDirection: 'row', flex: 1, alignItems: 'center'}}>
										<Text>Note Unnormal</Text>
									</View>
								</View>
								<View style={{flexDirection: 'column', marginLeft: 5}}>
									<View style={{flexDirection: 'row', flex: 1, alignItems: 'center'}}>
										<Text>:</Text>
									</View>
								</View>
								<View style={{flexDirection: 'column', margin: 5, justifyContent: 'center', paddingLeft: 5, flex: 1}}>
									<View style={{justifyContent: 'center', borderWidth: 1, borderRadius: 5, height: 40, backgroundColor: '#b8b8b8', paddingLeft: 5}}>
										<Text>{records.length > 0 ? records[0].verification_qc.note_unnormal != null ? records[0].verification_qc.note_unnormal : '-' : '-'}</Text>
									</View>
								</View>
							</View>
							{ImageFunction()}
							{
								records.length > 0 ?
								records[0].verification_qc.inspection_time == null ?
								records[0].next_screen  == 'qc_form' ?
								<View style={{flexDirection: 'row', marginTop: 10}}>
									<View style={{flexDirection: 'column', flex: 1, alignItems: 'center', marginLeft: 5}}>
										<Text>{inspection_time}</Text>
									</View>
								</View> :
								null :
								<View style={{flexDirection: 'row', marginTop: 10}}>
									<View style={{flexDirection: 'column', flex: 1, alignItems: 'center', marginLeft: 5}}>
										<Text>{records[0].verification_qc.inspection_time}</Text>
									</View>
								</View> :
								null
							}
						</View>
					)
				}
			}else{
				content.push(
					<View key={'content_3'} style={{marginBottom: 10}}>
						<View style={{flexDirection: 'row', justifyContent: 'center'}}>
							<Button style={{marginTop: 10, borderRadius: 5}} onPress={() => addNgToCart('can')}><Text>+ Bisa Rework</Text></Button>
						</View>
						<View style={{flexDirection: 'row', padding: 5}}>
							<Text style={{fontSize: 13, borderBottomWidth: 1}}>NG Bisa Dirework</Text>
						</View>
						{
							ng_can_rework.length > 0 ?
							<View style={{flexDirection: 'row', padding: 5, flex: 1}}>
								<View style={{flexDirection: 'column', padding: 10, width: '13%', borderBottomWidth: 1}}>
									<Text>No.</Text>
								</View>
								<View style={{flexDirection: 'column', padding: 10, flex: 1, alignItems: 'center', borderBottomWidth: 1}}>
									<Text>Nama NG</Text>
								</View>
								<View style={{flexDirection: 'column', padding: 10, width: '21%', borderBottomWidth: 1}}>
									<Text>QTY NG</Text>
								</View>
								<View style={{flexDirection: 'column', padding: 10, width: '18%', borderBottomWidth: 1}}>
									<Text>Action</Text>
								</View>
							</View> :
							null
						}
						{NgBisaReworkFunction('can')}
						<View style={{flexDirection: 'row', justifyContent: 'center'}}>
							<Button style={{marginTop: 10, borderRadius: 5}} onPress={() => addNgToCart('cannot')}><Text>+ Tidak Bisa Rework</Text></Button>
						</View>
						<View style={{flexDirection: 'row', padding: 5}}>
							<Text style={{fontSize: 13, borderBottomWidth: 1}}>NG Tidak Bisa Dirework</Text>
						</View>
						{
							ng_cannot_rework.length > 0 ?
							<View style={{flexDirection: 'row', padding: 5, flex: 1}}>
								<View style={{flexDirection: 'column', padding: 10, width: '13%', borderBottomWidth: 1}}>
									<Text>No.</Text>
								</View>
								<View style={{flexDirection: 'column', padding: 10, flex: 1, alignItems: 'center', borderBottomWidth: 1}}>
									<Text>Nama NG</Text>
								</View>
								<View style={{flexDirection: 'column', padding: 10, width: '21%', borderBottomWidth: 1}}>
									<Text>QTY NG</Text>
								</View>
								<View style={{flexDirection: 'column', padding: 10, width: '18%', borderBottomWidth: 1}}>
									<Text>Action</Text>
								</View>
							</View> :
							null
						}
						{NgBisaReworkFunction('cannot')}
					</View>
				)
			}
		}
		return content
	}

	const NgBisaReworkFunction = (type) => {
		var records = []
		if(type == 'can'){
			if(ng_can_rework.length > 0){
				ng_can_rework.map((v, k) => {
					records.push(
						<View key={k} style={{flexDirection: 'row', paddingHorizontal: 5, flex: 1}}>
							<View style={{width: '13%'}}>
								<View style={{borderBottomWidth: 1, height: 40, alignItems: 'center', justifyContent: 'center', paddingLeft: 5}}>
									<Text style={{fontSize: 15}}> {v.id}. </Text>
								</View>
							</View>
							<View style={{flex: 1}}>
								<View style={{borderBottomWidth: 1, height: 40, justifyContent: 'center', paddingLeft: 5}}>
									<Picker
										selectedValue={ng_can_rework[k].ng_category_id}
										onValueChange={(value) => updateValue(value, k, 'can_rework', 'picker')}
										>					
										{ListNGFunction()}
									</Picker>
								</View>
							</View>
							<View style={{width: '21%'}}>
								<View style={{borderBottomWidth: 1, height: 40, justifyContent: 'center', paddingLeft: 5}}>
									<TextInput onChangeText={(value) => updateValue(value, k, 'can_rework', 'input')} keyboardType="numeric" />
								</View>
							</View>
							<View style={{width: '18%', alignItems: 'center', borderBottomWidth: 1,}} >
								<TouchableOpacity onPress={() => removeCart(ng_can_rework[k].id, 'can') }>
									<Image source={sampah} style={{backgroundColor: 'red', borderRadius: 5, height: 38, width: 38}} />
								</TouchableOpacity>
							</View>
						</View>	
					)
				})
			}
		}else{
			if(ng_cannot_rework.length > 0){
				ng_cannot_rework.map((v, k) => {
					records.push(
						<View key={k} style={{flexDirection: 'row', paddingHorizontal: 5, flex: 1}}>
							<View style={{width: '13%'}}>
								<View style={{borderBottomWidth: 1, height: 40, alignItems: 'center', justifyContent: 'center', paddingLeft: 5}}>
									<Text style={{fontSize: 15}}> {v.id}. </Text>
								</View>
							</View>
							<View style={{flex: 1}}>
								<View style={{borderBottomWidth: 1, height: 40, justifyContent: 'center', paddingLeft: 5}}>
									<Picker
										selectedValue={ng_cannot_rework[k].ng_category_id}
										onValueChange={(value) => updateValue(value, k, 'cannot_rework', 'picker')}
										>					
										{ListNGFunction()}
									</Picker>
								</View>
							</View>
							<View style={{width: '21%'}}>
								<View style={{borderBottomWidth: 1, height: 40, justifyContent: 'center', paddingLeft: 5}}>
									<TextInput onChangeText={(value) => updateValue(value, k, 'cannot_rework', 'input')} keyboardType="numeric" />
								</View>
							</View>
							<View style={{width: '18%', alignItems: 'center', borderBottomWidth: 1,}} >
								<TouchableOpacity onPress={() => removeCart(ng_cannot_rework[k].id, 'cannot') }>
									<Image source={sampah} style={{backgroundColor: 'red', borderRadius: 5, height: 38, width: 38}} />
								</TouchableOpacity>
							</View>
						</View>	
					)
				})
			}
		}
		return records
	}

	const addNgToCart = (type) => {
		if(type == 'can'){
			setNgCanRework([...ng_can_rework, {
				id: ng_can_rework.length + 1,
				ng_category_id: 0,
				ng_category_name: null,
				quantity: 0
			}])
		}else{
			setNgCannotRework([...ng_cannot_rework, {
				id: ng_cannot_rework.length + 1,
				ng_category_id: 0,
				ng_category_name: null,
				quantity: 0
			}])
		}
	}

	const removeCart = (id, type) => {
		if(type == 'can'){
			setNgCanRework(ng_can_rework.filter(item => item.id == id ? null : item.id))
		}else{
			setNgCannotRework(ng_cannot_rework.filter(item => item.id == id ? null : item.id))
		}
	}

	const ListNGFunction = () => {
		var content = []
		if(records.length > 0){
			if(records[0].defect_categories.length > 0){
				content.push(
					<Picker.Item key={'listNGs'} value={'0'} label={'Pilih'} />
				)
				console.log(records[0].defect_categories)
					records[0].defect_categories.map((v, k) => {
						content.push(
							<Picker.Item key={k} value={v.qc_ng_category_id} label={v.qc_ng_category_name} />
						)
				})
			}
		}
		return content
	}

	const updateValue = (v, k, type, attr) => {
		if(type == 'can_rework'){
			if(attr == 'picker'){
				var new_object = [...ng_can_rework]
				new_object[k].ng_category_id = v
			}else{
				var new_object = [...ng_can_rework]
				new_object[k].quantity = v
			}
			setNgCanRework(new_object)
		}else{
			if(attr == 'picker'){
				var new_object = [...ng_cannot_rework]
				new_object[k].ng_category_id = v
			}else{
				var new_object = [...ng_cannot_rework]
				new_object[k].quantity = v
			}
			setNgCannotRework(new_object)
		}
	}

	const ImageFunction = () => {
		// if(img_base64_full != null){
		// 	var image = <Image source={{uri: img_base64_full}} style={{width: 270, height: 270, resizeMode: 'contain'}}/>
		// }else{
		// 	var image = <Image source={cameraicon} style={{width: 50, height: 50}} />
		// }
		if(records.length > 0){
			var image, style = null
			if(records[0].img_base64_full != null){
				var image = <Image source={{uri:  records[0].img_base64_full}} style={{width: 270, height: 270, resizeMode: 'contain'}}/>
				var style = {flexDirection: 'column', alignItems: 'center', borderWidth: 1, width: 300, height: 300}
			}
			<View style={style}>
				<TouchableOpacity style={{flex: 1, justifyContent: 'center'}} >
					{image}
				</TouchableOpacity>
			</View>
		}
		return(
			<View style={{flexDirection: 'row', marginTop: 10}}>
				<View style={{paddingTop: 20, flexDirection: 'row', flex: 1, justifyContent: 'center'}}>
					{/* <View style={{flexDirection: 'column', alignItems: 'center', borderWidth: 1, width: 300, height: 300}}>
						<TouchableOpacity style={{flex: 1, justifyContent: 'center'}} onPress={() => chooseImage()}>
							{image}
						</TouchableOpacity>
					</View> */}
				</View>
			</View>
		)
	}

	return(
		<KeyboardAvoidingView style={{flex:1}} behavior={Platform.OS == "ios" ? "padding" : "height"}>
			<TouchableWithoutFeedback onPress={Keyboard.dismiss}>
				<Container>
					<View style={{flex: 1, height: 100, backgroundColor: '#dfe0df', borderWidth: 0.3, flexDirection: 'column'}}>
						{header_form(object_header)}

						{loading ? content() : <View style={{justifyContent: 'center'}}><ActivityIndicator size="large" color="#0000ff"/></View>}

					</View>
				</Container>
			</TouchableWithoutFeedback>
		</KeyboardAvoidingView>
	)
}

export default new_lot_out;