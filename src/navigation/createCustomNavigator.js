import { createNavigationContainer, createNavigator } from 'react-navigation';

export default transitioner => router => createNavigationContainer(createNavigator(router)(transitioner));
