//  IMPORTANT:
//  This file is generated. Your changes will be lost.
//  Use the corresponding partial class for customizations.
//  Source Table: [dbo].[RegionalSubbasin]

using Nebula.Models.DataTransferObjects;

namespace Nebula.EFModels.Entities
{
    public static partial class RegionalSubbasinExtensionMethods
    {
        public static RegionalSubbasinDto AsDto(this RegionalSubbasin regionalSubbasin)
        {
            var regionalSubbasinDto = new RegionalSubbasinDto()
            {
                RegionalSubbasinID = regionalSubbasin.RegionalSubbasinID,
                DrainID = regionalSubbasin.DrainID,
                Watershed = regionalSubbasin.Watershed,
                OCSurveyCatchmentID = regionalSubbasin.OCSurveyCatchmentID,
                OCSurveyDownstreamCatchment = regionalSubbasin.OCSurveyDownstreamCatchment?.AsDto(),
                LastUpdate = regionalSubbasin.LastUpdate
            };
            DoCustomMappings(regionalSubbasin, regionalSubbasinDto);
            return regionalSubbasinDto;
        }

        static partial void DoCustomMappings(RegionalSubbasin regionalSubbasin, RegionalSubbasinDto regionalSubbasinDto);
    }
}