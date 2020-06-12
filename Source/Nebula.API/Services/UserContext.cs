using System;
using System.Linq;
using Microsoft.AspNetCore.Http;
using Nebula.EFModels.Entities;
using Nebula.Models.DataTransferObjects.User;

namespace Nebula.API.Services
{
    public class UserContext
    {
        public UserDto User { get; set; }

        private UserContext(UserDto user)
        {
            User = user;
        }

        public static UserDto GetUserFromHttpContext(NebulaDbContext dbContext, HttpContext httpContext)
        {

            var claimsPrincipal = httpContext.User;
            if (!claimsPrincipal.Claims.Any())
            {
                return null;
            }

            var userGuid = Guid.Parse(claimsPrincipal.Claims.Single(c => c.Type == "sub").Value);
            var keystoneUser = Nebula.EFModels.Entities.User.GetByUserGuid(dbContext, userGuid);
            return keystoneUser;
        }
    }
}