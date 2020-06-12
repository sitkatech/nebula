using System;
using System.Collections.Generic;
using System.Text;

namespace Nebula.Models.DataTransferObjects
{
    public class FieldDefinitionDto
    {
        public int FieldDefinitionTypeID { get; set; }
        public string DisplayName { get; set; }
        public string? Definition { get; set; }
    }
}
