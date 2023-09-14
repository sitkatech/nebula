CREATE TABLE [dbo].[CustomPageRole](
	[CustomPageRoleID] [int] IDENTITY(1,1) NOT NULL,
	[CustomPageID] [int] NOT NULL,
	[RoleID] [int] NOT NULL,
	CONSTRAINT [PK_CustomPageRole_CustomPageRoleID] PRIMARY KEY CLUSTERED ([CustomPageRoleID] ASC),
	CONSTRAINT [FK_CustomPageRole_CustomPage_CustomPageID] FOREIGN KEY ([CustomPageID]) REFERENCES [dbo].[CustomPage] ([CustomPageID]),
	CONSTRAINT [FK_CustomPageRole_Role_RoleID] FOREIGN KEY ([RoleID]) REFERENCES [dbo].[Role] ([RoleID])
)