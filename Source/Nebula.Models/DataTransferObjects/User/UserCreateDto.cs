using System;

namespace Nebula.Models.DataTransferObjects.User
{
    public class UserCreateDto: UserUpsertDto
    {
        public string LoginName { get; set; }
        public Guid UserGuid { get; set; }
    }
}