import { persistStore, persistCombineReducers } from 'redux-persist';
import { AsyncStorage } from 'react-native';
import logger from 'redux-logger';
import createSagaMiddleware from 'redux-saga';

import { createStore, applyMiddleware, compose, combineReducers } from 'redux';

import { middleware as navigationMiddleware } from '../navigation/redux';

export const saga = createSagaMiddleware();

let store;
export const configureStore = (reducers = {}, initialState = {}, middlewares = [], configs) => {
  const { compose: composeEnhancers = compose, logging = false } = configs;
  if (store) {
    store.replaceReducer(combineReducers({ ...reducers }));
    return store;
  }
  const config = {
    key: 'primary',
    storage: AsyncStorage,
    transform: [],
    blacklist: ['nav']
  };
  const allMiddlewares = [...middlewares, navigationMiddleware, saga, ...(logging ? [logger] : [])];
  store = createStore(
    persistCombineReducers(config, { ...reducers }),
    initialState,
    composeEnhancers(applyMiddleware(...allMiddlewares))
  );
  const persistPromise = new Promise(resolve => {
    store.persistor = persistStore(store, null, () => {
      resolve();
    });
  });
  store.runSaga = saga.run;
  store.then = (...args) => persistPromise.then(...args);
  return store;
};
