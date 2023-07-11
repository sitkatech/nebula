using System.Collections.Generic;
using System.Linq;
using Microsoft.EntityFrameworkCore;
using Nebula.Models.DataTransferObjects;
using Nebula.Models.DataTransferObjects.Watershed;

namespace Nebula.EFModels.Entities
{
    public partial class Watershed
    {
        public static List<WatershedDto> List(NebulaDbContext dbContext)
        {
            return GetWatershedsImpl(dbContext).Select(x => x.AsDto()).ToList();
        }

        public static WatershedDto GetByWatershedID(NebulaDbContext dbContext, int watershedID)
        {
            return GetWatershedsImpl(dbContext).SingleOrDefault(x => x.WatershedID == watershedID)?.AsDto();
        }

        public static List<WatershedDto> GetByWatershedID(NebulaDbContext dbContext, List<int> watershedIDs)
        {
            return GetWatershedsImpl(dbContext).Where(x => watershedIDs.Contains(x.WatershedID)).Select(x => x.AsDto()).ToList();
        }

        private static IQueryable<Watershed> GetWatershedsImpl(NebulaDbContext dbContext)
        {
            return dbContext.Watersheds.AsNoTracking();
        }

        public static BoundingBoxDto GetBoundingBoxByWatershedIDs(NebulaDbContext dbContext, List<int> watershedIDs)
        {
            var watersheds = dbContext.Watersheds
                .AsNoTracking()
                .Where(x => watershedIDs.Contains(x.WatershedID));

            var geometries = watersheds.Select(x => x.WatershedGeometry4326).ToList();
            return new BoundingBoxDto(geometries);
        }
    }
}