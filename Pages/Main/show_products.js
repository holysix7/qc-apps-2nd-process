import {Image, View, ScrollView, ActivityIndicator, RefreshControl, Alert, TouchableOpacity} from 'react-native';
import React, {useEffect, useState, useCallback} from 'react';
import LogoSIP from '../Assets/logo-sip370x50.png';
import operators from '../Assets/operators.png';
import AsyncStorage from "@react-native-community/async-storage";
import axios from 'axios';
import moment from 'moment';
import DateTimePicker from '@react-native-community/datetimepicker';
import CalendarBlack from '../Assets/calendar.png';
import { Container, Text, Button } from 'native-base';
import styles from '../Styles/Styling';
import app_version from '../System/app_version';
import base_url from '../System/base_url';

const show_products = ({route, navigation}) => {
	const {line_id, line_name, line_number, sys_plant_id, line_status, user_id} = route.params
	const [data, setData] = useState([])
	const [planning_date, setDate] = useState(new Date())
	const [dept_name, setDeptName] = useState(null)
	const [show, setShow] = useState(false)
	const [loading, setLoading] = useState(false)
  const [refreshing, setRefreshing] = useState(false)
	var dateTime 					= moment()
	var maximumDateFix		= moment(dateTime).add(1, 'days')
	var choosenFixedDate 	= moment(planning_date).format("YYYY-MM-DD")
	
	// console.log(choosenFixedDate)

	useEffect(() => {
		products();
	}, [])
	
	const products = async(value) => {
		var new_val = null
		setLoading(false)
		if(value){
			new_val = value
		}
		
		const token = await AsyncStorage.getItem("key")
		const dept_name = await AsyncStorage.getItem("department_name")
		setDeptName(dept_name)
		const headers = {
			'Authorization': token
		}
		const params = {
			tbl: 'planning_product',
			app_version: app_version,
			sys_plant_id: sys_plant_id,
      user_id: user_id,
			secproc_part_line_id: line_id,
			planning_date: new_val != null ? new_val : choosenFixedDate 
		}
		// console.log(params)
		axios.get(`${base_url}/api/v2/secprocs?`, {params: params, headers: headers})
		.then(response => {
			setLoading(true)
      setRefreshing(false)
			setData(response.data.data == null ? [] : response.data.data)
			console.log("Products List Data: ", response.data.status, response.data.message)
		})
		.catch(error => {
			console.log(error)
		})
	}

  const showDate = () => {
    setShow(true)
  }

  const onChange = (event, val) => {
    const currentDate = val || planning_date;
    setShow(Platform.OS === 'ios');
    setDate(currentDate)
		products(val)
  };

  const showDateModal = () => {
    if(show == true){
			return (
				<DateTimePicker
					testID="dateTimePicker"
					value={planning_date}
					maximumDate={new Date(maximumDateFix)}
					is24Hour={true}
					display="calendar"
					onChange={(evt, val) => onChange(evt, val)}
				/>
			)
    }
  }

	const searchData = () => {
		return (
			<View style={{flexDirection: 'row', width: '100%', backgroundColor: '#dfe0df', justifyContent: 'center'}}>
				<View style={{flexDirection: 'row', borderWidth: 1, borderRadius: 5, marginTop: 15, justifyContent: 'center'}}>
					<View style={{flexDirection: 'column', alignItems: 'flex-start', paddingLeft: 10, paddingVertical: 5}}>
						<Text onPress={() => showDate()}>{choosenFixedDate}</Text>
					</View>
					<View style={{flexDirection: 'column', alignItems: 'flex-end', width: 35, paddingVertical: 5, marginLeft: 55}}>
						<TouchableOpacity onPress={() => showDate()}>
							<Image source={CalendarBlack} style={{width: 25, height: 25, marginLeft: 4}}/>
						</TouchableOpacity>
					</View>
				</View>
				{showDateModal()}
			</View>
		)
	}

  const onRefresh = useCallback(() => {
    setRefreshing(true);
		products()
  }, []);

	const contentHeader = () => {
		return (
			<View style={styles.contentHeader}>
				<Text style={styles.fontProduct}>({line_number}) - {line_name}</Text>
				<Text style={styles.fontListProducts}>List Products</Text>
			</View>
		)
	}

  const contentData = () => {
    var records = []
    if(data.length > 0){
      data.map((val, key) => {
				if(val.operator_status == 'Ready'){
					if(val.next_screen == 'leader_form'){
						var button_status = true
						var new_shift 		= val.shift
						var route 				= 'LeaderFormShow'
						// var route 				= 'QCForm'
						var route_params 	= {
							secproc_planning_product_item_id: val.secproc_planning_product_item_id,
							secproc_planning_product_id: val.secproc_planning_product_id,
							eng_product_id: val.eng_product_id,
							product_name: val.product_name,
							product_internal_part_id: val.product_internal_part_id,
							product_customer_part_number: val.product_customer_part_number,
							quantity: val.quantity,
							mkt_customer_name: val.mkt_customer_name,
							product_model: val.product_model,
							sys_plant_id: sys_plant_id,
							line_name: line_name,
							line_status: line_status,
							default_shift: new_shift,
							dept_name: dept_name
						}
					}else if(val.next_screen == 'qc_form'){
						var button_status = true
						var new_shift 		= val.shift + 'abc'
						var route 				= 'QCForm'
						// var route 				= 'LeaderFormShow'
						var route_params 	= {
							secproc_planning_product_item_id: val.secproc_planning_product_item_id,
							secproc_planning_product_id: val.secproc_planning_product_id,
							eng_product_id: val.eng_product_id,
							product_name: val.product_name,
							product_internal_part_id: val.product_internal_part_id,
							product_customer_part_number: val.product_customer_part_number,
							quantity: val.quantity,
							mkt_customer_name: val.mkt_customer_name,
							product_model: val.product_model,
							sys_plant_id: sys_plant_id,
							line_name: line_name,
							line_status: line_status,
							default_shift: new_shift[0],
							dept_name: dept_name
						}
					}else{
						var button_status = false
					}
				}else{
					if(val.next_screen == 'leader_form'){
						var button_status = true
						var new_shift 		= val.shift
						var route 				= 'LeaderForm'
						var route_params 	= {
							secproc_planning_product_item_id: val.secproc_planning_product_item_id,
							secproc_planning_product_id: val.secproc_planning_product_id,
							eng_product_id: val.eng_product_id,
							product_name: val.product_name,
							product_internal_part_id: val.product_internal_part_id,
							product_customer_part_number: val.product_customer_part_number,
							quantity: val.quantity,
							mkt_customer_name: val.mkt_customer_name,
							product_model: val.product_model,
							sys_plant_id: sys_plant_id,
							line_name: line_name,
							line_status: line_status,
							default_shift: new_shift,
							dept_name: dept_name
						}
					}else{
						var button_status = false
					}
				}
				if(val.product_name.length > 28){
					var footer = { 
						fontSize: 7, 
						fontWeight: 'bold'
					}
				}else{
					var footer = { 
						fontSize: 9, 
						fontWeight: 'bold'
					}
				}
				console.log(val.product_name + ' + ' + val.product_name.length)
				records.push( 
					<View key={key} style={styles.contenDateProduct}>
						<Button style={styles.productsButtonRunning} onPress={() => button_status == true ? navigation.navigate(route, route_params) : alert('Maaf anda tidak memiliki akses') }>
							<View style={{flexDirection: 'row'}}>
								<View style={{flexDirection: 'column', flex: 1}}>
									<Text style={styles.fontButtonHeader}> {val.product_customer_part_number} </Text>   
									<Text style={footer}> {val.product_name} </Text>   
								</View>
								<View style={{flexDirection: 'column', justifyContent: 'flex-end'}}>
									<Text style={styles.fontButtonFooter}> {val.product_internal_part_id} </Text>   
								</View>
								{
									val.operator_status == 'Ready' ? 
									<View style={{flexDirection: 'column', justifyContent: 'center', marginRight: 5}}>
										<Image source={operators} style={{width: 35, height: 35}} />
									</View> :
									null 
								}
							</View>
						</Button>
					</View>
				)
      })
    }else{
			records.push(
				<View key={'wkwkw'} style={{width: '100%', padding: 25, flexDirection: 'row', justifyContent: 'center'}}>
					<View style={{alignItems: 'center', height: 200, padding: 10, borderRadius: 10, backgroundColor: '#F3F2C9'}}>
						<Text style={{textAlign: 'justify', color: 'grey'}}>Tidak ada data part di {line_name} pada tanggal {choosenFixedDate} </Text>
					</View>
				</View>
			)
		}
    return records
  }

	return(
		<Container>
			<View style={styles.headerWithBorder}>
				<View style={styles.contentHeader}>
					<Image source={LogoSIP}/>
				</View>
				{loading ? contentHeader() : null}
			</View>
			{loading ? null : <View style={{backgroundColor: '#dfe0df', alignItems: 'center', justifyContent: 'center'}}><ActivityIndicator size="large" color="#0000ff"/></View>}
			{loading ? searchData() : null}
			<View style={styles.contentFullWithPadding}>
				<ScrollView refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
				{loading ? contentData() : null}
				</ScrollView>
			</View>
			<View style={{width: '100%', padding: 25, flexDirection: 'row', justifyContent: 'center', backgroundColor: '#dfe0df'}}>
				{loading ? 
				<Button style={{justifyContent: 'center', backgroundColor: '#787A91', borderColor: '#1a508b', borderRadius: 15, flex: 1}} onPress={() => alert('Laporan Rework Under Maintenance')}>
					<Text style={{color: '#B2B1B9'}}>Laporan Rework Product Lot Out</Text>
				</Button> : 
				null}
			</View>
		</Container>
	)
}

export default show_products;