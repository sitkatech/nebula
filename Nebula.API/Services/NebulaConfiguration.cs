namespace Nebula.API.Services
{
    public class NebulaConfiguration
    {
        public string KEYSTONE_HOST { get; set; }
        public string DB_CONNECTION_STRING { get; set; }
        public string SITKA_EMAIL_REDIRECT { get; set; }
        public string WEB_URL { get; set; }
        public string KEYSTONE_REDIRECT_URL { get; set; }
        public string LeadOrganizationEmail { get; set; }
        public string APPINSIGHTS_INSTRUMENTATIONKEY { get; set; }
        public string SendGridApiKey { get; set; }
    }
}