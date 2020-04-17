declare module '@daily-co/daily-js' {
    export interface CallProperties {
        url: string;
        token?: string;
        lang?: string;
        showLeaveButton?: boolean;
        showFullscreenButton?: boolean;
        customLayout?: boolean;
        cssFile?: string;
        cssText?: string;
        bodyClass?: string;
    }

    class DailyIFrame {
        static wrap(iframe: HTMLIFrameElement, properties?: CallProperties): DailyIFrame;

        join(properties?: CallProperties): Promise<void>;
        setLocalAudio(bool: boolean): DailyIFrame;
        setLocalVideo(bool: boolean): DailyIFrame;
    }

    export default DailyIFrame;
}