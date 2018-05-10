import React from 'react';
import { Provider } from 'react-redux';
import { AppState } from 'react-native';

import Connector from './connector';
import { configureAppNavigator } from './navigation';
import { configureStore } from './redux';
import { run as runSubscription } from './redux/subscription';
import createPromiseMiddleware from './redux/createPromiseMiddleware';

import Overlay, { feature } from './Overlay';
import PortalAlias from './portal';

export const Feature = Connector;
export const Portal = PortalAlias;

export * from './redux';
export * from './navigation';

const PortalProvider = Portal.Provider;

export default ({
  modules: inputModules,
  initialState = {},
  middlewares = [],
  routeConfigs = {},
  compose,
  onError = () => {},
  onLoad = () => {}
}) => {
  const modules = new Connector(inputModules, feature);
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

  store.then(() => {
    // Run sagas
    const sagas = effects(resolve, reject, onError);
    sagas.forEach(store.runSaga);
    // Run subscriptions
    for (const module of modules) {
      if (module.subscriptions) {
        runSubscription(module.subscriptions, module, store, onError);
      }
    }
    onLoad();
  });

  return class App extends React.Component {
    componentWillMount() {
      AppState.removeEventListener('change', this.handleAppStateChange);
    }
    componentDidMount() {
      AppState.addEventListener('change', this.handleAppStateChange);
      store.then(() => {
        onLoad();
      });
    }
    handleAppStateChange = appState => {
      if (appState === 'background') {
        console.log('app is background.');
      }
    };
    render() {
      return (
        <Provider store={store}>
          <PortalProvider>
            <Overlay>
              <AppNavigator />
            </Overlay>
          </PortalProvider>
        </Provider>
      );
    }
  };
};
