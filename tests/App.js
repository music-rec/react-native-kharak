import React from 'react';
import { AppRegistry, View, Text } from 'react-native';

import kharak from '../src';

const MainScreen = () => (
  <View>
    <Text>Hello, main</Text>
  </View>
);
const LoginScreen = () => (
  <View>
    <Text>Hello, login</Text>
  </View>
);

const ExampleApp = kharak({
  reducers: {
    user(state = { name: 'limaofeng' }) {
      return state;
    }
  },
  routes: {
    Main: {
      screen: MainScreen
    },
    Login: {
      screen: LoginScreen
    }
  }
});

AppRegistry.registerComponent('Example', () => ExampleApp);

export default ExampleApp;
