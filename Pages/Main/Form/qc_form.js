import {Image, View, TextInput, TouchableWithoutFeedback, Keyboard, KeyboardAvoidingView, ScrollView, ActivityIndicator, Alert, VirtualizedList, TouchableOpacity} from 'react-native';
import React, {useEffect, useState} from 'react';
import { Container, Text, Button, Picker } from 'native-base';
import LogoSIP from '../../Assets/logo-sip370x50.png';
import cameraicon from '../../Assets/cameraicon.png';
import AsyncStorage from "@react-native-community/async-storage";
import Axios from 'axios';
import moment from 'moment';
import app_version from	'../../System/app_version';
import base_url from	'../../System/base_url';

const qc_form = ({route, navigation}) => {
  const {secproc_planning_product_item_id, product_name, product_internal_part_id, product_customer_part_number, mkt_customer_name, product_model, sys_plant_id, line_name} = route.params
	useEffect(() => {
		get_data()
	}, [])
	const [user_name, setUserName] 	      				= useState(null)
	const [simpan_button, setSimpanButton] 	      = useState(null)
	const [image_button, setImageButton] 	      	= useState(true)
	const [data, setData] 	              				= useState(null)
	const [shift, setShift] 											= useState(1)
	/**
	 * Parameters
	 */
	const [judgement_1st_piece, setJudgement] 		= useState(null)
	const [output_process, setOutputProcess] 			= useState('0')
	const [appearance_pn, setAppearancePN] 				= useState('0')
	const [appearance_n, setAppearanceN] 				  = useState('0')
	const [check_packing, setCheckPacking] 				= useState(null)
	const [check_label, setCheckLabel] 						= useState(null)
	const [final_judgement, setFinalJudgement] 		= useState(null)

	const [loading, setLoading] 									= useState(false)
	const [neeple_cooling, setCooling] 						= useState(null)
	const [standard_part, setStandard] 						= useState(null)
	const [data_categories, setCategories]				= useState(null)
	const [array_categories, newArrayCategories]	= useState([])
	const [object_categories, setObjectCategories]= useState(null)
	const [ng_details, setNGDetails]							= useState([])
	const [category_processes, setCategoryProcesses]				= useState([])
	const [created_by, setCreatedBy]		  				= useState(null)
	const [updated_by, setUpdatedBy]		  				= useState(null)
	const [planningId, setPlanningId]		  				= useState("")
	let date 																			= moment().format("YYYY-MM-DD")
	let created_at 																= moment().format("YYYY-MM-DD HH:mm:ss")
	let updated_at 																= moment().format("YYYY-MM-DD HH:mm:ss")
	const planning_id = parseInt(planningId)

	const submit = async() => {
		setLoading(false)
		const user_id = await AsyncStorage.getItem('id')
		const token = await AsyncStorage.getItem("key")
		var body = {
			tbl: 'planning_pic_product',
			update_hour: sys_plant_id,
			app_version: app_version,
			user_id: user_id,
			secproc_planning_product_item_id: secproc_planning_product_item_id,
			ng_details: ng_details,
			sys_plant_id: sys_plant_id
		}
		console.log(body)
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
						onPress: () => console.log('ShowProducts')
						// onPress: () => navigation.navigate('ShowProducts')
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
		setCreatedBy(user_id)
		setUpdatedBy(user_id)
		setUserName(name)
		const headers = {
			'Authorization': token
		}
		const params = {
			tbl: 'daily_inspection',
			app_version: app_version,
			sys_plant_id: sys_plant_id,
			user_id: user_id,
			secproc_planning_product_item_id: secproc_planning_product_item_id,
			shift: shift
		}
		// console.log(params)
		Axios.get(`${base_url}/api/v2/secprocs/new?`, {params: params, headers: headers})
		// Axios.get('http://192.168.131.121:3000/api/v2/secprocs/new?', {params: params, headers: headers})
		.then(response => {
			setLoading(true)
      // console.log(response.data.data.category_processes)
      setData(response.data.data)
      setCategories({id: response.data.data.category_processes[0].category_process_id, name: response.data.data.category_processes[0].category_process_name})
			setObjectCategories({id: null, name: null, status: 'Non-Active'})
			var array_kosong = []
			response.data.data.category_processes.map((v, k) => {
				array_kosong.push({
					id: v.category_process_id,
					name: v.category_process_name,
					status: 'Non-Active'
				})
			})
			newArrayCategories(array_kosong)
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
							{/* <TouchableOpacity style={{flexDirection: 'column', height: 50, justifyContent: 'center'}} onPress={() => setCategories({id: val.category_process_id, name: val.category_process_name})}> */}
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

				<View style={{flexDirection: 'row', marginTop: 15, borderTopWidth: 0.3}}>
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
						<TextInput style={{color: 'black', fontSize: 13}} value={output_process} onChangeText={(value) => AqlFunction(value)} keyboardType='number-pad' />
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
							<TextInput style={{color: 'black', fontSize: 13}} value={appearance_pn} onChangeText={(value) => setPnFunction(value)} keyboardType='number-pad' />
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

	const funcContent = () => {
		if(data_categories != null){
			if(data_categories.id == 1){
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
									<Text style={{fontSize: 14}}>{data_categories.name}</Text>
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
						
						<View style={{flexDirection: 'row', justifyContent: 'center', borderTopWidth: 0.3}}>
							<Button style={{marginVertical: 10, borderRadius: 5}} onPress={() => checkNGDetails(data_categories)}><Text>Add NG Category</Text></Button>
						</View>

						{list_ng_category()}

						{/* {
							image_button ?  */}
							<View style={{flexDirection: 'row', justifyContent: 'center', marginVertical: 20, borderTopWidth: 0.3}}>
								<Button style={{marginTop: 10, borderRadius: 5}} onPress={() => checkNGDetailsImage(data_categories)}><Text>Tambah Foto</Text></Button>
							</View> 

						{image_category()}

						{
							simpan_button ? 
							<View style={{flexDirection: 'row', justifyContent: 'center', marginVertical: 20}}>
								<Button style={{marginTop: 10, borderRadius: 5}} onPress={() => submit()}><Text>Simpan</Text></Button>
							</View> :
							null
						}


					</ScrollView>
				)
			}else if(data_categories.id == 2){
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
									<Text style={{fontSize: 14}}>{data_categories.name}</Text>
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
						
						<View style={{flexDirection: 'row', justifyContent: 'center', borderTopWidth: 0.3}}>
							<Button style={{marginTop: 10, borderRadius: 5}} onPress={() => checkNGDetails(data_categories)}><Text>Add NG Category</Text></Button>
						</View>

						{list_ng_category()}

						{/* {
							image_button ?  */}
							<View style={{flexDirection: 'row', justifyContent: 'center', marginVertical: 20, borderTopWidth: 0.3}}>
								<Button style={{marginTop: 10, borderRadius: 5}} onPress={() => checkNGDetailsImage(data_categories)}><Text>Tambah Foto</Text></Button>
							</View> 

						{image_category()}


						{
							simpan_button ? 
							<View style={{flexDirection: 'row', justifyContent: 'center', marginVertical: 20}}>
								<Button style={{marginTop: 10, borderRadius: 5}} onPress={() => submit()}><Text>Simpan</Text></Button>
							</View> :
							null
						}

					</ScrollView>
				)
			}else if(data_categories.id == 3){
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
									<Text style={{fontSize: 14}}>{data_categories.name}</Text>
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
						
						<View style={{flexDirection: 'row', justifyContent: 'center', borderTopWidth: 0.3}}>
							<Button style={{marginVertical: 10, borderRadius: 5}} onPress={() => checkNGDetails(data_categories)}><Text>Add NG Category</Text></Button>
						</View>

						{list_ng_category()}

						{/* {
							image_button ?  */}
							<View style={{flexDirection: 'row', justifyContent: 'center', marginVertical: 20, borderTopWidth: 0.3}}>
								<Button style={{marginTop: 10, borderRadius: 5}} onPress={() => checkNGDetailsImage(data_categories)}><Text>Tambah Foto</Text></Button>
							</View> 

						{image_category()}

						

						{
							simpan_button ? 
							<View style={{flexDirection: 'row', justifyContent: 'center', marginVertical: 20}}>
								<Button style={{marginTop: 10, borderRadius: 5}} onPress={() => submit()}><Text>Simpan</Text></Button>
							</View> :
							null
						}

					</ScrollView>
				)
			}else if(data_categories.id == 4){
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
									<Text style={{fontSize: 14}}>{data_categories.name}</Text>
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
						
						<View style={{flexDirection: 'row', justifyContent: 'center', borderTopWidth: 0.3}}>
							<Button style={{marginVertical: 10, borderRadius: 5}} onPress={() => checkNGDetails(data_categories)}><Text>Add NG Category</Text></Button>
						</View>

						{list_ng_category()}

						{/* {
							image_button ?  */}
							<View style={{flexDirection: 'row', justifyContent: 'center', marginVertical: 20, borderTopWidth: 0.3}}>
								<Button style={{marginTop: 10, borderRadius: 5}} onPress={() => checkNGDetailsImage(data_categories)}><Text>Tambah Foto</Text></Button>
							</View> 

						{image_category()}

						

						{
							simpan_button ? 
							<View style={{flexDirection: 'row', justifyContent: 'center', marginVertical: 20}}>
								<Button style={{marginTop: 10, borderRadius: 5}} onPress={() => submit()}><Text>Simpan</Text></Button>
							</View> :
							null
						}

					</ScrollView>
				)
			}
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
													<Text>{v.operator_name}</Text>
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
													<Text>{v.operator_name}</Text>
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

	const checkNGDetails = (value) => {
		setSimpanButton(true)
		setNGDetails([...ng_details, {
			id: ng_details.length + 1,
			category_process_id: value.id,
			ng_category_id: 0,
			ng_quantity: '0'
		}])
	}

	const checkNGDetailsImage = (value) => {
		setImageButton(false)
		setCategoryProcesses([...category_processes, {
			id: category_processes.length + 1,
			category_process_id: value.id,
			name: value.name,
			img_base64_full: null
		}])
	}

	const defect_function = () => {
		var records = []
		if(data != null){
			if(data.category_processes.length > 0){
				data.category_processes.map((v, k) => {
					console.log(v.defect_categories)
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
									<TextInput style={{color: 'black', fontSize: 13}} value={ng_details[key].ng_quantity} placeholder='0' onChangeText={(value) => fillNGCategory(value, key, 'qty')} keyboardType='number-pad' />
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
						records.push(
							<View key={key} style={{paddingTop: 20, flexDirection: 'row', flex: 1, justifyContent: 'center'}}>
								<View style={{flexDirection: 'column', alignItems: 'center', borderWidth: 1, width: 300, height: 300}}>
									<TouchableOpacity style={{flex: 1, justifyContent: 'center'}}>
										<Image source={cameraicon} style={{width: 50, height: 50}} />
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


	const fillCategoryProcesses = (el, key) => {
		let new_object	= [...category_processes]
		new_object[key].img_base64_full = el
		setNGDetails(new_object)
	}

	return(
		<KeyboardAvoidingView behavior={Platform.OS == "ios" ? "padding" : "height"} style={{flex:1}}>
			<TouchableWithoutFeedback onPress={Keyboard.dismiss}>
				<Container>
					<View style={{flex: 1, height: 100, backgroundColor: '#dfe0df', borderWidth: 0.3, flexDirection: 'column'}}>
						
						<View style={{justifyContent: 'center', alignItems: 'center', backgroundColor: '#dfe0df'}}>
							<Image source={LogoSIP}/>
						</View>

						<View style={{flexDirection: 'row'}}>
							<View style={{flexDirection: 'column', borderTopWidth: 0.3, borderRightWidth: 0.3, padding: 15, justifyContent: 'center', alignItems: 'center', width: "50%", backgroundColor: '#dfe0df'}}>
								<Text style={{marginTop: 1, fontWeight: 'bold', fontSize: 17}}>Form Check Sheet</Text>
							</View>
							<View style={{flexDirection: 'column', flex: 1}}>
								<View style={{flexDirection: 'row', borderTopWidth: 0.3, height: 40, justifyContent: 'center', alignItems: 'center'}}>
									<Text style={{fontWeight: 'bold', fontSize: 17}}>{line_name != null ? line_name : '-'}</Text>
								</View>
								<View style={{flexDirection: 'row', borderTopWidth: 0.3}}>
									<View style={{flexDirection: 'column', width: '50%', borderRightWidth: 0.3, alignItems: 'center'}}>
										<Text style={{fontWeight: 'bold', fontSize: 13}}>{date != null ? date : '-'}</Text>
									</View>
									<View style={{flexDirection: 'column', paddingLeft: 5, flex: 1, alignItems: 'center'}}>
										<Text style={{fontWeight: 'bold', fontSize: 13}}>Shift {data != null ? data.current_hour : null}</Text>
									</View>
								</View>
							</View>
						</View>

						<View style={{flexDirection: 'row'}}>
							<View style={{flexDirection: 'column', borderTopWidth: 0.3, borderRightWidth: 0.3, padding: 15, justifyContent: 'center', alignItems: 'center', width: "50%", backgroundColor: '#dfe0df'}}>
								<Text style={{marginTop: 1, fontWeight: 'bold', fontSize: 11}}>{mkt_customer_name != null ? mkt_customer_name : '-'}</Text>
							</View>
							<View style={{flexDirection: 'column', borderTopWidth: 0.3, justifyContent: 'center', alignItems: 'center', flex: 1}}>
								<Text style={{fontWeight: 'bold', fontSize: 11}}>{product_name != null ? product_name : '-'}</Text>
							</View>
						</View>

						<View style={{borderWidth: 0.5, flexDirection: 'row'}}>
							<View style={{flex: 1, justifyContent: 'center', borderRightWidth: 0.3, alignItems: 'center', paddingHorizontal: 5, height: 25}}>
								<Text style={{fontSize: 11, fontWeight: 'bold'}}>{product_internal_part_id != null ? product_internal_part_id : '-'}</Text>
							</View>
							<View style={{width: '33%', justifyContent: 'center', borderRightWidth: 0.3, alignItems: 'center', height: 25, paddingHorizontal: 5}}>
								<Text style={{fontSize: 11, fontWeight: 'bold'}}>{product_customer_part_number != null ? product_customer_part_number : '-'}</Text>
							</View>
							<View style={{width: '33%', justifyContent: 'center', borderRightWidth: 0.3, alignItems: 'center', paddingHorizontal: 5, height: 25}}>
								<Text style={{fontSize: 11, fontWeight: 'bold'}}>Model: {product_model != null ? product_model : '-'}</Text>
							</View>
						</View>

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