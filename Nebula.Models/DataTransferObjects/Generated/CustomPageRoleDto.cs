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

    public partial class CustomPageRoleSimpleDto
    {
        public int CustomPageRoleID { get; set; }
        public System.Int32 CustomPageID { get; set; }
        public System.Int32 RoleID { get; set; }
    }

}