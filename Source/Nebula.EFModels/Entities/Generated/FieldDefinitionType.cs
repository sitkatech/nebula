using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Nebula.EFModels.Entities
{
    public partial class FieldDefinitionType
    {
        public FieldDefinitionType()
        {
            FieldDefinition = new HashSet<FieldDefinition>();
        }

        [Key]
        public int FieldDefinitionTypeID { get; set; }
        [Required]
        [StringLength(100)]
        public string FieldDefinitionTypeName { get; set; }
        [Required]
        [StringLength(100)]
        public string FieldDefinitionTypeDisplayName { get; set; }

        [InverseProperty("FieldDefinitionType")]
        public virtual ICollection<FieldDefinition> FieldDefinition { get; set; }
    }
}
