export class SiteVariable {
    name: string;
    variable: string;
    gage: string;
    stationShortName: string;
    station: string;
    startDate: Date;
    endDate: Date;
    allowedAggregations: string[];

    constructor(obj?: any) {
        Object.assign(this, obj);
    }
}