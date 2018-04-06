import React from 'react';
import { Provider } from 'react-redux';

import Connector from './connector';
import { configureAppNavigator } from './navigation';
import { configureStore } from './redux';
import getSaga from './redux/getSaga';

export const Feature = Connector;

export * from './redux';
export * from './navigation';

export default ({ modules, initialState = {}, middlewares = [], routeConfigs = {}, compose, navigator }) => {
  const { routes, reducers } = modules;
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
  store.runSaga(
    getSaga(
      () => {},
      () => {},
      {
        *test(...args) {
          console.log(args);
        }
      },
      {
        namespace: 'test'
      }
    )
  );
  return () => (
    <Provider store={store}>
      <AppNavigator />
    </Provider>
  );
};
