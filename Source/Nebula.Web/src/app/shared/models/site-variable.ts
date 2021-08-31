export class SiteVariable {
    name: string;
    variable: string;
    stationShortName: string;
    station: string;
    startDate: Date;
    endDate: Date;
    allowedAggregations: string[];

    constructor(obj?: any) {
        Object.assign(this, obj);
    }
}