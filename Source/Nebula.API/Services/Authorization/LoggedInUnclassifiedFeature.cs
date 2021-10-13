using System.Collections.Generic;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc.Filters;
using Nebula.EFModels.Entities;
using Nebula.Models.DataTransferObjects.User;

namespace Nebula.API.Services.Authorization
{
    public class LoggedInUnclassifiedFeature : AuthorizeAttribute, IAuthorizationFilter
    {
        public LoggedInUnclassifiedFeature() : base()
        {
        }

        public void OnAuthorization(AuthorizationFilterContext context)
        {

        }
    }
}