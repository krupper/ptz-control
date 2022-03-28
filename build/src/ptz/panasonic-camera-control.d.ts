export default class PanasonicCameraControl implements PTZ {
    constructor(ip: string);
    ip: string;
    private irisMin;
    private irisMax;
    setPanTiltSpeed(pan: number, tilt: number): Promise<string | undefined>;
    setZoomSpeed(speed: number): Promise<string | undefined>;
    setAutoFocus(status: boolean): void;
    setFocusSpeed(speed: number): Promise<string | undefined>;
    setAutoIris(status: boolean): void;
    stepIris(direction: 'up' | 'down', stepSize: number): void;
    playbackPreset(presetNumber: number): void;
    private sendCommandToPTZ;
    private hexToNumber;
    private numberToHex;
    private nextHexStep;
    private previousHexStep;
}
