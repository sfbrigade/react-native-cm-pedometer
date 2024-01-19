import { NativeEventEmitter, NativeModules, Platform } from 'react-native';

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

// Determining Pedometer Availability

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

// Getting Live Pedometer Data

export interface CMPedometerData {
  startDate: Date;
  endDate: Date;
  numberOfSteps: number;
  distance: number | undefined | null;
  averageActivePace: number | undefined | null;
  currentPace: number | undefined | null;
  currentCadence: number | undefined | null;
  floorsAscended: number | undefined | null;
  floorsDescended: number | undefined | null;
}

const enum CmPedometerEvent {
  onPedometerData = 'onPedometerData',
  onPedometerEvent = 'onPedometerEvent',
}

const eventEmitter = new NativeEventEmitter(CmPedometer);

export function startUpdates(
  from: Date,
  withHandler: (
    error: Error | undefined,
    data: CMPedometerData | undefined
  ) => void
): void {
  eventEmitter.addListener(CmPedometerEvent.onPedometerData, (event: any) => {
    let error: Error | undefined;
    if (event.error) {
      error = new Error(event.error);
    }
    let data: CMPedometerData | undefined;
    if (event.data) {
      data = {
        ...event.data,
        startDate: new Date(event.data.startDate),
        endDate: new Date(event.data.endDate),
      } as CMPedometerData;
    }
    withHandler(error, data);
  });
  CmPedometer.startUpdates(from.toISOString());
}

export function stopUpdates(): void {
  eventEmitter.removeAllListeners(CmPedometerEvent.onPedometerData);
  CmPedometer.stopUpdates();
}

// Fetching Historical Pedometer Data
