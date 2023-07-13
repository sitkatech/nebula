CREATE TABLE [dbo].[FieldDefinition](
	[FieldDefinitionID] [int] IDENTITY(1,1) NOT NULL,
	[FieldDefinitionTypeID] [int] NOT NULL,
	[FieldDefinitionValue] [dbo].[html] NULL,
	CONSTRAINT [PK_FieldDefinition_FieldDefinitionID] PRIMARY KEY CLUSTERED ([FieldDefinitionID] ASC),
	CONSTRAINT [FK_FieldDefinition_FieldDefinitionType_FieldDefinitionTypeID] FOREIGN KEY ([FieldDefinitionTypeID]) REFERENCES [dbo].[FieldDefinitionType] ([FieldDefinitionTypeID])
)