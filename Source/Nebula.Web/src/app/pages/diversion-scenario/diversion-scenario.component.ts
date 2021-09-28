import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { LyraService } from 'src/app/services/lyra.service';
import { StationSelectCardComponent } from 'src/app/shared/components/station-select-card/station-select-card.component';
import { UserDetailedDto } from 'src/app/shared/models';
import { Alert } from 'src/app/shared/models/alert';
import { AlertContext } from 'src/app/shared/models/enums/alert-context.enum';
import { CustomRichTextType } from 'src/app/shared/models/enums/custom-rich-text-type.enum';
import { SiteFilterEnum } from 'src/app/shared/models/enums/site-filter.enum';
import { HydstraWeatherCondition } from 'src/app/shared/models/hydstra/hydstra-weather-condition';
import { SiteVariable } from 'src/app/shared/models/site-variable';
import { AlertService } from 'src/app/shared/services/alert.service';

declare var $: any;
declare var vegaEmbed: any;

@Component({
  selector: 'nebula-diversion-scenario',
  templateUrl: './diversion-scenario.component.html',
  styleUrls: ['./diversion-scenario.component.scss']
})
export class DiversionScenarioComponent implements OnInit {
  public watchUserChangeSubscription: any;
  public currentUser: UserDetailedDto;

  @ViewChild("mapDiv") mapElement: ElementRef;
  @ViewChild("selectedDataCardRef") selectedDataCardRef: ElementRef;
  @ViewChild("stationSelect") stationSelect: StationSelectCardComponent;

  public mapID: string = 'DiversionScenarioStationSelectMap';

  public richTextTypeID = CustomRichTextType.DiversionScenario;
  public defaultSelectedMapFilter = SiteFilterEnum.HasDischarge;

  public vegaSpec: Object = null;

  public hydstraWeatherConditions: HydstraWeatherCondition[] = HydstraWeatherCondition.all();

  public selectedSiteProperties: any;
  public selectedSiteAvailableVariables: SiteVariable[] = [];
  public selectedSiteStation: string = null;
  public selectedSiteName: string = null;
  public selectedVariables: SiteVariable[] = [];

  public errorOccurred: boolean;
  public errorMessage: string = null;
  public gettingTimeSeriesData: boolean = false;
  public rainfallStations: any = null;
  public currentlyDisplayingRequestDto: any;
  public downloadingChartData: boolean;
  public lyraMessages: Alert[] = [];

  public variableNamesAllowedToAddToScenario = ["Discharge"];

  public monthData = [
    { id: 1, display: 'January' },
    { id: 2, display: 'February' },
    { id: 3, display: 'March' },
    { id: 4, display: 'April' },
    { id: 5, display: 'May' },
    { id: 6, display: 'June' },
    { id: 7, display: 'July' },
    { id: 8, display: 'August' },
    { id: 9, display: 'September' },
    { id: 10, display: 'October' },
    { id: 11, display: 'November' },
    { id: 12, display: 'December' }
  ]

  public weekdayData = [
    { id: 6, display: 'Sunday' },
    { id: 0, display: 'Monday' },
    { id: 1, display: 'Tuesday' },
    { id: 2, display: 'Wednesday' },
    { id: 3, display: 'Thursday' },
    { id: 4, display: 'Friday' },
    { id: 5, display: 'Saturday' }
  ]

  public hourData = [
    { id: 0, display: '12 AM' },
    { id: 1, display: '1 AM' },
    { id: 2, display: '2 AM' },
    { id: 3, display: '3 AM' },
    { id: 4, display: '4 AM' },
    { id: 5, display: '5 AM' },
    { id: 6, display: '6 AM' },
    { id: 7, display: '7 AM' },
    { id: 8, display: '8 AM' },
    { id: 9, display: '9 AM' },
    { id: 10, display: '10 AM' },
    { id: 11, display: '11 AM' },
    { id: 12, display: '12 PM' },
    { id: 13, display: '1 PM' },
    { id: 14, display: '2 PM' },
    { id: 15, display: '3 PM' },
    { id: 16, display: '4 PM' },
    { id: 17, display: '5 PM' },
    { id: 18, display: '6 PM' },
    { id: 19, display: '7 PM' },
    { id: 20, display: '8 PM' },
    { id: 21, display: '9 PM' },
    { id: 22, display: '10 PM' },
    { id: 23, display: '11 PM' },
  ]

  public currentDate = new Date();
  public timeSeriesForm = new FormGroup({
    start_date: new FormControl({ year: this.currentDate.getUTCFullYear(), month: this.currentDate.getUTCMonth() - 2, day: this.currentDate.getUTCDate() }, [Validators.required]),
    end_date: new FormControl({ year: this.currentDate.getUTCFullYear(), month: this.currentDate.getUTCMonth() + 1, day: this.currentDate.getUTCDate() }, [Validators.required]),
    site: new FormControl(null, [Validators.required]),
    diversion_rate_cfs: new FormControl(0, [Validators.required]),
    storage_max_depth_ft: new FormControl(0, [Validators.required]),
    storage_initial_depth_ft: new FormControl(0, [Validators.required]),
    storage_area_sqft: new FormControl(0, [Validators.required]),
    infiltration_rate_inhr: new FormControl(0, [Validators.required]),
    rainfall_event_shutdown: new FormControl(true, [Validators.required]),
    rainfall_event_depth_threshold: new FormControl(0.1, [Validators.required]),
    event_seperation_hrs: new FormControl(6, [Validators.required]),
    after_rain_delay_hrs: new FormControl(72, [Validators.required]),
    nearest_rainfall_station: new FormControl(null, [Validators.required]),
    diversion_months_active: new FormControl(this.monthData.map(x => x.id), [Validators.required]),
    diversion_days_active: new FormControl(this.weekdayData.map(x => x.id), [Validators.required]),
    diversion_hours_active: new FormControl(this.hourData.map(x => x.id), [Validators.required]),
  });
  public timeSeriesFormDefault = this.timeSeriesForm.value;
  currentlyDisplayingRequestLinkText: string;
  mapReady: boolean;


  constructor(
    private cdr: ChangeDetectorRef,
    private lyraService: LyraService,
    private authenticationService: AuthenticationService,
    private route: ActivatedRoute,
    private alertService: AlertService
  ) {
  }

  ngOnInit() {
    this.watchUserChangeSubscription = this.authenticationService.currentUserSetObservable.subscribe(currentUser => {
      this.currentUser = currentUser;
      this.lyraService.getSiteLocationGeoJson().subscribe(result => {
        this.rainfallStations = result.features.filter(x => x.properties.has_rainfall).sort((x, y) => {
          if (x.properties.stname > y.properties.stname) {
            return 1;
          }

          if (x.properties.stname < y.properties.stname) {
            return -1;
          }

          return 0;
        });

        if (this.mapReady) {
          this.populateFormFromURL();
        }
      });
      this.setupFormChangeListener();
    });
  }

  public onSubmit() {
    this.getTimeSeriesData();
  }

  public isActionBeingPerformed() {
    return this.gettingTimeSeriesData || this.downloadingChartData
  }

  public getTimeSeriesData() {
    if (!this.timeSeriesForm.valid) {
      Object.keys(this.timeSeriesForm.controls).forEach(field => {
        const control = this.timeSeriesForm.get(field);
        control.markAsTouched({ onlySelf: true });
      });
      return;
    }
    let swnTimeSeriesRequestDto =
    {
      start_date: this.getDateFromTimeSeriesFormDateObject('start_date'),
      end_date: this.getDateFromTimeSeriesFormDateObject('end_date'),
      site: this.timeSeriesForm.get('site').value,
      diversion_rate_cfs: this.timeSeriesForm.get('diversion_rate_cfs').value,
      storage_max_depth_ft: this.timeSeriesForm.get('storage_max_depth_ft').value,
      storage_initial_depth_ft: this.timeSeriesForm.get('storage_initial_depth_ft').value,
      storage_area_sqft: this.timeSeriesForm.get('storage_area_sqft').value,
      infiltration_rate_inhr: this.timeSeriesForm.get('infiltration_rate_inhr').value,
      rainfall_event_shutdown: this.timeSeriesForm.get('rainfall_event_shutdown').value,
      rainfall_event_depth_threshold: this.timeSeriesForm.get('rainfall_event_depth_threshold').value,
      event_seperation_hrs: this.timeSeriesForm.get('event_seperation_hrs').value,
      after_rain_delay_hrs: this.timeSeriesForm.get('after_rain_delay_hrs').value,
      nearest_rainfall_station: this.timeSeriesForm.get('nearest_rainfall_station').value,
      diversion_months_active: this.timeSeriesForm.get('diversion_months_active').value,
      diversion_days_active: this.timeSeriesForm.get('diversion_days_active').value,
      diversion_hours_active: this.timeSeriesForm.get('diversion_hours_active').value
    };
    this.gettingTimeSeriesData = true;
    this.errorOccurred = false;
    this.vegaSpec = null;
    this.currentlyDisplayingRequestDto = null;
    this.lyraMessages = [];
    this.timeSeriesForm.disable({emitEvent: false});
    this.lyraService.getDiversionScenarioPlot(swnTimeSeriesRequestDto).subscribe(result => {
      if (result.hasOwnProperty('data') && result.data.hasOwnProperty('spec')) {
        if (result.data.hasOwnProperty('messages') && result.data.messages.length > 0) {
          this.lyraMessages.push(...result.data.messages.filter(x => x != "").map(x => new Alert(x, AlertContext.Warning, true)));
        }
        this.vegaSpec = result.data.spec;
        vegaEmbed('#vis', this.vegaSpec);
        this.currentlyDisplayingRequestDto = swnTimeSeriesRequestDto;
        this.currentlyDisplayingRequestLinkText = `${window.location.origin}${window.location.pathname}?json=${JSON.stringify(this.currentlyDisplayingRequestDto)}`;
      }
      else {
        this.errorOccurred = true;
        if (result.hasOwnProperty('msg')) {
          this.lyraMessages.push(new Alert(`There was an error with the entered query. Message: ${result.msg}`, AlertContext.Danger, true));
        }
      }
      this.gettingTimeSeriesData = false;
      this.timeSeriesForm.enable({emitEvent: false});
      this.cdr.detectChanges();
    },
      error => {
        if (error.hasOwnProperty('error') && error.error.hasOwnProperty('detail')) {
          for (let details of error.error.detail) {
            if (details.hasOwnProperty('msg')) {
              this.lyraMessages.push(new Alert(`There was an error with the entered query. Message: ${details.msg}`, AlertContext.Danger, true));
            }
          }
        }
        this.errorOccurred = true;
        this.gettingTimeSeriesData = false;
        this.timeSeriesForm.enable({emitEvent: false});
      });
  }

  public downloadChartData() {
    if (!this.currentlyDisplayingRequestDto) {
      return;
    }

    this.downloadingChartData = true;
    this.timeSeriesForm.disable({emitEvent: false});
    this.lyraService.downloadDiversionScenarioData(this.currentlyDisplayingRequestDto).subscribe(result => {
      const blob = new Blob([result], {
        type: 'text/csv'
      });

      //Create a fake object to trigger downloading the csv file that was returned
      const a: any = document.createElement('a');
      document.body.appendChild(a);

      a.style = 'display: none';
      const url = window.URL.createObjectURL(blob);
      a.href = url;
      let date = new Date();
      a.download = `SWN_Diversion_Scenario_Data_Request_${date.getMonth() + 1}_${date.getDate()}_${date.getFullYear()}_${date.getHours()}_${date.getMinutes()}.csv`;
      a.click();
      window.URL.revokeObjectURL(url);
      this.downloadingChartData = false;
      this.timeSeriesForm.enable({emitEvent: false});
    })
  }

  public updateSelectedStation(selectedStationProperties: any) {
    this.selectedSiteName = selectedStationProperties.stname;
    this.getDischargeVariableIfPresent(selectedStationProperties);
    this.selectedSiteStation = selectedStationProperties.station;
  }

  public getDischargeVariableIfPresent(featureProperties: any) {
    this.selectedSiteAvailableVariables = [];
    let baseSiteVariable = new SiteVariable(
      { 
        stationShortName: featureProperties.shortname, 
        station: featureProperties.station, 
        nearestRainfallStationInfo: {
          stationLongName: featureProperties.nearest_rainfall_station_info.stname,
          station: featureProperties.nearest_rainfall_station_info.station
        }});

    if (featureProperties.has_discharge) {
      let dischargeInfo = featureProperties.discharge_info;
      let dischargeSiteVariable = Object.assign(new SiteVariable({
        name: dischargeInfo.name,
        variable: dischargeInfo.variable,
        start_date: new Date(`${dischargeInfo.period_start.slice(0, 4)}-${dischargeInfo.period_start.slice(4, 6)}-${dischargeInfo.period_start.slice(6, 8)}`).toLocaleDateString(),
        end_date: new Date(`${dischargeInfo.period_end.slice(0, 4)}-${dischargeInfo.period_end.slice(4, 6)}-${dischargeInfo.period_end.slice(6, 8)}`).toLocaleDateString(),
      }), baseSiteVariable);
      this.selectedSiteAvailableVariables.push(dischargeSiteVariable);
    }
  }

  public siteSelectedAndVariablesFound(): boolean {
    return this.selectedSiteName && this.selectedSiteAvailableVariables != null && this.selectedSiteAvailableVariables.length > 0
  }

  public addVariableToSelection(variable: SiteVariable): void {
    this.selectedVariables = [];
    this.selectedVariables.push(variable);
    this.timeSeriesForm.patchValue({ site: variable.station });
    this.timeSeriesForm.patchValue({ nearest_rainfall_station: variable.nearestRainfallStationInfo.station});
    this.clearResults();
  }

  public removeVariableFromSelection(): void {
    this.timeSeriesForm.patchValue({ site: null });
    this.lyraMessages = [];
    this.clearResults();
  }

  public catchExtraSymbols(event: KeyboardEvent): void {
    if (event.code === "KeyE" || event.code === "Equal" || event.code === "Minus" || event.code === "Plus") {
      event.preventDefault();
    }
  }

  public catchPastedSymbols(event: any): void {
    let val = event.clipboardData.getData('text/plain');
    if (val && (val.includes("+") || val.includes("-") || val.includes("e") || val.includes("E"))) {
      val = val.replace(/\+|\-|e|E/g, '');
      event.preventDefault();
    }
  }

  public formatDateForNgbDatepicker(date: Date): any {
    let dateToChange = new Date(date);
    return { year: dateToChange.getUTCFullYear(), month: dateToChange.getUTCMonth() + 1, day: dateToChange.getUTCDate() };
  }

  public scrollIntoView(el: ElementRef) {
    el.nativeElement.scrollIntoView(true);
  }

  public closeAlert(index: number) {
    this.lyraMessages.splice(index, 1);
  }

  public clearResults() {
    this.vegaSpec = null;
    this.currentlyDisplayingRequestDto = null;
    this.lyraMessages = [];
    this.errorOccurred = false;
  }

  //#region Form Functionality

  get f() {
    return this.timeSeriesForm.controls;
  }

  public getDateFromTimeSeriesFormDateObject(formFieldName: string): string {
    let date = this.timeSeriesForm.get(formFieldName).value;
    return `${date["year"]}-${date["month"].toString().padStart(2, '0')}-${date["day"].toString().padStart(2, '0')}`;
  }

  public setupFormChangeListener() {
    this.timeSeriesForm.valueChanges.subscribe(val => {
      this.clearResults();
    })
  }

  //#endregion

  public setMapReadyToTrueAndCheckIfWeCanPopulateFormFromURL() {
    this.mapReady = true;
    if (this.rainfallStations != null) {
      this.populateFormFromURL();
    }
  }

  public populateFormFromURL() {
    this.route.queryParams.subscribe(params => {
      if (params == null || params == undefined || !params.hasOwnProperty("json")) {
        return;
      }

      let queriedParams;

      try {
        queriedParams = JSON.parse(params["json"]);
      }
      catch (e) {
        this.alertService.pushAlert(new Alert(`There was an error parsing the URL. ${e}`, AlertContext.Danger, true));
        return;
      }
      

      //Don't bother if we don't have a site
      if (!queriedParams.hasOwnProperty("site")) {
        return;
      }

      let message = this.stationSelect.externalAddSiteVariableReturnMessageIfFailed(queriedParams["site"], "discharge");
      if (message != null && message != undefined) {
        this.alertService.pushAlert(new Alert(message, AlertContext.Danger, true));
        return;
      }

      if (queriedParams["start_date"] != null) {
        let start_date = new Date(queriedParams["start_date"]);
        this.timeSeriesForm.patchValue({start_date : { year: start_date.getUTCFullYear(), month: start_date.getUTCMonth() + 1, day: start_date.getUTCDate() }});
      }

      if (queriedParams["end_date"] != null) {
        let end_date = new Date(queriedParams["end_date"]);
        this.timeSeriesForm.patchValue({end_date : { year: end_date.getUTCFullYear(), month: end_date.getUTCMonth() + 1, day: end_date.getUTCDate() }});
      }

      let errorMessagesToDisplay = [];

      this.updateFormWithValueIfProvidedAndPresentPopulateErrorIfNot(queriedParams, "diversion_rate_cfs", (x => typeof x === "number" && !isNaN(x)), errorMessagesToDisplay)        
      this.updateFormWithValueIfProvidedAndPresentPopulateErrorIfNot(queriedParams, "storage_max_depth_ft", (x => typeof x === "number" && !isNaN(x)), errorMessagesToDisplay)        
      this.updateFormWithValueIfProvidedAndPresentPopulateErrorIfNot(queriedParams, "storage_initial_depth_ft", (x => typeof x === "number" && !isNaN(x)), errorMessagesToDisplay)        
      this.updateFormWithValueIfProvidedAndPresentPopulateErrorIfNot(queriedParams, "storage_area_sqft", (x => typeof x === "number" && !isNaN(x)), errorMessagesToDisplay)        
      this.updateFormWithValueIfProvidedAndPresentPopulateErrorIfNot(queriedParams, "infiltration_rate_inhr", (x => typeof x === "number" && !isNaN(x)), errorMessagesToDisplay)        
      this.updateFormWithValueIfProvidedAndPresentPopulateErrorIfNot(queriedParams, "rainfall_event_shutdown", (x => typeof x === "boolean"), errorMessagesToDisplay)        
      this.updateFormWithValueIfProvidedAndPresentPopulateErrorIfNot(queriedParams, "rainfall_event_depth_threshold", (x => typeof x === "number" && !isNaN(x)), errorMessagesToDisplay)        
      this.updateFormWithValueIfProvidedAndPresentPopulateErrorIfNot(queriedParams, "event_seperation_hrs", (x => typeof x === "number" && !isNaN(x)), errorMessagesToDisplay)        
      this.updateFormWithValueIfProvidedAndPresentPopulateErrorIfNot(queriedParams, "after_rain_delay_hrs", (x => typeof x === "number" && !isNaN(x)), errorMessagesToDisplay)        
      this.updateFormWithValueIfProvidedAndPresentPopulateErrorIfNot(queriedParams, "nearest_rainfall_station", (x => this.rainfallStations.some(y => x == y.properties.station)), errorMessagesToDisplay)        
      this.updateFormWithValueIfProvidedAndSomePresentPopulateErrorIfNot(queriedParams, "diversion_months_active", this.monthData, ((x, y) => x.some(z => z.id == y)), errorMessagesToDisplay);
      this.updateFormWithValueIfProvidedAndSomePresentPopulateErrorIfNot(queriedParams, "diversion_days_active", this.weekdayData, ((x, y) => x.some(z => z.id == y)), errorMessagesToDisplay);
      this.updateFormWithValueIfProvidedAndSomePresentPopulateErrorIfNot(queriedParams, "diversion_hours_active", this.hourData, ((x, y) => x.some(z => z.id == y)), errorMessagesToDisplay);

      this.lyraMessages = errorMessagesToDisplay;
      this.cdr.detectChanges();
      this.scrollIntoView(this.selectedDataCardRef);
    })
  }

  public updateFormWithValueIfProvidedAndPresentPopulateErrorIfNot(jsonObject : any, key : string, validityFunction : any, errors : any) {
    let value = jsonObject[key];
    let startOfString = jsonObject.hasOwnProperty("site") ? `Station with ID:${jsonObject["site"]}` : "Request";
    if (value == null || value == undefined) {
      errors.push(new Alert(`${startOfString} did not provide key:${key}. Will use default.`, AlertContext.Warning, true));
      return;
    }
    
    if (!validityFunction(value)) {
      errors.push(new Alert(`${startOfString} provided an invalid value for key:${key}. Will use default. Invalid value was:${value}`, AlertContext.Warning, true));
      return;
    }

    this.timeSeriesForm.patchValue({[key] : value});
  }

  public updateFormWithValueIfProvidedAndSomePresentPopulateErrorIfNot(jsonObject : any, key : string, listToCompare: any, comparisonFunction: any, errors : any) {
    let value = jsonObject[key];
    let startOfString = jsonObject.hasOwnProperty("site") ? `Station with ID:${jsonObject["site"]}` : "Request";
    if (value == null || value == undefined) {
      errors.push(new Alert(`${startOfString} did not provide key:${key}. Will use default.`, AlertContext.Warning, true));
      return;
    }

    let presentValues = value.filter(x => comparisonFunction(listToCompare, x)).map(x => x);
    
    if (presentValues.length != value.length) {
      if (presentValues.length == 0) {
        errors.push(new Alert(`${startOfString} provided invalid values for key:${key}. Will use default. Invalid values were:${value.join(", ")}`, AlertContext.Warning, true));
        return;
      }
      errors.push(new Alert(`${startOfString} provided some invalid values for key:${key}. Will use only valid values. Invalid values were:${value.filter(x => !comparisonFunction(listToCompare, x)).map(x => x).join(", ")}`, AlertContext.Warning, true));
    }

    this.timeSeriesForm.patchValue({[key] : presentValues});
  }
}
