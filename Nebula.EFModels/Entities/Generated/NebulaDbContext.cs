using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata;

namespace Nebula.EFModels.Entities
{
    public partial class NebulaDbContext : DbContext
    {
        public NebulaDbContext()
        {
        }

        public NebulaDbContext(DbContextOptions<NebulaDbContext> options)
            : base(options)
        {
        }

        public virtual DbSet<BackboneSegment> BackboneSegments { get; set; }
        public virtual DbSet<BackboneSegmentType> BackboneSegmentTypes { get; set; }
        public virtual DbSet<CustomPage> CustomPages { get; set; }
        public virtual DbSet<CustomPageRole> CustomPageRoles { get; set; }
        public virtual DbSet<CustomRichText> CustomRichTexts { get; set; }
        public virtual DbSet<FieldDefinition> FieldDefinitions { get; set; }
        public virtual DbSet<RegionalSubbasin> RegionalSubbasins { get; set; }
        public virtual DbSet<User> Users { get; set; }
        public virtual DbSet<Watershed> Watersheds { get; set; }
        public virtual DbSet<vGeoServerBackbone> vGeoServerBackbones { get; set; }
        public virtual DbSet<vGeoServerRegionalSubbasin> vGeoServerRegionalSubbasins { get; set; }
        public virtual DbSet<vGeoServerWatershed> vGeoServerWatersheds { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<BackboneSegment>(entity =>
            {
                entity.HasOne(d => d.BackboneSegmentType)
                    .WithMany(p => p.BackboneSegments)
                    .HasForeignKey(d => d.BackboneSegmentTypeID)
                    .OnDelete(DeleteBehavior.ClientSetNull);

                entity.HasOne(d => d.DownstreamBackboneSegment)
                    .WithMany(p => p.InverseDownstreamBackboneSegment)
                    .HasForeignKey(d => d.DownstreamBackboneSegmentID)
                    .HasConstraintName("FK_BackboneSegment_BackboneSegment_DownstreamBackboneSegmentID_BackboneSegmentID");
            });

            modelBuilder.Entity<BackboneSegmentType>(entity =>
            {
                entity.Property(e => e.BackboneSegmentTypeID).ValueGeneratedNever();
            });

            modelBuilder.Entity<CustomPageRole>(entity =>
            {
                entity.HasOne(d => d.CustomPage)
                    .WithMany(p => p.CustomPageRoles)
                    .HasForeignKey(d => d.CustomPageID)
                    .OnDelete(DeleteBehavior.ClientSetNull);
            });

            modelBuilder.Entity<RegionalSubbasin>(entity =>
            {
                entity.HasOne(d => d.OCSurveyDownstreamCatchment)
                    .WithMany(p => p.InverseOCSurveyDownstreamCatchment)
                    .HasPrincipalKey(p => p.OCSurveyCatchmentID)
                    .HasForeignKey(d => d.OCSurveyDownstreamCatchmentID)
                    .HasConstraintName("FK_RegionalSubbasin_RegionalSubbasin_OCSurveyDownstreamCatchmentID_OCSurveyCatchmentID");
            });

            modelBuilder.Entity<vGeoServerBackbone>(entity =>
            {
                entity.ToView("vGeoServerBackbones");
            });

            modelBuilder.Entity<vGeoServerRegionalSubbasin>(entity =>
            {
                entity.ToView("vGeoServerRegionalSubbasins");

                entity.Property(e => e.RegionalSubbasinID).ValueGeneratedOnAdd();
            });

            modelBuilder.Entity<vGeoServerWatershed>(entity =>
            {
                entity.ToView("vGeoServerWatersheds");
            });

            OnModelCreatingPartial(modelBuilder);
        }

        partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
    }
}
