CREATE TABLE [dbo].[CustomPage] (
	[CustomPageID] [int] IDENTITY(1,1) NOT NULL,
	[CustomPageDisplayName] [varchar](100) COLLATE SQL_Latin1_General_CP1_CI_AS NOT NULL,
	[CustomPageVanityUrl] [varchar](100) COLLATE SQL_Latin1_General_CP1_CI_AS NOT NULL,
	[CustomPageContent] [dbo].[html] NULL,
	[MenuItemID] [int] NOT NULL,
	[SortOrder] [int] NULL,
	CONSTRAINT [PK_CustomPage_CustomPageID] PRIMARY KEY CLUSTERED ([CustomPageID] ASC),
	CONSTRAINT [AK_CustomPage_CustomPageDisplayName] UNIQUE NONCLUSTERED ([CustomPageDisplayName] ASC),
	CONSTRAINT [AK_CustomPage_CustomPageVanityUrl] UNIQUE NONCLUSTERED ([CustomPageVanityUrl] ASC),
	CONSTRAINT [FK_CustomPage_MenuItem_MenuItemID] FOREIGN KEY([MenuItemID]) REFERENCES [dbo].[MenuItem] ([MenuItemID])
)