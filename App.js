/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import * as React from 'react'
import { NavigationContainer } from '@react-navigation/native'
import Routes from './Routes'

const App = () => {

  return (
    <NavigationContainer>
      <Routes />
    </NavigationContainer>
  );
};

export default App