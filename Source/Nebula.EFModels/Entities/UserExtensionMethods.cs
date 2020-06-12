﻿using Nebula.Models.DataTransferObjects.User;

namespace Nebula.EFModels.Entities
{
    public static class UserExtensionMethods
    {
        public static UserDto AsDto(this User user)
        {
            return new UserDto()
            {
                UserID = user.UserID,
                UserGuid = user.UserGuid,
                FirstName = user.FirstName,
                LastName = user.LastName,
                Email = user.Email,
                Phone = user.Phone,
                Role = user.Role?.AsDto(),
                LoginName = user.LoginName,
                DisclaimerAcknowledgedDate = user.DisclaimerAcknowledgedDate,
                ReceiveSupportEmails = user.ReceiveSupportEmails
            };
        }

        public static UserSimpleDto AsSimpleDto(this User user)
        {
            return new UserSimpleDto()
            {
                UserID = user.UserID,
                FirstName = user.FirstName,
                LastName = user.LastName,
                Email = user.Email,
            };
        }
    }
}