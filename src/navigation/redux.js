import { NavigationActions } from 'react-navigation';
import { createReactNavigationReduxMiddleware, createReduxBoundAddListener } from 'react-navigation-redux-helpers';

const middleware = createReactNavigationReduxMiddleware('root', state => state.nav);
const addListener = createReduxBoundAddListener('root');

/**
 * 创建 Redux Reducer
 * @param {*} AppNavigator 导航对象
 * @param {*} configs 配置对象
 */
const createReducer = (AppNavigator, { initialRouteName = null }) => {
  let initialNavState = {};
  if (initialRouteName) {
    const initialAction = AppNavigator.router.getActionForPathAndParams(initialRouteName);
    initialNavState = AppNavigator.router.getStateForAction(initialAction);
  } else {
    // Start with two routes: The Main screen, with the Login screen on top.
    const firstAction = AppNavigator.router.getActionForPathAndParams('Main');
    const tempNavState = AppNavigator.router.getStateForAction(firstAction);
    const secondAction = AppNavigator.router.getActionForPathAndParams('Login');
    initialNavState = AppNavigator.router.getStateForAction(secondAction, tempNavState);
  }

  return {
    nav(state = initialNavState, action) {
      let nextState;
      switch (action.type) {
        case 'auth/login':
          nextState = AppNavigator.router.getStateForAction(NavigationActions.back(), state);
          break;
        case 'auth/logout':
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
