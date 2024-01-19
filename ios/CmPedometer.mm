#import <React/RCTBridgeModule.h>
#import <React/RCTEventEmitter.h>

@interface RCT_EXTERN_MODULE(CmPedometer, RCTEventEmitter)

// MARK: - Determining Pedometer Availability

RCT_EXTERN_METHOD(authorizationStatus:(RCTPromiseResolveBlock)resolve
                  withRejecter:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(isStepCountingAvailable:(RCTPromiseResolveBlock)resolve
                  withRejecter:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(isDistanceAvailable:(RCTPromiseResolveBlock)resolve
                  withRejecter:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(isFloorCountingAvailable:(RCTPromiseResolveBlock)resolve
                  withRejecter:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(isPaceAvailable:(RCTPromiseResolveBlock)resolve
                  withRejecter:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(isCadenceAvailable:(RCTPromiseResolveBlock)resolve
                  withRejecter:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(isPedometerEventTrackingAvailable:(RCTPromiseResolveBlock)resolve
                  withRejecter:(RCTPromiseRejectBlock)reject)

// MARK: - Gathering Live Pedometer Data

RCT_EXTERN_METHOD(startUpdates:(NSString *)from)

RCT_EXTERN_METHOD(stopUpdates)

RCT_EXTERN_METHOD(startEventUpdates)

RCT_EXTERN_METHOD(stopEventUpdates)

// MARK: - Fetching Historical Pedometer Data

// MARK: -

+ (BOOL)requiresMainQueueSetup
{
    return NO;
}

@end
