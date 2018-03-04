import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { addNavigationHelpers, StackNavigator } from 'react-navigation';
import CardStackStyleInterpolator from 'react-navigation/src/views/CardStack/CardStackStyleInterpolator';

import CardStackTransitioner from './views/CardStack/CardStackTransitioner';
import createCustomNavigator from './createCustomNavigator';

import { addListener } from './redux';

export const RightSideNavigator = createCustomNavigator(CardStackTransitioner);

class AppWithNavigationState extends React.Component {
  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    nav: PropTypes.object.isRequired,
    appNavigator: PropTypes.element.isRequired
  };

  render() {
    const { dispatch, nav, appNavigator: AppNavigator = StackNavigator } = this.props;
    return (
      <AppNavigator
        navigation={addNavigationHelpers({
          dispatch,
          state: nav,
          addListener
        })}
      />
    );
  }
}

const mapStateToProps = state => ({
  nav: state.nav
});

const AppWithNavigationStateWrapper = connect(mapStateToProps)(AppWithNavigationState);

export const configureAppNavigator = (routes, configs = {}, Navigator = StackNavigator) => {
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
  // AppNavigator.Redux = withRedux(AppNavigator);
  // { AppNavigator, createReducer: createReducer(AppNavigator, { initialRouteName: configs.initialRouteName }) };
  return <AppWithNavigationStateWrapper appNavigator={AppNavigator} />;
};
