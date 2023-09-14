CREATE TABLE [dbo].[Watershed] (
	[WatershedID] [int] IDENTITY(1,1) NOT NULL,
	[WatershedName] [varchar](100) COLLATE SQL_Latin1_General_CP1_CI_AS NOT NULL,
	[WatershedGeometry] [geometry] NOT NULL,
	[WatershedGeometry4326] [geometry] NOT NULL,
	CONSTRAINT [PK_Watershed_WatershedID] PRIMARY KEY CLUSTERED ([WatershedID] ASC)
)
