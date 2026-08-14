/**
 * @format
 */
import 'react-native-gesture-handler';
import { enableScreens } from 'react-native-screens';
import { AppRegistry, UIManager } from 'react-native';
import App from './App';
import { name as appName } from './app.json';

enableScreens(true);

setTimeout(() => {
  // eslint-disable-next-line no-console
  console.log(
    'UIManager RNSScreenStackHeaderSubview:',
    UIManager.getViewManagerConfig('RNSScreenStackHeaderSubview')
  );
}, 1000);

AppRegistry.registerComponent(appName, () => App);
