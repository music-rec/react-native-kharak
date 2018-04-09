/* eslint-disable no-plusplus, prefer-rest-params, no-unused-vars, require-yield */
import React from 'react';
import { merge, map, union, without, castArray } from 'lodash';
import { call, put } from 'redux-saga/effects';

import getReducer from './redux/getReducer';
import getSaga from './redux/getSaga';

const combine = (features, extractor) => without(union(...map(features, res => castArray(extractor(res)))), undefined);

export default class Connector {
  constructor(
    { namespace = null, state: initialState = {}, reducer = {}, effects, subscriptions, route, navItem },
    ...features
  ) {
    if (!(arguments[0] instanceof Connector) && namespace) {
      this.modules = [
        {
          namespace,
          state: initialState,
          reducers: reducer,
          effects,
          subscriptions,
          routes: route
        }
      ];
    } else {
      this.modules = combine(arguments, arg => arg.modules);
    }
    this.tabItem = combine(arguments, arg => arg.tabItem);
  }

  get tabItems() {
    return merge(...this.tabItem);
  }

  get reducers() {
    return merge(...combine(this.modules, m => ({ [m.namespace]: getReducer(m.reducers, m.state, m) })));
  }

  get routes() {
    return merge(...combine(this.modules, m => m.routes || {}));
  }

  get length() {
    return this.modules.length;
  }

  [Symbol.iterator] = () => {
    const values = this.modules;
    let index = 0;
    return {
      next() {
        return {
          value: values[index],
          done: index++ >= values.length
        };
      }
    };
  };

  effects = (resolve, reject, onError) =>
    this.modules.filter(m => m.effects).map(m => getSaga(resolve, reject, m.effects, m, onError, []));
}
