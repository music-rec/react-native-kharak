import React from 'react';
import PropTypes from 'prop-types';
import { addNavigationHelpers, StackNavigator } from 'react-navigation';
import CardStackStyleInterpolator from 'react-navigation/src/views/CardStack/CardStackStyleInterpolator';
import { View, Image, TouchableOpacity } from 'react-native';

export const createReducer = AppNavigator => ({ initialRouteName = 'Login' }) => {
  const initialState = AppNavigator.router.getStateForAction(
    AppNavigator.router.getActionForPathAndParams(initialRouteName)
  );

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
      initialRouteName: 'Test',
      // 增加安卓可以从右侧滑入页面
      transitionConfig: () => ({
        screenInterpolator: CardStackStyleInterpolator.forHorizontal
      }),
      ...configs
    }
  );
  AppNavigator.redux = ({ dispatch, nav }) => (
    <AppNavigator navigation={addNavigationHelpers({ dispatch, state: nav })} />
  );
  return { AppNavigator, createReducer: createReducer(AppNavigator) };
};

export const AppNavigator = Navigator;
