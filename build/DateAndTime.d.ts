export declare class DateAndTime {
    /**
     * Date & time helper functions as provided by:
     * http://scottrbailey.wordpress.com/2009/05/28/parsing-dates-flex-as3/
     *
     *
     **/
    static parseISODate(value: string): Date;
    static parseDatetime(value: string, guessAMPM?: boolean): any;
    static parseTime(value: string, guessAMPM?: boolean): any;
    static parseElapsedTime(value: string): number;
    static elapsedTime(startTime: Date, endTime: Date, showSeconds?: boolean): string;
    static formatAsTime(time: number, showSeconds?: boolean): string;
}
