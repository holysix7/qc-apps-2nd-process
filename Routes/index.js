import * as React from 'react'
import { createStackNavigator } from '@react-navigation/stack'
import {
	SplashScreen,
  BoardingScreen,
  Login,
	Main,
	ShowProducts,
	LeaderForm,
	QCForm
} from '../Pages'

const Stack = createStackNavigator();

const Routes = () => {  
  
  return(
		<Stack.Navigator initialRouteName="Home" screenOptions={({ route, navigation }) => ({
			gestureEnabled: true,
      headerShown: false,
			headerStatusBarHeight:
			navigation.dangerouslyGetState().routes.indexOf(route) > 0 ? 0 : undefined,
		})}>
			<Stack.Screen name="SplashScreen" component={SplashScreen} />
			<Stack.Screen name="BoardingScreen" component={BoardingScreen} />
			<Stack.Screen name="Login" component={Login} />
			<Stack.Screen name="Main" component={Main} />
			<Stack.Screen name="ShowProducts" component={ShowProducts} />
			<Stack.Screen name="LeaderForm" component={LeaderForm} />
			<Stack.Screen name="QCForm" component={QCForm} />

    </Stack.Navigator>  
  )
}
export default Routes;