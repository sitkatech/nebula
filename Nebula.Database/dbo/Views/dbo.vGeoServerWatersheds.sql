create view dbo.vGeoServerWatersheds
as

select  w.WatershedID as PrimaryKey,
        w.WatershedID,
        w.WatershedName,
        w.WatershedGeometry4326
                
FROM    dbo.Watershed w
where	w.WatershedGeometry4326 is not null


GO
/*
select * from dbo.vGeoServerWatersheds
*/