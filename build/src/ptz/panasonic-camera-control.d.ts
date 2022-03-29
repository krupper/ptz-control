export default class PanasonicCameraControl implements PTZ {
    constructor(ip: string);
    ip: string;
    private irisMin;
    private irisMax;
    private panasonicMinimalMessageDelayInMs;
    private importantEventsQueue;
    setPanTiltSpeed(pan: number, tilt: number): void;
    setZoomSpeed(speed: number): void;
    setAutoFocus(status: boolean): void;
    setFocusSpeed(speed: number): void;
    setAutoIris(status: boolean): void;
    stepIris(direction: 'up' | 'down', stepSize: number): void;
    playbackPreset(presetNumber: number): void;
    private sendCommandToPTZ;
    private sendCommandInstantToPTZ;
    private runMessageQueue;
    private hexToNumber;
    private numberToHex;
    private nextHexStep;
    private previousHexStep;
}
