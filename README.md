# react-native-cm-pedometer

React Native iOS Core Motion CMPedometer module. This is an iOS-only module that exposes the entirety of the CMPedometer interface and functionality to a React Native app. Please refer to the [Apple CMPedometer Developer documentation](https://developer.apple.com/documentation/coremotion/cmpedometer) for details.

## Installation

```sh
npm install react-native-cm-pedometer
```

## Usage

See [`example/src/App.tsx`](example/src/App.tsx) for example usage of all the functions/types/enums in the module. See [`src/index.tsx`](src/index.tsx) for enum definitions.

```js
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

// ...

const status = await authorizationStatus();
switch (status) {
  case CMAuthorizationStatus.notDetermined:
    // ...
  case CMAuthorizationStatus.restricted:
    // ...
  case CMAuthorizationStatus.denied:
    // ...
  case CMAuthorizationStatus.authorized:
    // ...
}
```

## Contributing

See the [contributing guide](CONTRIBUTING.md) to learn how to contribute to the repository and the development workflow.

## Copyright

react-native-cm-pedometer  
Copyright &copy; 2024 SF Civic Tech

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU Lesser General Public License as
published by the Free Software Foundation, either version 3 of the
License, or (at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
GNU Lesser General Public License for more details.

You should have received a copy of the GNU Lesser General Public License
along with this program. If not, see <https://www.gnu.org/licenses/>.
