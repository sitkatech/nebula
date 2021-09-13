import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators, FormArray, FormBuilder } from '@angular/forms';
import { AnonymousSubject } from 'rxjs/internal/Subject';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { LyraService } from 'src/app/services/lyra.service';
import { UserDetailedDto } from 'src/app/shared/models';
import { Alert } from 'src/app/shared/models/alert';
import { AlertContext } from 'src/app/shared/models/enums/alert-context.enum';
import { CustomRichTextType } from 'src/app/shared/models/enums/custom-rich-text-type.enum';
import { SiteFilterEnum } from 'src/app/shared/models/enums/site-filter.enum';
import { HydstraAggregationMode } from 'src/app/shared/models/hydstra/hydstra-aggregation-mode';
import { HydstraFilter } from 'src/app/shared/models/hydstra/hydstra-filter';
import { HydstraInterval } from 'src/app/shared/models/hydstra/hydstra-interval';
import { SiteVariable } from 'src/app/shared/models/site-variable';

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

  public mapID: string = 'DiversionScenarioStationSelectMap';

  public richTextTypeID = CustomRichTextType.DiversionScenario;
  public defaultSelectedMapFilter = SiteFilterEnum.HasDischarge;

  public vegaSpec: Object = null;

  public hydstraFilters: HydstraFilter[] = HydstraFilter.all();

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
    startDate: new FormControl({ year: this.currentDate.getUTCFullYear(), month: this.currentDate.getUTCMonth() - 2, day: this.currentDate.getUTCDate() }, [Validators.required]),
    endDate: new FormControl({ year: this.currentDate.getUTCFullYear(), month: this.currentDate.getUTCMonth() + 1, day: this.currentDate.getUTCDate() }, [Validators.required]),
    site: new FormControl(null, [Validators.required]),
    diversionRate: new FormControl(0, [Validators.required]),
    storageMaxDepth: new FormControl(0, [Validators.required]),
    storageInitialDepth: new FormControl(0, [Validators.required]),
    storageArea: new FormControl(0, [Validators.required]),
    infiltrationRate: new FormControl(0, [Validators.required]),
    filter: new FormControl(HydstraFilter.Both.value, [Validators.required]),
    nearestRainfallStation: new FormControl(null, [Validators.required]),
    monthsActive: new FormControl(this.monthData.map(x => x.id), [Validators.required]),
    daysActive: new FormControl(this.weekdayData.map(x => x.id), [Validators.required]),
    hoursActive: new FormControl(this.hourData.map(x => x.id), [Validators.required]),
  });
  public timeSeriesFormDefault = this.timeSeriesForm.value;


  constructor(
    private cdr: ChangeDetectorRef,
    private lyraService: LyraService,
    private authenticationService: AuthenticationService
  ) {
  }

  ngOnInit() {
    this.watchUserChangeSubscription = this.authenticationService.currentUserSetObservable.subscribe(currentUser => {
      this.currentUser = currentUser;
      this.lyraService.getSiteLocationGeoJson().subscribe(result => {
        this.rainfallStations = result.features.filter(x => x.properties.has_rainfall);
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
      start_date: this.getDateFromTimeSeriesFormDateObject('startDate'),
      end_date: this.getDateFromTimeSeriesFormDateObject('endDate'),
      site: this.timeSeriesForm.get('site').value,
      diversion_rate_cfs: this.timeSeriesForm.get('diversionRate').value,
      storage_max_depth_ft: this.timeSeriesForm.get('storageMaxDepth').value,
      storage_initial_depth_ft: this.timeSeriesForm.get('storageInitialDepth').value,
      storage_area_sqft: this.timeSeriesForm.get('storageArea').value,
      infiltration_rate_inhr: this.timeSeriesForm.get('infiltrationRate').value,
      operated_weather_condition: this.timeSeriesForm.get('filter').value,
      nearest_rainfall_station: this.timeSeriesForm.get('nearestRainfallStation').value,
      diversion_months_active: this.timeSeriesForm.get('monthsActive').value,
      diversion_days_active: this.timeSeriesForm.get('daysActive').value,
      diversion_hours_active: this.timeSeriesForm.get('hoursActive').value
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
        startDate: new Date(`${dischargeInfo.period_start.slice(0, 4)}-${dischargeInfo.period_start.slice(4, 6)}-${dischargeInfo.period_start.slice(6, 8)}`).toLocaleDateString(),
        endDate: new Date(`${dischargeInfo.period_end.slice(0, 4)}-${dischargeInfo.period_end.slice(4, 6)}-${dischargeInfo.period_end.slice(6, 8)}`).toLocaleDateString(),
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
    this.timeSeriesForm.patchValue({ nearestRainfallStation: variable.nearestRainfallStationInfo.station});
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

  // public triggerTimeSeriesWithVariableValuesAndScrollIntoView(el: HTMLElement, variable: SiteVariable) {
  //   this.scroll(el);
  //   this.timeSeriesForm.controls.startDate.setValue(this.formatDateForNgbDatepicker(variable.startDate));
  //   this.timeSeriesForm.controls.endDate.setValue(this.formatDateForNgbDatepicker(variable.endDate));
  //   this.getTimeSeriesData();
  // }

  public formatDateForNgbDatepicker(date: Date): any {
    let dateToChange = new Date(date);
    return { year: dateToChange.getUTCFullYear(), month: dateToChange.getUTCMonth() + 1, day: dateToChange.getUTCDate() };
  }

  public scroll(el: HTMLElement) {
    el.scrollIntoView();
  }

  public closeAlert(index: number) {
    this.lyraMessages.splice(index, 1);
  }

  public clearResults() {
    this.vegaSpec = null;
    this.currentlyDisplayingRequestDto = null;
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
}
