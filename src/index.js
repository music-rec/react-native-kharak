import React from 'react';
import { Provider } from 'react-redux';

import Connector from './connector';
import { configureAppNavigator } from './navigation';
import { configureStore } from './redux';
import { run as runSubscription } from './redux/subscription';
import createPromiseMiddleware from './redux/createPromiseMiddleware';

export const Feature = Connector;

export * from './redux';
export * from './navigation';

export default ({ modules, initialState = {}, middlewares = [], routeConfigs = {}, compose, onError = () => {} }) => {
  const { routes, reducers, effects } = modules;
  const { middleware: promiseMiddleware, resolve, reject } = createPromiseMiddleware({ modules });
  middlewares.push(promiseMiddleware);
  const AppNavigator = configureAppNavigator(routes, routeConfigs);
  const store = configureStore(
    {
      ...reducers,
      ...AppNavigator.createReducer()
    },
    initialState,
    middlewares,
    { compose }
  );
  // Run sagas
  const sagas = effects(resolve, reject);
  sagas.forEach(store.runSaga);
  // Run subscriptions
  for (const module of modules) {
    if (module.subscriptions) {
      runSubscription(module.subscriptions, module, store, onError);
    }
  }
  return () => (
    <Provider store={store}>
      <AppNavigator />
    </Provider>
  );
};
