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
  const {sys_plant_id, line_id, line_name, line_number, eng_product_id, mkt_customer_id, mkt_customer_name, product_name, product_internal_part_id, product_customer_part_number, product_model, date, screen} = route.params
	// console.log(screen)
	useEffect(() => {
		get_data()
		if(screen == 'QC'){
			FixInspectionTime()
		}
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
	const [user_name, setUserName] 	      				            = useState(null)
	const [data, setdata] 	      				            				= useState(null)
	const [records, setRecords] 	      				            	= useState([])
	const [ng_data, setNGData] 	      				            	= useState([])
	const [operator, setOperator] 	                          = useState([])
	const [loading, setLoading] 									            = useState(false)
	const [data_categories, setCategories]				            = useState(null)
	const [modal, setModal]												            = useState(true)
	const [filtered, setFiltered] 								            = useState(null)
	const [operator_process, setOperatorProcess]	            = useState([])
	const [total_process, setTotalProcess]				            = useState([])

  /**
   * Parameter
   */
  const [category_processes, setCategoryProcesses]  = useState(0)
  const [shift, setShift]                           = useState(0)
  const [hour, setHour]                             = useState(0)
  const [category_ng_id, setCategoryNgId]						= useState(0)
  const [ng_can_rework, setNgCanRework]							= useState([])
  const [ng_cannot_rework, setNgCannotRework]				= useState([])
  const [check_packing, setCheckPacking]						= useState(null)
  const [img_base64_full, setImage]									= useState(null)
  const [inspection_time, setInspectionTime]				= useState(null)

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
		console.log(type)
		// setLoading(false)
		// const user_id = await AsyncStorage.getItem('id')
		// const token = await AsyncStorage.getItem("key")
		// var body = {
		// 	tbl: 'planning_pic_product',
		// 	update_hour: sys_plant_id,
		// 	app_version: app_version,
		// 	user_id: user_id,
		// 	secproc_planning_product_item_id: secproc_planning_product_item_id,
		// 	operator_process: operator_process,
		// 	sys_plant_id: sys_plant_id
		// }
		// var config = {
		// 	method: 'post',
		// 	url: `${base_url}/api/v2/secprocs`,
		// 	headers: { 
		// 		'Authorization': token, 
		// 		'Content-Type': 'application/json', 
		// 		'Cookie': '_denapi_session=ubcfq3AHCuVeTlxtg%2F1nyEa3Ktylg8nY1lIEPD7pgS3YAWwlKOxwA0S9pw7JhvZ2mNkrYl0j62wAWJWJZd7AbfolGuHCwXgEMeJH6EoLiQ%3D%3D--M%2BjBb0uJeHmOf%2B3o--%2F2Fjw57x0Fyr90Ec9FVibQ%3D%3D'
		// 	},
		// 	data : body
		// };
		// Axios(config)
		// .then(function (response){
		// 	console.log("Res: ", response.status, " Ok")
		// 	setLoading(true)
		// 	Alert.alert(
		// 		"Success Send Data",
		// 		"Berhasil Menyimpan Data",
		// 		[
		// 			{ 
		// 				text: "OK", 
		// 				onPress: () => navigation.navigate('ShowProducts')
		// 				// onPress: () => navigation.navigate('ShowProducts')
		// 			}
		// 		],
		// 		{ cancelable: false }
		// 	)
		// })
		// .catch(function (error){
		// 	setLoading(true)
		// 	Alert.alert(
		// 		"Failed Send Data",
		// 		"Gagal Kirim Data, Hubungi IT Department",
		// 		[
		// 			{ 
		// 				text: "OK", 
		// 				onPress: () => console.log(error) 
		// 			}
		// 		],
		// 		{ cancelable: false }
		// 	)
		// })
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
			console.log(params)
			Axios.get(`${base_url}/api/v2/secprocs?`, {params: params, headers: headers})
			.then(response => {
				setLoading(true)
				setRecords(response.data.data)
				var ngsdata = [
					{
						ng_category_id: 1,
						ng_category_name: 'Rusak'
					},
					{
						ng_category_id: 2,
						ng_category_name: 'Basah'
					},
					{
						ng_category_id: 3,
						ng_category_name: 'Baud Lepas'
					},
					{
						ng_category_id: 4,
						ng_category_name: 'Lecet'
					},
					{
						ng_category_id: 5,
						ng_category_name: 'Bingung'
					},
				]
				setNGData(ngsdata)
				console.log(response.data.message)
			})
			.catch(error => {
				console.log(error)
			})
		}
		setCategoryNgId(value)
	}
	// console.log(user_name.length)
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
					screen == 'QC' ? 
					<View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
						<View style={{flexDirection: 'column', justifyContent: 'center', borderBottomWidth: 1, borderTopWidth: 1, flex: 1, marginTop: 30}}>
							<Text style={{textAlign: 'center', fontSize: 20, fontWeight: 'bold', paddingVertical: 10}}>Verifikasi QC</Text>
						</View>
					</View> :
					null
				}
				{
					screen == 'QC' ?
					funcContent('verifikasi_qc') :
					null
				}
				{
					records.length > 0 ?
					screen == 'QC' ?
					<View style={{flexDirection: 'row', justifyContent: 'center', marginTop: 10}}>
						<Button style={{borderRadius: 5}} onPress={() => submit('QC')}>
							<Text>Simpan</Text>
						</Button>
					</View> :
					<View style={{flexDirection: 'row', justifyContent: 'center', marginTop: 10}}>
						<Button style={{borderRadius: 5}} onPress={() => submit('Leader')}>
							<Text>Simpan</Text>
						</Button>
					</View> :
					null
				}
			</ScrollView>
		)
	}

	const funcContent = (type) => {
		if(type == 'ng_details'){
			if(records.length > 0){
				return (
					<View style={{marginBottom: 10}}>
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
		}else{
			return (
				<View style={{marginBottom: 25}}>
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
									user_name.length > 26 ?
									<Text style={{fontSize: 13.5}}>{user_name}</Text> :
									<Text>{user_name}</Text>
								}
							</View>
						</View>
					</View>
					<View style={{flexDirection: 'row', marginTop: 15}}>
						<View style={{flexDirection: 'column', width: '40%', marginLeft: 5, marginTop: 10}}>
							<View style={{flexDirection: 'row', flex: 1, alignItems: 'center'}}>
								<Text>Check Appearance</Text>
							</View>
						</View>
						<View style={{flexDirection: 'column', marginLeft: 5, marginTop: 10}}>
							<View style={{flexDirection: 'row', flex: 1, alignItems: 'center'}}>
								<Text>:</Text>
							</View>
						</View>
						<View style={{flexDirection: 'column', margin: 5, justifyContent: 'center', paddingLeft: 5, flex: 1}}>
							<View style={{flexDirection: 'row', borderWidth: 1, borderRadius: 5, height: 40, marginTop: 10}}>
								<TextInput placeholder={'PN'} />
							</View>
							<View style={{flexDirection: 'row', borderWidth: 1, borderRadius: 5, height: 40, marginTop: 10, paddingLeft: 5, alignItems: 'center', backgroundColor: '#b8b8b8'}}>
								<Text>Nilai N</Text>
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
							<View style={{justifyContent: 'center', borderWidth: 1, borderRadius: 5, height: 40}}>
								<Picker
									selectedValue={check_packing}
									onValueChange={(value) => setCheckPacking(value)}
									>					
									<Picker.Item label={'Pilih'} value={'null'} />
									<Picker.Item label={'OK'} value={'OK'} />
									<Picker.Item label={'NG'} value={'NG'} />
								</Picker>
							</View>
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
								<Text>Status</Text>
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
								<Text>Load Data</Text>
							</View>
						</View>
					</View>
					{ImageFunction()}
					<View style={{flexDirection: 'row', marginTop: 10}}>
						<View style={{flexDirection: 'column', flex: 1, alignItems: 'center', marginLeft: 5}}>
							<Text>{inspection_time}</Text>
						</View>
					</View>
				</View>
			)
		}
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
									<TextInput onChangeText={(value) => updateValue(value, k, 'can_rework', 'input')} />
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
										onValueChange={(value) => updateValue(value, k, 'can_rework', 'picker')}
										>					
										{ListNGFunction()}
									</Picker>
								</View>
							</View>
							<View style={{width: '21%'}}>
								<View style={{borderBottomWidth: 1, height: 40, justifyContent: 'center', paddingLeft: 5}}>
									<TextInput onChangeText={(value) => updateValue(value, k, 'can_rework', 'input')} />
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
				ng_can_rework_qty: 0
			}])
		}else{
			setNgCannotRework([...ng_cannot_rework, {
				id: ng_cannot_rework.length + 1,
				ng_category_id: 0,
				ng_category_name: null,
				ng_can_rework_qty: 0
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
		var records = []
		if(ng_data.length > 0){
			records.push(
				<Picker.Item key={'listNGs'} value={'0'} label={'Pilih'} />
				)
				ng_data.map((v, k) => {
					records.push(
						<Picker.Item key={k} value={v.ng_category_id} label={v.ng_category_name} />
					)
			})
		}
		return records
	}

	const updateValue = (v, k, type, attr) => {
		if(type == 'can_rework'){
			if(attr == 'picker'){
				var new_object = [...ng_can_rework]
				new_object[k].ng_category_id = v
			}else{
				var new_object = [...ng_can_rework]
				new_object[k].ng_category_name = v
			}
			setNgCanRework(new_object)
		}
	}

	const ImageFunction = () => {
		if(img_base64_full != null){
			var image = <Image source={{uri: img_base64_full}} style={{width: 270, height: 270, resizeMode: 'contain'}}/>
		}else{
			var image = <Image source={cameraicon} style={{width: 50, height: 50}} />
		}
		return(
			<View style={{flexDirection: 'row', marginTop: 10}}>
				<View style={{paddingTop: 20, flexDirection: 'row', flex: 1, justifyContent: 'center'}}>
					<View style={{flexDirection: 'column', alignItems: 'center', borderWidth: 1, width: 300, height: 300}}>
						<TouchableOpacity style={{flex: 1, justifyContent: 'center'}} onPress={() => chooseImage()}>
							{image}
						</TouchableOpacity>
					</View>
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