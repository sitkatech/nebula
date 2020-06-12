MERGE INTO dbo.FieldDefinitionType AS Target
USING (VALUES
(1, 'Name', 'Name')
)
AS Source (FieldDefinitionTypeID, FieldDefinitionTypeName, FieldDefinitionTypeDisplayName)
ON Target.FieldDefinitionTypeID = Source.FieldDefinitionTypeID
WHEN MATCHED THEN
UPDATE SET
	FieldDefinitionTypeName = Source.FieldDefinitionTypeName,
	FieldDefinitionTypeDisplayName = Source.FieldDefinitionTypeDisplayName
WHEN NOT MATCHED BY TARGET THEN
	INSERT (FieldDefinitionTypeID, FieldDefinitionTypeName, FieldDefinitionTypeDisplayName)
	VALUES (FieldDefinitionTypeID, FieldDefinitionTypeName, FieldDefinitionTypeDisplayName)
WHEN NOT MATCHED BY SOURCE THEN
	DELETE;
