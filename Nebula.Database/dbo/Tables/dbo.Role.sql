CREATE TABLE [dbo].[Role] (
	[RoleID] [int] NOT NULL,
	[RoleName] [varchar](100) COLLATE SQL_Latin1_General_CP1_CI_AS NOT NULL,
	[RoleDisplayName] [varchar](100) COLLATE SQL_Latin1_General_CP1_CI_AS NOT NULL,
	[RoleDescription] [varchar](255) COLLATE SQL_Latin1_General_CP1_CI_AS NULL,
	[SortOrder] [int] NOT NULL,
	CONSTRAINT [PK_Role_RoleID] PRIMARY KEY CLUSTERED ([RoleID] ASC),
	CONSTRAINT [AK_Role_RoleDisplayName] UNIQUE NONCLUSTERED ([RoleDisplayName] ASC),
	CONSTRAINT [AK_Role_RoleName] UNIQUE NONCLUSTERED ([RoleName] ASC)
)
