using Microsoft.EntityFrameworkCore;

namespace Nebula.EFModels.Entities
{
    public partial class NebulaDbContext
    {
        partial void OnModelCreatingPartial(ModelBuilder modelBuilder)
        {
        }
    }
}