using System.Collections.Generic;
using System.Linq;
using Nebula.Models.DataTransferObjects;
using Microsoft.EntityFrameworkCore;

namespace Nebula.EFModels.Entities
{
    public partial class CustomPageRole
    {
        public static List<CustomPageRoleSimpleDto> List(NebulaDbContext dbContext)
        {
            return dbContext.CustomPageRoles
                .Include(x => x.CustomPage)
                .AsNoTracking()
                .Select(x => x.AsSimpleDto()).ToList();
        }
        public static List<CustomPageRoleSimpleDto> GetByCustomPageVanityURL(NebulaDbContext dbContext, string customPageVanityUrl)
        {
            return dbContext.CustomPageRoles
                .Include(x => x.CustomPage)
                .AsNoTracking()
                .Where(x => x.CustomPage.CustomPageVanityUrl == customPageVanityUrl)
                .Select(x => x.AsSimpleDto()).ToList();
        }

        public static List<CustomPageRoleSimpleDto> GetByCustomPageID(NebulaDbContext dbContext, int customPageID)
        {
            return dbContext.CustomPageRoles
                .Include(x => x.CustomPage)
                .AsNoTracking()
                .Where(x => x.CustomPage.CustomPageID == customPageID)
                .Select(x => x.AsSimpleDto()).ToList();
        }

    }
}