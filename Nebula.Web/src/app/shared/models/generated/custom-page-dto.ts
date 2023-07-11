//  IMPORTANT:
//  This file is generated. Your changes will be lost.
//  Use the corresponding partial class for customizations.
//  Source Table: [dbo].[CustomPage]
import { MenuItemDto } from './menu-item-dto'

export class CustomPageDto {
	CustomPageID : number
	CustomPageDisplayName : string
	CustomPageVanityUrl : string
	CustomPageContent : string
	MenuItem : MenuItemDto
	SortOrder : number

    constructor(obj?: any) {
        Object.assign(this, obj);
    }
}
