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
import AutocompleteInput from 'react-native-autocomplete-input';

const leader_form = ({route, navigation}) => {
  const {secproc_planning_product_item_id, product_name, product_internal_part_id, product_customer_part_number, mkt_customer_name, product_model, sys_plant_id, line_name} = route.params
	useEffect(() => {
		get_data()
	}, [])
	const [user_name, setUserName] 	      				= useState(null)
	const [simpan_button, setSimpanButton] 	      = useState(null)
	const [data, setData] 	              				= useState(null)
	const [operator, setOperator] 	              = useState([])
	const [loading, setLoading] 									= useState(false)
	const [data_categories, setCategories]				= useState(null)
	const [modal, setModal]												= useState(true)
	const [filtered, setFiltered] 								= useState(null)
	const [operator_process, setOperatorProcess]	= useState([])
	const [total_process, setTotalProcess]				= useState([])
	let date 																			= moment().format("YYYY-MM-DD")

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
			operator_process: operator_process,
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
		const name = await AsyncStorage.getItem('name')
		setUserName(name)
		const headers = {
			'Authorization': token
		}
		const params = {
			tbl: 'planning_pic_product',
			app_version: app_version,
			sys_plant_id: 2,
			user_id: user_id,
			secproc_planning_product_item_id: secproc_planning_product_item_id
		}
		console.log(params)
		Axios.get(`${base_url}/api/v2/secprocs/new?`, {params: params, headers: headers})
		.then(response => {
			setLoading(true)
      setData(response.data.data)
      setOperator(response.data.data.operator_list)
			setCategories({id: response.data.data.category_process_by_product[0].id, name: response.data.data.category_process_by_product[0].name})
			console.log(response.data.status)
		})
		.catch(error => {
			console.log(error)
		})
	}

	const content = () => {
		var category_process = []
		var warna, color = null 
		if(data != null){
			if(data.category_process_by_product.length > 0){
				data.category_process_by_product.map((val, key) => {
					if(data_categories != null){
						if(val.id == data_categories.id){
							warna = '#39A2DB'
							color = 'white'
						}else{
							warna = 'grey'
							color = 'black'
						}
					}
					// console.log(val)
					category_process.push(
						// <View key={key} style={{flexDirection: 'row', marginTop: 5, borderWidth: 0.3, marginHorizontal: 2, paddingHorizontal: 5}}>
							<TouchableOpacity key={key} style={{flexDirection: 'column', height: 50, justifyContent: 'center', borderWidth: 0.3, marginHorizontal: 2, paddingHorizontal: 5, backgroundColor: warna}} onPress={() => setCategories({id: val.id, name: val.name})}>
								<Text>{val.name}</Text>
							</TouchableOpacity>
						// </View>
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
			<ScrollView key={'content'} style={{flexDirection: 'column'}}>
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
			var button_save = []
			if(simpan_button){
				button_save.push(
					<View key={'but_sub'} style={{flexDirection: 'row', justifyContent: 'center'}}>
						<Button style={{marginTop: 10, borderRadius: 5}} onPress={() => submit()}><Text>Simpan</Text></Button>
					</View>
				)
			}
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
								<Text style={{fontSize: 14}}>{data_categories != null ? data_categories.name : 'HUBUNGI IT DEPT.'}</Text>
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
								<Text style={{fontSize: 14}}>{user_name}</Text>
							</View>
						</View>
					</View>
					<View style={{flexDirection: 'row', justifyContent: 'center'}}>
						<Button style={{marginTop: 10, borderRadius: 5}} onPress={() => checkOperator(data_categories)}><Text>Tambah Operator {data_categories.name}</Text></Button>
					</View>

					{listOperator()}

					{recomendation}
					
					{button_save}

				</View>
			)
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
			hrd_employee_id: 0,
			hrd_employee_name: null,
			hrd_employee_nik: null
		}])
	}

	const searchFunction = (val, key, id) => {
		setModal(true)
		if(val && modal == true){
			const list = operator.filter(function (item) {
				const text_data = val.toUpperCase()
				const name			= item.name.toUpperCase().indexOf(text_data) >= 0
				const nik	 			= item.nik.toUpperCase().indexOf(text_data) >= 0
				return name || nik
			})
			setFiltered({key: key, list: list})
		}else{
			console.log('kosong')
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
								<View style={{margin: 4, flex: 1}}>
									<View style={{borderWidth: 0.5, borderRadius: 5, height: 40, justifyContent: 'center', paddingLeft: 5}}>
										<TextInput style={{color: 'black', fontSize: 13}} value={operator_process[key].hrd_employee_name} onChangeText={(value) => searchFunction(value, key, key+1)} placeholder='Search' />
									</View>
								</View>
								<View style={{margin: 4, width: '10%'}} >
									<TouchableOpacity onPress={() => deleteItem(operator_process[key].id) }>
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

	const deleteItem = (el) => {
		setSimpanButton(true)
		setOperatorProcess(operator_process.filter(item => item.id == el ? null : item.id))
	}

	const fillOperatorData = (el, key, status) => {
		console.log('in id: ', el)
		console.log('in key: ', key)
		let new_object	= [...operator_process]
		new_object[key].hrd_employee_id = el.id
		new_object[key].hrd_employee_name = el.name
		new_object[key].hrd_employee_nik = el.nik
		setOperatorProcess(new_object)
		setModal(status)
	}

	return(
		<KeyboardAvoidingView style={{flex:1}} behavior={Platform.OS == "ios" ? "padding" : "height"}>
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
							{/* {funcContent()} */}
						{/* </View> */}

					</View>
				</Container>
			</TouchableWithoutFeedback>
		</KeyboardAvoidingView>
	)
}

export default leader_form;