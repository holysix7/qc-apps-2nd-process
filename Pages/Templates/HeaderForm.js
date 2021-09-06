import {Image, View} from 'react-native';
import React, {useEffect, useState, useCallback} from 'react';
import LogoSIP from '../Assets/logo-sip370x50.png';
import { Text } from 'native-base';

const header_form = (val) => {
  var header_column_dua = []
  if(val != null){
    if((val.product_model != null ? val.product_model : '-').length > 10){
      var style = {
        fontSize: 10,
        fontWeight: 'bold'
      }
    }else{
      var style = { 
        fontSize: 11,
        fontWeight: 'bold'
      }
    }
    if(val.id == 1){
      var title_text    = <Text style={{fontWeight: 'bold', textAlign: 'center'}}>{val.title.slice(0, 11)} {"\n"} {val.title.slice(12)}</Text>
      var hour_or_shift = <Text style={{fontWeight: 'bold', textAlign: 'center', fontSize: 13}}>Jam Ke - {val != null ? val.current_hour != null ? val.current_hour : null : null}</Text>
      header_column_dua.push(
        <View style={{flexDirection: 'row'}} key="qc-form">
          <View style={{flexDirection: 'column', borderTopWidth: 0.3, borderRightWidth: 0.3, justifyContent: 'center', alignItems: 'center', width: "50%", backgroundColor: '#dfe0df'}}>
            <View style={{flexDirection: 'row', justifyContent: 'center', alignItems: 'center', width: '100%'}}>
              {title_text}
            </View>
          </View>
          <View style={{flexDirection: 'column', flex: 1}}>
            <View style={{flexDirection: 'row', borderTopWidth: 0.3, height: 40, justifyContent: 'center', alignItems: 'center'}}>
              <Text style={{fontWeight: 'bold', fontSize: 17}}>{val != null ? val.line_name != null ? val.line_name : '-' : '-'}</Text>
            </View>
            <View style={{flexDirection: 'row', borderTopWidth: 0.3}}>
              <View style={{flexDirection: 'column', width: '50%', borderRightWidth: 0.3, alignItems: 'center'}}>
                <Text style={{fontWeight: 'bold', fontSize: 13}}>{val != null ? val.date != null ? val.date : '-' : '-'}</Text>
              </View>
              <View style={{flexDirection: 'column', paddingLeft: 5, flex: 1, alignItems: 'center'}}>
                {hour_or_shift}
              </View>
            </View>
          </View>
        </View>
      )
    }else if(val.id == 2){
      if(val.type == 'edit'){
        var title_text  = <Text style={{fontWeight: 'bold', textAlign: 'center'}}>{val.title.slice(0, 18)} {"\n"} {val.title.slice(19)}</Text>
      }else{
        var title_text  = <Text style={{fontWeight: 'bold', textAlign: 'center'}}>{val.title}</Text>
      }
      var hour_or_shift = <Text style={{fontWeight: 'bold', textAlign: 'center', fontSize: 13}}>Shift 1</Text>
      header_column_dua.push(
        <View style={{flexDirection: 'row'}} key="leader-form">
          <View style={{flexDirection: 'column', borderTopWidth: 0.3, borderRightWidth: 0.3, justifyContent: 'center', alignItems: 'center', width: "50%", backgroundColor: '#dfe0df'}}>
            <View style={{flexDirection: 'row', justifyContent: 'center', alignItems: 'center', width: '100%'}}>
              {title_text}
            </View>
          </View>
          <View style={{flexDirection: 'column', flex: 1}}>
            <View style={{flexDirection: 'row', borderTopWidth: 0.3, height: 40, justifyContent: 'center', alignItems: 'center'}}>
              <Text style={{fontWeight: 'bold', fontSize: 17}}>{val != null ? val.line_name != null ? val.line_name : '-' : '-'}</Text>
            </View>
            <View style={{flexDirection: 'row', borderTopWidth: 0.3}}>
              <View style={{flexDirection: 'column', width: '50%', borderRightWidth: 0.3, alignItems: 'center'}}>
                <Text style={{fontWeight: 'bold', fontSize: 13}}>{val != null ? val.date != null ? val.date : '-' : '-'}</Text>
              </View>
              <View style={{flexDirection: 'column', paddingLeft: 5, flex: 1, alignItems: 'center'}}>
                {hour_or_shift}
              </View>
            </View>
          </View>
        </View>
      )
    }else{
      var title_text  = <Text style={{fontWeight: 'bold', textAlign: 'center'}}>{val.title}</Text>
      header_column_dua.push(
        <View style={{flexDirection: 'row'}} key={'rework'}>
          <View style={{flexDirection: 'column', flex: 1, borderTopWidth: 0.3, borderRightWidth: 0.3, justifyContent: 'center', alignItems: 'center', backgroundColor: '#dfe0df'}}>
            <View style={{flexDirection: 'row', justifyContent: 'center', alignItems: 'center', width: '100%'}}>
              {title_text}
            </View>
            <View style={{flexDirection: 'row', height: 40, justifyContent: 'center', alignItems: 'center'}}>
              <Text style={{fontWeight: 'bold', fontSize: 17}}>{val != null ? val.line_name != null ? val.line_name : '-' : '-'}</Text>
            </View>
          </View>
        </View>
      )
    }
  }
  return (
    <View>
      <View style={{justifyContent: 'center', alignItems: 'center', backgroundColor: '#dfe0df'}}>
        <Image source={LogoSIP}/>
      </View>
      {header_column_dua}
      <View style={{flexDirection: 'row'}}>
        <View style={{flexDirection: 'column', borderTopWidth: 0.3, borderRightWidth: 0.3, padding: 15, justifyContent: 'center', alignItems: 'center', width: "50%", backgroundColor: '#dfe0df'}}>
          <Text style={{marginTop: 1, fontWeight: 'bold', fontSize: 11}}>{val != null ? val.mkt_customer_name != null ? val.mkt_customer_name : '-' : '-'}</Text>
        </View>
        <View style={{flexDirection: 'column', borderTopWidth: 0.3, justifyContent: 'center', alignItems: 'center', flex: 1}}>
          <Text style={{fontWeight: 'bold', fontSize: 11}}>{val != null ? val.product_name != null ? val.product_name : '-' : '-'}</Text>
        </View>
      </View>
      <View style={{borderWidth: 0.5, flexDirection: 'row'}}>
        <View style={{flex: 1, justifyContent: 'center', borderRightWidth: 0.3, alignItems: 'center', paddingHorizontal: 5, height: 25}}>
          <Text style={{fontSize: 11, fontWeight: 'bold'}}>{val != null ? val.product_internal_part_id != null ? val.product_internal_part_id : '-' : '-'}</Text>
        </View>
        <View style={{width: '33%', justifyContent: 'center', borderRightWidth: 0.3, alignItems: 'center', height: 25, paddingHorizontal: 5}}>
          <Text style={{fontSize: 11, fontWeight: 'bold'}}>{val != null ? val.product_customer_part_number != null ? val.product_customer_part_number : '-' : '-'}</Text>
        </View>
        <View style={{width: '33%', justifyContent: 'center', alignItems: 'center', borderRightWidth: 0.3, paddingHorizontal: 5, height: 25}}>
          <Text style={style}>Model: {val != null ? val.product_model != null ? val.product_model : '-' : '-'}</Text>
        </View>
      </View>
    </View>
  )
}

export default header_form