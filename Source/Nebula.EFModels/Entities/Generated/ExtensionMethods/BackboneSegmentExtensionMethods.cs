//  IMPORTANT:
//  This file is generated. Your changes will be lost.
//  Use the corresponding partial class for customizations.
//  Source Table: [dbo].[BackboneSegment]

using Nebula.Models.DataTransferObjects;

namespace Nebula.EFModels.Entities
{
    public static partial class BackboneSegmentExtensionMethods
    {
        public static BackboneSegmentDto AsDto(this BackboneSegment backboneSegment)
        {
            var backboneSegmentDto = new BackboneSegmentDto()
            {
                BackboneSegmentID = backboneSegment.BackboneSegmentID,
                CatchIDN = backboneSegment.CatchIDN,
                BackboneSegmentType = backboneSegment.BackboneSegmentType.AsDto(),
                DownstreamBackboneSegmentID = backboneSegment.DownstreamBackboneSegmentID,
                StreamName = backboneSegment.StreamName
            };
            DoCustomMappings(backboneSegment, backboneSegmentDto);
            return backboneSegmentDto;
        }

        static partial void DoCustomMappings(BackboneSegment backboneSegment, BackboneSegmentDto backboneSegmentDto);

    }
}