import { Component } from 'react';
import PropTypes from 'prop-types';
import { PushNotificationIOS, Platform } from 'react-native';
import PushNotification from 'react-native-push-notification';

/**
 * Local Notifications Schedule
 * @param {Object} details (same as localNotification)
 * @param {Date} details.date - The date and time when the system should deliver the notification
 */
PushNotification.localNotificationSchedule = (originalLocalNotificationSchedule => (details: Object) => {
  if (Platform.OS === 'ios') {
    let soundName = details.soundName ? details.soundName : 'default'; // play sound (and vibrate) as default behaviour
    // eslint-disable-next-line no-prototype-builtins
    if (details.hasOwnProperty('playSound') && !details.playSound) {
      soundName = ''; // empty string results in no sound (and no vibration)
    }
    const iosDetails = {
      fireDate: details.date.toISOString(),
      alertTitle: details.title,
      alertBody: details.message,
      soundName,
      userInfo: details.userInfo,
      repeatInterval: details.repeatType
    };
    if (details.number) {
      iosDetails.applicationIconBadgeNumber = parseInt(details.number, 10);
    }
    // ignore Android only repeatType
    if (!details.repeatType || details.repeatType === 'time') {
      delete iosDetails.repeatInterval;
    }
    PushNotificationIOS.scheduleLocalNotification(iosDetails);
  } else {
    details.fireDate = details.date.getTime();
    delete details.date;
    // ignore iOS only repeatType
    if (['year', 'month'].includes(details.repeatType)) {
      delete details.repeatType;
    }
    originalLocalNotificationSchedule.apply(PushNotification, [details]);
  }
})(PushNotification.localNotificationSchedule);

export default class Provider extends Component {
  static propTypes = {
    children: PropTypes.any.isRequired
  };
  componentWillMount() {
    PushNotification.configure({
      onRegister(token) {
        console.log('TOKEN:', token);
      },
      onNotification(notification) {
        console.log('NOTIFICATION:', notification);
        notification.finish(PushNotificationIOS.FetchResult.NoData);
      },
      permissions: {
        alert: true,
        badge: true,
        sound: true
      },
      popInitialNotification: true,
      requestPermissions: true
    });
  }
  render() {
    return this.props.children;
  }
}
