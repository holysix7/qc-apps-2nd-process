import {Image, View, ScrollView, ActivityIndicator, RefreshControl, Alert} from 'react-native';
import React, {useEffect, useState, useCallback} from 'react';
import LogoSIP from '../Assets/logo-sip370x50.png';
import operators from '../Assets/operators.png';
import AsyncStorage from "@react-native-community/async-storage";
import axios from 'axios';
import { Container, Text, Button } from 'native-base';
import styles from '../Styles/Styling';
import app_version from '../System/app_version';
import app_name from '../System/app_name';
import checklist from '../Assets/check.png';

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
			// kind: 'by_machine',
			sys_plant_id: sys_plant_id,
			app_version: app_version,
      user_id: user_id,
			secproc_part_line_id: line_id,
		}
		axios.get('http://192.168.131.121:3000/api/v2/secprocs?', {params: params, headers: headers})
		.then(response => {
			setLoading(true)
      setRefreshing(false)
			setData(response.data.data)
			console.log(response.data.data)
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
        records.push( 
          <View key={key} style={styles.contenDateProduct}>
            <Button style={styles.productsButtonRunning} onPress={() => navigation.navigate('FormByProduct', {
              id_part: val.id,
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
              line_status: line_status
            })}>
              <View style={{flexDirection: 'row'}}>
                <View style={{flexDirection: 'column'}}>
                  <Text style={styles.fontButtonHeader}> {val.product_customer_part_number} </Text>   
                  <Text style={styles.fontButtonFooter}> {val.product_name} </Text>   
                </View>
                <View style={{flexDirection: 'column', justifyContent: 'flex-end'}}>
                  <Text style={styles.fontButtonFooter}> {val.product_internal_part_id} </Text>   
                </View>
                {
                  val.operator_status == 'Ready' ? 
                  <View style={{flexDirection: 'column', justifyContent: 'center'}}>
                    <Image source={operators} style={{width: 35, height: 35}} />
                  </View> :
                  null 
                }
              </View>
            </Button>
          </View>
        )
      })
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
		</Container>
	)
}

export default show_products;