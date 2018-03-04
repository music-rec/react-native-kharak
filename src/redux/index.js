import { persistStore, persistCombineReducers } from 'redux-persist';
import { AsyncStorage } from 'react-native';
import createSagaMiddleware from 'redux-saga';

import { createStore, applyMiddleware, compose, combineReducers } from 'redux';
// import defaultMiddleware from './middleware';

import { middleware as navigationMiddleware } from '../navigation/redux';

const defaultMiddleware = [].concat(navigationMiddleware);

export const saga = createSagaMiddleware();
let store;
export const configureStore = (reducers = {}, initialState = {}, middlewares = []) => {
  if (store) {
    store.replaceReducer(combineReducers(reducers));
    return store;
  }
  const config = {
    key: 'primary',
    storage: AsyncStorage,
    transform: [],
    blacklist: ['nav']
    // whitelist: ['user'],
  };
  store = createStore(
    persistCombineReducers(config, reducers), // combineReducers(reducers),
    initialState,
    compose(applyMiddleware(...defaultMiddleware.concat(...middlewares).concat([saga])))
  );
  persistStore(store, null, (...args) => {
    console.log(args);
  });
  store.runSaga = saga.run;
  return store;
};
