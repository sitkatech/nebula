using Nebula.EFModels.Entities;

namespace Nebula.API.Services.Authorization
{
    public class DataExplorerFeature : BaseAuthorizationAttribute
    {
        public DataExplorerFeature() : base(new[] { RoleEnum.Admin, RoleEnum.DataExplorer }) { }
    }
}