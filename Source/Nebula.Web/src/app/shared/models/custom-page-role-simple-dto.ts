export class CustomPageRoleSimpleDto { 
    CustomPageRoleID?: number;
    CustomPageID?: number;
    RoleID?: number;
    constructor(obj?: any) {
        Object.assign(this, obj);
    }
}
