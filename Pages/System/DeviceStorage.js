import AsyncStorage from "@react-native-community/async-storage";

const DeviceStorage = async(data) => {
	const value = data
		try {
			await AsyncStorage.setItem('key', value);
		} catch (error) {
			console.log('AsyncStorage Error: ' + error.message);
		}
}

export default DeviceStorage;