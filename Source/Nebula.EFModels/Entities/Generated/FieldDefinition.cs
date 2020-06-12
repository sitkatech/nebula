using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Nebula.EFModels.Entities
{
    public partial class FieldDefinition
    {
        [Key]
        public int FieldDefinitionID { get; set; }
        public int FieldDefinitionTypeID { get; set; }
        public string FieldDefinitionValue { get; set; }

        [ForeignKey(nameof(FieldDefinitionTypeID))]
        [InverseProperty("FieldDefinition")]
        public virtual FieldDefinitionType FieldDefinitionType { get; set; }
    }
}
