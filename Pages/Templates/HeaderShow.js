import {Image, View} from 'react-native';
import React, {useEffect, useState, useCallback} from 'react';
import LogoSIP from '../Assets/logo-sip370x50.png';
import { Text } from 'native-base';
import styles from '../Styles/Styling';

const header_content = (val, type) => {
  if(type != 'LotOut'){
    return (
      <View style={styles.headerWithBorder}>
        <View style={styles.contentHeader}>
          <Image source={LogoSIP}/>
        </View>
        <View style={styles.contentHeader}>
          <Text style={styles.fontProduct}>({val.line_number}) - {val.line_name}</Text>
          <Text style={styles.fontListProducts}>{val.title}</Text>
        </View>
      </View>
    )
  }else{
    return (
      <View style={styles.headerWithBorder}>
        <View style={styles.contentHeader}>
          <Image source={LogoSIP}/>
        </View>
        <View style={styles.contentHeader}>
          {/* <Text style={styles.fontProduct}>PLANT {} </Text> */}
          <Text style={styles.fontListProducts}>{val.title}</Text>
        </View>
      </View>
    )
  }
}

export default header_content