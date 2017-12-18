/* @flow */

import * as React from 'react';
import { NativeModules } from 'react-native';
import { Transitioner } from 'react-navigation';

import CardStack from './CardStack';
import CardStackStyleInterpolator from 'react-navigation/src/views/CardStack/CardStackStyleInterpolator';
import TransitionConfigs from 'react-navigation/src/views/CardStack/TransitionConfigs';

import type {
  NavigationSceneRenderer,
  NavigationScreenProp,
  NavigationStackScreenOptions,
  NavigationState,
  NavigationTransitionProps,
  NavigationNavigatorProps,
  NavigationRouter,
  ViewStyleProp,
  TransitionConfig
} from 'react-navigation/src/TypeDefinition';

const NativeAnimatedModule = NativeModules && NativeModules.NativeAnimatedModule;

type Props = {
  mode: 'card' | 'modal',
  router: NavigationRouter<NavigationState, NavigationStackScreenOptions>,
  cardStyle?: ViewStyleProp,
  onTransitionStart?: () => void,
  onTransitionEnd?: () => void,
  /**
   * Optional custom animation when transitioning between screens.
   */
  transitionConfig?: () => TransitionConfig
} & NavigationNavigatorProps<NavigationStackScreenOptions, NavigationState>;

class CardStackTransitioner extends React.Component<Props> {
  _render: NavigationSceneRenderer;

  static defaultProps = {
    mode: 'card'
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

  _configureTransition = (
    // props for the new screen
    transitionProps: NavigationTransitionProps,
    // props for the old screen
    prevTransitionProps: ?NavigationTransitionProps
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

  _render = (props: NavigationTransitionProps): React.Node => {
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
}

export default CardStackTransitioner;
