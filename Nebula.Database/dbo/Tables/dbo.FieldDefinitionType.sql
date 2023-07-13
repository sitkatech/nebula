CREATE TABLE [dbo].[FieldDefinitionType] (
	[FieldDefinitionTypeID] [int] NOT NULL,
	[FieldDefinitionTypeName] [varchar](100) COLLATE SQL_Latin1_General_CP1_CI_AS NOT NULL,
	[FieldDefinitionTypeDisplayName] [varchar](100) COLLATE SQL_Latin1_General_CP1_CI_AS NOT NULL,
	CONSTRAINT [PK_FieldDefinitionType_FieldDefinitionTypeID] PRIMARY KEY CLUSTERED ([FieldDefinitionTypeID] ASC),
	CONSTRAINT [AK_FieldDefinitionType_FieldDefinitionTypeDisplayName] UNIQUE NONCLUSTERED ([FieldDefinitionTypeDisplayName] ASC),
	CONSTRAINT [AK_FieldDefinitionType_FieldDefinitionTypeName] UNIQUE NONCLUSTERED ([FieldDefinitionTypeName] ASC)
)
