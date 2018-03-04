import Feature from '../src/connector';
import { configureStore } from '../src/redux';

function delay(timeout) {
  return new Promise(resolve => {
    setTimeout(resolve, timeout);
  });
}

describe('Connector Tests', () => {
  it('Create an Instance', () => {
    const count = new Feature({
      namespace: 'count',
      state: 0,
      reducer: {
        add(state) {
          return state + 1;
        }
      },
      effects: {
        *addDelay(action, { call, put }) {
          yield call(delay, 1000);
          yield put({ type: 'count/add' });
        }
      }
    });
    expect(count.reducers.count(0, { type: 'count/add' })).toBe(1);
  });

  it('effects an Instance', () => {
    const user = new Feature({
      namespace: 'user',
      state: { hasAuthorized: false },
      reducer: {
        login(state, { payload: user }) {
          return { hasAuthorized: true, user };
        }
      },
      effects: {
        *logout(action, { call, put }) {
          yield call(delay, 1000);
          yield put({ type: 'user/login' }, {});
        }
      }
    });
    expect(
      user.reducers.user({ hasAuthorized: false }, { type: 'user/login', payload: { name: 'limaofeng' } })
    ).toEqual({
      hasAuthorized: true,
      user: { name: 'limaofeng' }
    });
  });

  it(' async ', () => {
    const count = new Feature({
      namespace: 'count',
      state: 0,
      reducer: {
        add(state) {
          return state + 1;
        }
      },
      effects: {
        *addDelay(action, { call, put }) {
          yield call(delay, 1000);
          yield put({ type: 'count/add' });
        }
      }
    });
    const modules = new Feature(count);
    const store = configureStore(modules.reducers);
    store.dispatch({ type: 'count/add' });
    store.dispatch({ type: 'count/addDelay' });
  });
  it(' Merge Module ', () => {
    const count = new Feature({
      namespace: 'count',
      state: 0,
      reducer: {
        add(state) {
          return state + 1;
        }
      },
      effects: {
        *addDelay(action, { call, put }) {
          yield call(delay, 1000);
          yield put({ type: 'count/add' });
        }
      }
    });
    const user = new Feature({
      namespace: 'user',
      state: { hasAuthorized: false },
      reducer: {
        login(state, { payload: user }) {
          return { hasAuthorized: true, user };
        }
      },
      effects: {
        *logout(action, { call, put }) {
          yield call(delay, 1000);
          yield put({ type: 'user/login' }, {});
        }
      }
    });
    const features = new Feature(count, user);
    console.log(features.reducers);
  });
});
