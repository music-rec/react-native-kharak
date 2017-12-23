import React from 'react';
import PropTypes from 'prop-types';
import { Provider } from 'react-redux';
import { persistStore, persistCombineReducers } from 'redux-persist';
import { AsyncStorage } from 'react-native';

import { createStore, applyMiddleware, compose, combineReducers } from 'redux';
import defaultMiddleware from './middleware';

const initialState = {};

let store: any;
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
    compose(applyMiddleware(...defaultMiddleware.concat(...middlewares)))
  );
  persistStore(store, null, (...args) => {
    console.log(args);
  });
  return store;
};

export const ReduxProvider = ({ store, children }) => <Provider store={store}>{children}</Provider>;

ReduxProvider.propTypes = {
  store: PropTypes.any.isRequired,
  children: PropTypes.any.isRequired
};
