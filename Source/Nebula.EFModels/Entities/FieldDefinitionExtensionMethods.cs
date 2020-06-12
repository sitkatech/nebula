using Nebula.Models.DataTransferObjects;

namespace Nebula.EFModels.Entities
{
    public static class FieldDefinitionExtensionMethods
    {
        public static FieldDefinitionDto AsDto(this FieldDefinition fieldDefinition)
        {
            return new FieldDefinitionDto
            {
                FieldDefinitionTypeID = fieldDefinition.FieldDefinitionTypeID,
                DisplayName = fieldDefinition.FieldDefinitionType.FieldDefinitionTypeDisplayName,
                Definition = fieldDefinition.FieldDefinitionValue
            };
        }
    }
}