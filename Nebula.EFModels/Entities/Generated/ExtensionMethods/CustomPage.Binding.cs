//  IMPORTANT:
//  This file is generated. Your changes will be lost.
//  Use the corresponding partial class for customizations.
//  Source Table: [dbo].[CustomPage]
namespace Nebula.EFModels.Entities
{
    public partial class CustomPage
    {
        public MenuItem MenuItem => MenuItem.AllLookupDictionary[MenuItemID];
    }
}