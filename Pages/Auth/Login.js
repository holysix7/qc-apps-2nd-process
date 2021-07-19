import React, {useEffect, useState} from 'react';
import {View, Image, TouchableWithoutFeedback, Keyboard, KeyboardAvoidingView, ActivityIndicator, BackHandler, Alert} from 'react-native';
import LogoSIP from '../Assets/logo-sip3.png';
import {Container, Button, Text, Form, Item, Label, Input} from "native-base";
import styles from "../Styles/Styling";
import Axios from 'axios';
import DeviceStorage from '../System/DeviceStorage';
import Session from '../System/Session';
import base_url from '../System/base_url';
import app_version from '../System/app_version';
import app_name from '../System/app_name';
import PushNotification from "react-native-push-notification";
import Firebase from '@react-native-firebase/app'
import messaging from '@react-native-firebase/messaging';

const Login = ({navigation}) => {
	const [user, setUser] = useState("");
	const [password, setPassword] = useState("");
	const [loading, setLoading] = useState(true)
	const [registration_ids, setRegistration_ids] = useState("")

	const backAction = () => {
    Alert.alert("Alert", "Apakah Anda Yakin Ingin Keluar?", [
      {
        text: "Cancel",
        onPress: () => null,
        style: "cancel"
      },
      { text: "YES", onPress: () => BackHandler.exitApp() }
    ]);
    return true;
	};

  useEffect(() => {
    messaging().getToken().then(token => {
			setRegistration_ids(token)
		});
		
    // Firebase.initializeApp()
		// PushNotification.configure({
		// 	onRegister: function (token) {
		// 		console.log("TOKEN:", token);
		// 	},

		// 	onNotification: function (notification) {
		// 		console.log("NOTIFICATION:", notification);

		// 		notification.finish(PushNotificationIOS.FetchResult.NoData);
		// 	},

		// 	onAction: function (notification) {
		// 		console.log("ACTION:", notification.action);
		// 		console.log("NOTIFICATION:", notification);

		// 	},
		// 	onRegistrationError: function(err) {
		// 		console.error(err.message, err);
		// 	},
		// 	permissions: {
		// 		alert: true,
		// 		badge: true,
		// 		sound: true,
		// 	},
		// 	popInitialNotification: true,
		// 	requestPermissions: true,
		// });

		BackHandler.addEventListener("hardwareBackPress", backAction);

    return () =>
      BackHandler.removeEventListener("hardwareBackPress", backAction);
  }, []);

	const submit = async() => {
		setLoading(false)
		const data = {
			user,
			password,
			app_version,
			app_name,
			registration_ids
		}
		Axios.post(`${base_url}/signin`, data)
		.then(res => {
      if(res.data.data != null){
        setLoading(true)
        DeviceStorage(res.data.data.token)
				Session(res.data.data)
				navigation.replace('Main')
      }else{
        setLoading(true)
        Alert.alert(
          "Info",
          "Login Gagal, Username dan Password tidak cocok",
          [
            { text: "OK", onPress: () => console.log("Submitted") }
            // { text: "OK", onPress: () => BackHandler.exitApp() }
          ],
          { cancelable: false }
        );
      }
		}).catch((err) => {
			setLoading(true)
			alert("Error: Hubungi IT Dept (API Login)")
			console.log("Login: ", err)
		})
	}

	const content = () => {
		var data = []
		data.push(
			<Form key="aAoksmkw" style={{justifyContent: 'center', alignItems: 'center'}}>
				<Item floatingLabel success style={styles.labelFloat}>
					<Label>NIK</Label>
					<Input value={user} onChangeText={(value) => setUser(value)} keyboardType="numeric" />
				</Item>
				<Item floatingLabel success style={styles.labelFloat}>
					<Label>Password</Label>
					<Input value={password} onChangeText={(value) => setPassword(value)}  secureTextEntry={true} autoCapitalize='none' />
				</Item>
				<View style={{justifyContent: 'flex-end', marginLeft: 240}}>
					<Button rounded info style={styles.buttonLogin} onPress={() => submit()}>
						<Text>
							Login
						</Text>
					</Button>
				</View>
			</Form>
		)
		return data
	}

	return (
		<KeyboardAvoidingView behavior={Platform.OS == "ios" ? "padding" : "height"} style={{flex:1}}>
			<TouchableWithoutFeedback onPress={Keyboard.dismiss}>
				<Container style={{alignItems: 'center', justifyContent: 'center'}}>
        {/* <GeneralStatusBarColor backgroundColor="#54c3f0" barStyle="light-content"/> */}
					<View style={{justifyContent: 'center', alignItems: 'center'}}>
					<Image source={LogoSIP} style={styles.logoSipBesar}/>
					</View>
					{loading ? content() : <View style={{justifyContent: 'center'}}><ActivityIndicator size="large" color="#0000ff"/></View>}
				</Container>
			</TouchableWithoutFeedback>
		</KeyboardAvoidingView>
	)
}

export default Login;