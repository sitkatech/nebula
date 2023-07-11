import { RoleDto } from './generated/role-dto';
import { MenuItemDto } from './generated/menu-item-dto';

export class CustomPageWithRolesDto { 
    CustomPageID: number;
    CustomPageDisplayName: string;
    CustomPageVanityUrl: string;
    CustomPageContent?: string;
    MenuItem: MenuItemDto;
    SortOrder?: number;
    ViewableRoles: Array<RoleDto>;
    readonly IsEmptyContent?: boolean;
    constructor(obj?: any) {
        Object.assign(this, obj);
    }
}
