//  IMPORTANT:
//  This file is generated. Your changes will be lost.
//  Use the corresponding partial class for customizations.
//  Source Table: [dbo].[CustomRichTextType]
using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using Nebula.Models.DataTransferObjects;


namespace Nebula.EFModels.Entities
{
    public abstract partial class CustomRichTextType
    {
        public static readonly CustomRichTextTypePlatformOverview PlatformOverview = Nebula.EFModels.Entities.CustomRichTextTypePlatformOverview.Instance;
        public static readonly CustomRichTextTypeDisclaimer Disclaimer = Nebula.EFModels.Entities.CustomRichTextTypeDisclaimer.Instance;
        public static readonly CustomRichTextTypeHomepage Homepage = Nebula.EFModels.Entities.CustomRichTextTypeHomepage.Instance;
        public static readonly CustomRichTextTypeHelp Help = Nebula.EFModels.Entities.CustomRichTextTypeHelp.Instance;
        public static readonly CustomRichTextTypeLabelsAndDefinitionsList LabelsAndDefinitionsList = Nebula.EFModels.Entities.CustomRichTextTypeLabelsAndDefinitionsList.Instance;
        public static readonly CustomRichTextTypeWatershedList WatershedList = Nebula.EFModels.Entities.CustomRichTextTypeWatershedList.Instance;
        public static readonly CustomRichTextTypeTimeSeriesAnalysis TimeSeriesAnalysis = Nebula.EFModels.Entities.CustomRichTextTypeTimeSeriesAnalysis.Instance;
        public static readonly CustomRichTextTypePairedRegressionAnalysis PairedRegressionAnalysis = Nebula.EFModels.Entities.CustomRichTextTypePairedRegressionAnalysis.Instance;
        public static readonly CustomRichTextTypeDiversionScenario DiversionScenario = Nebula.EFModels.Entities.CustomRichTextTypeDiversionScenario.Instance;
        public static readonly CustomRichTextTypeCustomPages CustomPages = Nebula.EFModels.Entities.CustomRichTextTypeCustomPages.Instance;

        public static readonly List<CustomRichTextType> All;
        public static readonly List<CustomRichTextTypeDto> AllAsDto;
        public static readonly ReadOnlyDictionary<int, CustomRichTextType> AllLookupDictionary;
        public static readonly ReadOnlyDictionary<int, CustomRichTextTypeDto> AllAsDtoLookupDictionary;

        /// <summary>
        /// Static type constructor to coordinate static initialization order
        /// </summary>
        static CustomRichTextType()
        {
            All = new List<CustomRichTextType> { PlatformOverview, Disclaimer, Homepage, Help, LabelsAndDefinitionsList, WatershedList, TimeSeriesAnalysis, PairedRegressionAnalysis, DiversionScenario, CustomPages };
            AllAsDto = new List<CustomRichTextTypeDto> { PlatformOverview.AsDto(), Disclaimer.AsDto(), Homepage.AsDto(), Help.AsDto(), LabelsAndDefinitionsList.AsDto(), WatershedList.AsDto(), TimeSeriesAnalysis.AsDto(), PairedRegressionAnalysis.AsDto(), DiversionScenario.AsDto(), CustomPages.AsDto() };
            AllLookupDictionary = new ReadOnlyDictionary<int, CustomRichTextType>(All.ToDictionary(x => x.CustomRichTextTypeID));
            AllAsDtoLookupDictionary = new ReadOnlyDictionary<int, CustomRichTextTypeDto>(AllAsDto.ToDictionary(x => x.CustomRichTextTypeID));
        }

        /// <summary>
        /// Protected constructor only for use in instantiating the set of static lookup values that match database
        /// </summary>
        protected CustomRichTextType(int customRichTextTypeID, string customRichTextTypeName, string customRichTextTypeDisplayName)
        {
            CustomRichTextTypeID = customRichTextTypeID;
            CustomRichTextTypeName = customRichTextTypeName;
            CustomRichTextTypeDisplayName = customRichTextTypeDisplayName;
        }

        [Key]
        public int CustomRichTextTypeID { get; private set; }
        public string CustomRichTextTypeName { get; private set; }
        public string CustomRichTextTypeDisplayName { get; private set; }
        [NotMapped]
        public int PrimaryKey { get { return CustomRichTextTypeID; } }

        /// <summary>
        /// Enum types are equal by primary key
        /// </summary>
        public bool Equals(CustomRichTextType other)
        {
            if (other == null)
            {
                return false;
            }
            return other.CustomRichTextTypeID == CustomRichTextTypeID;
        }

        /// <summary>
        /// Enum types are equal by primary key
        /// </summary>
        public override bool Equals(object obj)
        {
            return Equals(obj as CustomRichTextType);
        }

        /// <summary>
        /// Enum types are equal by primary key
        /// </summary>
        public override int GetHashCode()
        {
            return CustomRichTextTypeID;
        }

        public static bool operator ==(CustomRichTextType left, CustomRichTextType right)
        {
            return Equals(left, right);
        }

        public static bool operator !=(CustomRichTextType left, CustomRichTextType right)
        {
            return !Equals(left, right);
        }

        public CustomRichTextTypeEnum ToEnum => (CustomRichTextTypeEnum)GetHashCode();

        public static CustomRichTextType ToType(int enumValue)
        {
            return ToType((CustomRichTextTypeEnum)enumValue);
        }

        public static CustomRichTextType ToType(CustomRichTextTypeEnum enumValue)
        {
            switch (enumValue)
            {
                case CustomRichTextTypeEnum.CustomPages:
                    return CustomPages;
                case CustomRichTextTypeEnum.Disclaimer:
                    return Disclaimer;
                case CustomRichTextTypeEnum.DiversionScenario:
                    return DiversionScenario;
                case CustomRichTextTypeEnum.Help:
                    return Help;
                case CustomRichTextTypeEnum.Homepage:
                    return Homepage;
                case CustomRichTextTypeEnum.LabelsAndDefinitionsList:
                    return LabelsAndDefinitionsList;
                case CustomRichTextTypeEnum.PairedRegressionAnalysis:
                    return PairedRegressionAnalysis;
                case CustomRichTextTypeEnum.PlatformOverview:
                    return PlatformOverview;
                case CustomRichTextTypeEnum.TimeSeriesAnalysis:
                    return TimeSeriesAnalysis;
                case CustomRichTextTypeEnum.WatershedList:
                    return WatershedList;
                default:
                    throw new ArgumentException("Unable to map Enum: {enumValue}");
            }
        }
    }

    public enum CustomRichTextTypeEnum
    {
        PlatformOverview = 1,
        Disclaimer = 2,
        Homepage = 3,
        Help = 4,
        LabelsAndDefinitionsList = 5,
        WatershedList = 6,
        TimeSeriesAnalysis = 7,
        PairedRegressionAnalysis = 8,
        DiversionScenario = 9,
        CustomPages = 10
    }

    public partial class CustomRichTextTypePlatformOverview : CustomRichTextType
    {
        private CustomRichTextTypePlatformOverview(int customRichTextTypeID, string customRichTextTypeName, string customRichTextTypeDisplayName) : base(customRichTextTypeID, customRichTextTypeName, customRichTextTypeDisplayName) {}
        public static readonly CustomRichTextTypePlatformOverview Instance = new CustomRichTextTypePlatformOverview(1, @"Platform Overview", @"Platform Overview");
    }

    public partial class CustomRichTextTypeDisclaimer : CustomRichTextType
    {
        private CustomRichTextTypeDisclaimer(int customRichTextTypeID, string customRichTextTypeName, string customRichTextTypeDisplayName) : base(customRichTextTypeID, customRichTextTypeName, customRichTextTypeDisplayName) {}
        public static readonly CustomRichTextTypeDisclaimer Instance = new CustomRichTextTypeDisclaimer(2, @"Disclaimer", @"Disclaimer");
    }

    public partial class CustomRichTextTypeHomepage : CustomRichTextType
    {
        private CustomRichTextTypeHomepage(int customRichTextTypeID, string customRichTextTypeName, string customRichTextTypeDisplayName) : base(customRichTextTypeID, customRichTextTypeName, customRichTextTypeDisplayName) {}
        public static readonly CustomRichTextTypeHomepage Instance = new CustomRichTextTypeHomepage(3, @"Home page", @"Home page");
    }

    public partial class CustomRichTextTypeHelp : CustomRichTextType
    {
        private CustomRichTextTypeHelp(int customRichTextTypeID, string customRichTextTypeName, string customRichTextTypeDisplayName) : base(customRichTextTypeID, customRichTextTypeName, customRichTextTypeDisplayName) {}
        public static readonly CustomRichTextTypeHelp Instance = new CustomRichTextTypeHelp(4, @"Help", @"Help");
    }

    public partial class CustomRichTextTypeLabelsAndDefinitionsList : CustomRichTextType
    {
        private CustomRichTextTypeLabelsAndDefinitionsList(int customRichTextTypeID, string customRichTextTypeName, string customRichTextTypeDisplayName) : base(customRichTextTypeID, customRichTextTypeName, customRichTextTypeDisplayName) {}
        public static readonly CustomRichTextTypeLabelsAndDefinitionsList Instance = new CustomRichTextTypeLabelsAndDefinitionsList(5, @"LabelsAndDefinitionsList", @"Labels and Definitions List");
    }

    public partial class CustomRichTextTypeWatershedList : CustomRichTextType
    {
        private CustomRichTextTypeWatershedList(int customRichTextTypeID, string customRichTextTypeName, string customRichTextTypeDisplayName) : base(customRichTextTypeID, customRichTextTypeName, customRichTextTypeDisplayName) {}
        public static readonly CustomRichTextTypeWatershedList Instance = new CustomRichTextTypeWatershedList(6, @"WatershedList", @"Watershed List");
    }

    public partial class CustomRichTextTypeTimeSeriesAnalysis : CustomRichTextType
    {
        private CustomRichTextTypeTimeSeriesAnalysis(int customRichTextTypeID, string customRichTextTypeName, string customRichTextTypeDisplayName) : base(customRichTextTypeID, customRichTextTypeName, customRichTextTypeDisplayName) {}
        public static readonly CustomRichTextTypeTimeSeriesAnalysis Instance = new CustomRichTextTypeTimeSeriesAnalysis(7, @"TimeSeriesAnalysis", @"Time Series Analysis");
    }

    public partial class CustomRichTextTypePairedRegressionAnalysis : CustomRichTextType
    {
        private CustomRichTextTypePairedRegressionAnalysis(int customRichTextTypeID, string customRichTextTypeName, string customRichTextTypeDisplayName) : base(customRichTextTypeID, customRichTextTypeName, customRichTextTypeDisplayName) {}
        public static readonly CustomRichTextTypePairedRegressionAnalysis Instance = new CustomRichTextTypePairedRegressionAnalysis(8, @"PairedRegressionAnalysis", @"Paired Regression Analysis");
    }

    public partial class CustomRichTextTypeDiversionScenario : CustomRichTextType
    {
        private CustomRichTextTypeDiversionScenario(int customRichTextTypeID, string customRichTextTypeName, string customRichTextTypeDisplayName) : base(customRichTextTypeID, customRichTextTypeName, customRichTextTypeDisplayName) {}
        public static readonly CustomRichTextTypeDiversionScenario Instance = new CustomRichTextTypeDiversionScenario(9, @"DiversionScenario", @"Diversion Scenario");
    }

    public partial class CustomRichTextTypeCustomPages : CustomRichTextType
    {
        private CustomRichTextTypeCustomPages(int customRichTextTypeID, string customRichTextTypeName, string customRichTextTypeDisplayName) : base(customRichTextTypeID, customRichTextTypeName, customRichTextTypeDisplayName) {}
        public static readonly CustomRichTextTypeCustomPages Instance = new CustomRichTextTypeCustomPages(10, @"CustomPages", @"Custom Pages");
    }
}