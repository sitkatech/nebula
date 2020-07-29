insert into dbo.FieldDefinitionType(FieldDefinitionTypeID, FieldDefinitionTypeName, FieldDefinitionTypeDisplayName)
values (2, 'AggregationMode', 'Aggregation Mode'),
(3, 'TimeInterval', 'Time Interval'),
(4, 'IntervalMultiplier', 'Interval Multiplier')

insert into dbo.FieldDefinition (FieldDefinitionTypeID, FieldDefinitionValue)
select FieldDefinitionTypeID, 'Default definition for ' + FieldDefinitionTypeName
from dbo.FieldDefinitionType
where FieldDefinitionTypeID > 1
