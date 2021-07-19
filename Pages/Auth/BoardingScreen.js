import React, {useEffect, useState} from 'react';
import {Container, Button, Text} from "native-base";
import {Image, View, StyleSheet} from 'react-native';
import AsyncStorage from "@react-native-community/async-storage";
import LogoSIP from '../Assets/logo-sip3.png'

const BoardingScreen = ({navigation}) => {
	const [token, setToken] = useState(null)
	useEffect(() => {
		cekLogin()
	}, [])
	
	const cekLogin = async() => {
    const isLogin = await AsyncStorage.getItem('key')
		setToken(isLogin)
	}
	
	const buttonFix = () => {
		// console.log(token)
		if(token != null){
			return (
				<Button rounded info style={{marginTop: 10}} onPress={() => navigation.replace('Main')}>
					<Text>
						✓
					</Text>
				</Button>
			)
		}else{
			return(
				<Button rounded info style={{marginTop: 10}} onPress={() => navigation.replace('Login')}>
					<Text>
						✓
					</Text>
				</Button>
			)
		}
	}

	return (
		<Container style={{alignItems: 'center', justifyContent: 'center', backgroundColor: '#DDDDDD'}}>
				<View style={{justifyContent: 'center', alignItems: 'center'}}>
					<Image source={LogoSIP} style={{width: 188, height: 150}}/>
				</View>
				<View style={{justifyContent: 'center', alignItems: 'center'}}>
					<Text style={styles.title}>
						Department Name
					</Text>
					<Text style={styles.paragraph}>
						Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum
					</Text>
				</View>
				<View>
					{buttonFix()}
				</View>
		</Container>
	)
}

const styles = StyleSheet.create({
	paragraph: {
		color: "black",
		textDecorationColor: "yellow",
		textAlign: 'justify',
		margin: 30
	},
	bodyParagraph: {
		fontStyle: 'italic',
		fontWeight: 'bold'
	},
	title: {
		color: "black",
		fontWeight: "bold",
		fontSize: 22,
		margin: 24
	}
})

export default BoardingScreen;