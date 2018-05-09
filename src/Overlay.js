import React from 'react';
import PropTypes from 'prop-types';
import { Dimensions, View, TouchableWithoutFeedback } from 'react-native';

import { connect } from 'react-redux';

import Portal from './portal';
import Connector from './connector';

class Overlay extends React.Component {
  static propTypes = {
    children: PropTypes.any.isRequired,
    visible: PropTypes.bool.isRequired,
    locked: PropTypes.bool.isRequired,
    dispatch: PropTypes.func.isRequired
  };
  handleTouch = () => {
    const { dispatch, visible, locked } = this.props;
    if (visible && !locked) {
      dispatch({ type: 'overlay/hidden' });
    }
  };
  render() {
    const { children, visible } = this.props;
    const ScreenWidth = Dimensions.get('window').width;
    const ScreenHeight = Dimensions.get('window').height;
    return (
      <View style={{ flex: 1 }}>
        {children}
        {visible && (
          <View
            style={{
              position: 'absolute',
              top: 0,
              width: ScreenWidth,
              height: ScreenHeight
            }}
          >
            <TouchableWithoutFeedback onPress={this.handleTouch}>
              <View
                style={{
                  position: 'absolute',
                  top: 0,
                  width: ScreenWidth,
                  height: ScreenHeight,
                  backgroundColor: 'rgba(0, 0, 0, 0.5)'
                }}
              />
            </TouchableWithoutFeedback>
            <Portal.Black name="popup" />
          </View>
        )}
      </View>
    );
  }
}
export const feature = new Connector({
  namespace: 'overlay',
  state: {
    visible: false,
    locked: false
  },
  reducers: {
    visible() {
      return { visible: true, locked: false };
    },
    locked() {
      return { visible: true, locked: true };
    },
    hidden() {
      return { visible: false, locked: false };
    }
  }
});

export default connect(({ overlay: { visible, locked } }) => ({ visible, locked }))(Overlay);
