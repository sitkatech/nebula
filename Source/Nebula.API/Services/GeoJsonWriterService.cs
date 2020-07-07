using System.Collections.Generic;
using NetTopologySuite.Features;
using NetTopologySuite.IO;
using Newtonsoft.Json;

namespace Nebula.API.Services
{
    public static class GeoJsonWriterService
    {
        public static string buildFeatureCollectionAndWriteGeoJson(List<Feature> featureList)
        {
            var featureCollection = new FeatureCollection();

            foreach (var feature in featureList)
            {
                featureCollection.Add(feature);
            }

            var gjw = new GeoJsonWriter
            {
                SerializerSettings =
                {
                    NullValueHandling = NullValueHandling.Ignore,
                    FloatParseHandling = FloatParseHandling.Decimal,
                    Formatting = Formatting.Indented
                }
            };

            return gjw.Write(featureCollection);
        }
    }
}