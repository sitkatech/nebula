export class SiteVariable {
    displayName: string;
    name: string;
    variable: number;
    startDate: Date;
    endDate: Date;

    constructor(obj?: any) {
        Object.assign(this, obj);
    }
}