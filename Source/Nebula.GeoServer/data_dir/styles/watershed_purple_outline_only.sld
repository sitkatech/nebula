<?xml version="1.0" encoding="ISO-8859-1"?>
<StyledLayerDescriptor version="1.0.0"
  xsi:schemaLocation="http://www.opengis.net/sld http://schemas.opengis.net/sld/1.0.0/StyledLayerDescriptor.xsd"
  xmlns="http://www.opengis.net/sld" xmlns:ogc="http://www.opengis.net/ogc"
  xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">

    <NamedLayer>
        <Name>all_watersheds_purple_outline_only</Name>
        <UserStyle>
            <Title>Watershed With Purple Outline Only</Title>
            <FeatureTypeStyle>
                <Rule>
                    <Name>Border</Name>
                    <MaxScaleDenominator>2000000</MaxScaleDenominator>
                    <PolygonSymbolizer>
                        <Stroke>
                            <CssParameter name="stroke">#DFCCFA</CssParameter>
                            <CssParameter name="stroke-width">3</CssParameter>
                        </Stroke>
                    </PolygonSymbolizer>
                </Rule>
            </FeatureTypeStyle>
        </UserStyle>
    </NamedLayer>
</StyledLayerDescriptor>