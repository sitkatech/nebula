//  IMPORTANT:
//  This file is generated. Your changes will be lost.
//  Use the corresponding partial class for customizations.
//  Source Table: [dbo].[MenuItem]

using Nebula.Models.DataTransferObjects;

namespace Nebula.EFModels.Entities
{
    public static partial class MenuItemExtensionMethods
    {
        public static MenuItemDto AsDto(this MenuItem menuItem)
        {
            var menuItemDto = new MenuItemDto()
            {
                MenuItemID = menuItem.MenuItemID,
                MenuItemName = menuItem.MenuItemName,
                MenuItemDisplayName = menuItem.MenuItemDisplayName
            };
            DoCustomMappings(menuItem, menuItemDto);
            return menuItemDto;
        }

        static partial void DoCustomMappings(MenuItem menuItem, MenuItemDto menuItemDto);

    }
}