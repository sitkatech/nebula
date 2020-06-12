using Nebula.Models.DataTransferObjects.Watershed;

namespace Nebula.EFModels.Entities
{
    public static class WatershedExtensionMethods
    {
        public static WatershedSimpleDto AsSimpleDto(this Watershed watershed)
        {
            var watershedSimpleDto = new WatershedSimpleDto()
            {
                WatershedID = watershed.WatershedID,
                WatershedName = watershed.WatershedName
            };

            return watershedSimpleDto;
        }

        public static WatershedDto AsDto(this Watershed watershed)
        {
            var watershedDto = new WatershedDto()
            {
                WatershedID = watershed.WatershedID,
                WatershedName = watershed.WatershedName
            };
            return watershedDto;
        }
    }
}