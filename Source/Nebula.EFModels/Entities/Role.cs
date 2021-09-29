using System.Collections.Generic;
using System.Linq;
using Microsoft.EntityFrameworkCore;
using Nebula.Models.DataTransferObjects;

namespace Nebula.EFModels.Entities
{
    public partial class Role
    {
        public static IEnumerable<RoleDto> List(NebulaDbContext dbContext)
        {
            var roles = dbContext.Roles
                .AsNoTracking()
                .Select(x => x.AsDto());

            return roles;
        }

        public static RoleDto GetByRoleID(NebulaDbContext dbContext, int roleID)
        {
            var role = dbContext.Roles
                .AsNoTracking()
                .FirstOrDefault(x => x.RoleID == roleID);

            return role?.AsDto();
        }
    }

    public enum RoleEnum
    {
        Admin = 1,
        LandOwner = 2,
        Unassigned = 3,
        Disabled = 4
    }
}
