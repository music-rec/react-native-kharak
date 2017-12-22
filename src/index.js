import Entypo from 'react-native-vector-icons/Entypo';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Ionicons from 'react-native-vector-icons/Ionicons';

import { Provider as PushProvider } from './notification';
import Feature from './connector';

export const loadFonts = () => {
  Entypo.loadFont();
  FontAwesome.loadFont();
  Ionicons.loadFont();
};

export * from './navigation';
export * from './redux';
export { Feature, PushProvider };
