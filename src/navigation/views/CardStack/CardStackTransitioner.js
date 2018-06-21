import React from 'react';
import PropTypes from 'prop-types';
import { NativeModules } from 'react-native';
import { Transitioner } from 'react-navigation';

import CardStackStyleInterpolator from 'react-navigation/src/views/StackView/StackViewStyleInterpolator';
import TransitionConfigs from 'react-navigation/src/views/StackView/StackViewTransitionConfigs';

import CardStack from './CardStack';

const NativeAnimatedModule = NativeModules && NativeModules.NativeAnimatedModule;

class CardStackTransitioner extends React.Component {
  static propTypes = {
    mode: PropTypes.string,
    navigation: PropTypes.any.isRequired,
    position: PropTypes.any.isRequired,
    onTransitionStart: PropTypes.func.isRequired,
    onTransitionEnd: PropTypes.func.isRequired,
    screenProps: PropTypes.any.isRequired,
    scenes: PropTypes.array.isRequired,
    router: PropTypes.array.isRequired,
    transitionConfig: PropTypes.any.isRequired,
    cardStyle: PropTypes.any.isRequired,
    layout: PropTypes.any.isRequired,
    scene: PropTypes.any.isRequired
  };
  static defaultProps = {
    mode: 'card'
  };

  _configureTransition = (
    // props for the new screen
    transitionProps,
    // props for the old screen
    prevTransitionProps
  ) => {
    const isModal = this.props.mode === 'modal';
    // Copy the object so we can assign useNativeDriver below
    // (avoid Flow error, transitionSpec is of type NavigationTransitionSpec).
    const transitionSpec = {
      ...TransitionConfigs.getTransitionConfig(
        this.props.transitionConfig,
        transitionProps,
        prevTransitionProps,
        isModal
      ).transitionSpec
    };
    if (
      !!NativeAnimatedModule &&
      // Native animation support also depends on the transforms used:
      CardStackStyleInterpolator.canUseNativeDriver()
    ) {
      // Internal undocumented prop
      transitionSpec.useNativeDriver = true;
    }
    return transitionSpec;
  };

  _render = props => {
    const { screenProps, mode, router, cardStyle, transitionConfig } = this.props;
    return (
      <CardStack
        screenProps={screenProps}
        mode={mode}
        router={router}
        cardStyle={cardStyle}
        transitionConfig={transitionConfig}
        {...props}
      />
    );
  };

  render() {
    return (
      <Transitioner
        configureTransition={this._configureTransition}
        navigation={this.props.navigation}
        render={this._render}
        onTransitionStart={this.props.onTransitionStart}
        onTransitionEnd={this.props.onTransitionEnd}
      />
    );
  }
}

export default CardStackTransitioner;
