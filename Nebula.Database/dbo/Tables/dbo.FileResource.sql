CREATE TABLE [dbo].[FileResource] (
	[FileResourceID] [int] IDENTITY(1,1) NOT NULL,
	[FileResourceMimeTypeID] [int] NOT NULL,
	[OriginalBaseFilename] [varchar](255) COLLATE SQL_Latin1_General_CP1_CI_AS NOT NULL,
	[OriginalFileExtension] [varchar](255) COLLATE SQL_Latin1_General_CP1_CI_AS NOT NULL,
	[FileResourceGUID] [uniqueidentifier] NOT NULL,
	[FileResourceData] [varbinary](max) NOT NULL,
	[CreateUserID] [int] NOT NULL,
	[CreateDate] [datetime] NOT NULL,
	CONSTRAINT [PK_FileResource_FileResourceID] PRIMARY KEY CLUSTERED ([FileResourceID] ASC),
	CONSTRAINT [AK_FileResource_FileResourceGUID] UNIQUE NONCLUSTERED ([FileResourceGUID] ASC),
	CONSTRAINT [FK_FileResource_FileResourceMimeType_FileResourceMimeTypeID] FOREIGN KEY([FileResourceMimeTypeID]) REFERENCES [dbo].[FileResourceMimeType] ([FileResourceMimeTypeID]),
	 CONSTRAINT [FK_FileResource_User_CreateUserID_UserID] FOREIGN KEY([CreateUserID]) REFERENCES [dbo].[User] ([UserID])
)