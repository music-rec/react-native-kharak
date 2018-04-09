import React from 'react';
import { AppRegistry, View, Text } from 'react-native';

import kharak, { Feature } from '../src';

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

const modules = new Feature({
  namespace: 'main',
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

const ExampleApp = kharak({
  modules,
  routeConfigs: {
    initialRouteName: 'Main'
  }
});

AppRegistry.registerComponent('Example', () => ExampleApp);

export default ExampleApp;
