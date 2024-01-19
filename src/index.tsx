import { NativeModules, Platform } from 'react-native';

const LINKING_ERROR =
  `The package 'react-native-cm-pedometer' doesn't seem to be linked. Make sure: \n\n` +
  Platform.select({ ios: "- You have run 'pod install'\n", default: '' }) +
  '- You rebuilt the app after installing the package\n' +
  '- You are not using Expo Go\n';

const CmPedometer = NativeModules.CmPedometer
  ? NativeModules.CmPedometer
  : new Proxy(
      {},
      {
        get() {
          throw new Error(LINKING_ERROR);
        },
      }
    );

export enum CMAuthorizationStatus {
  notDetermined,
  restricted,
  denied,
  authorized,
}

export function authorizationStatus(): Promise<CMAuthorizationStatus> {
  return CmPedometer.authorizationStatus();
}

export function isStepCountingAvailable(): Promise<boolean> {
  return CmPedometer.isStepCountingAvailable();
}

export function isDistanceAvailable(): Promise<boolean> {
  return CmPedometer.isDistanceAvailable();
}

export function isFloorCountingAvailable(): Promise<boolean> {
  return CmPedometer.isFloorCountingAvailable();
}

export function isPaceAvailable(): Promise<boolean> {
  return CmPedometer.isPaceAvailable();
}

export function isCadenceAvailable(): Promise<boolean> {
  return CmPedometer.isCadenceAvailable();
}

export function isPedometerEventTrackingAvailable(): Promise<boolean> {
  return CmPedometer.isPedometerEventTrackingAvailable();
}
