using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata;

#nullable disable

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
        public virtual DbSet<CustomRichText> CustomRichTexts { get; set; }
        public virtual DbSet<CustomRichTextType> CustomRichTextTypes { get; set; }
        public virtual DbSet<DatabaseMigration> DatabaseMigrations { get; set; }
        public virtual DbSet<FieldDefinition> FieldDefinitions { get; set; }
        public virtual DbSet<FieldDefinitionType> FieldDefinitionTypes { get; set; }
        public virtual DbSet<FileResource> FileResources { get; set; }
        public virtual DbSet<FileResourceMimeType> FileResourceMimeTypes { get; set; }
        public virtual DbSet<RegionalSubbasin> RegionalSubbasins { get; set; }
        public virtual DbSet<Role> Roles { get; set; }
        public virtual DbSet<User> Users { get; set; }
        public virtual DbSet<Watershed> Watersheds { get; set; }
        public virtual DbSet<vGeoServerBackbone> vGeoServerBackbones { get; set; }
        public virtual DbSet<vGeoServerRegionalSubbasin> vGeoServerRegionalSubbasins { get; set; }
        public virtual DbSet<vGeoServerWatershed> vGeoServerWatersheds { get; set; }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            
            {
#warning To protect potentially sensitive information in your connection string, you should move it out of source code. You can avoid scaffolding the connection string by using the Name= syntax to read it from configuration - see https://go.microsoft.com/fwlink/?linkid=2131148. For more guidance on storing connection strings, see http://go.microsoft.com/fwlink/?LinkId=723263.
                
            }
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.HasAnnotation("Relational:Collation", "SQL_Latin1_General_CP1_CI_AS");

            modelBuilder.Entity<BackboneSegment>(entity =>
            {
                entity.Property(e => e.StreamName).IsUnicode(false);

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

                entity.Property(e => e.BackboneSegmentTypeDisplayName).IsUnicode(false);

                entity.Property(e => e.BackboneSegmentTypeName).IsUnicode(false);
            });

            modelBuilder.Entity<CustomRichText>(entity =>
            {
                entity.Property(e => e.CustomRichTextContent).IsUnicode(false);

                entity.HasOne(d => d.CustomRichTextType)
                    .WithMany(p => p.CustomRichTexts)
                    .HasForeignKey(d => d.CustomRichTextTypeID)
                    .OnDelete(DeleteBehavior.ClientSetNull);
            });

            modelBuilder.Entity<CustomRichTextType>(entity =>
            {
                entity.Property(e => e.CustomRichTextTypeID).ValueGeneratedNever();

                entity.Property(e => e.CustomRichTextTypeDisplayName).IsUnicode(false);

                entity.Property(e => e.CustomRichTextTypeName).IsUnicode(false);
            });

            modelBuilder.Entity<DatabaseMigration>(entity =>
            {
                entity.HasKey(e => e.DatabaseMigrationNumber)
                    .HasName("PK_DatabaseMigration_DatabaseMigrationNumber");

                entity.Property(e => e.DatabaseMigrationNumber).ValueGeneratedNever();
            });

            modelBuilder.Entity<FieldDefinition>(entity =>
            {
                entity.Property(e => e.FieldDefinitionValue).IsUnicode(false);

                entity.HasOne(d => d.FieldDefinitionType)
                    .WithMany(p => p.FieldDefinitions)
                    .HasForeignKey(d => d.FieldDefinitionTypeID)
                    .OnDelete(DeleteBehavior.ClientSetNull);
            });

            modelBuilder.Entity<FieldDefinitionType>(entity =>
            {
                entity.Property(e => e.FieldDefinitionTypeID).ValueGeneratedNever();

                entity.Property(e => e.FieldDefinitionTypeDisplayName).IsUnicode(false);

                entity.Property(e => e.FieldDefinitionTypeName).IsUnicode(false);
            });

            modelBuilder.Entity<FileResource>(entity =>
            {
                entity.Property(e => e.OriginalBaseFilename).IsUnicode(false);

                entity.Property(e => e.OriginalFileExtension).IsUnicode(false);

                entity.HasOne(d => d.CreateUser)
                    .WithMany(p => p.FileResources)
                    .HasForeignKey(d => d.CreateUserID)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_FileResource_User_CreateUserID_UserID");

                entity.HasOne(d => d.FileResourceMimeType)
                    .WithMany(p => p.FileResources)
                    .HasForeignKey(d => d.FileResourceMimeTypeID)
                    .OnDelete(DeleteBehavior.ClientSetNull);
            });

            modelBuilder.Entity<FileResourceMimeType>(entity =>
            {
                entity.Property(e => e.FileResourceMimeTypeID).ValueGeneratedNever();

                entity.Property(e => e.FileResourceMimeTypeContentTypeName).IsUnicode(false);

                entity.Property(e => e.FileResourceMimeTypeDisplayName).IsUnicode(false);

                entity.Property(e => e.FileResourceMimeTypeIconNormalFilename).IsUnicode(false);

                entity.Property(e => e.FileResourceMimeTypeIconSmallFilename).IsUnicode(false);

                entity.Property(e => e.FileResourceMimeTypeName).IsUnicode(false);
            });

            modelBuilder.Entity<RegionalSubbasin>(entity =>
            {
                entity.Property(e => e.DrainID).IsUnicode(false);

                entity.Property(e => e.Watershed).IsUnicode(false);

                entity.HasOne(d => d.OCSurveyDownstreamCatchment)
                    .WithMany(p => p.InverseOCSurveyDownstreamCatchment)
                    .HasPrincipalKey(p => p.OCSurveyCatchmentID)
                    .HasForeignKey(d => d.OCSurveyDownstreamCatchmentID)
                    .HasConstraintName("FK_RegionalSubbasin_RegionalSubbasin_OCSurveyDownstreamCatchmentID_OCSurveyCatchmentID");
            });

            modelBuilder.Entity<Role>(entity =>
            {
                entity.Property(e => e.RoleID).ValueGeneratedNever();

                entity.Property(e => e.RoleDescription).IsUnicode(false);

                entity.Property(e => e.RoleDisplayName).IsUnicode(false);

                entity.Property(e => e.RoleName).IsUnicode(false);
            });

            modelBuilder.Entity<User>(entity =>
            {
                entity.Property(e => e.Company).IsUnicode(false);

                entity.Property(e => e.Email).IsUnicode(false);

                entity.Property(e => e.FirstName).IsUnicode(false);

                entity.Property(e => e.LastName).IsUnicode(false);

                entity.Property(e => e.LoginName).IsUnicode(false);

                entity.Property(e => e.Phone).IsUnicode(false);

                entity.HasOne(d => d.Role)
                    .WithMany(p => p.Users)
                    .HasForeignKey(d => d.RoleID)
                    .OnDelete(DeleteBehavior.ClientSetNull);
            });

            modelBuilder.Entity<Watershed>(entity =>
            {
                entity.Property(e => e.WatershedName).IsUnicode(false);
            });

            modelBuilder.Entity<vGeoServerBackbone>(entity =>
            {
                entity.ToView("vGeoServerBackbones");

                entity.Property(e => e.BackboneSegmentType).IsUnicode(false);

                entity.Property(e => e.StreamName).IsUnicode(false);
            });

            modelBuilder.Entity<vGeoServerRegionalSubbasin>(entity =>
            {
                entity.ToView("vGeoServerRegionalSubbasins");

                entity.Property(e => e.DrainID).IsUnicode(false);

                entity.Property(e => e.RegionalSubbasinID).ValueGeneratedOnAdd();

                entity.Property(e => e.Watershed).IsUnicode(false);
            });

            modelBuilder.Entity<vGeoServerWatershed>(entity =>
            {
                entity.ToView("vGeoServerWatersheds");

                entity.Property(e => e.WatershedName).IsUnicode(false);
            });

            OnModelCreatingPartial(modelBuilder);
        }

        partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
    }
}
