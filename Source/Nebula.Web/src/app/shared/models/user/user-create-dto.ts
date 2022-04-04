export class UserCreateDto {
    FirstName: string;
    LastName: string;
    Email: string;
    LoginName: string;
    UserGuid: string;
    OrganizationName?: string;
    PhoneNumber?: string;
    constructor(obj?: any) {
        Object.assign(this, obj);
    }
}
