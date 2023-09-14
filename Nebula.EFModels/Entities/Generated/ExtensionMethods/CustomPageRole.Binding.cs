//  IMPORTANT:
//  This file is generated. Your changes will be lost.
//  Use the corresponding partial class for customizations.
//  Source Table: [dbo].[CustomPageRole]
namespace Nebula.EFModels.Entities
{
    public partial class CustomPageRole
    {
        public Role Role => Role.AllLookupDictionary[RoleID];
    }
}