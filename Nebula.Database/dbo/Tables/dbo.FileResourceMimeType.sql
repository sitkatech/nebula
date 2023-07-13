CREATE TABLE [dbo].[FileResourceMimeType](
	[FileResourceMimeTypeID] [int] NOT NULL,
	[FileResourceMimeTypeName] [varchar](100) COLLATE SQL_Latin1_General_CP1_CI_AS NOT NULL,
	[FileResourceMimeTypeDisplayName] [varchar](100) COLLATE SQL_Latin1_General_CP1_CI_AS NOT NULL,
	[FileResourceMimeTypeContentTypeName] [varchar](100) COLLATE SQL_Latin1_General_CP1_CI_AS NOT NULL,
	[FileResourceMimeTypeIconSmallFilename] [varchar](100) COLLATE SQL_Latin1_General_CP1_CI_AS NULL,
	[FileResourceMimeTypeIconNormalFilename] [varchar](100) COLLATE SQL_Latin1_General_CP1_CI_AS NULL,
	CONSTRAINT [PK_FileResourceMimeType_FileResourceMimeTypeID] PRIMARY KEY CLUSTERED ([FileResourceMimeTypeID] ASC),
	CONSTRAINT [AK_FileResourceMimeType_FileResourceMimeTypeDisplayName] UNIQUE NONCLUSTERED ([FileResourceMimeTypeDisplayName] ASC),
	CONSTRAINT [AK_FileResourceMimeType_FileResourceMimeTypeName] UNIQUE NONCLUSTERED ([FileResourceMimeTypeName] ASC)
)
