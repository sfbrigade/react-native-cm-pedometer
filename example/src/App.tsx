import * as React from 'react';

import { StyleSheet, View, Text } from 'react-native';
import {
  CMAuthorizationStatus,
  authorizationStatus,
  isStepCountingAvailable,
  isDistanceAvailable,
  isFloorCountingAvailable,
  isPaceAvailable,
  isCadenceAvailable,
  isPedometerEventTrackingAvailable,
} from 'react-native-cm-pedometer';

export default function App() {
  const [authorizationStatusResult, setAuthorizationStatusResult] =
    React.useState<CMAuthorizationStatus | undefined>();
  const [isStepCountingAvailableResult, setStepCountingAvailableResult] =
    React.useState<boolean | undefined>();
  const [isDistanceAvailableResult, setDistanceAvailableResult] =
    React.useState<boolean | undefined>();
  const [isFloorCountingAvailableResult, setFloorCountingAvailableResult] =
    React.useState<boolean | undefined>();
  const [isPaceAvailableResult, setPaceAvailableResult] = React.useState<
    boolean | undefined
  >();
  const [isCadenceAvailableResult, setCadenceAvailableResult] = React.useState<
    boolean | undefined
  >();
  const [
    isPedometerEventTrackingAvailableResult,
    setPedometerEventTrackingAvailableResult,
  ] = React.useState<boolean | undefined>();

  React.useEffect(() => {
    authorizationStatus().then(setAuthorizationStatusResult);
    isStepCountingAvailable().then(setStepCountingAvailableResult);
    isDistanceAvailable().then(setDistanceAvailableResult);
    isFloorCountingAvailable().then(setFloorCountingAvailableResult);
    isPaceAvailable().then(setPaceAvailableResult);
    isCadenceAvailable().then(setCadenceAvailableResult);
    isPedometerEventTrackingAvailable().then(
      setPedometerEventTrackingAvailableResult
    );
  }, []);

  return (
    <View style={styles.container}>
      <Text>
        Authorization Status:{' '}
        {authorizationStatusResult !== undefined &&
          CMAuthorizationStatus[authorizationStatusResult]}
      </Text>
      <Text>
        Is Step Counting Available: {isStepCountingAvailableResult?.toString()}
      </Text>
      <Text>
        Is Distance Available: {isDistanceAvailableResult?.toString()}
      </Text>
      <Text>
        Is Floor Counting Available:{' '}
        {isFloorCountingAvailableResult?.toString()}
      </Text>
      <Text>Is Pace Available: {isPaceAvailableResult?.toString()}</Text>
      <Text>Is Cadence Available: {isCadenceAvailableResult?.toString()}</Text>
      <Text>
        Is Pedometer Event Tracking Available:{' '}
        {isPedometerEventTrackingAvailableResult?.toString()}
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
