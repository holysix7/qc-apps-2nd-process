import {View, Image} from 'react-native';
import React, {useEffect} from 'react';
import { Button } from 'native-base';
import styles from '../Styles/Styling'
import Home from '../Assets/FixHomeWhite.png'
import Profile from '../Assets/FixProfileWhite.png'

const footer = (element, navigation) => {
  console.log(element.deptName)
  return (
    <View style={styles.bottomNavbar}>
      <Button style={styles.buttonNavbar}>
        <Image source={Home} style={styles.homeButton}/>
      </Button>

      <Button style={styles.buttonNavbar} onPress={() => {
        navigation.navigate('Profile', {
          name: element.name,
          dept_name: element.dept_name,
          duty_id: element.duty_id,
          user_nik: element.user_nik,
          user_image: element.user_image
        })
      }}>
        <Image source={Profile} style={styles.profileButton}/>
      </Button>
    </View>
  )
}

export default footer