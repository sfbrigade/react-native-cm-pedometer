import * as React from 'react';

import { StyleSheet, View, Text, Button } from 'react-native';
import {
  CMAuthorizationStatus,
  authorizationStatus,
  isStepCountingAvailable,
  isDistanceAvailable,
  isFloorCountingAvailable,
  isPaceAvailable,
  isCadenceAvailable,
  isPedometerEventTrackingAvailable,
  type CMPedometerData,
  startUpdates,
  stopUpdates,
  type CMPedometerEvent,
  CMPedometerEventType,
  startEventUpdates,
  stopEventUpdates,
  queryPedometerData,
} from 'react-native-cm-pedometer';

export default function App() {
  const [status, setStatus] = React.useState<
    CMAuthorizationStatus | undefined
  >();
  const [isStepAvail, setStepAvail] = React.useState<boolean | undefined>();
  const [isDistAvail, setDistAvail] = React.useState<boolean | undefined>();
  const [isFloorAvail, setFloorAvail] = React.useState<boolean | undefined>();
  const [isPaceAvail, setPaceAvail] = React.useState<boolean | undefined>();
  const [isCadenceAvail, setCadenceAvail] = React.useState<
    boolean | undefined
  >();
  const [isEventAvail, setEventAvail] = React.useState<boolean | undefined>();

  React.useEffect(() => {
    authorizationStatus().then(setStatus);
    isStepCountingAvailable().then(setStepAvail);
    isDistanceAvailable().then(setDistAvail);
    isFloorCountingAvailable().then(setFloorAvail);
    isPaceAvailable().then(setPaceAvail);
    isCadenceAvailable().then(setCadenceAvail);
    isPedometerEventTrackingAvailable().then(setEventAvail);
    return () => {
      stopUpdates();
    };
  }, []);

  const [error, setError] = React.useState<Error | undefined>();

  const [isDataStarted, setDataStarted] = React.useState<boolean>(false);
  const [startDate, setStartDate] = React.useState<Date>(new Date());
  const [data, setData] = React.useState<CMPedometerData | undefined>();

  function onPressData() {
    const now = new Date();
    if (isDataStarted) {
      stopUpdates();
      queryPedometerData(startDate, now).then(setData);
    } else {
      setStartDate(now);
      startUpdates(now, (newError, newData) => {
        setError(newError);
        setData(newData);
      });
    }
    setDataStarted(!isDataStarted);
  }

  const [isEventStarted, setEventStarted] = React.useState<boolean>(false);
  const [event, setEvent] = React.useState<CMPedometerEvent | undefined>();

  function onPressEvent() {
    if (isEventStarted) {
      stopEventUpdates();
    } else {
      startEventUpdates((newError, newEvent) => {
        setError(newError);
        setEvent(newEvent);
      });
    }
    setEventStarted(!isEventStarted);
  }

  return (
    <View style={styles.container}>
      <Text>
        Authorization Status:{' '}
        {status !== undefined && CMAuthorizationStatus[status]}
      </Text>
      <Text>Is Step Counting Available: {isStepAvail?.toString()}</Text>
      <Text>Is Distance Available: {isDistAvail?.toString()}</Text>
      <Text>Is Floor Counting Available: {isFloorAvail?.toString()}</Text>
      <Text>Is Pace Available: {isPaceAvail?.toString()}</Text>
      <Text>Is Cadence Available: {isCadenceAvail?.toString()}</Text>
      <Text>
        Is Pedometer Event Tracking Available: {isEventAvail?.toString()}
      </Text>
      <Text>Error: {error?.message}</Text>
      <Button
        onPress={onPressData}
        title={isDataStarted ? 'Stop Data Updates' : 'Start Data Updates'}
      />
      <Text>Start Date: {data?.startDate.toLocaleString()}</Text>
      <Text>End Date: {data?.endDate.toLocaleString()}</Text>
      <Text>Number of Steps: {data?.numberOfSteps}</Text>
      <Text>Distance: {data?.distance}</Text>
      <Text>Current Cadence: {data?.currentCadence}</Text>
      <Text>Current Pace: {data?.currentPace}</Text>
      <Text>Average Active Pace: {data?.averageActivePace}</Text>
      <Text>Floors Ascended: {data?.floorsAscended}</Text>
      <Text>Floors Descended: {data?.floorsDescended}</Text>
      <Button
        onPress={onPressEvent}
        title={isEventStarted ? 'Stop Event Updates' : 'Start Event Updates'}
      />
      <Text>Event date: {event?.date.toLocaleString()}</Text>
      <Text>
        Event type:{' '}
        {event?.type !== undefined && CMPedometerEventType[event.type]}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  box: {
    width: 60,
    height: 60,
    marginVertical: 20,
  },
});
