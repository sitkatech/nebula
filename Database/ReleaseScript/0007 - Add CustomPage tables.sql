
CREATE TABLE dbo.MenuItem(
	MenuItemID int NOT NULL CONSTRAINT PK_MenuItem_MenuItemID PRIMARY KEY,
	MenuItemName varchar(100) NOT NULL CONSTRAINT AK_MenuItem_MenuItemName UNIQUE,
	MenuItemDisplayName varchar(100) NOT NULL CONSTRAINT AK_MenuItem_MenuItemDisplayName UNIQUE
)

CREATE TABLE dbo.CustomPage(
	CustomPageID int IDENTITY(1,1) NOT NULL CONSTRAINT PK_CustomPage_CustomPageID PRIMARY KEY,
	CustomPageDisplayName varchar(100) NOT NULL CONSTRAINT AK_CustomPage_CustomPageDisplayName UNIQUE,
	CustomPageVanityUrl varchar(100) NOT NULL CONSTRAINT AK_CustomPage_CustomPageVanityUrl UNIQUE,
	CustomPageContent dbo.html NULL,
    MenuItemID int NOT NULL CONSTRAINT FK_CustomPage_MenuItem_MenuItemID FOREIGN KEY REFERENCES dbo.MenuItem (MenuItemID),
	SortOrder int NULL
)

CREATE TABLE dbo.CustomPageRole(
	CustomPageRoleID int IDENTITY(1,1) NOT NULL CONSTRAINT PK_CustomPageRole_CustomPageRoleID PRIMARY KEY,
	CustomPageID int NOT NULL CONSTRAINT FK_CustomPageRole_CustomPage_CustomPageID FOREIGN KEY REFERENCES dbo.CustomPage (CustomPageID),
	RoleID int NOT NULL CONSTRAINT FK_CustomPageRole_Role_RoleID FOREIGN KEY REFERENCES dbo.Role (RoleID)
)

Insert Into CustomRichTextType (CustomRichTextTypeID, CustomRichTextTypeName, CustomRichTextTypeDisplayName)
Values
(10, 'CustomPages', 'Custom Pages')

Insert Into CustomRichText (CustomRichTextTypeID, CustomRichTextContent)
Values
(10, 'Welcome to Custom Pages!')