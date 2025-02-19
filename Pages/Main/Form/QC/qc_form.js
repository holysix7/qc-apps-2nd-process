import {Image, View, TextInput, TouchableWithoutFeedback, Keyboard, KeyboardAvoidingView, ScrollView, ActivityIndicator, Alert, VirtualizedList, TouchableOpacity} from 'react-native';
import React, {useEffect, useState} from 'react';
import { Container, Text, Button, Picker } from 'native-base';
import cameraicon from '../../../Assets/cameraicon.png';
import sampah from '../../../Assets/tong-sampah.png';
import AsyncStorage from "@react-native-community/async-storage";
import Axios from 'axios';
import moment from 'moment';
import app_version from	'../../../System/app_version';
import base_url from	'../../../System/base_url';
import {launchCamera} from 'react-native-image-picker';
import header_form from '../../../Templates/HeaderForm';

const qc_form = ({route, navigation}) => {
  const {secproc_planning_product_item_id, product_name, product_internal_part_id, product_customer_part_number, mkt_customer_name, product_model, sys_plant_id, line_name, default_shift, dept_name, date} = route.params
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

	const [data, setData] 	              				= useState(null)

	const object_header = {
		id: 1, 
		type: 'create',
		title: 'Check Sheet 2nd Process', 
		line_name: line_name != null ? line_name : '-', 
		date: date, 
		current_hour: data != null ? data.current_hour : null, 
		mkt_customer_name: mkt_customer_name != null ? mkt_customer_name : '-',
		product_name: product_name != null ? product_name : '-', 
		product_internal_part_id: product_internal_part_id != null ? product_internal_part_id : '-', 
		product_customer_part_number: product_customer_part_number != null ? product_customer_part_number : '-', 
		product_model: product_model != null ? product_model : '-'
	}

	/**
	 * Parameters
	 */
	const [shift, setShift] 													= useState(default_shift)
	const [judgement_1st_piece, setJudgement] 				= useState(null)
	const [output_process, setOutputProcess] 					= useState(null)
	const [appearance_pn, setAppearancePN] 						= useState(null)
	const [appearance_n, setAppearanceN] 				  		= useState(null)
	const [check_packing, setCheckPacking] 						= useState(null)
	const [check_label, setCheckLabel] 								= useState(null)
	const [final_judgement, setFinalJudgement] 				= useState(null)
	const [note_unnormal, setNotUnnomral] 						= useState(null)
	const [inspectionTime, setInspectionTime] 				= useState(null)

	const [loading, setLoading] 											= useState(false)
	const [data_categories, setCategories]						= useState(null)
	const [ng_details, setNGDetails]									= useState([])
	const [category_processes, setCategoryProcesses]	= useState([])

	const submit = async() => {
		setLoading(false)
		const user_id = await AsyncStorage.getItem('id')
		const token = await AsyncStorage.getItem("key")
		var new_catpros = []
		category_processes.map((v, k) => {
			var new_ng_obj
			var new_ng_arr = []
			ng_details.map((el, obj) => {
				if(v.category_process_id == el.category_process_id){
					new_ng_obj = ng_details
					new_ng_arr.push(
						{
							category_process_id: el.category_process_id,
							id: el.id,
							ng_category_id: el.ng_category_id,
							ng_quantity: parseInt(el.ng_quantity)
						}
					)
				}
			})
			var new_obj = {
				id: v.id,
				category_process_id: v.category_process_id,
				name: v.name,
				img_base64_full: v.img_base64_full,
				ng_details: new_ng_arr
			}
			new_catpros.push(new_obj)
		})
		var check_appearance_pn = appearance_pn == null || appearance_pn.length == 0 ? 0 : appearance_pn
		var body = {
			sys_plant_id: sys_plant_id,
			app_version: app_version,
			user_id: user_id,
			tbl: 'daily_inspection',
			secproc_planning_product_item_id: secproc_planning_product_item_id,
			shift: shift,
			hour: data != null ? data.current_hour != null ? data.current_hour : null : null,
			judgement_1st_piece: judgement_1st_piece,
			output_process: output_process,
			check_appearance_pn: check_appearance_pn,
			check_packing: check_packing, 
			check_label: check_label, 
			final_judgement: final_judgement, 
			inspection_time: inspectionTime, 
			note_unnormal: note_unnormal, 
			category_processes: new_catpros, 
		}
		var config = {
			method: 'post',
			url: `${base_url}/api/v2/secprocs`,
			// params: params,
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
						onPress: () => navigation.navigate('ShowProducts')
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
        let newArray = [...category_processes]
        var newExt   = source.ext
        var news     = newExt.split(".").pop()
        var fixedExt = '.' + news
        newArray[i].img_base64_full = source.uri
        newArray[i].ext = fixedExt
        setCategoryProcesses(newArray)
			}
		})
  }

	const get_data = async(val) => {
		if(val > 0){
			setShift(val)
		}
		// console.log(val)
		const token = await AsyncStorage.getItem("key")
		const user_id = await AsyncStorage.getItem('id')
		const name = await AsyncStorage.getItem('name')
		const headers = {
			'Authorization': token
		}
		// console.log(val != null ? val : 'wkwkk')
		const params = {
			tbl: 'daily_inspection',
			app_version: app_version,
			sys_plant_id: sys_plant_id,
			user_id: user_id,
			secproc_planning_product_item_id: secproc_planning_product_item_id,
			shift: val > 1 ? val : default_shift
		}
		// console.log(params)
		Axios.get(`${base_url}/api/v2/secprocs/new?`, {params: params, headers: headers})
		.then(response => {
			setLoading(true)
      setData(response.data.data)
      setCategories({id: response.data.data.category_processes[0].category_process_id, name: response.data.data.category_processes[0].category_process_name})
			console.log(response.data.status)
		})
		.catch(error => {
			console.log(error)
		})
	}

	const update_params_judgement = (val) => {
		if(val == 'NG'){
			if(appearance_pn > 0 || check_packing == 'NG' || check_label == 'NG'){
				setFinalJudgement('NG')
				setJudgement(val)
				console.log('final harus NG')
			}else{
				setFinalJudgement('OK')
				setJudgement(val)
				console.log('final harus OK')
			}
		}else{
			if(appearance_pn > 0 || check_packing == 'NG' || check_label == 'NG'){
				setFinalJudgement('NG')
				setJudgement(val)
				console.log('final harus NG')
			}else{
				setFinalJudgement('OK')
				setJudgement(val)
				console.log('final harus OK')
			}
		}
	}

	const update_params_packing = (val) => {
		if(val == 'NG'){
			if(judgement_1st_piece == 'NG' || appearance_pn > 0 || check_label == 'NG' || val == 'NG'){
				console.log('final harus NG')
				setFinalJudgement('NG')
				setCheckPacking(val)
			}else{
				setFinalJudgement('OK')
				console.log('final harus OK')
				setCheckPacking(val)
			}
		}else{
			if(judgement_1st_piece == 'NG' || appearance_pn > 0 || check_label == 'NG' || val == 'NG'){
				console.log('final harus NG')
				setFinalJudgement('NG')
				setCheckPacking(val)
			}else{
				setFinalJudgement('OK')
				console.log('final harus OK')
				setCheckPacking(val)
			}
		}
	}

	const update_params_label = (val) => {
		if(val == 'NG'){
			if(judgement_1st_piece == 'NG' || appearance_pn > 0 || check_packing == 'NG' || val == 'NG'){
				console.log('final harus NG')
				setFinalJudgement('NG')
				setCheckLabel(val)
			}else{
				setFinalJudgement('OK')
				console.log('final harus OK')
				etCheckLabel(val)
			}
		}else{
			if(judgement_1st_piece == 'NG' || appearance_pn > 0 || check_packing == 'NG' || val == 'NG'){
				console.log('final harus NG')
				setFinalJudgement('NG')
				setCheckLabel(val)
			}else{
				setFinalJudgement('OK')
				console.log('final harus OK')
				setCheckLabel(val)
			}
		}
	}

	const setPnFunction = (val) => {
		setAppearancePN(val)
		if(parseInt(val) > 0){
			if(judgement_1st_piece == 'NG' || check_packing == 'NG' || check_label == 'NG' || val > 0){
				console.log('final harus NG')
				setFinalJudgement('NG')
			}else{
				setFinalJudgement('OK')
				console.log('final harus OK')
			}
		}else{
			if(judgement_1st_piece == 'NG' || check_packing == 'NG' || check_label == 'NG' || val > 0){
				console.log('final harus NG')
				setFinalJudgement('NG')
			}else{
				setFinalJudgement('OK')
				console.log('final harus OK')
			}
		}
	}
	
	const AqlFunction = (val) => {
		if(data != null){
			if(data.aql_logic.length > 0){
				// console.log(data.aql_logic)
				setOutputProcess(val)
				data.aql_logic.map((v, k) => {
					if(val <= 1){
						setAppearanceN('0')
					}else{
						if(val >= v.value_start && val <= v.value_end){
							setAppearanceN(v.result)
						}
					}
				})
			}
		}
	}

	const functionShift = () => {
		if(default_shift < 2){
			return (
				<View style={{flexDirection: 'row', marginTop: 15, borderTopWidth: 0.3}}>
					<View style={{flexDirection: 'column', padding: 7, width: '40%'}}>
						<Text>Shift</Text>
					</View>
					<View style={{flexDirection: 'column', padding: 7, paddingTop: 15}}>
						<Text>:</Text>
					</View>
					<View style={{flexDirection: 'column', margin: 7, justifyContent: 'center', height: 40, borderWidth: 1, paddingLeft: 5, borderRadius: 5, flex: 1}}>
						<Picker 
							selectedValue={shift}
							onValueChange={(val) => get_data(val)}
						>
							<Picker.Item label={'Pilih'} value={null} />
							<Picker.Item label={'1'} value={'1'} />
							<Picker.Item label={'2'} value={'2'} />
							<Picker.Item label={'3'} value={'3'} />
						</Picker>
					</View>
				</View>				
			)
		}else if(default_shift < 3){
			return (
				<View style={{flexDirection: 'row', marginTop: 15, borderTopWidth: 0.3}}>
					<View style={{flexDirection: 'column', padding: 7, width: '40%'}}>
						<Text>Shift</Text>
					</View>
					<View style={{flexDirection: 'column', padding: 7, paddingTop: 15}}>
						<Text>:</Text>
					</View>
					<View style={{flexDirection: 'column', margin: 7, justifyContent: 'center', height: 40, borderWidth: 1, paddingLeft: 5, borderRadius: 5, flex: 1}}>
						<Picker 
							selectedValue={shift}
							onValueChange={(val) => get_data(val)}
						>
							<Picker.Item label={'Pilih'} value={null} />
							<Picker.Item label={'2'} value={'2'} />
							<Picker.Item label={'3'} value={'3'} />
						</Picker>
					</View>
				</View>	
			)
		}else{
			return (
				<View style={{flexDirection: 'row', marginTop: 15, borderTopWidth: 0.3}}>
					<View style={{flexDirection: 'column', padding: 7, width: '40%'}}>
						<Text>Shift</Text>
					</View>
					<View style={{flexDirection: 'column', padding: 7, paddingTop: 15}}>
						<Text>:</Text>
					</View>
					<View style={{flexDirection: 'column', margin: 7, justifyContent: 'center', height: 40, borderWidth: 1, paddingLeft: 5, borderRadius: 5, flex: 1, backgroundColor: '#b8b8b8'}}>
						<Text>{default_shift}</Text>
					</View>
				</View>	
			)
		}
	}

	const content = () => {
		var category_process = []
		var warna, color = null 
		if(data != null){
			if(data.category_processes.length > 0){
				data.category_processes.map((val, key) => {
					if(data_categories != null) {
						if(val.category_process_id == data_categories.id){
							warna = '#39A2DB'
							color = 'white'
						}else{
							warna = 'grey'
							color = 'black'
						}
						category_process.push(
							<TouchableOpacity key={key} style={{flexDirection: 'column', height: 50, justifyContent: 'center', borderWidth: 0.3, marginHorizontal: 2, paddingHorizontal: 5, backgroundColor: warna}} onPress={() => setCategories({id: val.category_process_id, name: val.category_process_name})}>
								<Text style={{color: color}}>{val.category_process_name}</Text>
							</TouchableOpacity>
						)
					}
				})
			}else{
				category_process.push(
					<View key={'category_process'} style={{flexDirection: 'column', marginTop: 10, justifyContent: 'center'}}>
						<View style={{flexDirection: 'column', justifyContent: 'center', height: 120, padding: 10, borderRadius: 10, backgroundColor: '#F3F2C9'}}>
							<Text style={{textAlign: 'justify', color: 'grey'}}>Gagal Memanggil Data Category Process</Text>
						</View>
					</View>
				)
			}
		}
		return (
			<ScrollView key={'content'} style={{flexDirection: 'column'}}>

				{functionShift()}

				<View style={{flexDirection: 'row', marginTop: 15}}>
					<View style={{flexDirection: 'column', padding: 7, width: '40%'}}>
						<Text>Judgement 1st Piece</Text>
					</View>
					<View style={{flexDirection: 'column', padding: 7, paddingTop: 15}}>
						<Text>:</Text>
					</View>
					<View style={{flexDirection: 'column', margin: 7, justifyContent: 'center', height: 40, borderWidth: 1, paddingLeft: 5, borderRadius: 5, flex: 1}}>
						<Picker
							selectedValue={judgement_1st_piece}
							onValueChange={(value) => update_params_judgement(value)}
						>					
							<Picker.Item label={'Pilih'} value={null} />
							<Picker.Item label={'OK'} value={'OK'} />
							<Picker.Item label={'NG'} value={'NG'} />
						</Picker>
					</View>
				</View>

				<View style={{flexDirection: 'row', marginTop: 15}}>
					<View style={{flexDirection: 'column', padding: 7, width: '40%'}}>
						<Text>Output Process</Text>
					</View>
					<View style={{flexDirection: 'column', padding: 7}}>
						<Text>:</Text>
					</View>
					<View style={{flexDirection: 'column', margin: 7, justifyContent: 'center', height: 40, borderWidth: 1, paddingLeft: 5, borderRadius: 5, flex: 1}}>
						<TextInput style={{color: 'black', fontSize: 13}} value={output_process != null ? output_process : null} onChangeText={(value) => AqlFunction(value)} keyboardType='number-pad' placeholder='0' />
					</View>
				</View>

				<View style={{flexDirection: 'row', marginTop: 15}}>
					<View style={{flexDirection: 'column', padding: 7, marginTop: 25, width: '40%'}}>
						<Text>Check Appearance</Text>
					</View>
					<View style={{flexDirection: 'column', padding: 7, marginTop: 25}}>
						<Text>:</Text>
					</View>
					<View style={{flexDirection: 'column', padding: 7}}>
						<View style={{flexDirection: 'row', marginTop: 8}}>
							<Text>PN</Text>
						</View>
						<View style={{flexDirection: 'row', marginTop: 18}}>
							<Text>N</Text>
						</View>
					</View>

					<View style={{flexDirection: 'column', margin: 7, justifyContent: 'center', paddingLeft: 5, flex: 1}}>
						<View style={{flexDirection: 'row', height: 40, borderWidth: 1, borderRadius: 5}}>
							<TextInput style={{color: 'black', fontSize: 13}} value={appearance_pn != null ? appearance_pn : null} onChangeText={(value) => setPnFunction(value)} keyboardType='number-pad' placeholder='0' />
						</View>
						<View style={{flexDirection: 'row', alignItems: 'center', height: 40, borderWidth: 1, borderRadius: 5, marginTop: 5, backgroundColor: '#b8b8b8'}}>
							<Text style={{fontSize: 13}}>{parseInt(appearance_n) > 0 ? appearance_n : 0}</Text>
						</View>
					</View>
				</View>

				<View style={{flexDirection: 'row', marginTop: 15}}>
					<View style={{flexDirection: 'column', padding: 7, width: '40%'}}>
						<Text>Check Packing</Text>
					</View>
					<View style={{flexDirection: 'column', padding: 7, paddingTop: 15}}>
						<Text>:</Text>
					</View>
					<View style={{flexDirection: 'column', margin: 7, justifyContent: 'center', height: 40, borderWidth: 1, paddingLeft: 5, borderRadius: 5, flex: 1}}>
						<Picker
							selectedValue={check_packing}
							onValueChange={(value) => update_params_packing(value)}
						>					
							<Picker.Item label={'Pilih'} value={null} />
							<Picker.Item label={'OK'} value={'OK'} />
							<Picker.Item label={'NG'} value={'NG'} />
						</Picker>
					</View>
				</View>

				<View style={{flexDirection: 'row', marginTop: 15}}>
					<View style={{flexDirection: 'column', padding: 7, width: '40%'}}>
						<Text>Check Label</Text>
					</View>
					<View style={{flexDirection: 'column', padding: 7, paddingTop: 15}}>
						<Text>:</Text>
					</View>
					<View style={{flexDirection: 'column', margin: 7, justifyContent: 'center', height: 40, borderWidth: 1, paddingLeft: 5, borderRadius: 5, flex: 1}}>
						<Picker
							selectedValue={check_label}
							onValueChange={(value) => update_params_label(value)}
						>					
							<Picker.Item label={'Pilih'} value={null} />
							<Picker.Item label={'OK'} value={'OK'} />
							<Picker.Item label={'NG'} value={'NG'} />
						</Picker>
					</View>
				</View>

				<View style={{flexDirection: 'row', marginTop: 15}}>
					<View style={{flexDirection: 'column', padding: 7, width: '40%'}}>
						<Text>Final Judgment</Text>
					</View>
					<View style={{flexDirection: 'column', padding: 7, paddingTop: 15}}>
						<Text>:</Text>
					</View>
					<View style={{flexDirection: 'column', backgroundColor: '#b8b8b8', margin: 7, justifyContent: 'center', height: 40, borderWidth: 1, paddingLeft: 5, borderRadius: 5, flex: 1}}>
						<Text>{final_judgement != null ? final_judgement : '-'}</Text>
					</View>
				</View>
				
				<View style={{flexDirection: 'row', marginTop: 15, borderTopWidth: 0.3}}>
					<View style={{flexDirection: 'column', alignItems: 'center', flex: 1}}>
						<Text style={{fontWeight: 'bold'}}>Category Process</Text>
					</View>
				</View>

				<View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
					{category_process}
				</View>

				{funcContent()}
			</ScrollView>
		)
	}

	// console.log(category_processes)
	const funcContent = () => {

		var add_ngs 				= []
		var add_images 			= []
		var button_submit 	= []
		var note_unnormals 	= []
		var inspection_time = []
		var obj_ng_detail = false
		if(data_categories != null){
			var ng_summaries = 0
			var simpan_button = true
			var nilai_pn = appearance_pn == null ? 0 : appearance_pn
			if(ng_details.length > 0){
				ng_details.map((v, k) => {
					ng_summaries += v.ng_quantity != null ? parseInt(v.ng_quantity) : 0
				})
			}
			if(category_processes.length > 0){
				category_processes.map((v, k) => {
					if(v.category_process_id == data_categories.id){
						obj_ng_detail = true
					}
				})
			}
			if(ng_summaries <= nilai_pn){
				if(ng_summaries < appearance_pn){
					if(obj_ng_detail == true){
						if(category_processes.length > 0){
							add_ngs.push(
								<View key='add_ngs' style={{flexDirection: 'row', justifyContent: 'center'}}>
									<Button style={{marginVertical: 10, borderRadius: 5}} onPress={() => checkNGDetails(data_categories)}><Text>Add NG Category</Text></Button>
								</View>
							)
						}
					}else{
						add_ngs.push(
							<View key='add_ngs' style={{flexDirection: 'row', justifyContent: 'center'}}>
								<Button style={{marginVertical: 10, borderRadius: 5}} onPress={() => checkCategoryProcess(data_categories)}><Text>Add Category Process</Text></Button>
							</View>
						)
					}
				}
			}else{
				simpan_button = false
				add_ngs.push(
					<View key={'add_ngs'} style={{width: '100%', padding: 25, flexDirection: 'row', justifyContent: 'center'}}>
						<View style={{justifyContent: 'center', height: 200, padding: 10, borderRadius: 10, backgroundColor: '#F3F2C9'}}>
							<Text style={{textAlign: 'center', color: 'grey'}}>Jumlah NG Melebihi Nilai Appearance N Atau Jumlah NG Tidak Diinput Maka Form Check Sheet tidak bisa disimpan </Text>
						</View>
					</View>
				)
			}
			// if(ng_summaries <= nilai_pn){
			// 	if(ng_summaries < appearance_pn){
			// 		if(simpan_button){
			// 			if(index_image < 8){
			// 				add_images.push(
			// 					<View key='add_images' style={{flexDirection: 'row', justifyContent: 'center', marginVertical: 20, borderTopWidth: 0.3}}>
			// 						<Button style={{marginTop: 10, borderRadius: 5}} onPress={() => addItemImage(data_categories)}><Text>Tambah Foto</Text></Button>
			// 					</View>
			// 				)
			// 			}
			// 		}
			// 	}
			// }

			if(simpan_button){
				note_unnormals.push(
					<View key='add_unnormal' style={{flexDirection: 'row'}}>
						<View style={{flexDirection: 'column', width: '40%', paddingHorizontal: 7, paddingTop: 12}}>
							<Text>Note Unnormal</Text>
						</View>
						<View style={{flexDirection: 'column', paddingHorizontal: 7, paddingTop: 12}}>
							<Text>:</Text>
						</View>
						<View style={{flexDirection: 'column', margin: 7, justifyContent: 'center', height: 40, borderWidth: 1, paddingLeft: 5, borderRadius: 5, flex: 1}}>
							<TextInput style={{color: 'black', fontSize: 13}} value={note_unnormal} onChangeText={(value) => setNotUnnomral(value)} />
						</View>
					</View>
				)
			}

			if(simpan_button){
				button_submit.push(
					<View key='button_submit' style={{flexDirection: 'row', justifyContent: 'center', marginVertical: 20}}>
						<Button style={{marginTop: 10, borderRadius: 5}} onPress={() => submit()}><Text>Simpan</Text></Button>
					</View>
				)
			}

			if(inspectionTime != null){
				inspection_time.push(
					<View key={'inpection_time'} style={{flexDirection: 'row', justifyContent: 'center'}}>
						<Text>{inspectionTime}</Text>
					</View>
				)
			}

			return (
				<ScrollView>

					<View style={{flexDirection: 'row'}}>
						<View style={{flexDirection: 'column', width: '40%', padding: 7, justifyContent: 'center'}}>
							<Text>Category Process</Text>
						</View>
						<View style={{flexDirection: 'column', padding: 7, justifyContent: 'center'}}>
							<Text>:</Text>
						</View>
						<View style={{flexDirection: 'column', padding: 10, flex: 1}}>
							<View style={{backgroundColor: '#b8b8b8', justifyContent: 'center', height: 40, borderWidth: 1, paddingLeft: 5, borderRadius: 5, flex: 1}}>
								<Text style={{fontSize: 14}}>{data_categories != null ? data_categories.name : '-'}</Text>
							</View>
						</View>
					</View>

					<View style={{flexDirection: 'row'}}>
						<View style={{flexDirection: 'column', width: '40%', padding: 7, justifyContent: 'center'}}>
							<Text>Leader Produksi</Text>
						</View>
						<View style={{flexDirection: 'column', padding: 7, justifyContent: 'center'}}>
							<Text>:</Text>
						</View>
						<View style={{flexDirection: 'column', padding: 10, flex: 1}}>
							<View style={{backgroundColor: '#b8b8b8', justifyContent: 'center', height: 40, borderWidth: 1, paddingLeft: 5, borderRadius: 5, flex: 1}}>
								<Text style={{fontSize: 14}}>{data != null ? data.leader_name : '-'}</Text>
							</View>
						</View>
					</View>

					{listOperator()}

					<View style={{flexDirection: 'row'}}>
						<View style={{flexDirection: 'column', flex: 1, backgroundColor: '#dfe0df', height: 10, borderBottomWidth: 0.3, padding: 7, justifyContent: 'center'}}>
							<Text style={{color: '#dfe0df'}}>Leader Produksi</Text>
						</View>
					</View>

					{add_ngs}

					
					{list_ng_category()}

					{add_images}

					{image_category()}
				
					{note_unnormals}

					{inspection_time}
					
					{button_submit}

				</ScrollView>
			)
		}
	}

	const listOperator = () => {
		var records = []
		if(data != null){
			if(data.category_processes.length > 0){
				data.category_processes.map((value, key) => {
					if(value.operator_lists.length > 0){
						value.operator_lists.map((v, k) => {
							if(data_categories.id == value.category_process_id){
								if(value.operator_lists.length <= 1){
									records.push(
										<View key={k} style={{flexDirection: 'row'}}>
											<View style={{flexDirection: 'column', width: '40%', padding: 7, justifyContent: 'center'}}>
												<Text style={{fontSize: 15}}>Nama Operator </Text>
											</View>
											<View style={{flexDirection: 'column', padding: 7, justifyContent: 'center'}}>
												<Text>:</Text>
											</View>
											<View style={{flexDirection: 'column', padding: 10, flex: 1}}>
												<View style={{borderWidth: 1, borderRadius: 5, backgroundColor: '#b8b8b8', height: 40, justifyContent: 'center', paddingLeft: 5}}>
													<Text style={{fontSize: 14}}>{v.operator_name}</Text>
												</View>
											</View>
										</View>
									)
								}else{
									records.push(
										<View key={k} style={{flexDirection: 'row'}}>
											<View style={{flexDirection: 'column', width: '40%', padding: 7, justifyContent: 'center'}}>
												<Text style={{fontSize: 15}}>Nama Operator {k+1} </Text>
											</View>
											<View style={{flexDirection: 'column', padding: 7, justifyContent: 'center'}}>
												<Text>:</Text>
											</View>
											<View style={{flexDirection: 'column', padding: 10, flex: 1}}>
												<View style={{borderWidth: 1, borderRadius: 5, backgroundColor: '#b8b8b8', height: 40, justifyContent: 'center', paddingLeft: 5}}>
													<Text style={{fontSize: 14}}>{v.operator_name}</Text>
												</View>
											</View>
										</View>
									)
								}
							}
						})
					}
				})
			}
		}
		return records
	}

	const checkCategoryProcess = (value) => {
		newFunc(value)
	}

	const checkNGDetails = (value) => {
		newFuncNgDetails(value)
	}

	const newFunc = (value) => {
		setCategoryProcesses([...category_processes, {
			id: category_processes.length + 1,
			category_process_id: value.id,
			name: value.name,
			img_base64_full: null
		}])
	}

	const newFuncNgDetails = (value) => {
		setNGDetails([...ng_details, {
			id: ng_details.length + 1,
			category_process_id: value.id,
			ng_category_id: 0,
			ng_quantity: null
		}])
	}

	const defect_function = () => {
		var records = []
		if(data != null){
			if(data.category_processes.length > 0){
				records.push(
					<Picker.Item label='Pilih' value='0' key='pilih' />
				)
				data.category_processes.map((v, k) => {
					if(v.defect_categories.length > 0){
						v.defect_categories.map((el, key) => {
							if(v.category_process_id == data_categories.id){
								records.push(
									<Picker.Item label={el.qc_ng_category_name} value={el.qc_ng_category_id} key={key} />
								)
							}
						})
					}
				})
			}
		}
		return records
	}

	const list_ng_category = () => {
		var records = []
		var iterasi = 1
		if(ng_details.length > 0){
			ng_details.map((value, key) => {
				data.category_processes.map((element, index) => {
					// console.log()
					if(value.category_process_id == element.category_process_id && value.category_process_id == data_categories.id){
						records.push(
							<View key={key} style={{paddingTop: 5, flexDirection: 'row'}}>
								<View style={{flexDirection: 'column', margin: 7, width: '10%', justifyContent: 'center', height: 40, borderWidth: 1, paddingLeft: 10, borderRadius: 5}}>
									<Text style={{fontSize: 15}}> {iterasi++} </Text>
								</View>
								<View style={{flexDirection: 'column', margin: 7, justifyContent: 'center', height: 40, flex: 1}}>
									<View style={{borderWidth: 1, borderRadius: 5, height: 40, justifyContent: 'center', paddingLeft: 5}}>
										<Picker 
										mode="dropdown"
										selectedValue={ng_details[key].ng_category_id}
										onValueChange={(value) => fillNGCategory(value, key, 'category_id')}
										itemStyle={{marginLeft: 0}}
										itemTextStyle={{fontSize: 9}}
										>
											{/* {loopingOperator()} */}
											{defect_function()}
										</Picker>
									</View>
								</View>
								<View style={{flexDirection: 'column', margin: 7, justifyContent: 'center', height: 40, borderWidth: 1, paddingLeft: 5, borderRadius: 5, width: '30%'}}>
									<TextInput style={{color: 'black', fontSize: 13}} value={ng_details[key].ng_quantity != null ? ng_details[key].ng_quantity : null} placeholder='0' onChangeText={(value) => fillNGCategory(value, key, 'qty')} keyboardType='number-pad' />
								</View>
								<View style={{margin: 4, width: '10%'}} >
									<TouchableOpacity onPress={() => deleteItem(ng_details[key].id) }>
										<Image source={sampah} style={{backgroundColor: 'red', borderRadius: 5, height: 40, width: 40}} />
									</TouchableOpacity>
								</View>
							</View>	
						)
					}
				})
			})
		}
		return records
	}

	const image_category = () => {
		var records = []
		if(category_processes.length > 0){
			category_processes.map((val, key) => {
				data.category_processes.map((el, ind) => {
					if(val.category_process_id == el.category_process_id && val.category_process_id == data_categories.id){
						if(val.img_base64_full != null){
							var image = <Image source={{uri: val.img_base64_full}} style={{width: 270, height: 270, resizeMode: 'contain'}}/>
						}else{
							var image = <Image source={cameraicon} style={{width: 50, height: 50}} />
						}
						records.push(
							<View key={key} style={{paddingTop: 20, flexDirection: 'row', flex: 1, justifyContent: 'center'}}>
								<View style={{flexDirection: 'column', alignItems: 'center', borderWidth: 1, width: 300, height: 300}}>
									<TouchableOpacity style={{flex: 1, justifyContent: 'center'}} onPress={() => chooseImage(key)}>
										{image}
									</TouchableOpacity>
								</View>
							</View>
						)
					}
				})
			})
		}
		return records
	}
	
	const deleteItem = (el) => {
		setNGDetails(ng_details.filter(item => item.id == el ? null : item.id))
	}
	
	const fillNGCategory = (val, key, type) => {
		if(type == 'qty'){
			let new_object	= [...ng_details]
			new_object[key].ng_quantity = val
			setNGDetails(new_object)
		}else{
			let new_object	= [...ng_details]
			new_object[key].ng_category_id = val
			setNGDetails(new_object)
		}
	}

	return(
		<KeyboardAvoidingView behavior={Platform.OS == "ios" ? "padding" : "height"} style={{flex:1}}>
			<TouchableWithoutFeedback onPress={Keyboard.dismiss}>
				<Container>
					<View style={{flex: 1, height: 100, backgroundColor: '#dfe0df', borderWidth: 0.3, flexDirection: 'column'}}>

						{header_form(object_header)}

						{loading ? content() : <View style={{justifyContent: 'center'}}><ActivityIndicator size="large" color="#0000ff"/></View>}

						{/* <View style={{flexDirection: 'row'}}> */}
							{/* {funcContent()} */}
						{/* </View> */}

					</View>
				</Container>
			</TouchableWithoutFeedback>
		</KeyboardAvoidingView>
	)
}

export default qc_form;