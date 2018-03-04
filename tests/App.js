import React from 'react';
import { AppRegistry, View, Text } from 'react-native';
import { Provider } from 'react-redux';

import { configureAppNavigator } from '../src/navigation';
import { configureStore } from '../src/redux/index';

const HelloScreen = () => (
  <View>
    <Text>Hello, world</Text>
  </View>
);

const store = configureStore({
  user(state = { name: 'limaofeng' }) {
    return state;
  }
});

const AppNavigator = configureAppNavigator({
  Hello: {
    screen: HelloScreen
  }
});

class ExampleApp extends React.Component {
  render() {
    return (
      <Provider store={store}>
        <AppNavigator />
      </Provider>
    );
  }
}

AppRegistry.registerComponent('Example', () => ExampleApp);

export default ExampleApp;
