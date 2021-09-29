Drop View If Exists dbo.vGeoServerBackbones
Go

Create View dbo.vGeoServerBackbones
as
Select	BackboneSegmentID,
		CatchIDN,
		b.BackboneSegmentTypeID,
		DownstreamBackboneSegmentID,
		StreamName,
		BackboneSegmentGeometry4326 as BackboneSegmentGeometry,
		t.BackboneSegmentTypeName as BackboneSegmentType
From	dbo.BackboneSegment b 
join	dbo.BackboneSegmentType t on b.BackboneSegmentTypeID = t.BackboneSegmentTypeID

