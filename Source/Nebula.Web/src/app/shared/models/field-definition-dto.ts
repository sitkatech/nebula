export class FieldDefinitionDto{
    public FieldDefinitionTypeID: number;
    public DisplayName: string;
    public Definition?: string;

    constructor(obj?: any){
        Object.assign(this, obj);
    }
}