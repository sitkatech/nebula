using System;
using System.Text.Json;
using System.Text.Json.Serialization;

namespace Nebula.API.Converters
{
    public class BooleanConverter : JsonConverter<bool>
    {
        public override bool Read(ref Utf8JsonReader reader, Type typeToConvert, JsonSerializerOptions options)
        {
            switch (reader.TokenType)
            {
                case JsonTokenType.String:
                    var value = reader.GetString();
                    var chkValue = value.ToLower();
                    if (chkValue.Equals("true") || chkValue.Equals("yes") || chkValue.Equals("1"))
                    {
                        return true;
                    }
                    if (value.ToLower().Equals("false") || chkValue.Equals("no") || chkValue.Equals("0"))
                    {
                        return false;
                    }
                    throw new JsonException($"No converter defined for string: {value} to bool!");
                case JsonTokenType.Number:
                    var intValue = reader.GetInt32();
                    return intValue == 1;
                case JsonTokenType.True:
                    return true;
                case JsonTokenType.False:
                    return false;
                default:
                    throw new ArgumentOutOfRangeException(
                        $"No converter defined for TokenType: {reader.TokenType} to bool!");
            }
        }

        public override void Write(Utf8JsonWriter writer, bool value, JsonSerializerOptions options)
        {
            switch (value)
            {
                case true:
                    writer.WriteBooleanValue(true);
                    break;
                case false:
                    writer.WriteBooleanValue(false);
                    break;
            }
        }
    }
}