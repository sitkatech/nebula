export class SiteVariable {
  name: string;
  description: string;
  variable: string;
  gage: string;
  stationShortName: string;
  stationLongName: string;
  station: string;
  startDate: Date;
  endDate: Date;
  nearestRainfallStationInfo: SiteVariable;
  allowedAggregations: string[];

  constructor(obj?: any) {
    Object.assign(this, obj);
  }
}