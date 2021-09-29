//  IMPORTANT:
//  This file is generated. Your changes will be lost.
//  Use the corresponding partial class for customizations.
//  Source Table: [dbo].[BackboneSegment]
import { BackboneSegmentTypeDto } from './backbone-segment-type-dto'

export class BackboneSegmentDto {
	BackboneSegmentID : number
	CatchIDN : number
	BackboneSegmentType : BackboneSegmentTypeDto
	DownstreamBackboneSegmentID : number
	StreamName : string

    constructor(obj?: any) {
        Object.assign(this, obj);
    }
}
