using Nebula.Models.DataTransferObjects;

namespace Nebula.EFModels.Entities
{
    public static partial class CustomPageRoleExtensionMethods
    {
        public static CustomPageRoleSimpleDto AsSimpleDto(this CustomPageRole customPageRole)
        {
            var customPageRoleSimpleDto = new CustomPageRoleSimpleDto()
            {
                CustomPageRoleID = customPageRole.CustomPageRoleID,
                CustomPageID = customPageRole.CustomPageID,
                RoleID = customPageRole.RoleID
            };
            return customPageRoleSimpleDto;
        }
    }
}