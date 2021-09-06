import {Image, View} from 'react-native';
import React, {useEffect, useState, useCallback} from 'react';
import operators from '../Assets/operators.png';
import CalendarWhite from '../Assets/calendarWhite.png'
import { Text, Button } from 'native-base';
import styles from '../Styles/Styling';

const content_data = (element, navigation) => {
  var records = []
  if(element.type == 'show_product'){
    if(element.data.length > 0){
      element.data.map((val, key) => {
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
              sys_plant_id: element.sys_plant_id,
              line_name: element.line_name,
              line_status: element.line_status,
              default_shift: new_shift,
              dept_name: element.dept_name,
              date: element.date
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
              sys_plant_id: element.sys_plant_id,
              line_name: element.line_name,
              line_status: element.line_status,
              default_shift: new_shift[0],
              dept_name: element.dept_name,
              date: element.date
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
              sys_plant_id: element.sys_plant_id,
              line_name: element.line_name,
              line_status: element.line_status,
              default_shift: new_shift,
              dept_name: element.dept_name,
              date: element.date
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
          <View style={{alignItems: 'center', justifyContent: 'center', height: 200, padding: 10, borderRadius: 10, backgroundColor: '#F3F2C9'}}>
            <Text style={{textAlign: 'center', color: 'grey'}}>Tidak ada data part di {element.line_name} pada tanggal {element.date} </Text>
          </View>
        </View>
      )
    }
  }else if(element.type == 'list_lines'){
    if(element.sys_plant_id != null){
      if(element.data.length > 0){
        element.data.map(value => {
          records.push(
            <Button key={value.id} style={{backgroundColor: '#1a508b', marginTop: 5, marginVertical: 2, marginHorizontal: 3, height: 45, width: "23%", borderRadius: 5}}
            onPress={() => {
              navigation.navigate('ShowProducts', {
                line_id: value.id,
                line_name: value.name,
                line_number: value.number,
                sys_plant_id: value.sys_plant_id,
                line_status: value.status,
                user_id: element.user_id
              })
            }}
            >
              <View style={{flexDirection: 'column', alignItems: 'center', flex: 1}}>
                <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
                  <View style={{flexDirection: 'column'}}>
                    <Text style={{fontSize: 10}}>{value.name}</Text> 
                  </View>
                </View>
              </View>
              {
                value.planning_status == 'Ready' ?
                <View style={{flexDirection: 'column', paddingRight: 5}}>
                  <Image source={CalendarWhite} style={{width: 20, height: 20}} /> 
                </View> :
                null
              }
            </Button>
          )
        });
      }else{
        records.push(
          <View key={'wkwkw'} style={{width: '100%', padding: 25, flexDirection: 'row', justifyContent: 'center'}}>
            <View style={{justifyContent: 'center', height: 200, padding: 10, borderRadius: 10, backgroundColor: '#F3F2C9'}}>
              <Text style={{textAlign: 'justify', color: 'grey'}}>Tidak ada data line di plant ini</Text>
            </View>
          </View>
        )
      }
    }
  }
  return records
}

export default content_data