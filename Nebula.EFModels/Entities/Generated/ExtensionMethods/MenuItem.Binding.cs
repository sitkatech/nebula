//  IMPORTANT:
//  This file is generated. Your changes will be lost.
//  Use the corresponding partial class for customizations.
//  Source Table: [dbo].[MenuItem]
using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using Nebula.Models.DataTransferObjects;


namespace Nebula.EFModels.Entities
{
    public abstract partial class MenuItem
    {
        public static readonly MenuItemView View = Nebula.EFModels.Entities.MenuItemView.Instance;
        public static readonly MenuItemManage Manage = Nebula.EFModels.Entities.MenuItemManage.Instance;
        public static readonly MenuItemLearnMore LearnMore = Nebula.EFModels.Entities.MenuItemLearnMore.Instance;

        public static readonly List<MenuItem> All;
        public static readonly List<MenuItemDto> AllAsDto;
        public static readonly ReadOnlyDictionary<int, MenuItem> AllLookupDictionary;
        public static readonly ReadOnlyDictionary<int, MenuItemDto> AllAsDtoLookupDictionary;

        /// <summary>
        /// Static type constructor to coordinate static initialization order
        /// </summary>
        static MenuItem()
        {
            All = new List<MenuItem> { View, Manage, LearnMore };
            AllAsDto = new List<MenuItemDto> { View.AsDto(), Manage.AsDto(), LearnMore.AsDto() };
            AllLookupDictionary = new ReadOnlyDictionary<int, MenuItem>(All.ToDictionary(x => x.MenuItemID));
            AllAsDtoLookupDictionary = new ReadOnlyDictionary<int, MenuItemDto>(AllAsDto.ToDictionary(x => x.MenuItemID));
        }

        /// <summary>
        /// Protected constructor only for use in instantiating the set of static lookup values that match database
        /// </summary>
        protected MenuItem(int menuItemID, string menuItemName, string menuItemDisplayName)
        {
            MenuItemID = menuItemID;
            MenuItemName = menuItemName;
            MenuItemDisplayName = menuItemDisplayName;
        }

        [Key]
        public int MenuItemID { get; private set; }
        public string MenuItemName { get; private set; }
        public string MenuItemDisplayName { get; private set; }
        [NotMapped]
        public int PrimaryKey { get { return MenuItemID; } }

        /// <summary>
        /// Enum types are equal by primary key
        /// </summary>
        public bool Equals(MenuItem other)
        {
            if (other == null)
            {
                return false;
            }
            return other.MenuItemID == MenuItemID;
        }

        /// <summary>
        /// Enum types are equal by primary key
        /// </summary>
        public override bool Equals(object obj)
        {
            return Equals(obj as MenuItem);
        }

        /// <summary>
        /// Enum types are equal by primary key
        /// </summary>
        public override int GetHashCode()
        {
            return MenuItemID;
        }

        public static bool operator ==(MenuItem left, MenuItem right)
        {
            return Equals(left, right);
        }

        public static bool operator !=(MenuItem left, MenuItem right)
        {
            return !Equals(left, right);
        }

        public MenuItemEnum ToEnum => (MenuItemEnum)GetHashCode();

        public static MenuItem ToType(int enumValue)
        {
            return ToType((MenuItemEnum)enumValue);
        }

        public static MenuItem ToType(MenuItemEnum enumValue)
        {
            switch (enumValue)
            {
                case MenuItemEnum.LearnMore:
                    return LearnMore;
                case MenuItemEnum.Manage:
                    return Manage;
                case MenuItemEnum.View:
                    return View;
                default:
                    throw new ArgumentException("Unable to map Enum: {enumValue}");
            }
        }
    }

    public enum MenuItemEnum
    {
        View = 1,
        Manage = 2,
        LearnMore = 3
    }

    public partial class MenuItemView : MenuItem
    {
        private MenuItemView(int menuItemID, string menuItemName, string menuItemDisplayName) : base(menuItemID, menuItemName, menuItemDisplayName) {}
        public static readonly MenuItemView Instance = new MenuItemView(1, @"View", @"View");
    }

    public partial class MenuItemManage : MenuItem
    {
        private MenuItemManage(int menuItemID, string menuItemName, string menuItemDisplayName) : base(menuItemID, menuItemName, menuItemDisplayName) {}
        public static readonly MenuItemManage Instance = new MenuItemManage(2, @"Manage", @"Manage");
    }

    public partial class MenuItemLearnMore : MenuItem
    {
        private MenuItemLearnMore(int menuItemID, string menuItemName, string menuItemDisplayName) : base(menuItemID, menuItemName, menuItemDisplayName) {}
        public static readonly MenuItemLearnMore Instance = new MenuItemLearnMore(3, @"LearnMore", @"Learn More");
    }
}