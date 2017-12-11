import React from 'react';
import PropTypes from 'prop-types';
import { addNavigationHelpers, StackNavigator } from 'react-navigation';
import CardStackStyleInterpolator from 'react-navigation/src/views/CardStack/CardStackStyleInterpolator';
import { View, Image, TouchableOpacity } from 'react-native';

let Navigator = null;

export const createAppNavigator = (routes, configs) => {
  Navigator = StackNavigator(
    {
      ...routes
    },
    {
      headerMode: 'screen',
      initialRouteName: null,
      // 增加安卓可以从右侧滑入页面
      transitionConfig: () => ({
        screenInterpolator: CardStackStyleInterpolator.forHorizontal
      }),
      ...configs
    }
  );
};

export const AppNavigator = Navigator;
