//  IMPORTANT:
//  This file is generated. Your changes will be lost.
//  Use the corresponding partial class for customizations.
//  Source Table: [dbo].[CustomPage]

using Nebula.Models.DataTransferObjects;

namespace Nebula.EFModels.Entities
{
    public static partial class CustomPageExtensionMethods
    {
        public static CustomPageDto AsDto(this CustomPage customPage)
        {
            var customPageDto = new CustomPageDto()
            {
                CustomPageID = customPage.CustomPageID,
                CustomPageDisplayName = customPage.CustomPageDisplayName,
                CustomPageVanityUrl = customPage.CustomPageVanityUrl,
                CustomPageContent = customPage.CustomPageContent,
                MenuItem = customPage.MenuItem.AsDto(),
                SortOrder = customPage.SortOrder
            };
            DoCustomMappings(customPage, customPageDto);
            return customPageDto;
        }

        static partial void DoCustomMappings(CustomPage customPage, CustomPageDto customPageDto);

    }
}