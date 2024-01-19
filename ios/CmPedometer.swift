import CoreMotion

@objc(CmPedometer)
class CmPedometer: NSObject {
    @objc(authorizationStatus:withRejecter:)
    func authorizationStatus(resolve:RCTPromiseResolveBlock, reject:RCTPromiseRejectBlock) -> Void {
        resolve(CMPedometer.authorizationStatus().rawValue)
    }

    @objc(isStepCountingAvailable:withRejecter:)
    func isStepCountingAvailable(resolve:RCTPromiseResolveBlock, reject:RCTPromiseRejectBlock) -> Void {
        resolve(CMPedometer.isStepCountingAvailable())
    }

    @objc(isDistanceAvailable:withRejecter:)
    func isDistanceAvailable(resolve:RCTPromiseResolveBlock, reject:RCTPromiseRejectBlock) -> Void {
        resolve(CMPedometer.isDistanceAvailable())
    }

    @objc(isFloorCountingAvailable:withRejecter:)
    func isFloorCountingAvailable(resolve:RCTPromiseResolveBlock, reject:RCTPromiseRejectBlock) -> Void {
        resolve(CMPedometer.isFloorCountingAvailable())
    }

    @objc(isPaceAvailable:withRejecter:)
    func isPaceAvailable(resolve:RCTPromiseResolveBlock, reject:RCTPromiseRejectBlock) -> Void {
        resolve(CMPedometer.isPaceAvailable())
    }

    @objc(isCadenceAvailable:withRejecter:)
    func isCadenceAvailable(resolve:RCTPromiseResolveBlock, reject:RCTPromiseRejectBlock) -> Void {
        resolve(CMPedometer.isCadenceAvailable())
    }

    @objc(isPedometerEventTrackingAvailable:withRejecter:)
    func isPedometerEventTrackingAvailable(resolve:RCTPromiseResolveBlock, reject:RCTPromiseRejectBlock) -> Void {
        resolve(CMPedometer.isPedometerEventTrackingAvailable())
    }
}
