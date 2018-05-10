import React from 'react';
import { connect } from 'react-redux';
import { addNavigationHelpers, StackNavigator } from 'react-navigation';
import CardStackStyleInterpolator from 'react-navigation/src/views/CardStack/CardStackStyleInterpolator';

import CardStackTransitioner from './views/CardStack/CardStackTransitioner';
import createCustomNavigator from './createCustomNavigator';

import { addListener, createReducer } from './redux';

export const RightSideNavigator = createCustomNavigator(CardStackTransitioner);

const AppWithNavigationState = connect(({ nav }) => ({ nav }))(({ dispatch, nav, appNavigator: AppNavigator }) => (
  <AppNavigator
    navigation={addNavigationHelpers({
      dispatch,
      state: nav,
      addListener
    })}
  />
));

export const configureAppNavigator = (
  routes,
  { actionNames, initialRouteName, loginRouteName, ...configs },
  Navigator = StackNavigator
) => {
  const AppNavigator = Navigator(
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
  const AppNavigationWrapper = () => <AppWithNavigationState appNavigator={AppNavigator} />;
  AppNavigationWrapper.createReducer = () =>
    createReducer(AppNavigator, { initialRouteName, loginRouteName, actionNames });
  return AppNavigationWrapper;
};
