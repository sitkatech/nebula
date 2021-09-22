insert into dbo.FieldDefinitionType(FieldDefinitionTypeID, FieldDefinitionTypeName, FieldDefinitionTypeDisplayName)
values (18, 'RainfallEventShutdown', 'Shutdown Diversion During Rain Events'),
(19, 'RainfallEventDepthThreshold', 'Rainfall Event Depth Threshold (inches)'),
(20, 'EventSeperationTime', 'Event Separation Time (hours)'),
(21, 'AfterRainDelay', 'Resume Diversion After Delay (hours)') 

insert into dbo.FieldDefinition (FieldDefinitionTypeID, FieldDefinitionValue)
select FieldDefinitionTypeID, 'Default definition for ' + FieldDefinitionTypeName
from dbo.FieldDefinitionType
where FieldDefinitionTypeID > 17