using System;
using System.Text.Json;
using System.Text.Json.Serialization;

namespace Nebula.API.Converters
{
    public class DoubleConverter : JsonConverter<double>
    {
        private readonly int _numberOfSignificantDigits;

        public DoubleConverter(int numberOfSignificantDigits)
        {
            _numberOfSignificantDigits = numberOfSignificantDigits;
        }

        public DoubleConverter()
        {
            _numberOfSignificantDigits = 2;
        }

        public override bool CanConvert(Type objectType)
        {
            return objectType == typeof(double);
        }

        public override double Read(ref Utf8JsonReader reader, Type typeToConvert, JsonSerializerOptions options)
        {
            return reader.TokenType == JsonTokenType.String ? double.Parse(reader.GetString()) : reader.GetDouble();
        }

        public override void Write(Utf8JsonWriter writer, double value, JsonSerializerOptions options) => writer.WriteNumberValue(Math.Round(value, _numberOfSignificantDigits));
    }
}