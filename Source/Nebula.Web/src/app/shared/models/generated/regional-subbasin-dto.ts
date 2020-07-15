//  IMPORTANT:
//  This file is generated. Your changes will be lost.
//  Use the corresponding partial class for customizations.
//  Source Table: [dbo].[RegionalSubbasin]
import { RegionalSubbasinDto } from './regional-subbasin-dto'

export class RegionalSubbasinDto {
	RegionalSubbasinID : number
	DrainID? : string
	Watershed? : string
	OCSurveyCatchmentID : number
	OCSurveyDownstreamCatchment? : RegionalSubbasinDto
	LastUpdate? : Date

    constructor(obj?: any) {
        Object.assign(this, obj);
    }
}