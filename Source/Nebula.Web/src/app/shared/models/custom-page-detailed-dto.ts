import { CustomPageDto } from "./generated/custom-page-dto";

export class CustomPageDetailedDto extends CustomPageDto{
    public IsEmptyContent: boolean;

    constructor(obj?: any){
        super();
        Object.assign(this, obj);
    }
}