using Nebula.EFModels.Entities;

namespace Nebula.API.Services.Authorization
{
    public class AdminFeature : BaseAuthorizationAttribute
    {
        public AdminFeature() : base(new []{RoleEnum.Admin})
        {
        }
    }
}