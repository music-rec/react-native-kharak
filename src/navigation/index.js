import React from 'react';
import PropTypes from 'prop-types';
import { addNavigationHelpers, StackNavigator } from 'react-navigation';
import CardStackStyleInterpolator from 'react-navigation/src/views/CardStack/CardStackStyleInterpolator';
import { View, Image, TouchableOpacity } from 'react-native';

export const createReducer = ({ router: { getStateForAction, getActionForPathAndParams } } , { initialRouteName }) => () => {
  const action = initialRouteName ? : getActionForPathAndParams(initialRouteName):
  const initialState = getStateForAction(action);

  return (state = initialState, action) => {
    const nextState = AppNavigator.router.getStateForAction(action, state);
    return nextState || state;
  };
};

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
  AppNavigator.Redux = ({ dispatch, nav }) => (
    <AppNavigator navigation={addNavigationHelpers({ dispatch, state: nav })} />
  );
  return { AppNavigator, createReducer: createReducer(AppNavigator, { initialRouteName: configs.initialRouteName }) };
};
