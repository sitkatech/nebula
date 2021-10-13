using Nebula.EFModels.Entities;

namespace Nebula.API.Services.Authorization
{
    public class UserViewFeature : BaseAuthorizationAttribute
    {
        public UserViewFeature() : base(new []{RoleEnum.Admin, RoleEnum.LandOwner, RoleEnum.Unassigned})
        {
        }
    }
}