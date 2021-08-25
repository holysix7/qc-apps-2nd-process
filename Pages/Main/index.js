import {View, ScrollView, ActivityIndicator, Image, Alert, RefreshControl} from 'react-native';
import React, {useState, useEffect} from 'react';
import { Container, Text, Button, Picker} from 'native-base';
import styles from '../Styles/Styling'
import Home from '../Assets/FixHomeWhite.png'
import Profile from '../Assets/FixProfileWhite.png'
import CalendarWhite from '../Assets/calendarWhite.png'
import AsyncStorage from "@react-native-community/async-storage";
import axios from 'axios';
import app_version from '../System/app_version';
import base_url from '../System/base_url'

const Main = ({navigation}) => {
  
  const [cekId, setCekId]                             = useState(null);
  const [user_id, setUserId]                          = useState(null);
  const [employees_image, setEmployeesImage]          = useState(null);
  const [name, setCekName]                            = useState("");
  const [deptName, setCekDeptName]                    = useState("");
  const [userNik, setUserNik]                         = useState(null);
  const [dutyId, setDutyId]                           = useState([]);
  const [loading, setLoading]                         = useState(false);
  const [data, setData]                               = useState([]);
  const [refreshing, setRefreshing]                   = useState(false);
  
  useEffect(() => {
    session()
  }, [])

  const lines = async(value) => {
    setCekId(value)
    setLoading(false)
    const token = await AsyncStorage.getItem("key")
    const user_id = await AsyncStorage.getItem("id")
    setUserId(user_id)
    const headers = {
      'Authorization': token
    }
    const params = {
      sys_plant_id: value,
      user_id: user_id,
      app_version: app_version
    }
    axios.get(`${base_url}/api/v2/secprocs?`, {params: params, headers: headers})
    .then(response => {
      setLoading(true)
      setData(response.data.data)
      setRefreshing(false)
      console.log("List Lines Data: ", response.data.status, "OK")
    })
    .catch(error => {
      console.log(error)
      setLoading(true)
      Alert.alert(
        "Info",
        "Silahkan Login Kembali",
        [
          { text: "OK", onPress: () => logout() }
        ],
        { cancelable: false }
      );
    })
  }

  const logout = async() => {
    AsyncStorage.getAllKeys()
    .then(keys => AsyncStorage.multiRemove(keys))
    .then(() => {
      navigation.replace('Login')
      alert("Successfully Logout!")
    })
  }

  const session = async () => {
    try {
      const sys_plant_id          = await AsyncStorage.getItem('sys_plant_id')
      const duty                  = await AsyncStorage.getItem('duty_plant_option_select')
      const deptName              = await AsyncStorage.getItem('department_name')
      const name                  = await AsyncStorage.getItem('name')
      const user                  = await AsyncStorage.getItem('user')
      const employees_image       = await AsyncStorage.getItem('employee_image_base64')
      setEmployeesImage(employees_image == 0 ? null : employees_image)
      setDutyId(duty != null ? JSON.parse(duty) : [])
      setCekId(sys_plant_id)
      setUserNik(user)
      setCekDeptName(deptName)
      setCekName(name)
      lines(sys_plant_id)
    } catch (error) {
      console.log('Multi Get Error: ', error.message)
    }
  }

  const plantId = () => {
    var records = []
    if(dutyId.length > 0){
      dutyId.map((element, key) => {
        records.push(
          <Picker.Item label={element.plant_name} value={element.plant_id} key={key} />
        )
      })
    }
    return records
  }

  const listLines = () => {
    var records = []
    if(cekId != null){
      if(data.length > 0){
        data.map(element => {
          records.push(
            <Button key={element.id} style={{backgroundColor: '#1a508b', marginTop: 5, marginVertical: 2, marginHorizontal: 3, height: 45, width: "23%", borderRadius: 5}}
            onPress={() => {
              navigation.navigate('ShowProducts', {
                line_id: element.id,
                line_name: element.name,
                line_number: element.number,
                sys_plant_id: element.sys_plant_id,
                line_status: element.status,
                user_id: user_id
              })
            }}
            >
              <View style={{flexDirection: 'column', alignItems: 'center', flex: 1}}>
                <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
                  <View style={{flexDirection: 'column'}}>
                    <Text style={{fontSize: 10}}>{element.name}</Text> 
                  </View>
                </View>
              </View>
              {
                element.planning_status == 'Ready' ?
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
    return records
  }

  const buttonNavbar = () => {
    return (
      <View style={styles.bottomNavbar}>
        <Button style={styles.buttonNavbar}>
          <Image source={Home} style={styles.homeButton}/>
        </Button>

        <Button style={styles.buttonNavbar} onPress={() => {
          navigation.navigate('Profile', {
            name: name,
            dept_name: deptName,
            duty_id: dutyId,
            user_nik: userNik,
            user_image: employees_image
          })
        }}>
          <Image source={Profile} style={styles.profileButton}/>
        </Button>
      </View>
    )
  }

  const headerContent = () => {
    return (
      <View>
        <View style={{borderBottomWidth: 1, borderColor: 'gray', padding: 5, paddingLeft: 20,  backgroundColor: '#19456b'}}>
          <View style={{height: 35, justifyContent: 'center', alignItems: 'center'}} >
            <Text style={{color: 'white'}}>LIST LINES</Text>
          </View>
        </View>
      </View>
    )
  }
  
  const onRefresh = () => {
    setLoading(false)
    lines(cekId)
  }

  return (
    <Container>
      {headerContent()}
      <View>
        <View style={{padding: 5, backgroundColor: '#dfe0df'}}>
          <View style={{borderWidth: 1, borderColor: 'gray', height: 40, justifyContent: 'center'}} >
            <Picker 
              selectedValue={cekId}
              style={{ height: 40, width: 400, color: 'black' }}
              itemStyle={{height: 20}}
              onValueChange={(itemValue, itemIndex) => lines(itemValue)}
            >
              {plantId()}
            </Picker>
          </View>
        </View>
      </View>
      <View style={{flex: 1, backgroundColor: '#dfe0df'}}>
        <ScrollView style={styles.contentFull} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />} >
          {/* {loading == true ? <View><ActivityIndicator size="large" color='#0000ff'/></View> : null} */}
          <View style={styles.responsiveButtonLoop}>
            {loading ? listLines() : <View style={{flex: 1, height: 500, justifyContent: 'center'}}><ActivityIndicator size="large" color="#0000ff"/></View> }
          </View>
          {loading ? <View style={{alignItems: 'center', borderTopWidth: 1, borderTopColor: 'gray', paddingVertical: 10}}></View> : null}
          {loading ? <View style={{flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}>

            <View style={{width: "97%", flexDirection: 'row', paddingVertical: 0}}>
              <View style={{width: '25%', flexDirection: 'column'}}>
                {/* Column A */}
                <View style={{flexDirection: 'row', paddingVertical: 1}}>
                  <View style={{backgroundColor: '#1a508b', padding: 8, margin: 5}}></View>
                  <View style={{justifyContent: 'center'}}>
                    <Text style={{fontWeight: 'bold', fontSize: 8}}>: Loaded</Text>
                  </View>
                </View>
                <View style={{flexDirection: 'row', paddingVertical: 1}}>
                  <View style={{backgroundColor: 'yellow', padding: 8, margin: 5}}></View>
                  <View style={{justifyContent: 'center'}}>
                    <Text style={{fontWeight: 'bold', fontSize: 8}}>: No Load</Text>
                  </View>
                </View>
              </View>
              <View style={{width: '25%', flexDirection: 'column'}}>
                {/* Column B */}
                <View style={{flexDirection: 'row', paddingVertical: 1}}>
                  <View style={{backgroundColor: 'red', padding: 8, margin: 5}}></View>
                  <View style={{justifyContent: 'center'}}>
                    <Text style={{fontWeight: 'bold', fontSize: 8}}>: Broken</Text>
                  </View>
                </View>
                <View style={{flexDirection: 'row', paddingVertical: 1}}>
                </View>
                <View style={{flexDirection: 'row', paddingVertical: 1}}>
                  <View style={{paddingLeft: 8}}><Text style={{color: 'red'}}>* </Text></View>
                  <View style={{justifyContent: 'center'}}>
                    <Text style={{fontWeight: 'bold', fontSize: 8}}>  : Terdapat NG</Text>
                  </View>
                </View>
                <View style={{flexDirection: 'row', paddingVertical: 1}}>
                </View>
              </View>
              <View style={{width: '25%', flexDirection: 'column'}}>
                {/* Column C */}
                <View style={{flexDirection: 'row', paddingVertical: 1}}>
                  <View style={{backgroundColor: '#ebae34', padding: 8, margin: 5}}></View>
                  <View style={{justifyContent: 'center'}}>
                    <Text style={{fontWeight: 'bold', fontSize: 8}}>: Maintenance</Text>
                  </View>
                </View>
                <View style={{flexDirection: 'row', paddingVertical: 1}}>
                </View>
                <View style={{flexDirection: 'row', paddingVertical: 1}}>
                  <Image source={CalendarWhite} style={{width: 20, height: 20, marginLeft: 4 }} />
                  <View style={{justifyContent: 'center'}}>
                    <Text style={{fontWeight: 'bold', fontSize: 8}}>: Terdapat Planning</Text>
                  </View>
                </View>
                <View style={{flexDirection: 'row', paddingVertical: 1}}>
                </View>
              </View>
              <View style={{width: '25%', flexDirection: 'column'}}>
                {/* Column D */}
                <View style={{flexDirection: 'row', paddingVertical: 1}}>
                  <View style={{backgroundColor: 'green', padding: 8, margin: 5}}></View>
                  <View style={{justifyContent: 'center'}}>
                    <Text style={{fontWeight: 'bold', fontSize: 8}}>: Trial</Text>
                  </View>
                </View>
                <View style={{flexDirection: 'row', paddingVertical: 1}}>
                </View>
              </View>
            </View>

          </View> : null }
        </ScrollView>
      </View>
      {userNik != null ? buttonNavbar() : null }
    </Container>
  ) 
}

export default Main