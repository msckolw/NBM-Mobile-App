import DeviceInfo from 'react-native-device-info';

export const getDeviceInfo = () => {
  return {
    appVersion: DeviceInfo.getVersion(),
    buildNumber: DeviceInfo.getBuildNumber(),
    deviceModel: DeviceInfo.getModel(),
    systemName: DeviceInfo.getSystemName(),
    systemVersion: DeviceInfo.getSystemVersion(),
    manufacturer: DeviceInfo.getManufacturerSync(),
    isEmulator: DeviceInfo.isEmulatorSync(),
  };
};