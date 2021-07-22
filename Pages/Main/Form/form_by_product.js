import {Image, View, TextInput, TouchableWithoutFeedback, Keyboard, KeyboardAvoidingView, ScrollView, ActivityIndicator, Alert, VirtualizedList, TouchableOpacity} from 'react-native';
import React, {useEffect, useState} from 'react';
import { Container, Text, Button, Picker } from 'native-base';
import LogoSIP from '../../Assets/logo-sip370x50.png';
import AsyncStorage from "@react-native-community/async-storage";
import Axios from 'axios';
import moment from 'moment';
import app_version from	'../../System/app_version';
import base_url from	'../../System/base_url';

const form_by_product = ({route, navigation}) => {
  const {id_part, secproc_planning_product_id, eng_product_id, product_name, product_internal_part_id, product_customer_part_number, quantity, mkt_customer_name, product_model, sys_plant_id, line_name, line_status} = route.params
	useEffect(() => {
		get_data()
	}, [])
	const [user_name, setUserName] 	      				= useState(null)
	const [simpan_button, setSimpanButton] 	      = useState(null)
	const [data, setData] 	              				= useState(null)
	const [mold_condition, setCondition] 					= useState(null)
	const [loading, setLoading] 									= useState(false)
	const [neeple_cooling, setCooling] 						= useState(null)
	const [standard_part, setStandard] 						= useState(null)
	const [data_categories, setCategories]				= useState(null)
	const [operator_process, setOperatorProcess]	= useState([])
	const [total_process, setTotalProcess]				= useState([])
	const [created_by, setCreatedBy]		  				= useState("")
	const [updated_by, setUpdatedBy]		  				= useState("")
	const [tooling, setTooling]		  							= useState(null)
	const [planningId, setPlanningId]		  				= useState("")
	let date 																			= moment().format("YYYY-MM-DD")
	let created_at 																= moment().format("YYYY-MM-DD HH:mm:ss")
	let updated_at 																= moment().format("YYYY-MM-DD HH:mm:ss")
	const planning_id = parseInt(planningId)

	const submit = async() => {
		setLoading(false)
		const id = await AsyncStorage.getItem('id')
		console.log('data: ', data)
		const token = await AsyncStorage.getItem("key")
		const params = {
			tbl: 'daily_inspection',
			kind: 'masspro_mm',
			update_hour: sys_plant_id,
			app_version: app_version
		}
		var config = {
			method: 'put',
			url: base_url,
			params: params,
			headers: { 
				'Authorization': token, 
				'Content-Type': 'application/json', 
				'Cookie': '_denapi_session=ubcfq3AHCuVeTlxtg%2F1nyEa3Ktylg8nY1lIEPD7pgS3YAWwlKOxwA0S9pw7JhvZ2mNkrYl0j62wAWJWJZd7AbfolGuHCwXgEMeJH6EoLiQ%3D%3D--M%2BjBb0uJeHmOf%2B3o--%2F2Fjw57x0Fyr90Ec9FVibQ%3D%3D'
			},
			data : data
		};
		if(parseInt(tooling) > 0 && mold_condition != null && neeple_cooling != null && standard_part != null){
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
							onPress: () => console.log('200 OK') 
						}
					],
					{ cancelable: false }
				)
				navigation.navigate('ShowPlanning')
			})
			.catch(function (error){
				setLoading(true)
				Alert.alert(
					"Failed Send Data",
					"Gagal Kirim Data, Hubungi IT Department",
					[
						{ 
							text: "OK", 
							onPress: () => console.log('400 BAD') 
						}
					],
					{ cancelable: false }
				)
				console.log(error)
			})
		}else{
			console.log("Gabisa Save Bro")
			setLoading(true)
			Alert.alert(
				"Failed Send Data",
				"Gagal Kirim Data, Harap Perhatikan Form Input!",
				[
					{ 
						text: "OK", 
						onPress: () => console.log('400 BAD') 
					}
				],
				{ cancelable: false }
			)
		}
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
			tbl: 'planning_pic_product',
			app_version: app_version,
			sys_plant_id: sys_plant_id,
			user_id: user_id,
			eng_product_id: eng_product_id
		}
		Axios.get('http://192.168.131.121:3000/api/v2/secprocs/new?', {params: params, headers: headers})
		.then(response => {
			setLoading(true)
      setData(response.data.data)
			console.log(response.data.status)
		})
		.catch(error => {
			console.log(error)
		})
	}

	const content = () => {
		var form = []
		var category_process = []
		if(data != null){
			if(data.category_process_by_product.length > 0){
				data.category_process_by_product.map((val, key) => {
					category_process.push(
						<View key={key} style={{flexDirection: 'row', marginTop: 5, borderWidth: 0.3, marginHorizontal: 2, paddingHorizontal: 5}}>
							<TouchableOpacity style={{flexDirection: 'column', height: 50, justifyContent: 'center'}} onPress={() => setCategories({id: val.id, name: val.name})}>
								<Text>{val.name}</Text>
							</TouchableOpacity>
						</View>
					)
				})
			}else{
				category_process.push(
					<View key={'category_process'} style={{flexDirection: 'row', marginTop: 10}}>
						<View style={{flexDirection: 'column', justifyContent: 'center', height: 120, padding: 10, borderRadius: 10, backgroundColor: '#F3F2C9'}}>
							<Text style={{textAlign: 'justify', color: 'grey'}}>Gagal Memanggil Data Category Process</Text>
						</View>
					</View>
				)
			}
		}
		return (
			<View key={'content'} style={{flexDirection: 'column'}}>
				<View style={{flexDirection: 'row', marginTop: 15, borderTopWidth: 0.3}}>
					<View style={{flexDirection: 'column', alignItems: 'center', flex: 1}}>
						<Text style={{fontWeight: 'bold'}}>Category Process</Text>
					</View>
				</View>
				<View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
					{category_process}
				</View>
			</View>
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
									<Text style={{fontSize: 14}}>{user_name.substring(5, 1000)}</Text>
								</View>
							</View>
						</View>

						<View style={{flexDirection: 'row', justifyContent: 'center'}}>
							<Button style={{marginTop: 10, borderRadius: 5}} onPress={() => checkOperator(data_categories)}><Text>Tambah Operator {data_categories.name}</Text></Button>
						</View>

						{listOperator()}

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
									<Text style={{fontSize: 14}}>{user_name.substring(5, 1000)}</Text>
								</View>
							</View>
						</View>
						<View style={{flexDirection: 'row', justifyContent: 'center'}}>
							<Button style={{marginTop: 10, borderRadius: 5}} onPress={() => checkOperator(data_categories)}><Text>Tambah Operator {data_categories.name}</Text></Button>
						</View>

						{listOperator()}

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
									<Text style={{fontSize: 14}}>{user_name.substring(5, 1000)}</Text>
								</View>
							</View>
						</View>
						<View style={{flexDirection: 'row', justifyContent: 'center'}}>
							<Button style={{marginTop: 10, borderRadius: 5}} onPress={() => checkOperator(data_categories)}><Text>Tambah Operator {data_categories.name}</Text></Button>
						</View>
						
						{listOperator()}

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
									<Text style={{fontSize: 14}}>{user_name.substring(5, 1000)}</Text>
								</View>
							</View>
						</View>
						<View style={{flexDirection: 'row', justifyContent: 'center'}}>
							<Button style={{marginTop: 10, borderRadius: 5}} onPress={() => checkOperator(data_categories)}><Text>Tambah Operator {data_categories.name}</Text></Button>
						</View>
						
						{listOperator()}

						{
							simpan_button ? 
							<View style={{flexDirection: 'row', justifyContent: 'center', marginVertical: 20}}>
								<Button style={{marginTop: 10, borderRadius: 5}} onPress={() => submit()}><Text>Simpan</Text></Button>
							</View> :
							null
						}

					</ScrollView>
				)
			}else{
				
			}
		}
	}

	const checkOperator = (value) => {
		setSimpanButton(true)
		setTotalProcess([...total_process, {
			id: total_process.length + 1,
			category_process_id: value.id,
			name: value.name
		}])
		setOperatorProcess([...operator_process, {
			id: operator_process.length + 1,
			category_process_id: value.id,
			category_process_name: value.name,
			hrd_employee_id: 0
		}])
	}
	
	const listOperator = () => {
		var records = []
		var iterasi = 1
		if(operator_process.length > 0 && total_process.length > 0){
			operator_process.map((value, key) => {
				data.category_process_by_product.map((element, index) => {
					if(value.category_process_id == element.id && value.category_process_id == data_categories.id){
						records.push(
							<View key={key} style={{paddingTop: 20, flexDirection: 'row'}}>
								<View style={{padding: 4, width: '10%'}}>
									<View style={{borderWidth: 0.5, borderRadius: 5, height: 40, justifyContent: 'center', paddingLeft: 5}}>
										<Text style={{fontSize: 15}}> {iterasi++} </Text>
									</View>
								</View>
								<View style={{padding: 4, flex: 1}}>
									<View style={{borderWidth: 0.5, borderRadius: 5, height: 40, justifyContent: 'center', paddingLeft: 5}}>
										<Picker 
										mode="dropdown"
										selectedValue={operator_process[key].hrd_employee_id}
										onValueChange={(value) => fillOperatorData(value, key)}
										itemStyle={{marginLeft: 0}}
										itemTextStyle={{fontSize: 9}}
										>
											{loopingOperator()}
										</Picker>
									</View>
								</View>
							</View>	
						)
					}
				})
			})
		}
		return records
	}

	console.log(operator_process)

	const loopingOperator = () => {
		var record = []
		if(data != null){
			if(data.operator_list.length > 0){
				record.push(
					<Picker.Item key={'itemChild'} label={'Pilih'} value={0} />
				)
				data.operator_list.map((val, key) => {
					record.push(
						<Picker.Item key={key} label={val.nik + ' | ' + val.name} value={val.id} />
					)
				})
			}
		}
		return record
	}

	const fillOperatorData = (el, key) => {
		let new_object	= [...operator_process]
		new_object[key].hrd_employee_id = el
		setOperatorProcess(new_object)
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
								<Text style={{marginTop: 1, fontWeight: 'bold', fontSize: 17}}>Form Data Operator</Text>
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
										<Text style={{fontWeight: 'bold', fontSize: 13}}>shift 1</Text>
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
								<Text style={{fontSize: 11}}>{product_internal_part_id != null ? product_internal_part_id : '-'}</Text>
							</View>
							<View style={{width: '33%', justifyContent: 'center', borderRightWidth: 0.3, alignItems: 'center', height: 25, paddingHorizontal: 5}}>
								<Text style={{fontSize: 11}}>{product_customer_part_number != null ? product_customer_part_number : '-'}</Text>
							</View>
							<View style={{width: '33%', justifyContent: 'center', borderRightWidth: 0.3, alignItems: 'center', paddingHorizontal: 5, height: 25}}>
								<Text style={{fontSize: 11}}>{product_model != null ? product_model : '-'}</Text>
							</View>
						</View>

						{loading ? content() : <View style={{justifyContent: 'center'}}><ActivityIndicator size="large" color="#0000ff"/></View>}

						{/* <View style={{flexDirection: 'row'}}> */}
							{funcContent()}
						{/* </View> */}

					</View>
				</Container>
			</TouchableWithoutFeedback>
		</KeyboardAvoidingView>
	)
}

export default form_by_product;