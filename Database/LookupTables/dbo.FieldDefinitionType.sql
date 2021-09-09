MERGE INTO dbo.FieldDefinitionType AS Target
USING (VALUES
(1, 'Name', 'Name'),
(2, 'AggregationMode', 'Aggregation Mode'),
(3, 'TimeInterval', 'Time Interval'),
(4, 'Filter', 'Filter'),
(5, 'RegressionMethod', 'Regression Method'),
(6, 'DiversionRate', 'Diversion Rate (cfs)'),
(7, 'StorageMaxDepth', 'Storage Max Depth (ft)'),
(8, 'StorageInitialDepth', 'Storage Initial Depth (ft)'),
(9, 'StorageArea', 'Storage Area (sqft)'),
(10, 'InfiltrationRate', 'Infiltration Rate (in/hr)'),
(11, 'MonthsActive', 'Months Active'),
(12, 'WeekdaysActive', 'Weekdays Active'),
(13, 'HoursActive', 'Hours Active'),
(14, 'NearestRainfallStation', 'Nearest Rainfall Station')
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
