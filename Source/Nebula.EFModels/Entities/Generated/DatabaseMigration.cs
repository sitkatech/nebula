﻿using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Nebula.EFModels.Entities
{
    public partial class DatabaseMigration
    {
        [Key]
        public int DatabaseMigrationNumber { get; set; }
    }
}
