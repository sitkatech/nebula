CREATE TABLE [dbo].[BackboneSegmentType] (
	[BackboneSegmentTypeID] [int] NOT NULL,
	[BackboneSegmentTypeName] [varchar](20) COLLATE SQL_Latin1_General_CP1_CI_AS NOT NULL,
	[BackboneSegmentTypeDisplayName] [varchar](20) COLLATE SQL_Latin1_General_CP1_CI_AS NOT NULL,
	CONSTRAINT [PK_BackboneSegmentType_BackboneSegmentTypeID] PRIMARY KEY CLUSTERED ([BackboneSegmentTypeID] ASC),
	CONSTRAINT [AK_BackboneSegmentType_BackboneSegmentTypeDisplayName] UNIQUE NONCLUSTERED ([BackboneSegmentTypeDisplayName] ASC),
	CONSTRAINT [AK_BackboneSegmentType_BackboneSegmentTypeName] UNIQUE NONCLUSTERED ([BackboneSegmentTypeName] ASC)
)
