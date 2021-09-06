import {Image, View, TextInput, TouchableWithoutFeedback, Keyboard, KeyboardAvoidingView, ScrollView, ActivityIndicator, Alert, VirtualizedList, TouchableOpacity} from 'react-native';
import React, {useEffect, useState} from 'react';
import { Container, Text, Button, Picker } from 'native-base';
import LogoSIP from '../../../Assets/logo-sip370x50.png';
import sampah from '../../../Assets/tong-sampah.png';
import AsyncStorage from "@react-native-community/async-storage";
import Axios from 'axios';
import moment from 'moment';
import app_version from	'../../../System/app_version';
import base_url from	'../../../System/base_url';
import {launchCamera} from 'react-native-image-picker';
import header_form from '../../../Templates/HeaderForm';

const leader_form_show = ({route, navigation}) => {
  const {secproc_planning_product_item_id, product_name, product_internal_part_id, product_customer_part_number, mkt_customer_name, product_model, sys_plant_id, line_name, date} = route.params
	useEffect(() => {
		get_data()
	}, [])

	const object_header = {
		id: 2, 
		type: 'edit',
		title: 'Form Data Operator (Edit)',  
		line_name: line_name != null ? line_name : '-', 
		date: date, 
		current_hour: data != null ? data.current_hour : null, 
		mkt_customer_name: mkt_customer_name != null ? mkt_customer_name : '-',
		product_name: product_name != null ? product_name : '-', 
		product_internal_part_id: product_internal_part_id != null ? product_internal_part_id : '-', 
		product_customer_part_number: product_customer_part_number != null ? product_customer_part_number : '-', 
		product_model: product_model != null ? product_model : '-'
	}

	const [data, setData] 	              				= useState(null)
	const [loading, setLoading] 									= useState(false)
	const [simpan_button, setSimpanButton] 				= useState(false)
	const [operator_lama, setOperatorLama] 	      = useState([])
	const [operator, setOperator] 	              = useState([])
	const [filtered, setFiltered] 								= useState(null)
	const [modal, setModal]												= useState(true)
	/**
	 * Parameters
	 */
	const [data_categories, setCategories]				= useState(null)
	const [operator_process, setOperatorProcess]	= useState([])

	
	const submit = async() => {
		setLoading(false)
		const user_id = await AsyncStorage.getItem('id')
		const token = await AsyncStorage.getItem("key")
		var body = {
			sys_plant_id: sys_plant_id,
			tbl: 'planning_pic_product',
			user_id: user_id,
			app_version: app_version,
			secproc_planning_product_item_id: secproc_planning_product_item_id,
			planning_pic_products: operator_lama,
			new_planning_pic_products: operator_process
		}
		var config = {
			method: 'put',
			url: `${base_url}/api/v2/secproc_update`,
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
				"Success Update Data",
				"Berhasil Menyimpan Data",
				[
					{ 
						text: "OK", 
						onPress: () => navigation.navigate('ShowProducts')
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
		const headers = {
			'Authorization': token
		}
		const params = {
			tbl: 'planning_pic_product',
			app_version: app_version,
			sys_plant_id: 2,
			user_id: user_id,
			secproc_planning_product_item_id: secproc_planning_product_item_id,
		}
		Axios.get(`${base_url}/api/v2/secprocs/secproc_show?`, {params: params, headers: headers})
		.then(response => {
			setLoading(true)
      setData(response.data.data)
			var array 		= []
			var array_dua = []
			response.data.data.category_processes.map((v, k) => {
				v.operator_lists.map((val, key) => {
					var object = {
						category_process_id: v.category_process_id,
						operator_id: val.operator_id,
						operator_name: val.operator_name
					}
					var object_dua = {
						id: val.id,
						operator_id: val.operator_id,
						status: val.status
					}
					array.push(object)
					array_dua.push(object_dua)
				})
				// console.log(operator_process)
			})
			setOperatorProcess(array)
			setOperatorLama(array_dua)
			setOperator(response.data.data.operator_lists)
      setCategories({id: response.data.data.category_processes[0].category_process_id, name: response.data.data.category_processes[0].category_process_name})
			console.log(response.data.status)
		})
		.catch(error => {
			setLoading(true)
			console.log(error)
		})
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
				<View style={{paddingTop: 15, flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
					{category_process}
				</View>
				{funcContent()}

				{
					simpan_button ?
					<View style={{flexDirection: 'row', justifyContent: 'center'}}>
						<Button style={{marginTop: 10, borderRadius: 5}} onPress={() => submit()}>
							<Text>Update Data</Text>
						</Button> 
					</View> :
					null
				}
			</ScrollView>
		)
	}

	const funcContent = () => {
		var recomendation = []
		if(modal == true){
			recomendation.push(
				<ScrollView key={'scrollView'} showsVerticalScrollIndicator={false}>
					{recommendationFunction()}
				</ScrollView>
			)
		}
		return (
			<View>
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

				<View style={{flexDirection: 'row', justifyContent: 'center'}}>
					<Button style={{marginTop: 10, borderRadius: 5}} onPress={() => checkOperator(data_categories)}><Text>Tambah Operator {data_categories != null ? data_categories.name : '-'}</Text></Button>
				</View>

				{listOperator()}

				{recomendation}

			</View>
		)
	}

	const searchFunction = (val, key, type) => {
		setModal(true)
		if(val && modal == true){
			const list = operator.filter(function (item) {
				const text_data = val.toUpperCase()
				const name			= item.name.toUpperCase().indexOf(text_data) >= 0
				const nik	 			= item.nik.toUpperCase().indexOf(text_data) >= 0
				return name || nik
			})
			setFiltered({key: key, list: list, type: type})
		}else{
			setFiltered({key: key, list: []})
		}
	}

	const recommendationFunction = () => {
		var records = []
		if(filtered != null){
			if(filtered.list.length > 0){
				filtered.list.map((v, k) => {
					records.push(
						<TouchableOpacity key={k} style={{borderRadius: 10, alignItems: 'flex-end', marginTop: 2, marginLeft: 45, marginRight: 5}} onPress={() => fillOperatorData(v, filtered.key, false)}>
							<View style={{backgroundColor: '#adadad', width: '100%', padding: 4, flexDirection: 'row', justifyContent: 'space-between', borderRadius: 5}}>
								<View>
									<Text style={{fontWeight: 'bold', fontSize: 10, textTransform: 'uppercase'}}>{v.nik}</Text>
									<Text style={{fontSize: 12, fontWeight: '600', letterSpacing: 1.2, textTransform: 'uppercase', marginTop: 5}}>{v.name}</Text>
								</View>
							</View>
						</TouchableOpacity>
					)
				})
			}
		}
		return records
	}

	const fillOperatorData = (el, key, status) => {
		let new_object	= [...operator_process]
		new_object[key].category_process_id = data_categories != null ? data_categories.id : null
		new_object[key].operator_id = el.id
		new_object[key].operator_name = el.name
		setOperatorProcess(new_object)
		setModal(status)
	}

	const checkOperator = (value) => {
		setSimpanButton(true)
		setOperatorProcess([...operator_process, {
			category_process_id: value.id,
			operator_id: 0,
			operator_name: null,
		}])
	}

	const listOperator = () => {
		var records = []
		var iterasi = 1
		if(data != null){
			if(operator_process.length > 0){
				operator_process.map((value, key) => {
					if(data.category_processes.length > 0){
						data.category_processes.map((element, index) => {
							if(data_categories != null){
								if(value.category_process_id == element.category_process_id && value.category_process_id == data_categories.id){
									records.push(
										<View key={key} style={{paddingTop: 20, flexDirection: 'row'}}>
											<View style={{padding: 4, width: '10%'}}>
												<View style={{borderWidth: 0.5, borderRadius: 5, height: 40, justifyContent: 'center', paddingLeft: 5}}>
													<Text style={{fontSize: 15}}> {iterasi++} </Text>
												</View>
											</View>
											<View style={{margin: 4, flex: 1}}>
												<View style={{borderWidth: 0.5, borderRadius: 5, height: 40, justifyContent: 'center', paddingLeft: 5}}>
													<TextInput style={{color: 'black', fontSize: 13}} value={operator_process[key].operator_name} onChangeText={(value) => searchFunction(value, key, 'not-call')} placeholder='Search' />
												</View>
											</View>
											<View style={{margin: 4, width: '10%'}} >
												<TouchableOpacity onPress={() => deleteItem(key, operator_process[key].operator_id) }>
													<Image source={sampah} style={{backgroundColor: 'red', borderRadius: 5, height: 40, width: 40}} />
												</TouchableOpacity>
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

	const deleteItem = (key, el) => {
		setSimpanButton(true)
		setOperatorProcess(operator_process.filter(item => item.operator_id == el ? null : item.operator_id))
		let new_object = [...operator_lama]
		new_object[key].status = 'suspend' 
		setOperatorLama(new_object)
	}
	console.log(operator_lama)

	return(
		<KeyboardAvoidingView behavior={Platform.OS == "ios" ? "padding" : "height"} style={{flex:1}}>
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

export default leader_form_show;