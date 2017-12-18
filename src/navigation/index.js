import React from 'react';
import PropTypes from 'prop-types';
import { addNavigationHelpers, StackNavigator } from 'react-navigation';
import CardStackStyleInterpolator from 'react-navigation/src/views/CardStack/CardStackStyleInterpolator';

import CardStackTransitioner from './views/CardStack/CardStackTransitioner';
import createCustomNavigator from './createCustomNavigator';

const WithRedux = ({ dispatch, nav }) => <AppNavigator navigation={addNavigationHelpers({ dispatch, state: nav })} />;

WithRedux.propTypes = {
  dispatch: PropTypes.object.isRequired,
  nav: PropTypes.object.isRequired
};

export const createReducer = (AppNavigator, { initialRouteName }) => () => {
  const { router: { getStateForAction, getActionForPathAndParams } } = AppNavigator;
  const initialState = getStateForAction(getActionForPathAndParams(initialRouteName));

  return (state = initialState, action) => getStateForAction(action, state) || state;
};

export const RightSideNavigator = createCustomNavigator(CardStackTransitioner);

export const createAppNavigator = (routes, configs) => {
  const AppNavigator = StackNavigator(
    {
      ...routes
    },
    {
      headerMode: 'screen',
      // 增加安卓可以从右侧滑入页面
      transitionConfig: () => ({
        screenInterpolator: CardStackStyleInterpolator.forHorizontal
      }),
      ...configs
    }
  );
  AppNavigator.Redux = WithRedux;
  return { AppNavigator, createReducer: createReducer(AppNavigator, { initialRouteName: configs.initialRouteName }) };
};
