//  IMPORTANT:
//  This file is generated. Your changes will be lost.
//  Use the corresponding partial class for customizations.
//  Source Table: [dbo].[CustomPageRole]
using System;


namespace Nebula.Models.DataTransferObjects
{
    public partial class CustomPageRoleDto
    {
        public int CustomPageRoleID { get; set; }
        public CustomPageDto CustomPage { get; set; }
        public RoleDto Role { get; set; }
    }
}