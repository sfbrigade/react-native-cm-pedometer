import CoreMotion
import React

enum CmPedometerEvent: String, CaseIterable {
    case onPedometerData
    case onPedometerEvent
}

@objc(CmPedometer)
class CmPedometer: RCTEventEmitter {
    static let instance = CMPedometer()
    static let dateFormatter = {
        let dateFormatter = ISO8601DateFormatter()
        dateFormatter.formatOptions = [
            .withInternetDateTime,
            .withFractionalSeconds
        ]
        return dateFormatter
    }()

    // MARK: - Determining Pedometer Availability

    @objc(authorizationStatus:withRejecter:)
    func authorizationStatus(resolve: RCTPromiseResolveBlock, reject: RCTPromiseRejectBlock) -> Void {
        resolve(CMPedometer.authorizationStatus().rawValue)
    }

    @objc(isStepCountingAvailable:withRejecter:)
    func isStepCountingAvailable(resolve: RCTPromiseResolveBlock, reject: RCTPromiseRejectBlock) -> Void {
        resolve(CMPedometer.isStepCountingAvailable())
    }

    @objc(isDistanceAvailable:withRejecter:)
    func isDistanceAvailable(resolve: RCTPromiseResolveBlock, reject: RCTPromiseRejectBlock) -> Void {
        resolve(CMPedometer.isDistanceAvailable())
    }

    @objc(isFloorCountingAvailable:withRejecter:)
    func isFloorCountingAvailable(resolve: RCTPromiseResolveBlock, reject: RCTPromiseRejectBlock) -> Void {
        resolve(CMPedometer.isFloorCountingAvailable())
    }

    @objc(isPaceAvailable:withRejecter:)
    func isPaceAvailable(resolve: RCTPromiseResolveBlock, reject: RCTPromiseRejectBlock) -> Void {
        resolve(CMPedometer.isPaceAvailable())
    }

    @objc(isCadenceAvailable:withRejecter:)
    func isCadenceAvailable(resolve: RCTPromiseResolveBlock, reject: RCTPromiseRejectBlock) -> Void {
        resolve(CMPedometer.isCadenceAvailable())
    }

    @objc(isPedometerEventTrackingAvailable:withRejecter:)
    func isPedometerEventTrackingAvailable(resolve: RCTPromiseResolveBlock, reject: RCTPromiseRejectBlock) -> Void {
        resolve(CMPedometer.isPedometerEventTrackingAvailable())
    }

    // MARK: - Gathering Live Pedometer Data

    @objc(startUpdates:)
    func startUpdates(from: String) -> Void {
        if let from = CmPedometer.dateFormatter.date(from: from) {
            CmPedometer.instance.startUpdates(from: from) { [weak self] (data, error) in
                guard let self = self else { return }
                var body: [String: Any] = [:]
                body["error"] = error?.localizedDescription
                if let data = data {
                    body["data"] = [
                        "startDate": CmPedometer.dateFormatter.string(from: data.startDate),
                        "endDate": CmPedometer.dateFormatter.string(from: data.endDate),
                        "numberOfSteps": data.numberOfSteps,
                        "distance": data.distance as Any,
                        "averageActivePace": data.averageActivePace as Any,
                        "currentPace": data.currentPace as Any,
                        "currentCadence": data.currentCadence as Any,
                        "floorsAscended": data.floorsAscended as Any,
                        "floorsDescended": data.floorsDescended as Any,
                    ]
                }
                self.sendEvent(withName: CmPedometerEvent.onPedometerData.rawValue, body: body)
            }
        }
    }

    @objc(stopUpdates)
    func stopUpdates() -> Void {
        CmPedometer.instance.stopUpdates()
    }

    // MARK: - Fetching Historical Pedometer Data

    // MARK: -

    override func supportedEvents() -> [String]! {
        return CmPedometerEvent.allCases.map{ $0.rawValue }
    }
}
