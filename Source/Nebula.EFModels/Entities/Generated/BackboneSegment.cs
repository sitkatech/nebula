using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;
using NetTopologySuite.Geometries;

#nullable disable

namespace Nebula.EFModels.Entities
{
    [Table("BackboneSegment")]
    public partial class BackboneSegment
    {
        public BackboneSegment()
        {
            InverseDownstreamBackboneSegment = new HashSet<BackboneSegment>();
        }

        [Key]
        public int BackboneSegmentID { get; set; }
        [Required]
        [Column(TypeName = "geometry")]
        public Geometry BackboneSegmentGeometry { get; set; }
        public int CatchIDN { get; set; }
        public int BackboneSegmentTypeID { get; set; }
        public int? DownstreamBackboneSegmentID { get; set; }
        public string StreamName { get; set; }
        [Column(TypeName = "geometry")]
        public Geometry BackboneSegmentGeometry4326 { get; set; }

        [ForeignKey(nameof(BackboneSegmentTypeID))]
        [InverseProperty("BackboneSegments")]
        public virtual BackboneSegmentType BackboneSegmentType { get; set; }
        [ForeignKey(nameof(DownstreamBackboneSegmentID))]
        [InverseProperty(nameof(BackboneSegment.InverseDownstreamBackboneSegment))]
        public virtual BackboneSegment DownstreamBackboneSegment { get; set; }
        [InverseProperty(nameof(BackboneSegment.DownstreamBackboneSegment))]
        public virtual ICollection<BackboneSegment> InverseDownstreamBackboneSegment { get; set; }
    }
}
