CREATE TABLE [dbo].[BackboneSegment](
	[BackboneSegmentID] [int] IDENTITY(1,1) NOT NULL,
	[BackboneSegmentGeometry] [geometry] NOT NULL,
	[CatchIDN] [int] NOT NULL,
	[BackboneSegmentTypeID] [int] NOT NULL,
	[DownstreamBackboneSegmentID] [int] NULL,
	[StreamName] [varchar](max) COLLATE SQL_Latin1_General_CP1_CI_AS NULL,
	[BackboneSegmentGeometry4326] [geometry] NULL,
	CONSTRAINT [PK_BackboneSegment_BackboneSegmentID] PRIMARY KEY CLUSTERED ([BackboneSegmentID] ASC),
	CONSTRAINT [FK_BackboneSegment_BackboneSegment_DownstreamBackboneSegmentID_BackboneSegmentID] FOREIGN KEY ([DownstreamBackboneSegmentID]) REFERENCES [dbo].[BackboneSegment] ([BackboneSegmentID]),
	CONSTRAINT [FK_BackboneSegment_BackboneSegmentType_BackboneSegmentTypeID] FOREIGN KEY ([BackboneSegmentTypeID]) REFERENCES [dbo].[BackboneSegmentType] ([BackboneSegmentTypeID])
)