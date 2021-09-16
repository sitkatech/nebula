insert into dbo.FieldDefinitionType(FieldDefinitionTypeID, FieldDefinitionTypeName, FieldDefinitionTypeDisplayName)
values (15, 'StationID', 'Station ID'),
(16, 'StationShortName', 'Short Name'),
(17, 'StationDescription', 'Description')

insert into dbo.FieldDefinition (FieldDefinitionTypeID, FieldDefinitionValue)
select FieldDefinitionTypeID, 'Default definition for ' + FieldDefinitionTypeName
from dbo.FieldDefinitionType
where FieldDefinitionTypeID > 14

update dbo.FieldDefinitionType
set FieldDefinitionTypeName = 'AggregationMethod',
FieldDefinitionTypeDisplayName = 'Aggregation Method'
where FieldDefinitionTypeID = 2

update dbo.FieldDefinitionType
set FieldDefinitionTypeName = 'WeatherCondition',
FieldDefinitionTypeDisplayName = 'Weather Condition'
where FieldDefinitionTypeID = 4