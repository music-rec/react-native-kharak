import { createNavigationContainer, createNavigator, StackRouter } from 'react-navigation';

function randomString(len = 8) {
  const $chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678';
  const maxPos = $chars.length;
  let pwd = '';
  for (i = 0; i < len; i++) {
    pwd += $chars.charAt(Math.floor(Math.random() * maxPos));
  }
  return pwd;
}

export default transitioner => (main, right) => {
  const routes = {};
  const keyMain = `main-${randomString(8)}`;
  const keyRight = `right-${randomString(8)}`;
  routes[keyMain] = {
    screen: main,
    navigationOptions: {
      reverseRouteName: keyRight
    }
  };
  routes[keyRight] = {
    screen: right
  };
  const config = {
    initialRouteName: keyMain
  };
  return createNavigationContainer(createNavigator(StackRouter(routes, config))(transitioner));
};
