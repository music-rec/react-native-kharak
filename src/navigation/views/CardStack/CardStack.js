import React from 'react';
import PropTypes from 'prop-types';
import clamp from 'clamp';
import { Animated, StyleSheet, PanResponder, Platform, View, I18nManager, Easing } from 'react-native';

import { NavigationActions, addNavigationHelpers } from 'react-navigation';

import Card from 'react-navigation/src/views/CardStack/Card';
import SceneView from 'react-navigation/src/views/SceneView';

import TransitionConfigs from 'react-navigation/src/views/CardStack/TransitionConfigs';

const emptyFunction = () => {};

/**
 * The max duration of the card animation in milliseconds after released gesture.
 * The actual duration should be always less then that because the rest distance
 * is always less then the full distance of the layout.
 */
const ANIMATION_DURATION = 500;

/**
 * The gesture distance threshold to trigger the back behavior. For instance,
 * `1/2` means that moving greater than 1/2 of the width of the screen will
 * trigger a back action
 */
const POSITION_THRESHOLD = 1 / 2;

/**
 * The threshold (in pixels) to start the gesture action.
 */
const RESPOND_THRESHOLD = 20;

/**
 * The distance of touch start from the edge of the screen where the gesture will be recognized
 */
const GESTURE_RESPONSE_DISTANCE_HORIZONTAL = 25;
// const GESTURE_RESPONSE_DISTANCE_VERTICAL = 135;

const animatedSubscribeValue = animatedValue => {
  if (!animatedValue.__isNative) {
    return;
  }
  if (Object.keys(animatedValue._listeners).length === 0) {
    animatedValue.addListener(emptyFunction);
  }
};

class CardStack extends React.Component {
  static propTypes = {
    mode: PropTypes.string.isRequired,
    screenProps: PropTypes.any.isRequired,
    navigation: PropTypes.any.isRequired,
    position: PropTypes.any.isRequired,
    router: PropTypes.any.isRequired,
    scenes: PropTypes.array.isRequired,
    transitionConfig: PropTypes.any.isRequired,
    cardStyle: PropTypes.any.isRequired,
    layout: PropTypes.any.isRequired,
    scene: PropTypes.any.isRequired
  };
  constructor(props) {
    super(props);
    this._gestureStartValue = 0;
    this._isResponding = false;
    this._immediateIndex = null;
    this._screenDetails = {};
  }

  componentWillReceiveProps(props) {
    if (props.screenProps !== this.props.screenProps) {
      this._screenDetails = {};
    }
    props.scenes.forEach((newScene: *) => {
      if (this._screenDetails[newScene.key] && this._screenDetails[newScene.key].state !== newScene.route) {
        this._screenDetails[newScene.key] = null;
      }
    });
  }

  _getScreenDetails = scene => {
    const { screenProps, navigation, router } = this.props;
    let screenDetails = this._screenDetails[scene.key];
    if (!screenDetails || screenDetails.state !== scene.route) {
      const screenNavigation = addNavigationHelpers({
        dispatch: navigation.dispatch,
        state: scene.route
      });
      screenDetails = {
        state: scene.route,
        navigation: screenNavigation,
        options: router.getScreenOptions(screenNavigation, screenProps)
      };
      this._screenDetails[scene.key] = screenDetails;
    }
    return screenDetails;
  };

  // eslint-disable-next-line class-methods-use-this
  _animatedSubscribe(props) {
    // Hack to make this work with native driven animations. We add a single listener
    // so the JS value of the following animated values gets updated. We rely on
    // some Animated private APIs and not doing so would require using a bunch of
    // value listeners but we'd have to remove them to not leak and I'm not sure
    // when we'd do that with the current structure we have. `stopAnimation` callback
    // is also broken with native animated values that have no listeners so if we
    // want to remove this we have to fix this too.
    animatedSubscribeValue(props.layout.width);
    animatedSubscribeValue(props.layout.height);
    animatedSubscribeValue(props.position);
  }

  _reset(resetToIndex: number, duration: number): void {
    Animated.timing(this.props.position, {
      toValue: resetToIndex,
      duration,
      easing: Easing.linear(),
      useNativeDriver: this.props.position.__isNative
    }).start();
  }

  _goBack(backFromIndex: number, duration: number) {
    const { navigation, position, scenes } = this.props;
    const toValue = Math.max(backFromIndex - 1, 0);

    // set temporary index for gesture handler to respect until the action is
    // dispatched at the end of the transition.
    this._immediateIndex = toValue;

    Animated.timing(position, {
      toValue,
      duration,
      easing: Easing.linear(),
      useNativeDriver: position.__isNative
    }).start(() => {
      this._immediateIndex = null;
      const backFromScene = scenes.find((s: *) => s.index === toValue + 1);
      if (!this._isResponding && backFromScene) {
        navigation.dispatch(NavigationActions.back({ key: backFromScene.route.key }));
      }
    });
  }

  _renderInnerScene(SceneComponent, scene) {
    const { navigation } = this._getScreenDetails(scene);
    const { screenProps } = this.props;
    return <SceneView screenProps={screenProps} navigation={navigation} component={SceneComponent} />;
  }

  _getTransitionConfig = () => {
    const isModal = this.props.mode === 'modal';
    return TransitionConfigs.getTransitionConfig(this.props.transitionConfig, {}, {}, isModal);
  };

  _renderCard = (scene): React.Node => {
    const { screenInterpolator } = this._getTransitionConfig();
    const style = screenInterpolator && screenInterpolator({ ...this.props, scene });

    const SceneComponent = this.props.router.getComponentForRouteName(scene.route.routeName);
    /* if (style.transform[0].translateX) {
      console.log('card styles = ', style.transform[0].translateX.__getValue());
    } */
    return (
      <Card {...this.props} key={`card_${scene.key}`} style={[style, this.props.cardStyle]} scene={scene}>
        {this._renderInnerScene(SceneComponent, scene)}
      </Card>
    );
  };
  render() {
    const { navigation, position, layout, scene, scenes, mode } = this.props;
    const { index } = navigation.state;
    const isVertical = mode === 'modal';

    const responder = PanResponder.create({
      onPanResponderTerminate: () => {
        this._isResponding = false;
        this._reset(index, 0);
      },
      onPanResponderGrant: () => {
        position.stopAnimation((value: number) => {
          this._isResponding = true;
          this._gestureStartValue = value;
        });
      },
      onMoveShouldSetPanResponder: (event: { nativeEvent: { pageY: number, pageX: number } }, gesture: any) => {
        if (index !== scene.index) {
          return false;
        }
        const immediateIndex = this._immediateIndex == null ? index : this._immediateIndex;
        const currentDragDistance = gesture[isVertical ? 'dy' : 'dx'];
        const currentDragPosition = event.nativeEvent[isVertical ? 'pageY' : 'pageX'];
        const axisLength = isVertical ? layout.height.__getValue() : layout.width.__getValue();
        const axisHasBeenMeasured = !!axisLength;

        // Measure the distance from the touch to the edge of the screen
        const screenEdgeDistance = currentDragPosition - currentDragDistance;
        // Compare to the gesture distance relavant to card or modal
        const {
          gestureResponseDistance: userGestureResponseDistance = {},
          reverseRouteName = null
        } = this._getScreenDetails(scene).options;
        const gestureResponseDistance = userGestureResponseDistance.horizontal || GESTURE_RESPONSE_DISTANCE_HORIZONTAL;
        // GESTURE_RESPONSE_DISTANCE is about 25 or 30. Or 135 for modals

        const GESTURE_RESPONSE_DISTANCE = axisLength - 25;
        if (screenEdgeDistance > gestureResponseDistance && screenEdgeDistance < GESTURE_RESPONSE_DISTANCE) {
          // Reject touches that started in the middle of the screen
          return false;
        }

        this.isRight = screenEdgeDistance > GESTURE_RESPONSE_DISTANCE;

        const hasDraggedEnough = Math.abs(currentDragDistance) > RESPOND_THRESHOLD;

        if (this.isRight && !reverseRouteName) {
          return false;
        }

        if (this.isRight && reverseRouteName) {
          if (hasDraggedEnough) {
            navigation.navigate(reverseRouteName);
          }
          const isOnFirstCard = false; // immediateIndex === 0;
          const shouldSetResponder = hasDraggedEnough && axisHasBeenMeasured && !isOnFirstCard;
          // console.log('shouldSetResponder = ', hasDraggedEnough, axisHasBeenMeasured, !isOnFirstCard);
          return shouldSetResponder;
        }

        const isOnFirstCard = immediateIndex === 0;
        const shouldSetResponder = hasDraggedEnough && axisHasBeenMeasured && !isOnFirstCard;
        // console.log(`${hasDraggedEnough} && ${axisHasBeenMeasured} && !${isOnFirstCard}`, '=', shouldSetResponder);
        return shouldSetResponder;
      },
      onPanResponderMove: (event: any, gesture: any) => {
        // Handle the moving touches for our granted responder
        const startValue = this._gestureStartValue;
        const axis = isVertical ? 'dy' : 'dx';
        const axisDistance = isVertical ? layout.height.__getValue() : layout.width.__getValue();
        const currentValue =
          I18nManager.isRTL && axis === 'dx'
            ? startValue + gesture[axis] / axisDistance // eslint-disable-line
            : startValue - gesture[axis] / axisDistance; // eslint-disable-line
        const value = clamp(index - 1, currentValue, index);
        if (this.isRight) {
          position.setValue(Math.max(currentValue, index - 1));
        } else {
          position.setValue(value);
        }
      },
      onPanResponderTerminationRequest: () =>
        // Returning false will prevent other views from becoming responder while
        // the navigation view is the responder (mid-gesture)
        false,
      onPanResponderRelease: (event: any, gesture: any) => {
        if (!this._isResponding) {
          return;
        }
        this._isResponding = false;

        const immediateIndex = this._immediateIndex == null ? index : this._immediateIndex;

        // Calculate animate duration according to gesture speed and moved distance
        const axisDistance = isVertical ? layout.height.__getValue() : layout.width.__getValue();
        let movedDistance = Math.abs(gesture[isVertical ? 'dy' : 'dx']);
        if (this.isRight) {
          movedDistance = axisDistance - movedDistance;
        }
        const gestureVelocity = gesture[isVertical ? 'vy' : 'vx'];
        const defaultVelocity = axisDistance / ANIMATION_DURATION;
        const velocity = Math.max(Math.abs(gestureVelocity), defaultVelocity);
        const resetDuration = movedDistance / velocity;
        const goBackDuration = (axisDistance - movedDistance) / velocity;
        /* console.log(`(${movedDistance}(movedDistance) / ${velocity}(velocity) = `, resetDuration);
        console.log(
          `(${axisDistance}(axisDistance) - ${movedDistance}(movedDistance)) / ${velocity}(velocity) = `,
          goBackDuration
        ); */

        // To asyncronously get the current animated value, we need to run stopAnimation:
        position.stopAnimation((value: number) => {
          // If the speed of the gesture release is significant, use that as the indication
          // of intent
          // console.log('onPanResponderRelease', `${gestureVelocity} < -0.5 = `, gestureVelocity < -0.5);
          // console.log('onPanResponderRelease', `${gestureVelocity} > 0.5 = `, gestureVelocity > 0.5);
          if (gestureVelocity < -0.5) {
            this._reset(immediateIndex, resetDuration);
            return;
          }
          if (gestureVelocity > 0.5) {
            this._goBack(immediateIndex, goBackDuration);
            return;
          }

          // console.log(
          //   'onPanResponderRelease',
          //   `${value} <= ${index} - ${POSITION_THRESHOLD} = `,
          //   value <= index - POSITION_THRESHOLD ? 'goBack' : 'reset',
          //   immediateIndex,
          //   value <= index - POSITION_THRESHOLD ? goBackDuration : resetDuration
          // );
          // Then filter based on the distance the screen was moved. Over a third of the way swiped,
          // and the back will happen.
          if (value <= index - POSITION_THRESHOLD) {
            this._goBack(immediateIndex, goBackDuration);
          } else {
            this._reset(immediateIndex, resetDuration);
          }
        });
      }
    });

    const { options } = this._getScreenDetails(scene);
    const gesturesEnabled =
      typeof options.gesturesEnabled === 'boolean' ? options.gesturesEnabled : Platform.OS === 'ios';

    const handlers = gesturesEnabled ? responder.panHandlers : {};
    const containerStyle = [styles.container, this._getTransitionConfig().containerStyle];

    // console.log('统计:', scenes.length, navigation);

    return (
      <View {...handlers} style={containerStyle}>
        <View style={styles.scenes}>{scenes.map((s: *) => this._renderCard(s))}</View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // Header is physically rendered after scenes so that Header won't be
    // covered by the shadows of the scenes.
    // That said, we'd have use `flexDirection: 'column-reverse'` to move
    // Header above the scenes.
    flexDirection: 'column-reverse'
  },
  scenes: {
    flex: 1
  }
});

export default CardStack;
