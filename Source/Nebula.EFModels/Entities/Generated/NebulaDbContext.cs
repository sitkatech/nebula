﻿using System;
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

        public virtual DbSet<BackboneSegment> BackboneSegment { get; set; }
        public virtual DbSet<BackboneSegmentType> BackboneSegmentType { get; set; }
        public virtual DbSet<CustomRichText> CustomRichText { get; set; }
        public virtual DbSet<CustomRichTextType> CustomRichTextType { get; set; }
        public virtual DbSet<DatabaseMigration> DatabaseMigration { get; set; }
        public virtual DbSet<FieldDefinition> FieldDefinition { get; set; }
        public virtual DbSet<FieldDefinitionType> FieldDefinitionType { get; set; }
        public virtual DbSet<FileResource> FileResource { get; set; }
        public virtual DbSet<FileResourceMimeType> FileResourceMimeType { get; set; }
        public virtual DbSet<RegionalSubbasin> RegionalSubbasin { get; set; }
        public virtual DbSet<Role> Role { get; set; }
        public virtual DbSet<User> User { get; set; }
        public virtual DbSet<Watershed> Watershed { get; set; }
        public virtual DbSet<vGeoServerBackbones> vGeoServerBackbones { get; set; }
        public virtual DbSet<vGeoServerRegionalSubbasins> vGeoServerRegionalSubbasins { get; set; }
        public virtual DbSet<vGeoServerWatersheds> vGeoServerWatersheds { get; set; }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            
            {

                
            }
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<BackboneSegment>(entity =>
            {
                entity.Property(e => e.StreamName).IsUnicode(false);

                entity.HasOne(d => d.BackboneSegmentType)
                    .WithMany(p => p.BackboneSegment)
                    .HasForeignKey(d => d.BackboneSegmentTypeID)
                    .OnDelete(DeleteBehavior.ClientSetNull);

                entity.HasOne(d => d.DownstreamBackboneSegment)
                    .WithMany(p => p.InverseDownstreamBackboneSegment)
                    .HasForeignKey(d => d.DownstreamBackboneSegmentID)
                    .HasConstraintName("FK_BackboneSegment_BackboneSegment_DownstreamBackboneSegmentID_BackboneSegmentID");
            });

            modelBuilder.Entity<BackboneSegmentType>(entity =>
            {
                entity.HasIndex(e => e.BackboneSegmentTypeDisplayName)
                    .HasName("AK_BackboneSegmentType_BackboneSegmentTypeDisplayName")
                    .IsUnique();

                entity.HasIndex(e => e.BackboneSegmentTypeName)
                    .HasName("AK_BackboneSegmentType_BackboneSegmentTypeName")
                    .IsUnique();

                entity.Property(e => e.BackboneSegmentTypeID).ValueGeneratedNever();

                entity.Property(e => e.BackboneSegmentTypeDisplayName).IsUnicode(false);

                entity.Property(e => e.BackboneSegmentTypeName).IsUnicode(false);
            });

            modelBuilder.Entity<CustomRichText>(entity =>
            {
                entity.Property(e => e.CustomRichTextContent).IsUnicode(false);

                entity.HasOne(d => d.CustomRichTextType)
                    .WithMany(p => p.CustomRichText)
                    .HasForeignKey(d => d.CustomRichTextTypeID)
                    .OnDelete(DeleteBehavior.ClientSetNull);
            });

            modelBuilder.Entity<CustomRichTextType>(entity =>
            {
                entity.HasIndex(e => e.CustomRichTextTypeDisplayName)
                    .HasName("AK_CustomRichTextType_CustomRichTextTypeDisplayName")
                    .IsUnique();

                entity.HasIndex(e => e.CustomRichTextTypeName)
                    .HasName("AK_CustomRichTextType_CustomRichTextTypeName")
                    .IsUnique();

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
                    .WithMany(p => p.FieldDefinition)
                    .HasForeignKey(d => d.FieldDefinitionTypeID)
                    .OnDelete(DeleteBehavior.ClientSetNull);
            });

            modelBuilder.Entity<FieldDefinitionType>(entity =>
            {
                entity.HasIndex(e => e.FieldDefinitionTypeDisplayName)
                    .HasName("AK_FieldDefinitionType_FieldDefinitionTypeDisplayName")
                    .IsUnique();

                entity.HasIndex(e => e.FieldDefinitionTypeName)
                    .HasName("AK_FieldDefinitionType_FieldDefinitionTypeName")
                    .IsUnique();

                entity.Property(e => e.FieldDefinitionTypeID).ValueGeneratedNever();

                entity.Property(e => e.FieldDefinitionTypeDisplayName).IsUnicode(false);

                entity.Property(e => e.FieldDefinitionTypeName).IsUnicode(false);
            });

            modelBuilder.Entity<FileResource>(entity =>
            {
                entity.HasIndex(e => e.FileResourceGUID)
                    .HasName("AK_FileResource_FileResourceGUID")
                    .IsUnique();

                entity.Property(e => e.OriginalBaseFilename).IsUnicode(false);

                entity.Property(e => e.OriginalFileExtension).IsUnicode(false);

                entity.HasOne(d => d.CreateUser)
                    .WithMany(p => p.FileResource)
                    .HasForeignKey(d => d.CreateUserID)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_FileResource_User_CreateUserID_UserID");

                entity.HasOne(d => d.FileResourceMimeType)
                    .WithMany(p => p.FileResource)
                    .HasForeignKey(d => d.FileResourceMimeTypeID)
                    .OnDelete(DeleteBehavior.ClientSetNull);
            });

            modelBuilder.Entity<FileResourceMimeType>(entity =>
            {
                entity.HasIndex(e => e.FileResourceMimeTypeDisplayName)
                    .HasName("AK_FileResourceMimeType_FileResourceMimeTypeDisplayName")
                    .IsUnique();

                entity.HasIndex(e => e.FileResourceMimeTypeName)
                    .HasName("AK_FileResourceMimeType_FileResourceMimeTypeName")
                    .IsUnique();

                entity.Property(e => e.FileResourceMimeTypeID).ValueGeneratedNever();

                entity.Property(e => e.FileResourceMimeTypeContentTypeName).IsUnicode(false);

                entity.Property(e => e.FileResourceMimeTypeDisplayName).IsUnicode(false);

                entity.Property(e => e.FileResourceMimeTypeIconNormalFilename).IsUnicode(false);

                entity.Property(e => e.FileResourceMimeTypeIconSmallFilename).IsUnicode(false);

                entity.Property(e => e.FileResourceMimeTypeName).IsUnicode(false);
            });

            modelBuilder.Entity<RegionalSubbasin>(entity =>
            {
                entity.HasIndex(e => e.OCSurveyCatchmentID)
                    .HasName("AK_RegionalSubbasin_OCSurveyCatchmentID")
                    .IsUnique();

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
                entity.HasIndex(e => e.RoleDisplayName)
                    .HasName("AK_Role_RoleDisplayName")
                    .IsUnique();

                entity.HasIndex(e => e.RoleName)
                    .HasName("AK_Role_RoleName")
                    .IsUnique();

                entity.Property(e => e.RoleID).ValueGeneratedNever();

                entity.Property(e => e.RoleDescription).IsUnicode(false);

                entity.Property(e => e.RoleDisplayName).IsUnicode(false);

                entity.Property(e => e.RoleName).IsUnicode(false);
            });

            modelBuilder.Entity<User>(entity =>
            {
                entity.HasIndex(e => e.Email)
                    .HasName("AK_User_Email")
                    .IsUnique();

                entity.Property(e => e.Company).IsUnicode(false);

                entity.Property(e => e.Email).IsUnicode(false);

                entity.Property(e => e.FirstName).IsUnicode(false);

                entity.Property(e => e.LastName).IsUnicode(false);

                entity.Property(e => e.LoginName).IsUnicode(false);

                entity.Property(e => e.Phone).IsUnicode(false);

                entity.HasOne(d => d.Role)
                    .WithMany(p => p.User)
                    .HasForeignKey(d => d.RoleID)
                    .OnDelete(DeleteBehavior.ClientSetNull);
            });

            modelBuilder.Entity<Watershed>(entity =>
            {
                entity.Property(e => e.WatershedName).IsUnicode(false);
            });

            modelBuilder.Entity<vGeoServerBackbones>(entity =>
            {
                entity.HasNoKey();

                entity.ToView("vGeoServerBackbones");

                entity.Property(e => e.BackboneSegmentType).IsUnicode(false);

                entity.Property(e => e.StreamName).IsUnicode(false);
            });

            modelBuilder.Entity<vGeoServerRegionalSubbasins>(entity =>
            {
                entity.HasNoKey();

                entity.ToView("vGeoServerRegionalSubbasins");

                entity.Property(e => e.DrainID).IsUnicode(false);

                entity.Property(e => e.RegionalSubbasinID).ValueGeneratedOnAdd();

                entity.Property(e => e.Watershed).IsUnicode(false);
            });

            modelBuilder.Entity<vGeoServerWatersheds>(entity =>
            {
                entity.HasNoKey();

                entity.ToView("vGeoServerWatersheds");

                entity.Property(e => e.WatershedName).IsUnicode(false);
            });

            OnModelCreatingPartial(modelBuilder);
        }

        partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
    }
}
