import { persistStore, persistCombineReducers } from 'redux-persist';
import { AsyncStorage } from 'react-native';
import createSagaMiddleware from 'redux-saga';

import { createStore, applyMiddleware, compose, combineReducers } from 'redux';
// import defaultMiddleware from './middleware';

import { middleware as navigationMiddleware } from '../navigation/redux';

export const saga = createSagaMiddleware();

const defaultMiddleware = [].concat(navigationMiddleware, saga);

let store;
export const configureStore = (reducers = {}, initialState = {}, middlewares = [], configs = { compose }) => {
  const composeEnhancers = configs.compose || compose;
  if (store) {
    store.replaceReducer(combineReducers({ ...reducers }));
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
    persistCombineReducers(config, { ...reducers }), // combineReducers(reducers),
    initialState,
    composeEnhancers(applyMiddleware(...defaultMiddleware.concat([saga]).concat(...middlewares)))
  );
  persistStore(store, null, () => {});
  store.runSaga = saga.run;
  return store;
};
