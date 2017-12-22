import { createNavigationContainer, createNavigator, StackRouter } from 'react-navigation';

export default transitioner => (routes, config) =>
  createNavigationContainer(createNavigator(StackRouter(routes, config))(transitioner));
