import Entypo from 'react-native-vector-icons/Entypo';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Feature from './connector';

export const loadFonts = () => {
  Entypo.loadFont();
  FontAwesome.loadFont();
  Ionicons.loadFont();
};

export * from './navigation';
export { Feature };
