import React from 'react';
import { Provider } from 'react-redux';

import Connector from './connector';
import { configureAppNavigator } from './navigation';
import { configureStore } from './redux';

export const Feature = Connector;

export * from './redux';
export * from './navigation';

export default ({ routes, reducers, initialState = {}, middlewares = [], routeConfigs = {}, compose, navigator }) => {
  const AppNavigator = configureAppNavigator(routes, routeConfigs, navigator);
  const store = configureStore(
    {
      ...reducers,
      ...AppNavigator.createReducer()
    },
    initialState,
    middlewares,
    { compose }
  );
  return () => (
    <Provider store={store}>
      <AppNavigator />
    </Provider>
  );
};
