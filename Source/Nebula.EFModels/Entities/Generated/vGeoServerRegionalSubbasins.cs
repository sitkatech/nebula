using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using NetTopologySuite.Geometries;

namespace Nebula.EFModels.Entities
{
    public partial class vGeoServerRegionalSubbasins
    {
        public int RegionalSubbasinID { get; set; }
        public int OCSurveyCatchmentID { get; set; }
        public int? OCSurveyDownstreamCatchmentID { get; set; }
        [StringLength(10)]
        public string DrainID { get; set; }
        [StringLength(100)]
        public string Watershed { get; set; }
        [Column(TypeName = "geometry")]
        public Geometry CatchmentGeometry { get; set; }
        public double? Area { get; set; }
    }
}
