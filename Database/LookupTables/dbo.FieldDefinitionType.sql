MERGE INTO dbo.FieldDefinitionType AS Target
USING (VALUES
(1, 'Name', 'Name'),
(2, 'AggregationMethod', 'Aggregation Method'),
(3, 'TimeInterval', 'Time Interval'),
(4, 'WeatherCondition', 'Weather Condition'),
(5, 'RegressionMethod', 'Regression Method'),
(6, 'DiversionRate', 'Diversion Rate (cfs)'),
(7, 'StorageMaxDepth', 'Storage Max Depth (ft)'),
(8, 'StorageInitialDepth', 'Storage Initial Depth (ft)'),
(9, 'StorageArea', 'Storage Area (sqft)'),
(10, 'InfiltrationRate', 'Infiltration Rate (in/hr)'),
(11, 'MonthsActive', 'Months Active'),
(12, 'WeekdaysActive', 'Weekdays Active'),
(13, 'HoursActive', 'Hours Active'),
(14, 'NearestRainfallStation', 'Nearest Rainfall Station'),
(15, 'StationID', 'Station ID'),
(16, 'StationShortName', 'Short Name'),
(17, 'StationDescription', 'Description'),
(18, 'RainfallEventShutdown', 'Shutdown Diversion During Rain Events'),
(19, 'RainfallEventDepthThreshold', 'Rainfall Event Depth Threshold (inches)'),
(20, 'EventSeperationTime', 'Event Separation Time (hours)'),
(21, 'AfterRainDelay', 'Resume Diversion After Delay (hours)') 
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
