/* eslint-disable prefer-rest-params, no-unused-vars, require-yield */
import React from 'react';
import { merge, map, union, without, castArray } from 'lodash';
import { call, put } from 'redux-saga/effects';

const combine = (features, extractor) => without(union(...map(features, res => castArray(extractor(res)))), undefined);

export default class Connector {
  constructor({ namespace = null, state: initialState = {}, reducer = {}, effects = {}, route, navItem }, ...features) {
    if (!(arguments[0] instanceof Connector) && namespace) {
      this.reducer = [
        {
          [namespace]: (state = initialState, action) => {
            if (action.type.startsWith('@@')) {
              return state;
            }
            const { type } = action;
            let func = effects[type.replace(new RegExp(`^${namespace}/`), '')];
            if (func) {
              // eslint-disable-next-line
              require('./redux').saga.run(function*() {
                yield call(func, action, { call, put });
              });
              return state;
            }
            func = reducer[type.replace(new RegExp(`^${namespace}/`), '')];
            if (func) {
              return func(state, action);
            }
            return state;
          }
        }
      ];
    } else {
      this.reducer = combine(arguments, arg => arg.reducers || {});
    }
    this.tabItem = combine(arguments, arg => arg.tabItem);
    this.route = combine(arguments, arg => arg.route);
  }

  get tabItems() {
    return merge(...this.tabItem);
  }

  get reducers() {
    return merge(...this.reducer);
  }

  get routes() {
    return merge(...this.route);
  }
}
