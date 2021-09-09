import {Image, View, ScrollView, ActivityIndicator, RefreshControl, Alert, TouchableOpacity} from 'react-native';
import React, {useEffect, useState, useCallback} from 'react';
import operators from '../../../Assets/operators.png';
import AsyncStorage from "@react-native-community/async-storage";
import axios from 'axios';
import moment from 'moment';
import DateTimePicker from '@react-native-community/datetimepicker';
import CalendarBlack from '../../../Assets/calendar.png';
import { Container, Text, Button } from 'native-base';
import styles from '../../../Styles/Styling';
import app_version from '../../../System/app_version';
import base_url from '../../../System/base_url';
import header_content from '../../../Templates/HeaderShow';

const lot_out = ({route, navigation}) => {
	const {line_id, line_name, line_number, sys_plant_id, line_status, user_id} = route.params
  const object_header = {
    title: 'List Parts Lot Out',
    line_number: line_number, 
    line_name: line_name
  }
	const [data, setData]             = useState([])
	const [code, setCode]             = useState(null)
	const [dept_name, setDeptName]    = useState(null)
	const [start_date, setStartDate]  = useState(new Date())
	const [end_date, setEndDate]      = useState(new Date())
	const [show, setShow]             = useState(false)
	const [mode, setMode]             = useState(null)
	const [loading, setLoading]       = useState(false)
  const [refreshing, setRefreshing] = useState(false)
	var dateTime                      = moment()
	var maximumDateFix                = moment(dateTime)
	var choosed_start_date 	          = moment(start_date).format("YYYY-MM-DD")
	var choosed_end_date 	        		= moment(end_date).format("YYYY-MM-DD")
	
	useEffect(() => {
		products();
	}, [])
	
	const products = async(value) => {
		var new_val 	= null
		setLoading(false)
		if(value){
			new_val = moment(value).format("YYYY-MM-DD")
		}
		const token = await AsyncStorage.getItem("key")
		const dept_name = await AsyncStorage.getItem("department_name")
		setDeptName(dept_name)
		const headers = {
			'Authorization': token
		}
		const params = {
			tbl: 'daily_inspection_item_category_process_ng_log',
			app_version: app_version,
			sys_plant_id: sys_plant_id,
      user_id: user_id,
			start_date: new_val != null ? new_val : choosed_start_date,
			type: 'product' 
		}
		console.log(params)
		console.log(params)
		axios.get(`${base_url}/api/v2/secprocs?`, {params: params, headers: headers})
		.then(response => {
			setLoading(true)
			setCode(response.data.code)
      setRefreshing(false)
			setData(response.data.data)
			console.log("Products List Data: ", response.data.status, response.data.message)
		})
		.catch(error => {
			console.log(error)
		})
	}

  const showDate = (value) => {
    setMode(value)
    setShow(true)
  }

  const showDateModal = () => {
    if(show == true){
      if(mode == 'start'){
        return (
          <DateTimePicker
            testID="dateTimePicker"
            value={start_date}
            maximumDate={end_date}
            is24Hour={true}
            display="calendar"
            onChange={(evt, val) => onChange(evt, val, 'start')}
          />
        )
      }else{
        return (
          <DateTimePicker
            testID="dateTimePicker"
            value={end_date}
            maximumDate={new Date(maximumDateFix)}
            minimumDate={start_date}
            is24Hour={true}
            display="calendar"
            onChange={(evt, val) => onChange(evt, val, 'end')}
          />
        )
      }
    }
  }

  const onChange = (event, val, type) => {
    if(type == 'start'){
      const currentDate = val || start_date;
      setShow(Platform.OS === 'ios');
      setStartDate(currentDate)
      products(val)
    }else{
      const currentDate = val || end_date;
      setShow(Platform.OS === 'ios');
      setEndDate(currentDate)
      products(val)
    }
  };

	const searchData = () => {
		return (
			<View style={{flexDirection: 'row', width: '100%', backgroundColor: '#dfe0df', justifyContent: 'center'}}>
				<View style={{flexDirection: 'row', width: '45%', borderWidth: 1, borderRadius: 5, marginTop: 15, justifyContent: 'center'}}>
					<View style={{flexDirection: 'column', alignItems: 'flex-start', paddingLeft: 10, paddingVertical: 5}}>
						<Text onPress={() => showDate('start')}>{choosed_start_date}</Text>
					</View>
					<View style={{flexDirection: 'column', alignItems: 'flex-end', width: 35, paddingVertical: 5, marginLeft: 48}}>
						<TouchableOpacity onPress={() => showDate('start')}>
							<Image source={CalendarBlack} style={{width: 25, height: 25, marginLeft: 4}}/>
						</TouchableOpacity>
					</View>
				</View>
				{/* <View style={{flexDirection: 'row', width: '45%', marginLeft: 5, borderWidth: 1, borderRadius: 5, marginTop: 15, justifyContent: 'center'}}>
					<View style={{flexDirection: 'column', alignItems: 'flex-start', paddingLeft: 10, paddingVertical: 5}}>
						<Text onPress={() => showDate('end')}>{choosed_end_date}</Text>
					</View>
					<View style={{flexDirection: 'column', alignItems: 'flex-end', width: 35, paddingVertical: 5, marginLeft: 48}}>
						<TouchableOpacity onPress={() => showDate('end')}>
							<Image source={CalendarBlack} style={{width: 25, height: 25, marginLeft: 4}}/>
						</TouchableOpacity>
					</View>
				</View> */}
				{showDateModal()}
			</View>
		)
	}

  const onRefresh = useCallback(() => {
    setRefreshing(true);
		products()
  }, []);

  const contentData = () => {
    var records = []
		if(code != 403){
			if(data.length > 0){
				data.map((val, key) => {
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
					var button_status = true
					var route_params = {
						sys_plant_id: sys_plant_id,
						line_id: line_id,
						line_name: line_name,
            line_number: line_number,
            eng_product_id: val.eng_product_id,
            mkt_customer_id: val.mkt_customer_id,
            mkt_customer_name: val.mkt_customer_name,
            product_name: val.product_name,
            product_internal_part_id: val.product_internal_part_id,
            product_customer_part_number: val.product_customer_part_number,
            product_model: val.product_model,
            date: val.date,
					}
					records.push( 
						<View key={key} style={styles.contenDateProduct}>
							<Button style={styles.productsButtonRunning} onPress={() => button_status == true ? navigation.navigate('NewLotOut', route_params) : alert('Maaf anda tidak memiliki akses') }>
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
					<View key={'content-data'} style={{width: '100%', padding: 25, flexDirection: 'row', justifyContent: 'center'}}>
						<View style={{alignItems: 'center', justifyContent: 'center', height: 200, padding: 10, borderRadius: 10, backgroundColor: '#F3F2C9'}}>
							<Text style={{textAlign: 'center', color: 'grey'}}>Tidak ada data Lot Out di {line_name} pada tanggal <Text style={{fontWeight: 'bold', color: 'grey'}}>{choosed_start_date}</Text></Text>
						</View>
					</View>
				)
			}
		}else{
			records.push(
				<View key={'content-data'} style={{width: '100%', padding: 25, flexDirection: 'row', justifyContent: 'center'}}>
					<View style={{alignItems: 'center', justifyContent: 'center', height: 200, padding: 10, borderRadius: 10, backgroundColor: '#F3F2C9'}}>
						<Text style={{textAlign: 'center', color: 'grey'}}>Maaf Anda Tidak Memiliki Hak Akses Untuk Melihat Data Lot Out</Text>
					</View>
				</View>
			)
		}
    return records
  }

	return(
		<Container>
      {header_content(object_header, 'LotOut')}
			{loading ? null : <View style={{backgroundColor: '#dfe0df', alignItems: 'center', justifyContent: 'center'}}><ActivityIndicator size="large" color="#0000ff"/></View>}
			{loading ? searchData() : null}
			<View style={styles.contentFullWithPadding}>
				<ScrollView refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
				{loading ? contentData() : null}
				</ScrollView>
			</View>
		</Container>
	)
}

export default lot_out;