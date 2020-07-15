//  IMPORTANT:
//  This file is generated. Your changes will be lost.
//  Use the corresponding partial class for customizations.
//  Source Table: [dbo].[BackboneSegmentType]

using Nebula.Models.DataTransferObjects;

namespace Nebula.EFModels.Entities
{
    public static partial class BackboneSegmentTypeExtensionMethods
    {
        public static BackboneSegmentTypeDto AsDto(this BackboneSegmentType backboneSegmentType)
        {
            var backboneSegmentTypeDto = new BackboneSegmentTypeDto()
            {
                BackboneSegmentTypeID = backboneSegmentType.BackboneSegmentTypeID,
                BackboneSegmentTypeName = backboneSegmentType.BackboneSegmentTypeName,
                BackboneSegmentTypeDisplayName = backboneSegmentType.BackboneSegmentTypeDisplayName
            };
            DoCustomMappings(backboneSegmentType, backboneSegmentTypeDto);
            return backboneSegmentTypeDto;
        }

        static partial void DoCustomMappings(BackboneSegmentType backboneSegmentType, BackboneSegmentTypeDto backboneSegmentTypeDto);
    }
}