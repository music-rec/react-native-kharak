import React from 'react';
import PropTypes from 'prop-types';
import { View } from 'react-native';
import GatewayRegistry from './GatewayRegistry';

export default class GatewayDest extends React.Component {
  static contextTypes = {
    gatewayRegistry: PropTypes.instanceOf(GatewayRegistry).isRequired
  };

  static propTypes = {
    name: PropTypes.string.isRequired,
    tagName: PropTypes.string,
    component: PropTypes.oneOfType([PropTypes.string, PropTypes.func])
  };

  static defaultProps = {
    tagName: null,
    component: null
  };

  constructor(props, context) {
    super(props, context);
    this.gatewayRegistry = context.gatewayRegistry;
  }

  state = {
    children: null
  };

  componentWillMount() {
    this.gatewayRegistry.addContainer(this.props.name, this);
  }

  componentWillUnmount() {
    this.gatewayRegistry.removeContainer(this.props.name, this);
  }

  render() {
    const { component, tagName, ...attrs } = this.props;
    delete attrs.name;
    return React.createElement(component || tagName || View, attrs, this.state.children);
  }
}
