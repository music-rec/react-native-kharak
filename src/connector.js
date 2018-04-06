/* eslint-disable no-plusplus, prefer-rest-params, no-unused-vars, require-yield */
import { merge, map, union, without, castArray } from 'lodash';
import { call, put } from 'redux-saga/effects';

const combine = (features, extractor) => without(union(...map(features, res => castArray(extractor(res)))), undefined);

export default class Connector {
  constructor(
    { namespace = null, state: initialState = {}, reducers = {}, effects = {}, subscriptions = {}, route, navItem },
    ...features
  ) {
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
            func = reducers[type.replace(new RegExp(`^${namespace}/`), '')];
            if (func) {
              return func(state, action);
            }
            return state;
          }
        }
      ];
      this.modules = [
        {
          namespace,
          state: initialState,
          reducers,
          effects,
          subscriptions
        }
      ];
    } else {
      // this.reducer = combine(arguments, arg => arg.reducers || {});
      this.modules = combine(arguments, arg => arg.modules);
      // console.log('sub modules', this.modules);
    }
    // this.subscription = combine(arguments, arg => arg.subscriptions);
    // this.tabItem = combine(arguments, arg => arg.tabItem);
    // this.route = combine(arguments, arg => arg.route);

    const module = {
      namespace,
      state: initialState,
      reducers,
      effects,
      subscriptions
    };
  }

  get tabItems() {
    return merge(...this.tabItem);
  }

  get length() {
    return this.modules.length;
  }

  get reducers() {
    return [];
  }

  get routes() {
    console.log(this.module);
    return {};
    // return merge(...this.route);
  }

  get subscriptions() {
    return [];
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
}
