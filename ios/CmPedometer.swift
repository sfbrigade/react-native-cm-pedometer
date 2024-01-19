import CoreMotion
import React

enum CmPedometerEvent: String, CaseIterable {
    case onPedometerData
    case onPedometerEvent
}

extension CMPedometerData {
    func toPayload() -> [String: Any] {
        return [
            "startDate": CmPedometer.dateFormatter.string(from: startDate),
            "endDate": CmPedometer.dateFormatter.string(from: endDate),
            "numberOfSteps": numberOfSteps,
            "distance": distance as Any,
            "averageActivePace": averageActivePace as Any,
            "currentPace": currentPace as Any,
            "currentCadence": currentCadence as Any,
            "floorsAscended": floorsAscended as Any,
            "floorsDescended": floorsDescended as Any,
        ]
    }
}

extension CMPedometerEvent {
    func toPayload() -> [String: Any] {
        return [
            "date": CmPedometer.dateFormatter.string(from: date),
            "type": type.rawValue
        ]
    }
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
                    body["data"] = data.toPayload()
                }
                self.sendEvent(withName: CmPedometerEvent.onPedometerData.rawValue, body: body)
            }
        }
    }

    @objc(stopUpdates)
    func stopUpdates() -> Void {
        CmPedometer.instance.stopUpdates()
    }

    @objc(startEventUpdates)
    func startEventUpdates() -> Void {
        CmPedometer.instance.startEventUpdates(handler: { [weak self] (pedometerEvent, error) in
            guard let self = self else { return }
            var body: [String: Any] = [:]
            body["error"] = error?.localizedDescription
            if let pedometerEvent = pedometerEvent {
                body["pedometerEvent"] = pedometerEvent.toPayload()
            }
            self.sendEvent(withName: CmPedometerEvent.onPedometerEvent.rawValue, body: body)
        })
    }

    @objc(stopEventUpdates)
    func stopEventUpdates() -> Void {
        CmPedometer.instance.stopEventUpdates()
    }

    // MARK: - Fetching Historical Pedometer Data

    @objc(queryPedometerData:to:withCallback:)
    func queryPedometerData(from: String, to: String, callback: @escaping RCTResponseSenderBlock) {
        if let from = CmPedometer.dateFormatter.date(from: from),
           let to = CmPedometer.dateFormatter.date(from: to) {
            CmPedometer.instance.queryPedometerData(from: from, to: to) { (data, error) in
                if let error = error {
                    callback([error.localizedDescription])
                } else if let data = data {
                    callback([NSNull(), data.toPayload()])
                } else {
                    callback(["An unexpected error has occurred."])
                }
            }
        } else {
            callback(["Invalid dates"])
        }
    }

    // MARK: -

    override func supportedEvents() -> [String]! {
        return CmPedometerEvent.allCases.map{ $0.rawValue }
    }
}
