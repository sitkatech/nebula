declare let window: any;

export class DynamicEnvironment {
  private _production: boolean;

  constructor(_production: boolean){
    this._production = _production
  }

  public get production() {
    if (window.config) {
      return window.config.production;
    } else return this._production;
  }

  public get staging() {
    return window.config.staging;
  }

  public get dev() {
    return window.config.dev;
  }

  public get mainAppApiUrl() {
    return window.config.mainAppApiUrl;
  }

  public get createAccountUrl() {
    return window.config.createAccountUrl;
  }

  public get createAccountRedirectUrl() {
    return window.config.createAccountRedirectUrl;
  }

  public get keystoneSupportBaseUrl() {
    return window.config.keystoneSupportBaseUrl;
  }

  public get geoserverMapServiceUrl() {
    return window.config.geoserverMapServiceUrl;
  }

  public get keystoneAuthConfiguration() {
    return window.config.keystoneAuthConfiguration;
  }

  public get lyraBaseURL() {
    return window.config.lyraBaseURL;
  }
}
