import Entypo from 'react-native-vector-icons/Entypo';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Ionicons from 'react-native-vector-icons/Ionicons';

import { createAppNavigator as createAppNavigatorTemp } from './navigation'
import connector from './connector';

export const loadFonts = () => {
  Entypo.loadFont();
  FontAwesome.loadFont();
  Ionicons.loadFont();
};

export const Feature = connector;
export const createAppNavigator = createAppNavigatorTemp