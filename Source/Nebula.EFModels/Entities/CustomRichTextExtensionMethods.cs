using Nebula.Models.DataTransferObjects;

namespace Nebula.EFModels.Entities
{
    public static class CustomRichTextExtensionMethods
    {
        public static CustomRichTextDto AsDto(this CustomRichText customRichText)
        {
            return new CustomRichTextDto
            {
                CustomRichTextContent = customRichText.CustomRichTextContent,
                IsEmptyContent = string.IsNullOrWhiteSpace(customRichText.CustomRichTextContent)
            };
        }
    }
}