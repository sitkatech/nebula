MERGE INTO dbo.CustomRichTextType AS Target
USING (VALUES
(1, 'Platform Overview', 'Platform Overview'),
(2, 'Disclaimer', 'Disclaimer'),
(3, 'Home page', 'Home page'),
(4, 'Help', 'Help'),
(5, 'LabelsAndDefinitionsList', 'Labels and Definitions List'),
(6, 'WatershedList', 'Watershed List'),
(7, 'TimeSeriesAnalysis', 'Time Series Analysis'),
(8, 'PairedRegressionAnalysis', 'Paired Regression Analysis'),
(9, 'DiversionScenario', 'Diversion Scenario'),
(10, 'CustomPages', 'Custom Pages')
)
AS Source (CustomRichTextTypeID, CustomRichTextTypeName, CustomRichTextTypeDisplayName)
ON Target.CustomRichTextTypeID = Source.CustomRichTextTypeID
WHEN MATCHED THEN
UPDATE SET
	CustomRichTextTypeName = Source.CustomRichTextTypeName,
	CustomRichTextTypeDisplayName = Source.CustomRichTextTypeDisplayName
WHEN NOT MATCHED BY TARGET THEN
	INSERT (CustomRichTextTypeID, CustomRichTextTypeName, CustomRichTextTypeDisplayName)
	VALUES (CustomRichTextTypeID, CustomRichTextTypeName, CustomRichTextTypeDisplayName)
WHEN NOT MATCHED BY SOURCE THEN
	DELETE;
