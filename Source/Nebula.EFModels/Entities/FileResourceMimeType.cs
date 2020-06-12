using System.Linq;

namespace Nebula.EFModels.Entities
{
    public partial class FileResourceMimeType
    {
        public static FileResourceMimeType GetFileResourceMimeTypeByContentTypeName(NebulaDbContext dbContext, string contentTypeName)
        {
            return dbContext.FileResourceMimeType.Single(x => x.FileResourceMimeTypeContentTypeName == contentTypeName);
        }
    }
}