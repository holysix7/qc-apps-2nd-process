import {Image, View, ScrollView, ActivityIndicator, RefreshControl, Alert, TouchableOpacity} from 'react-native';
import React, {useEffect, useState, useCallback} from 'react';
import LogoSIP from '../Assets/logo-sip370x50.png';
import operators from '../Assets/operators.png';
import AsyncStorage from "@react-native-community/async-storage";
import axios from 'axios';
import { Container, Text, Button } from 'native-base';
import styles from '../Styles/Styling';
import app_version from '../System/app_version';
import base_url from '../System/base_url';

const show_products = ({route, navigation}) => {
	const {line_id, line_name, line_number, sys_plant_id, line_status, user_id} = route.params
	const [data, setData] = useState([])
	const [loading, setLoading] = useState(false)
  const [refreshing, setRefreshing] = useState(false)
	
	useEffect(() => {
		products();
	}, [])
	
	const products = async () => {
		const token = await AsyncStorage.getItem("key")
		const headers = {
			'Authorization': token
		}
		const params = {
			tbl: 'planning_product',
			app_version: app_version,
			sys_plant_id: sys_plant_id,
      user_id: user_id,
			secproc_part_line_id: line_id,
		}
		axios.get(`${base_url}/api/v2/secprocs?`, {params: params, headers: headers})
		.then(response => {
			setLoading(true)
      setRefreshing(false)
			setData(response.data.data)
			console.log("Products List Data: ", response.data.status, response.data.message)
		})
		.catch(error => console.log(error))
	}

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    products();
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
				console.log(val)
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
						default_shift: new_shift
					}
				}else if(val.next_screen == 'qc_form'){
					var button_status = true
					var new_shift 		= val.shift + 'abc'
					var route 				= 'QCForm'
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
						default_shift: new_shift[0]
					}
				}else{
					var button_status = false
				}
				records.push( 
					<View key={key} style={styles.contenDateProduct}>
						<Button style={styles.productsButtonRunning} onPress={() => button_status == true ? navigation.navigate(route, route_params) : alert('Maaf anda tidak memiliki akses') }>
							<View style={{flexDirection: 'row'}}>
								<View style={{flexDirection: 'column', flex: 1}}>
									<Text style={styles.fontButtonHeader}> {val.product_customer_part_number} </Text>   
									<Text style={styles.fontButtonFooter}> {val.product_name} </Text>   
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
					<View style={{justifyContent: 'center', height: 200, padding: 10, borderRadius: 10, backgroundColor: '#F3F2C9'}}>
						<Text style={{textAlign: 'justify', color: 'grey'}}>Tidak ada data part di {line_name}</Text>
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
			<View style={styles.contentFullWithPadding}>
				<ScrollView refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
				{loading ? contentData() : null}
				</ScrollView>
			</View>
			<View style={{width: '100%', padding: 25, flexDirection: 'row', justifyContent: 'center', backgroundColor: '#dfe0df'}}>
				{loading ? 
				<Button style={{justifyContent: 'center', backgroundColor: '#1a508b', borderRadius: 15, flex: 1}} onPress={() => alert('Laporan Rework Under Maintenance')}>
					<Text>Laporan Rework Product Lot Out</Text>
				</Button> : 
				null}
			</View>
		</Container>
	)
}

export default show_products;