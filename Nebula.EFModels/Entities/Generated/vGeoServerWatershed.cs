﻿using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;
using NetTopologySuite.Geometries;

namespace Nebula.EFModels.Entities
{
    [Keyless]
    public partial class vGeoServerWatershed
    {
        public int PrimaryKey { get; set; }
        public int WatershedID { get; set; }
        [Required]
        [StringLength(100)]
        [Unicode(false)]
        public string WatershedName { get; set; }
        [Required]
        [Column(TypeName = "geometry")]
        public Geometry WatershedGeometry4326 { get; set; }
    }
}
