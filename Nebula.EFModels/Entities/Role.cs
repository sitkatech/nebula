using System.Collections.Generic;
using System.Linq;
using Microsoft.EntityFrameworkCore;
using Nebula.Models.DataTransferObjects;

namespace Nebula.EFModels.Entities
{
    public partial class Role
    {
        public static RoleDto GetByRoleID(NebulaDbContext dbContext, int roleID)
        {
            var role = All.SingleOrDefault(x => x.RoleID == roleID);

            return role?.AsDto();
        }
    }
}
