update dbo.CustomRichTextType
set CustomRichTextTypeName='MultiVariableMultiSite',
CustomRichTextTypeDisplayName='Multi-Variable Multi-Site'
where CustomRichTextTypeID=7

update dbo.CustomRichText
set CustomRichTextContent = 'Multi-Variable Multi-Site Default Content'
where CustomRichTextTypeID = 7

update dbo.FieldDefinitionType
set FieldDefinitionTypeName = 'Filter',
FieldDefinitionTypeDisplayName = 'Filter'
where FieldDefinitionTypeID = 4

update dbo.FieldDefinition
set FieldDefinitionValue = 'Default definition for Filter'
where FieldDefinitionTypeID = 4