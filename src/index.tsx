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

export enum CMPedometerEventType {
  pause,
  resume,
}

export interface CMPedometerEvent {
  date: Date;
  type: CMPedometerEventType;
}

export type CMPedometerHandler = (
  error: Error | undefined,
  data: CMPedometerData | undefined
) => void;

export type CMPedometerEventHandler = (
  error: Error | undefined,
  pedometerEvent: CMPedometerEvent
) => void;

const enum CmPedometerEvent {
  onPedometerData = 'onPedometerData',
  onPedometerEvent = 'onPedometerEvent',
}
const eventEmitter = new NativeEventEmitter(CmPedometer);

export function startUpdates(from: Date, handler: CMPedometerHandler): void {
  eventEmitter.addListener(CmPedometerEvent.onPedometerData, (event) => {
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
    handler(error, data);
  });
  CmPedometer.startUpdates(from.toISOString());
}

export function stopUpdates(): void {
  eventEmitter.removeAllListeners(CmPedometerEvent.onPedometerData);
  CmPedometer.stopUpdates();
}

export function startEventUpdates(handler: CMPedometerEventHandler): void {
  eventEmitter.addListener(CmPedometerEvent.onPedometerEvent, (event) => {
    let error: Error | undefined;
    if (event.error) {
      error = new Error(event.error);
    }
    let pedometerEvent: CMPedometerEvent | undefined;
    if (event.pedometerEvent) {
      pedometerEvent = {
        ...event.pedometerEvent,
        date: new Date(event.pedometerEvent.date),
      } as CMPedometerEvent;
      handler(error, pedometerEvent);
    }
  });
  CmPedometer.startEventUpdates();
}

export function stopEventUpdates(): void {
  eventEmitter.removeAllListeners(CmPedometerEvent.onPedometerEvent);
  CmPedometer.stopEventUpdates();
}

// Fetching Historical Pedometer Data

export function queryPedometerData(
  from: Date,
  to: Date
): Promise<CMPedometerData> {
  return new Promise((resolve, reject) => {
    CmPedometer.queryPedometerData(
      from.toISOString(),
      to.toISOString(),
      (error: string | undefined, data: any) => {
        if (error) {
          reject(new Error(error));
        } else if (data) {
          resolve({
            ...data,
            startDate: new Date(data.startDate),
            endDate: new Date(data.endDate),
          } as CMPedometerData);
        } else {
          reject(new Error('An unexpected error has occurred.'));
        }
      }
    );
  });
}
