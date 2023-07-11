//  IMPORTANT:
//  This file is generated. Your changes will be lost.
//  Use the corresponding partial class for customizations.
//  Source Table: [dbo].[CustomPageRole]
import { CustomPageDto } from './custom-page-dto'
import { RoleDto } from './role-dto'

export class CustomPageRoleDto {
	CustomPageRoleID : number
	CustomPage : CustomPageDto
	Role : RoleDto

    constructor(obj?: any) {
        Object.assign(this, obj);
    }
}
