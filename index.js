/**
 * @format
 */

//TTI measure
// globalThis.__APP_START_TIME__ = performance.now();
globalThis.__APP_START_TIME__ = Date.now();
import 'react-native-gesture-handler';
import {enableScreens} from 'react-native-screens';
import {AppRegistry} from 'react-native';

import App from './src/app/App';
import {name as appName} from './app.json';

enableScreens(true);

AppRegistry.registerComponent(appName, () => App);