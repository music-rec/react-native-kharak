import React from 'react';
import { Provider } from 'react-redux';

import Connector from './connector';
import { configureAppNavigator } from './navigation';
import { configureStore } from './redux';
import { run as runSubscription } from './redux/subscription';
import createPromiseMiddleware from './redux/createPromiseMiddleware';

import Overlay, { module as overlayModule } from './Overlay';
import PortalAlias from './portal';

export const Feature = Connector;
export const Portal = PortalAlias;

export * from './redux';
export * from './navigation';

export default ({
  modules: inputModules,
  initialState = {},
  middlewares = [],
  routeConfigs = {},
  compose,
  onError = () => {}
}) => {
  const modules = new Connector(inputModules, new Connector(overlayModule));
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
      <Overlay>
        <AppNavigator />
      </Overlay>
    </Provider>
  );
};
