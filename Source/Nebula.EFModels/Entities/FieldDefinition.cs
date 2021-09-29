using System.Collections.Generic;
using Nebula.Models.DataTransferObjects;
using System.Linq;
using Microsoft.EntityFrameworkCore;

namespace Nebula.EFModels.Entities
{
    public partial class FieldDefinition
    {
        public static List<FieldDefinitionDto> List(NebulaDbContext dbContext)
        {
            return dbContext.FieldDefinitions.Include(x => x.FieldDefinitionType).Select(x => x.AsDto()).ToList();
        }

        public static FieldDefinitionDto GetByFieldDefinitionTypeID(NebulaDbContext dbContext, int FieldDefinitionTypeID)
        {
            var fieldDefinition = dbContext.FieldDefinitions
                .Include(x => x.FieldDefinitionType)
                .SingleOrDefault(x => x.FieldDefinitionTypeID == FieldDefinitionTypeID);

            return fieldDefinition?.AsDto();
        }

        public static FieldDefinitionDto UpdateFieldDefinition(NebulaDbContext dbContext, int FieldDefinitionTypeID,
            FieldDefinitionDto FieldDefinitionUpdateDto)
        {
            var fieldDefinition = dbContext.FieldDefinitions
                .Include(x => x.FieldDefinitionType)
                .SingleOrDefault(x => x.FieldDefinitionTypeID == FieldDefinitionTypeID);

            // null check occurs in calling endpoint method.
            fieldDefinition.FieldDefinitionValue = FieldDefinitionUpdateDto.FieldDefinitionValue;

            dbContext.SaveChanges();

            return fieldDefinition.AsDto();
        }
    }
}