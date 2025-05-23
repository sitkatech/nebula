﻿using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace Nebula.EFModels.Entities
{
    [Table("FieldDefinition")]
    public partial class FieldDefinition
    {
        [Key]
        public int FieldDefinitionID { get; set; }
        public int FieldDefinitionTypeID { get; set; }
        [Unicode(false)]
        public string FieldDefinitionValue { get; set; }
    }
}
