CREATE TABLE [dbo].[CustomRichText](
	[CustomRichTextID] [int] IDENTITY(1,1) NOT NULL,
	[CustomRichTextTypeID] [int] NOT NULL,
	[CustomRichTextContent] [dbo].[html] NULL,
	CONSTRAINT [PK_CustomRichText_CustomRichTextID] PRIMARY KEY CLUSTERED ([CustomRichTextID] ASC),
	CONSTRAINT [FK_CustomRichText_CustomRichTextType_CustomRichTextTypeID] FOREIGN KEY ([CustomRichTextTypeID]) REFERENCES [dbo].[CustomRichTextType] ([CustomRichTextTypeID])
)