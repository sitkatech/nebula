
using System.Collections.Generic;
using System.Linq;
using Microsoft.EntityFrameworkCore;
using Nebula.EFModels.Entities;
using Nebula.Models.DataTransferObjects;

namespace Nebula.EFModels.Entities
{
    public partial class MenuItem
    {
        public static IEnumerable<MenuItemDto> List(NebulaDbContext dbContext)
        {
            IEnumerable<MenuItemDto> menuItems = dbContext.MenuItems
                .AsNoTracking()
                .Select(x => x.AsDto());

            return menuItems;
        }

    }
}
