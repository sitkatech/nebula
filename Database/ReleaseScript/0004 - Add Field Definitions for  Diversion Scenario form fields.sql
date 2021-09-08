insert into dbo.FieldDefinitionType(FieldDefinitionTypeID, FieldDefinitionTypeName, FieldDefinitionTypeDisplayName)
values (6, 'DiversionRate', 'Diversion Rate (cfs)'),
(7, 'StorageMaxDepth', 'Storage Max Depth (cfs)'),
(8, 'StorageInitialDepth', 'Storage Initial Depth (ft)'),
(9, 'StorageArea', 'Storage Area (sqft)'),
(10, 'InfiltrationRate', 'Infiltration Rate (in/hr)'),
(11, 'MonthsActive', 'Months Active'),
(12, 'WeekdaysActive', 'Weekdays Active'),
(13, 'HoursActive', 'Hours Active')

insert into dbo.FieldDefinition (FieldDefinitionTypeID, FieldDefinitionValue)
select FieldDefinitionTypeID, 'Default definition for ' + FieldDefinitionTypeName
from dbo.FieldDefinitionType
where FieldDefinitionTypeID > 5