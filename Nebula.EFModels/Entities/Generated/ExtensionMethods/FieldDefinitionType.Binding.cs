//  IMPORTANT:
//  This file is generated. Your changes will be lost.
//  Use the corresponding partial class for customizations.
//  Source Table: [dbo].[FieldDefinitionType]
using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using Nebula.Models.DataTransferObjects;


namespace Nebula.EFModels.Entities
{
    public abstract partial class FieldDefinitionType
    {
        public static readonly FieldDefinitionTypeName Name = Nebula.EFModels.Entities.FieldDefinitionTypeName.Instance;
        public static readonly FieldDefinitionTypeAggregationMethod AggregationMethod = Nebula.EFModels.Entities.FieldDefinitionTypeAggregationMethod.Instance;
        public static readonly FieldDefinitionTypeTimeInterval TimeInterval = Nebula.EFModels.Entities.FieldDefinitionTypeTimeInterval.Instance;
        public static readonly FieldDefinitionTypeWeatherCondition WeatherCondition = Nebula.EFModels.Entities.FieldDefinitionTypeWeatherCondition.Instance;
        public static readonly FieldDefinitionTypeRegressionMethod RegressionMethod = Nebula.EFModels.Entities.FieldDefinitionTypeRegressionMethod.Instance;
        public static readonly FieldDefinitionTypeDiversionRate DiversionRate = Nebula.EFModels.Entities.FieldDefinitionTypeDiversionRate.Instance;
        public static readonly FieldDefinitionTypeStorageMaxDepth StorageMaxDepth = Nebula.EFModels.Entities.FieldDefinitionTypeStorageMaxDepth.Instance;
        public static readonly FieldDefinitionTypeStorageInitialDepth StorageInitialDepth = Nebula.EFModels.Entities.FieldDefinitionTypeStorageInitialDepth.Instance;
        public static readonly FieldDefinitionTypeStorageArea StorageArea = Nebula.EFModels.Entities.FieldDefinitionTypeStorageArea.Instance;
        public static readonly FieldDefinitionTypeInfiltrationRate InfiltrationRate = Nebula.EFModels.Entities.FieldDefinitionTypeInfiltrationRate.Instance;
        public static readonly FieldDefinitionTypeMonthsActive MonthsActive = Nebula.EFModels.Entities.FieldDefinitionTypeMonthsActive.Instance;
        public static readonly FieldDefinitionTypeWeekdaysActive WeekdaysActive = Nebula.EFModels.Entities.FieldDefinitionTypeWeekdaysActive.Instance;
        public static readonly FieldDefinitionTypeHoursActive HoursActive = Nebula.EFModels.Entities.FieldDefinitionTypeHoursActive.Instance;
        public static readonly FieldDefinitionTypeNearestRainfallStation NearestRainfallStation = Nebula.EFModels.Entities.FieldDefinitionTypeNearestRainfallStation.Instance;
        public static readonly FieldDefinitionTypeStationID StationID = Nebula.EFModels.Entities.FieldDefinitionTypeStationID.Instance;
        public static readonly FieldDefinitionTypeStationShortName StationShortName = Nebula.EFModels.Entities.FieldDefinitionTypeStationShortName.Instance;
        public static readonly FieldDefinitionTypeStationDescription StationDescription = Nebula.EFModels.Entities.FieldDefinitionTypeStationDescription.Instance;
        public static readonly FieldDefinitionTypeRainfallEventShutdown RainfallEventShutdown = Nebula.EFModels.Entities.FieldDefinitionTypeRainfallEventShutdown.Instance;
        public static readonly FieldDefinitionTypeRainfallEventDepthThreshold RainfallEventDepthThreshold = Nebula.EFModels.Entities.FieldDefinitionTypeRainfallEventDepthThreshold.Instance;
        public static readonly FieldDefinitionTypeEventSeperationTime EventSeperationTime = Nebula.EFModels.Entities.FieldDefinitionTypeEventSeperationTime.Instance;
        public static readonly FieldDefinitionTypeAfterRainDelay AfterRainDelay = Nebula.EFModels.Entities.FieldDefinitionTypeAfterRainDelay.Instance;

        public static readonly List<FieldDefinitionType> All;
        public static readonly List<FieldDefinitionTypeDto> AllAsDto;
        public static readonly ReadOnlyDictionary<int, FieldDefinitionType> AllLookupDictionary;
        public static readonly ReadOnlyDictionary<int, FieldDefinitionTypeDto> AllAsDtoLookupDictionary;

        /// <summary>
        /// Static type constructor to coordinate static initialization order
        /// </summary>
        static FieldDefinitionType()
        {
            All = new List<FieldDefinitionType> { Name, AggregationMethod, TimeInterval, WeatherCondition, RegressionMethod, DiversionRate, StorageMaxDepth, StorageInitialDepth, StorageArea, InfiltrationRate, MonthsActive, WeekdaysActive, HoursActive, NearestRainfallStation, StationID, StationShortName, StationDescription, RainfallEventShutdown, RainfallEventDepthThreshold, EventSeperationTime, AfterRainDelay };
            AllAsDto = new List<FieldDefinitionTypeDto> { Name.AsDto(), AggregationMethod.AsDto(), TimeInterval.AsDto(), WeatherCondition.AsDto(), RegressionMethod.AsDto(), DiversionRate.AsDto(), StorageMaxDepth.AsDto(), StorageInitialDepth.AsDto(), StorageArea.AsDto(), InfiltrationRate.AsDto(), MonthsActive.AsDto(), WeekdaysActive.AsDto(), HoursActive.AsDto(), NearestRainfallStation.AsDto(), StationID.AsDto(), StationShortName.AsDto(), StationDescription.AsDto(), RainfallEventShutdown.AsDto(), RainfallEventDepthThreshold.AsDto(), EventSeperationTime.AsDto(), AfterRainDelay.AsDto() };
            AllLookupDictionary = new ReadOnlyDictionary<int, FieldDefinitionType>(All.ToDictionary(x => x.FieldDefinitionTypeID));
            AllAsDtoLookupDictionary = new ReadOnlyDictionary<int, FieldDefinitionTypeDto>(AllAsDto.ToDictionary(x => x.FieldDefinitionTypeID));
        }

        /// <summary>
        /// Protected constructor only for use in instantiating the set of static lookup values that match database
        /// </summary>
        protected FieldDefinitionType(int fieldDefinitionTypeID, string fieldDefinitionTypeName, string fieldDefinitionTypeDisplayName)
        {
            FieldDefinitionTypeID = fieldDefinitionTypeID;
            FieldDefinitionTypeName = fieldDefinitionTypeName;
            FieldDefinitionTypeDisplayName = fieldDefinitionTypeDisplayName;
        }

        [Key]
        public int FieldDefinitionTypeID { get; private set; }
        public string FieldDefinitionTypeName { get; private set; }
        public string FieldDefinitionTypeDisplayName { get; private set; }
        [NotMapped]
        public int PrimaryKey { get { return FieldDefinitionTypeID; } }

        /// <summary>
        /// Enum types are equal by primary key
        /// </summary>
        public bool Equals(FieldDefinitionType other)
        {
            if (other == null)
            {
                return false;
            }
            return other.FieldDefinitionTypeID == FieldDefinitionTypeID;
        }

        /// <summary>
        /// Enum types are equal by primary key
        /// </summary>
        public override bool Equals(object obj)
        {
            return Equals(obj as FieldDefinitionType);
        }

        /// <summary>
        /// Enum types are equal by primary key
        /// </summary>
        public override int GetHashCode()
        {
            return FieldDefinitionTypeID;
        }

        public static bool operator ==(FieldDefinitionType left, FieldDefinitionType right)
        {
            return Equals(left, right);
        }

        public static bool operator !=(FieldDefinitionType left, FieldDefinitionType right)
        {
            return !Equals(left, right);
        }

        public FieldDefinitionTypeEnum ToEnum => (FieldDefinitionTypeEnum)GetHashCode();

        public static FieldDefinitionType ToType(int enumValue)
        {
            return ToType((FieldDefinitionTypeEnum)enumValue);
        }

        public static FieldDefinitionType ToType(FieldDefinitionTypeEnum enumValue)
        {
            switch (enumValue)
            {
                case FieldDefinitionTypeEnum.AfterRainDelay:
                    return AfterRainDelay;
                case FieldDefinitionTypeEnum.AggregationMethod:
                    return AggregationMethod;
                case FieldDefinitionTypeEnum.DiversionRate:
                    return DiversionRate;
                case FieldDefinitionTypeEnum.EventSeperationTime:
                    return EventSeperationTime;
                case FieldDefinitionTypeEnum.HoursActive:
                    return HoursActive;
                case FieldDefinitionTypeEnum.InfiltrationRate:
                    return InfiltrationRate;
                case FieldDefinitionTypeEnum.MonthsActive:
                    return MonthsActive;
                case FieldDefinitionTypeEnum.Name:
                    return Name;
                case FieldDefinitionTypeEnum.NearestRainfallStation:
                    return NearestRainfallStation;
                case FieldDefinitionTypeEnum.RainfallEventDepthThreshold:
                    return RainfallEventDepthThreshold;
                case FieldDefinitionTypeEnum.RainfallEventShutdown:
                    return RainfallEventShutdown;
                case FieldDefinitionTypeEnum.RegressionMethod:
                    return RegressionMethod;
                case FieldDefinitionTypeEnum.StationDescription:
                    return StationDescription;
                case FieldDefinitionTypeEnum.StationID:
                    return StationID;
                case FieldDefinitionTypeEnum.StationShortName:
                    return StationShortName;
                case FieldDefinitionTypeEnum.StorageArea:
                    return StorageArea;
                case FieldDefinitionTypeEnum.StorageInitialDepth:
                    return StorageInitialDepth;
                case FieldDefinitionTypeEnum.StorageMaxDepth:
                    return StorageMaxDepth;
                case FieldDefinitionTypeEnum.TimeInterval:
                    return TimeInterval;
                case FieldDefinitionTypeEnum.WeatherCondition:
                    return WeatherCondition;
                case FieldDefinitionTypeEnum.WeekdaysActive:
                    return WeekdaysActive;
                default:
                    throw new ArgumentException("Unable to map Enum: {enumValue}");
            }
        }
    }

    public enum FieldDefinitionTypeEnum
    {
        Name = 1,
        AggregationMethod = 2,
        TimeInterval = 3,
        WeatherCondition = 4,
        RegressionMethod = 5,
        DiversionRate = 6,
        StorageMaxDepth = 7,
        StorageInitialDepth = 8,
        StorageArea = 9,
        InfiltrationRate = 10,
        MonthsActive = 11,
        WeekdaysActive = 12,
        HoursActive = 13,
        NearestRainfallStation = 14,
        StationID = 15,
        StationShortName = 16,
        StationDescription = 17,
        RainfallEventShutdown = 18,
        RainfallEventDepthThreshold = 19,
        EventSeperationTime = 20,
        AfterRainDelay = 21
    }

    public partial class FieldDefinitionTypeName : FieldDefinitionType
    {
        private FieldDefinitionTypeName(int fieldDefinitionTypeID, string fieldDefinitionTypeName, string fieldDefinitionTypeDisplayName) : base(fieldDefinitionTypeID, fieldDefinitionTypeName, fieldDefinitionTypeDisplayName) {}
        public static readonly FieldDefinitionTypeName Instance = new FieldDefinitionTypeName(1, @"Name", @"Name");
    }

    public partial class FieldDefinitionTypeAggregationMethod : FieldDefinitionType
    {
        private FieldDefinitionTypeAggregationMethod(int fieldDefinitionTypeID, string fieldDefinitionTypeName, string fieldDefinitionTypeDisplayName) : base(fieldDefinitionTypeID, fieldDefinitionTypeName, fieldDefinitionTypeDisplayName) {}
        public static readonly FieldDefinitionTypeAggregationMethod Instance = new FieldDefinitionTypeAggregationMethod(2, @"AggregationMethod", @"Aggregation Method");
    }

    public partial class FieldDefinitionTypeTimeInterval : FieldDefinitionType
    {
        private FieldDefinitionTypeTimeInterval(int fieldDefinitionTypeID, string fieldDefinitionTypeName, string fieldDefinitionTypeDisplayName) : base(fieldDefinitionTypeID, fieldDefinitionTypeName, fieldDefinitionTypeDisplayName) {}
        public static readonly FieldDefinitionTypeTimeInterval Instance = new FieldDefinitionTypeTimeInterval(3, @"TimeInterval", @"Time Interval");
    }

    public partial class FieldDefinitionTypeWeatherCondition : FieldDefinitionType
    {
        private FieldDefinitionTypeWeatherCondition(int fieldDefinitionTypeID, string fieldDefinitionTypeName, string fieldDefinitionTypeDisplayName) : base(fieldDefinitionTypeID, fieldDefinitionTypeName, fieldDefinitionTypeDisplayName) {}
        public static readonly FieldDefinitionTypeWeatherCondition Instance = new FieldDefinitionTypeWeatherCondition(4, @"WeatherCondition", @"Weather Condition");
    }

    public partial class FieldDefinitionTypeRegressionMethod : FieldDefinitionType
    {
        private FieldDefinitionTypeRegressionMethod(int fieldDefinitionTypeID, string fieldDefinitionTypeName, string fieldDefinitionTypeDisplayName) : base(fieldDefinitionTypeID, fieldDefinitionTypeName, fieldDefinitionTypeDisplayName) {}
        public static readonly FieldDefinitionTypeRegressionMethod Instance = new FieldDefinitionTypeRegressionMethod(5, @"RegressionMethod", @"Regression Method");
    }

    public partial class FieldDefinitionTypeDiversionRate : FieldDefinitionType
    {
        private FieldDefinitionTypeDiversionRate(int fieldDefinitionTypeID, string fieldDefinitionTypeName, string fieldDefinitionTypeDisplayName) : base(fieldDefinitionTypeID, fieldDefinitionTypeName, fieldDefinitionTypeDisplayName) {}
        public static readonly FieldDefinitionTypeDiversionRate Instance = new FieldDefinitionTypeDiversionRate(6, @"DiversionRate", @"Diversion Rate (cfs)");
    }

    public partial class FieldDefinitionTypeStorageMaxDepth : FieldDefinitionType
    {
        private FieldDefinitionTypeStorageMaxDepth(int fieldDefinitionTypeID, string fieldDefinitionTypeName, string fieldDefinitionTypeDisplayName) : base(fieldDefinitionTypeID, fieldDefinitionTypeName, fieldDefinitionTypeDisplayName) {}
        public static readonly FieldDefinitionTypeStorageMaxDepth Instance = new FieldDefinitionTypeStorageMaxDepth(7, @"StorageMaxDepth", @"Storage Max Depth (ft)");
    }

    public partial class FieldDefinitionTypeStorageInitialDepth : FieldDefinitionType
    {
        private FieldDefinitionTypeStorageInitialDepth(int fieldDefinitionTypeID, string fieldDefinitionTypeName, string fieldDefinitionTypeDisplayName) : base(fieldDefinitionTypeID, fieldDefinitionTypeName, fieldDefinitionTypeDisplayName) {}
        public static readonly FieldDefinitionTypeStorageInitialDepth Instance = new FieldDefinitionTypeStorageInitialDepth(8, @"StorageInitialDepth", @"Storage Initial Depth (ft)");
    }

    public partial class FieldDefinitionTypeStorageArea : FieldDefinitionType
    {
        private FieldDefinitionTypeStorageArea(int fieldDefinitionTypeID, string fieldDefinitionTypeName, string fieldDefinitionTypeDisplayName) : base(fieldDefinitionTypeID, fieldDefinitionTypeName, fieldDefinitionTypeDisplayName) {}
        public static readonly FieldDefinitionTypeStorageArea Instance = new FieldDefinitionTypeStorageArea(9, @"StorageArea", @"Storage Area (sqft)");
    }

    public partial class FieldDefinitionTypeInfiltrationRate : FieldDefinitionType
    {
        private FieldDefinitionTypeInfiltrationRate(int fieldDefinitionTypeID, string fieldDefinitionTypeName, string fieldDefinitionTypeDisplayName) : base(fieldDefinitionTypeID, fieldDefinitionTypeName, fieldDefinitionTypeDisplayName) {}
        public static readonly FieldDefinitionTypeInfiltrationRate Instance = new FieldDefinitionTypeInfiltrationRate(10, @"InfiltrationRate", @"Infiltration Rate (in/hr)");
    }

    public partial class FieldDefinitionTypeMonthsActive : FieldDefinitionType
    {
        private FieldDefinitionTypeMonthsActive(int fieldDefinitionTypeID, string fieldDefinitionTypeName, string fieldDefinitionTypeDisplayName) : base(fieldDefinitionTypeID, fieldDefinitionTypeName, fieldDefinitionTypeDisplayName) {}
        public static readonly FieldDefinitionTypeMonthsActive Instance = new FieldDefinitionTypeMonthsActive(11, @"MonthsActive", @"Months Active");
    }

    public partial class FieldDefinitionTypeWeekdaysActive : FieldDefinitionType
    {
        private FieldDefinitionTypeWeekdaysActive(int fieldDefinitionTypeID, string fieldDefinitionTypeName, string fieldDefinitionTypeDisplayName) : base(fieldDefinitionTypeID, fieldDefinitionTypeName, fieldDefinitionTypeDisplayName) {}
        public static readonly FieldDefinitionTypeWeekdaysActive Instance = new FieldDefinitionTypeWeekdaysActive(12, @"WeekdaysActive", @"Weekdays Active");
    }

    public partial class FieldDefinitionTypeHoursActive : FieldDefinitionType
    {
        private FieldDefinitionTypeHoursActive(int fieldDefinitionTypeID, string fieldDefinitionTypeName, string fieldDefinitionTypeDisplayName) : base(fieldDefinitionTypeID, fieldDefinitionTypeName, fieldDefinitionTypeDisplayName) {}
        public static readonly FieldDefinitionTypeHoursActive Instance = new FieldDefinitionTypeHoursActive(13, @"HoursActive", @"Hours Active");
    }

    public partial class FieldDefinitionTypeNearestRainfallStation : FieldDefinitionType
    {
        private FieldDefinitionTypeNearestRainfallStation(int fieldDefinitionTypeID, string fieldDefinitionTypeName, string fieldDefinitionTypeDisplayName) : base(fieldDefinitionTypeID, fieldDefinitionTypeName, fieldDefinitionTypeDisplayName) {}
        public static readonly FieldDefinitionTypeNearestRainfallStation Instance = new FieldDefinitionTypeNearestRainfallStation(14, @"NearestRainfallStation", @"Nearest Rainfall Station");
    }

    public partial class FieldDefinitionTypeStationID : FieldDefinitionType
    {
        private FieldDefinitionTypeStationID(int fieldDefinitionTypeID, string fieldDefinitionTypeName, string fieldDefinitionTypeDisplayName) : base(fieldDefinitionTypeID, fieldDefinitionTypeName, fieldDefinitionTypeDisplayName) {}
        public static readonly FieldDefinitionTypeStationID Instance = new FieldDefinitionTypeStationID(15, @"StationID", @"Station ID");
    }

    public partial class FieldDefinitionTypeStationShortName : FieldDefinitionType
    {
        private FieldDefinitionTypeStationShortName(int fieldDefinitionTypeID, string fieldDefinitionTypeName, string fieldDefinitionTypeDisplayName) : base(fieldDefinitionTypeID, fieldDefinitionTypeName, fieldDefinitionTypeDisplayName) {}
        public static readonly FieldDefinitionTypeStationShortName Instance = new FieldDefinitionTypeStationShortName(16, @"StationShortName", @"Short Name");
    }

    public partial class FieldDefinitionTypeStationDescription : FieldDefinitionType
    {
        private FieldDefinitionTypeStationDescription(int fieldDefinitionTypeID, string fieldDefinitionTypeName, string fieldDefinitionTypeDisplayName) : base(fieldDefinitionTypeID, fieldDefinitionTypeName, fieldDefinitionTypeDisplayName) {}
        public static readonly FieldDefinitionTypeStationDescription Instance = new FieldDefinitionTypeStationDescription(17, @"StationDescription", @"Description");
    }

    public partial class FieldDefinitionTypeRainfallEventShutdown : FieldDefinitionType
    {
        private FieldDefinitionTypeRainfallEventShutdown(int fieldDefinitionTypeID, string fieldDefinitionTypeName, string fieldDefinitionTypeDisplayName) : base(fieldDefinitionTypeID, fieldDefinitionTypeName, fieldDefinitionTypeDisplayName) {}
        public static readonly FieldDefinitionTypeRainfallEventShutdown Instance = new FieldDefinitionTypeRainfallEventShutdown(18, @"RainfallEventShutdown", @"Shutdown Diversion During Rain Events");
    }

    public partial class FieldDefinitionTypeRainfallEventDepthThreshold : FieldDefinitionType
    {
        private FieldDefinitionTypeRainfallEventDepthThreshold(int fieldDefinitionTypeID, string fieldDefinitionTypeName, string fieldDefinitionTypeDisplayName) : base(fieldDefinitionTypeID, fieldDefinitionTypeName, fieldDefinitionTypeDisplayName) {}
        public static readonly FieldDefinitionTypeRainfallEventDepthThreshold Instance = new FieldDefinitionTypeRainfallEventDepthThreshold(19, @"RainfallEventDepthThreshold", @"Rainfall Event Depth Threshold (inches)");
    }

    public partial class FieldDefinitionTypeEventSeperationTime : FieldDefinitionType
    {
        private FieldDefinitionTypeEventSeperationTime(int fieldDefinitionTypeID, string fieldDefinitionTypeName, string fieldDefinitionTypeDisplayName) : base(fieldDefinitionTypeID, fieldDefinitionTypeName, fieldDefinitionTypeDisplayName) {}
        public static readonly FieldDefinitionTypeEventSeperationTime Instance = new FieldDefinitionTypeEventSeperationTime(20, @"EventSeperationTime", @"Event Separation Time (hours)");
    }

    public partial class FieldDefinitionTypeAfterRainDelay : FieldDefinitionType
    {
        private FieldDefinitionTypeAfterRainDelay(int fieldDefinitionTypeID, string fieldDefinitionTypeName, string fieldDefinitionTypeDisplayName) : base(fieldDefinitionTypeID, fieldDefinitionTypeName, fieldDefinitionTypeDisplayName) {}
        public static readonly FieldDefinitionTypeAfterRainDelay Instance = new FieldDefinitionTypeAfterRainDelay(21, @"AfterRainDelay", @"Resume Diversion After Delay (hours)");
    }
}