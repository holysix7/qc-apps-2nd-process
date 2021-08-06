import {View, TouchableOpacity, ScrollView, FlatList, ActivityIndicator, Image} from 'react-native';
import React from 'react';
import { Container, Text, Button} from 'native-base';
import styles from '../Styles/Styling';
import Home from '../Assets/FixHomeWhite.png'
import ImageProfile from '../Assets/FixProfileWhite.png'
import Cog from '../Assets/FixCogWhite.png'
import AsyncStorage from "@react-native-community/async-storage";
import app_version from '../System/app_version';

const Profile = ({route, navigation}) => {
	const {name, deptName, dutyId, userNik} = route.params
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
  if(dutyId != null)
  {
    dutyId.map((element, key) => {
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

				<View style={{height: 100, margin: 15}}>
					<View style={{paddingTop: 10, flexDirection: 'row', paddingLeft: 12}}>
						<View style={{width: "25%"}}>
							<Text style={{fontSize: 15}}>User</Text>
						</View>
						<View style={{width: "6%"}}>
							<Text style={{fontSize: 15}}>:</Text>
						</View>
						<View style={{width: "60%"}}>
							<TouchableOpacity>
								<Text style={{fontSize: 15}}>{name}</Text>
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
								<Text style={{fontSize: 15}}>{deptName}</Text>
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