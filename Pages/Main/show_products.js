import {Image, View, ScrollView, ActivityIndicator, RefreshControl, Alert, TouchableOpacity} from 'react-native';
import React, {useEffect, useState, useCallback} from 'react';
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
import header_content from '../Templates/HeaderShow';
import content_data from '../Templates/Content';

const show_products = ({route, navigation}) => {
	const {line_id, line_name, line_number, sys_plant_id, line_status, user_id} = route.params
	const [data, setData] = useState([])
	const [rework_access, setReworkAccess] = useState(false)
	const [planning_date, setDate] = useState(new Date())
	const [dept_name, setDeptName] = useState(null)
	const [show, setShow] = useState(false)
	const [loading, setLoading] = useState(false)
  const [refreshing, setRefreshing] = useState(false)
	var dateTime 					= moment()
	var maximumDateFix		= moment(dateTime).add(1, 'days')
	var choosenFixedDate 	= moment(planning_date).format("YYYY-MM-DD")
  const object_header = {
    title: 'List Products By Machine',
    line_number: line_number, 
    line_name: line_name
  }
	const object_data = {
		type: 'show_product',
		data: data, 
		sys_plant_id: sys_plant_id, 
		line_status: line_status, 
		dept_name: dept_name, 
		line_name: line_name, 
		date: choosenFixedDate
	}
	
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
		console.log(params)
		axios.get(`${base_url}/api/v2/secprocs?`, {params: params, headers: headers})
		.then(response => {
			setLoading(true)
      setRefreshing(false)
			setReworkAccess(response.data.rework_access)
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

	const buttonRework = () => {
		var tampil_button = false
		var button = []
		if(rework_access == true){
			tampil_button = true
		}else{
			tampil_button = false
		}
		tampil_button == true ?
		button.push(
			<Button key={'button'} style={{justifyContent: 'center', backgroundColor: '#1a508b', borderColor: '#1a508b', borderRadius: 15, flex: 1}} onPress={() => navigation.navigate('LotOut', {
				line_id: line_id, 
				line_name: line_name, 
				line_number: line_number, 
				sys_plant_id: sys_plant_id, 
				line_status: line_status, 
				user_id: user_id
			})}>
				<Text>Laporan Rework Product Lot Out</Text>
			</Button>
		) :
		button.push(
			<Button key={'button'} style={{justifyContent: 'center', backgroundColor: '#1a508b', borderColor: '#1a508b', borderRadius: 15, flex: 1}} onPress={() => ('Maaf Anda Tidak Mempunyai Akses')}>
				<Text>Laporan Rework Product Lot Out</Text>
			</Button>
		)
		return button
	}

	return(
		<Container>
      {header_content(object_header)}
			{loading ? null : <View style={{backgroundColor: '#dfe0df', alignItems: 'center', justifyContent: 'center'}}><ActivityIndicator size="large" color="#0000ff"/></View>}
			{loading ? searchData() : null}
			<View style={styles.contentFullWithPadding}>
				<ScrollView refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
				{loading ? content_data(object_data, navigation) : null}
				</ScrollView>
			</View>
			<View style={{width: '100%', padding: 25, flexDirection: 'row', justifyContent: 'center', backgroundColor: '#dfe0df'}}>
				{loading ? 
				buttonRework() : 
				null}
			</View>
		</Container>
	)
}

export default show_products;