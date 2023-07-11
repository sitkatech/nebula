//  IMPORTANT:
//  This file is generated. Your changes will be lost.
//  Use the corresponding partial class for customizations.
//  Source Table: [dbo].[BackboneSegment]
using System;


namespace Nebula.Models.DataTransferObjects
{
    public partial class BackboneSegmentDto
    {
        public int BackboneSegmentID { get; set; }
        public int CatchIDN { get; set; }
        public BackboneSegmentTypeDto BackboneSegmentType { get; set; }
        public int? DownstreamBackboneSegmentID { get; set; }
        public string StreamName { get; set; }
    }
}