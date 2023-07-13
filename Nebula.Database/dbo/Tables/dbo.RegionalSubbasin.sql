CREATE TABLE [dbo].[RegionalSubbasin] (
	[RegionalSubbasinID] [int] IDENTITY(1,1) NOT NULL,
	[DrainID] [varchar](10) COLLATE SQL_Latin1_General_CP1_CI_AS NULL,
	[Watershed] [varchar](100) COLLATE SQL_Latin1_General_CP1_CI_AS NULL,
	[CatchmentGeometry] [geometry] NOT NULL,
	[OCSurveyCatchmentID] [int] NOT NULL,
	[OCSurveyDownstreamCatchmentID] [int] NULL,
	[CatchmentGeometry4326] [geometry] NULL,
	[LastUpdate] [datetime] NULL,
	CONSTRAINT [PK_RegionalSubbasin_RegionalSubbasinID] PRIMARY KEY CLUSTERED ([RegionalSubbasinID] ASC),
	CONSTRAINT [AK_RegionalSubbasin_OCSurveyCatchmentID] UNIQUE NONCLUSTERED ([OCSurveyCatchmentID] ASC),
	CONSTRAINT [FK_RegionalSubbasin_RegionalSubbasin_OCSurveyDownstreamCatchmentID_OCSurveyCatchmentID] FOREIGN KEY ([OCSurveyDownstreamCatchmentID]) REFERENCES [dbo].[RegionalSubbasin] ([OCSurveyCatchmentID])
)