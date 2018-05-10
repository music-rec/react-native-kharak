import { NavigationActions } from 'react-navigation';
import { createReactNavigationReduxMiddleware, createReduxBoundAddListener } from 'react-navigation-redux-helpers';

const middleware = createReactNavigationReduxMiddleware('root', state => state.nav);
const addListener = createReduxBoundAddListener('root');

/**
 * 创建 Redux Reducer
 * @param {*} AppNavigator 导航对象
 * @param {*} configs 配置对象
 */
const createReducer = (
  AppNavigator,
  { actionNames = { login: 'auth/login', logout: 'auth/logout' }, initialRouteName = null, loginRouteName = null }
) => {
  let initialNavState = {};
  if (initialRouteName) {
    const initialAction = AppNavigator.router.getActionForPathAndParams(initialRouteName);
    initialNavState = AppNavigator.router.getStateForAction(initialAction);
  }
  if (loginRouteName) {
    // Start with two routes: The Main screen, with the Login screen on top.
    const loginAction = AppNavigator.router.getActionForPathAndParams(loginRouteName);
    initialNavState = AppNavigator.router.getStateForAction(loginAction, initialNavState);
  }

  return {
    nav(state = initialNavState, action) {
      let nextState;
      switch (action.type) {
        case actionNames.login:
          nextState = AppNavigator.router.getStateForAction(NavigationActions.back(), state);
          break;
        case actionNames.logout:
          nextState = AppNavigator.router.getStateForAction(NavigationActions.navigate({ routeName: 'Login' }), state);
          break;
        default:
          nextState = AppNavigator.router.getStateForAction(action, state);
          break;
      }
      // Simply return the original `state` if `nextState` is null or undefined.
      return nextState || state;
    }
  };
};

export { middleware, addListener, createReducer };
