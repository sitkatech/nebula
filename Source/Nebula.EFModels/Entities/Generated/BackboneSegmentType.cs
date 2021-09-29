using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

#nullable disable

namespace Nebula.EFModels.Entities
{
    [Table("BackboneSegmentType")]
    [Index(nameof(BackboneSegmentTypeDisplayName), Name = "AK_BackboneSegmentType_BackboneSegmentTypeDisplayName", IsUnique = true)]
    [Index(nameof(BackboneSegmentTypeName), Name = "AK_BackboneSegmentType_BackboneSegmentTypeName", IsUnique = true)]
    public partial class BackboneSegmentType
    {
        public BackboneSegmentType()
        {
            BackboneSegments = new HashSet<BackboneSegment>();
        }

        [Key]
        public int BackboneSegmentTypeID { get; set; }
        [Required]
        [StringLength(20)]
        public string BackboneSegmentTypeName { get; set; }
        [Required]
        [StringLength(20)]
        public string BackboneSegmentTypeDisplayName { get; set; }

        [InverseProperty(nameof(BackboneSegment.BackboneSegmentType))]
        public virtual ICollection<BackboneSegment> BackboneSegments { get; set; }
    }
}
