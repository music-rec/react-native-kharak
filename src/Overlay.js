import React from 'react';
import PropTypes from 'prop-types';
import { Dimensions, View, Text } from 'react-native';

import { connect } from 'react-redux';

import Portal from './portal';
import Connector from './connector';

class Overlay extends React.Component {
  static propTypes = {
    children: PropTypes.any.isRequired,
    visible: PropTypes.bool.isRequired,
    dispatch: PropTypes.func.isRequired
  };
  render() {
    const { children, dispatch, visible } = this.props;
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
              height: ScreenHeight,
              backgroundColor: 'rgba(0, 0, 0, 0.5)'
            }}
            onPress={() => {
              dispatch({ type: 'overlay/hidden' });
            }}
          >
            <Portal.Black name="popup" />
          </View>
        )}
      </View>
    );
  }
}

export const module = new Connector({
  namespace: 'overlay',
  state: {
    visible: false
  },
  reducers: {
    visible() {
      return { visible: true };
    },
    hidden() {
      return { visible: false };
    }
  }
});

export default connect(({ overlay: { visible } }) => ({ visible }))(Overlay);
