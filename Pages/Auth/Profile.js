import {View, TouchableOpacity, Image} from 'react-native';
import React from 'react';
import { Container, Text, Button} from 'native-base';
import AsyncStorage from "@react-native-community/async-storage";
import app_version from '../System/app_version';
import nopict from '../Assets/nopict.jpg';

const Profile = ({route, navigation}) => {
	const {name, dept_name, duty_id, user_nik, user_image} = route.params
	const buttLogout = async () => {
    try {
			AsyncStorage.getAllKeys()
			.then(keys => AsyncStorage.multiRemove(keys))
			.then(() => {
				navigation.replace('Login')
				alert("Successfully Logout!")
			})
    } catch (error) {
      console.log('Gagal Logout: ', error);
    }
	}
	const dataDuty = []
  if(duty_id != null)
  {
    duty_id.map((element, key) => {
      dataDuty.push(
				<Text key={key} style={{fontSize: 15}}>{element.plant_name}</Text>
      )
    })
  }else{
    console.log("Duty Id = Kosong")
	}

  return (
    <Container>
      <View style={{height: 50, backgroundColor: '#19456b', alignContent: 'center'}}>
        <View style={{flexDirection: 'row', justifyContent: 'center'}}>
          <View style={{paddingTop: 10, justifyContent: 'center', alignItems: 'center'}}>
            <Text style={{color: 'white'}}>Profile</Text>
          </View>
        </View>
      </View>
      <View style={{flex: 1, backgroundColor: '#f0f0f0'}}>

				<View style={{paddingTop: 10, flexDirection: 'row', paddingLeft: 12, justifyContent: 'center'}}>
					{
						user_image != null ?
						<View style={{alignItems: 'center', justifyContent: 'center', height: 127, width: 127}}>
							<TouchableOpacity><Image source={{uri: user_image}} style={{width: 125, height: 125, resizeMode: 'cover', borderWidth: 0.5, borderRadius: 25}} /></TouchableOpacity>
						</View> : 
						<View style={{alignItems: 'center', justifyContent: 'center', height: 127, width: 127, borderWidth: 0.5, borderRadius: 22}}>
							<TouchableOpacity><Image source={nopict} style={{width: 125, height: 125, resizeMode: 'cover', borderWidth: 0.5, borderRadius: 25}} /></TouchableOpacity>
						</View>
					}
				</View>

				<View style={{height: 100, margin: 15}}>

					<View style={{paddingTop: 10, flexDirection: 'row', paddingLeft: 12}}>
						<View style={{width: "25%"}}>
							<Text style={{fontSize: 15}}>Name</Text>
						</View>
						<View style={{width: "6%"}}>
							<Text style={{fontSize: 15}}>:</Text>
						</View>
						<View style={{width: "60%"}}>
							<TouchableOpacity>
								<Text style={{fontSize: 15}}>{name != null ? name : '-'}</Text>
							</TouchableOpacity>
						</View>
					</View>
					
					<View style={{paddingTop: 10, flexDirection: 'row', paddingLeft: 12}}>
						<View style={{width: "25%"}}>
							<Text style={{fontSize: 15}}>User</Text>
						</View>
						<View style={{width: "6%"}}>
							<Text style={{fontSize: 15}}>:</Text>
						</View>
						<View>
							<TouchableOpacity>
								<Text style={{fontSize: 15}}>{user_nik != null ? user_nik : '-'}</Text>
							</TouchableOpacity>
						</View>
					</View>
					
					<View style={{paddingTop: 10, flexDirection: 'row', paddingLeft: 12}}>
						<View style={{width: "25%"}}>
							<Text style={{fontSize: 15}}>Department</Text>
						</View>
						<View style={{width: "6%"}}>
							<Text style={{fontSize: 15}}>:</Text>
						</View>
						<View>
							<TouchableOpacity>
								<Text style={{fontSize: 15}}>{dept_name}</Text>
							</TouchableOpacity>
						</View>
					</View>

					<View style={{paddingTop: 10, paddingBottom: 10, flexDirection: 'row', paddingLeft: 12}}>
						<View style={{width: "25%"}}>
							<Text style={{fontSize: 15}}>Access</Text>
						</View>
						<View style={{width: "6%"}}>
							<Text style={{fontSize: 15}}>:</Text>
						</View>
						<View style={{width: "56%"}}>
							<TouchableOpacity>
								{dataDuty}
							</TouchableOpacity>
						</View>
					</View>

					<View style={{paddingBottom: 10, flexDirection: 'row', paddingLeft: 12}}>
						<View style={{width: "25%"}}>
							<Text style={{fontSize: 15}}>App Version</Text>
						</View>
						<View style={{width: "6%"}}>
							<Text style={{fontSize: 15}}>:</Text>
						</View>
						<View style={{width: "56%"}}>
							<TouchableOpacity>
								<Text>{app_version}</Text>
							</TouchableOpacity>
						</View>
					</View>

					<View style={{paddingTop: 10, flexDirection: 'row', paddingLeft: 12, width: "100%", borderTopWidth: 1, borderTopColor: 'gray', justifyContent: 'center'}}>
						<View>
								<Button style={{backgroundColor: 'red'}} onPress={() => buttLogout()}>
									<Text style={{fontSize: 15}}>Logout</Text>
								</Button>
						</View>
					</View>
				</View>
      </View>
    </Container>
  )
}

export default Profile