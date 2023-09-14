CREATE TABLE [dbo].[CustomRichTextType](
	[CustomRichTextTypeID] [int] NOT NULL,
	[CustomRichTextTypeName] [varchar](100) COLLATE SQL_Latin1_General_CP1_CI_AS NOT NULL,
	[CustomRichTextTypeDisplayName] [varchar](100) COLLATE SQL_Latin1_General_CP1_CI_AS NOT NULL,
	CONSTRAINT [PK_CustomRichTextType_CustomRichTextTypeID] PRIMARY KEY CLUSTERED ([CustomRichTextTypeID] ASC),
	CONSTRAINT [AK_CustomRichTextType_CustomRichTextTypeDisplayName] UNIQUE NONCLUSTERED ([CustomRichTextTypeDisplayName] ASC),
	CONSTRAINT [AK_CustomRichTextType_CustomRichTextTypeName] UNIQUE NONCLUSTERED ([CustomRichTextTypeName] ASC)
)
