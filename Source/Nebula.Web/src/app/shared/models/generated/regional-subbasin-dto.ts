//  IMPORTANT:
//  This file is generated. Your changes will be lost.
//  Use the corresponding partial class for customizations.
//  Source Table: [dbo].[RegionalSubbasin]


export class RegionalSubbasinDto {
	RegionalSubbasinID : number
	DrainID : string
	Watershed : string
	OCSurveyCatchmentID : number
	OCSurveyDownstreamCatchmentID : number
	LastUpdate : Date

    constructor(obj?: any) {
        Object.assign(this, obj);
    }
}
