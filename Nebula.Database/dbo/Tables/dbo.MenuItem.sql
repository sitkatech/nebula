CREATE TABLE [dbo].[MenuItem] (
	[MenuItemID] [int] NOT NULL,
	[MenuItemName] [varchar](100) COLLATE SQL_Latin1_General_CP1_CI_AS NOT NULL,
	[MenuItemDisplayName] [varchar](100) COLLATE SQL_Latin1_General_CP1_CI_AS NOT NULL,
	CONSTRAINT [PK_MenuItem_MenuItemID] PRIMARY KEY CLUSTERED ([MenuItemID] ASC),
	CONSTRAINT [AK_MenuItem_MenuItemDisplayName] UNIQUE NONCLUSTERED ([MenuItemDisplayName] ASC),
	CONSTRAINT [AK_MenuItem_MenuItemName] UNIQUE NONCLUSTERED ([MenuItemName] ASC)
)
