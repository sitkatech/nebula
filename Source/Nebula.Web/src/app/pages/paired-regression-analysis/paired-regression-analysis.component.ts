import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators, FormArray, FormBuilder } from '@angular/forms';
import { LyraService } from 'src/app/services/lyra.service';
import { Alert } from 'src/app/shared/models/alert';
import { AlertContext } from 'src/app/shared/models/enums/alert-context.enum';
import { CustomRichTextType } from 'src/app/shared/models/enums/custom-rich-text-type.enum';
import { HydstraAggregationMode } from 'src/app/shared/models/hydstra/hydstra-aggregation-mode';
import { HydstraFilter } from 'src/app/shared/models/hydstra/hydstra-filter';
import { HydstraInterval } from 'src/app/shared/models/hydstra/hydstra-interval';
import { HydstraRegressionMethod } from 'src/app/shared/models/hydstra/hydstra-regression-method';
import { SiteVariable } from 'src/app/shared/models/site-variable';

declare var vegaEmbed: any;

@Component({
  selector: 'nebula-paired-regression-analysis',
  templateUrl: './paired-regression-analysis.component.html',
  styleUrls: ['./paired-regression-analysis.component.scss']
})
export class PairedRegressionAnalysisComponent implements OnInit {

  @ViewChild("mapDiv") mapElement: ElementRef;

  public mapID: string = 'PairedRegressionAnalysisStationSelectMap';

  public richTextTypeID = CustomRichTextType.MultiVariableMultiSite;

  public vegaSpec: Object = null;

  public hydstraIntervals: HydstraInterval[] = Object.values(HydstraInterval);
  public hydstraFilters: HydstraFilter[] = Object.values(HydstraFilter);
  public hydstraRegressionMethods: HydstraRegressionMethod[] = Object.values(HydstraRegressionMethod);

  public currentDate = new Date();
  public timeSeriesForm = new FormGroup({
    startDate: new FormControl({ year: this.currentDate.getUTCFullYear() - 5, month: this.currentDate.getUTCMonth() + 1, day: this.currentDate.getUTCDate() }, [Validators.required]),
    endDate: new FormControl({ year: this.currentDate.getUTCFullYear(), month: this.currentDate.getUTCMonth() + 1, day: this.currentDate.getUTCDate() }, [Validators.required]),
    interval: new FormControl(null, [Validators.required]),
    filter: new FormControl(null, [Validators.required]),
    regression_method: new FormControl(null, [Validators.required]),
    siteVariablesToQuery: new FormArray([])
  });
  public timeSeriesFormDefault = this.timeSeriesForm.value;

  public selectedSiteProperties: any;
  public selectedSiteAvailableVariables: SiteVariable[] = [];
  public selectedSiteStation: string = null;
  public selectedSiteName: string = null;
  public selectedVariables: SiteVariable[] = [];

  public errorOccurred: boolean;
  public errorMessage: string = null;
  public gettingTimeSeriesData: boolean = false;
  public allStations: any = null;
  public currentlyDisplayingRequestDto: any;
  public downloadingChartData: boolean;
  public lyraMessages: Alert[] = [];

  constructor(
    private cdr: ChangeDetectorRef,
    private lyraService: LyraService,
    private formBuilder: FormBuilder
  ) {
  }

  ngOnInit() {
    this.lyraService.getSiteLocationGeoJson().subscribe(result => {
      this.allStations = result.features;
    })
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
      interval: this.timeSeriesForm.get('interval').value,
      regression_method: this.timeSeriesForm.get('regression_method').value,
      timeseries: this.getTimeSeriesListFromTimerSeriesFormObject()
    };
    this.gettingTimeSeriesData = true;
    this.errorOccurred = false;
    this.vegaSpec = null;
    this.currentlyDisplayingRequestDto = null;
    this.lyraMessages = [];
    this.timeSeriesForm.disable();
    this.lyraService.getTimeSeriesData(swnTimeSeriesRequestDto).subscribe(result => {
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
      this.timeSeriesForm.enable();
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
        this.timeSeriesForm.enable();
      });
  }

  public downloadChartData() {
    if (!this.currentlyDisplayingRequestDto) {
      return;
    }

    this.downloadingChartData = true;
    this.timeSeriesForm.disable();
    this.lyraService.downloadTimeSeriesData(this.currentlyDisplayingRequestDto).subscribe(result => {
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
      a.download = `SWN_Paired_Regression_Analysis_Data_Request_${date.getMonth() + 1}_${date.getDate()}_${date.getFullYear()}_${date.getHours()}_${date.getMinutes()}.csv`;
      a.click();
      window.URL.revokeObjectURL(url);
      this.downloadingChartData = false;
      this.timeSeriesForm.enable();
    })
  }

  public updateSelectedStation(selectedStationProperties: any) {
    this.selectedSiteName = selectedStationProperties.stname;
    this.getAvailableVariables(selectedStationProperties);
    this.selectedSiteStation = selectedStationProperties.station;
  }

  public getAvailableVariables(featureProperties: any) {
    this.selectedSiteAvailableVariables = [];
    let baseSiteVariable = new SiteVariable({ stationShortName: featureProperties.shortname, station: featureProperties.station });

    if (featureProperties.has_conductivity) {
      let conductivityInfo = featureProperties.conductivity_info;
      let conductivitySiteVariable = Object.assign(new SiteVariable({
        name: conductivityInfo.name,
        variable: conductivityInfo.variable,
        startDate: new Date(`${conductivityInfo.period_start.slice(0, 4)}-${conductivityInfo.period_start.slice(4, 6)}-${conductivityInfo.period_start.slice(6, 8)}`).toLocaleDateString(),
        endDate: new Date(`${conductivityInfo.period_end.slice(0, 4)}-${conductivityInfo.period_end.slice(4, 6)}-${conductivityInfo.period_end.slice(6, 8)}`).toLocaleDateString(),
      }), baseSiteVariable);
      this.selectedSiteAvailableVariables.push(conductivitySiteVariable);
    }

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

    if (featureProperties.has_rainfall) {
      let rainfallInfo = featureProperties.rainfall_info;
      let rainfallSiteVariable = Object.assign(new SiteVariable({
        name: rainfallInfo.name,
        variable: rainfallInfo.variable,
        startDate: new Date(`${rainfallInfo.period_start.slice(0, 4)}-${rainfallInfo.period_start.slice(4, 6)}-${rainfallInfo.period_start.slice(6, 8)}`).toLocaleDateString(),
        endDate: new Date(`${rainfallInfo.period_end.slice(0, 4)}-${rainfallInfo.period_end.slice(4, 6)}-${rainfallInfo.period_end.slice(6, 8)}`).toLocaleDateString(),
      }), baseSiteVariable);
      this.selectedSiteAvailableVariables.push(rainfallSiteVariable);
    }
    else if (featureProperties.nearest_rainfall_station != null) {
      let rainfallStationProperties = this.allStations.filter(x => x.properties.index === featureProperties.nearest_rainfall_station)[0].properties;
      let rainfallInfo = rainfallStationProperties.rainfall_info;
      let rainfallSiteVariable = new SiteVariable({
        name: rainfallInfo.name,
        variable: rainfallInfo.variable,
        gage: rainfallStationProperties.stname,
        startDate: new Date(`${rainfallInfo.period_start.slice(0, 4)}-${rainfallInfo.period_start.slice(4, 6)}-${rainfallInfo.period_start.slice(6, 8)}`).toLocaleDateString(),
        endDate: new Date(`${rainfallInfo.period_end.slice(0, 4)}-${rainfallInfo.period_end.slice(4, 6)}-${rainfallInfo.period_end.slice(6, 8)}`).toLocaleDateString(),
        stationShortName: rainfallStationProperties.shortname,
        station: rainfallStationProperties.station
      });
      this.selectedSiteAvailableVariables.push(rainfallSiteVariable);
    }

    if (featureProperties.has_raw_level) {
      let rawLevelInfo = featureProperties.raw_level_info;
      let rawLevelSiteVariable = Object.assign(new SiteVariable({
        name: rawLevelInfo.name,
        variable: rawLevelInfo.variable,
        startDate: new Date(`${rawLevelInfo.period_start.slice(0, 4)}-${rawLevelInfo.period_start.slice(4, 6)}-${rawLevelInfo.period_start.slice(6, 8)}`).toLocaleDateString(),
        endDate: new Date(`${rawLevelInfo.period_end.slice(0, 4)}-${rawLevelInfo.period_end.slice(4, 6)}-${rawLevelInfo.period_end.slice(6, 8)}`).toLocaleDateString(),
      }), baseSiteVariable);
      this.selectedSiteAvailableVariables.push(rawLevelSiteVariable);
    }

    this.selectedSiteAvailableVariables.push(Object.assign(new SiteVariable({
      name: "Estimated Urban Drool",
      variable: "urban_drool",
    }), baseSiteVariable));
  }

  public siteSelectedAndVariablesFound(): boolean {
    return this.selectedSiteName && this.selectedSiteAvailableVariables != null && this.selectedSiteAvailableVariables.length > 0
  }

  public canSelectVariable(variable: SiteVariable): boolean {
    return this.selectedVariables.length <= 2 && this.variableNotPresentInSelectedVariables(variable) && !this.isActionBeingPerformed()
  }

  public addVariableToSelection(variable: SiteVariable): void {
    this.selectedVariables.push(variable);
    this.addSiteVariableToQuery(variable);
    this.cdr.detectChanges();
  }

  public removeVariableFromSelection(index: number): void {
    this.selectedVariables.splice(index, 1);
    this.removeSiteVariableToQuery(index);
    if (this.selectedVariables.length == 0) {
      this.lyraMessages = [];
    }
  }

  public clearAllVariables(): void {
    this.selectedVariables = [];
    this.lyraMessages = [];
    this.siteVariablesToQuery().clear();
  }

  public variableNotPresentInSelectedVariables(variable: SiteVariable): boolean {
    return this.selectedVariables.length == 0 || !this.selectedVariables.some(x => x.name == variable.name && x.station == variable.station);
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

  //#region Form Functionality

  get f() {
    return this.timeSeriesForm.controls;
  }

  siteVariablesToQuery(): FormArray {
    return this.timeSeriesForm.get("siteVariablesToQuery") as FormArray
  }

  newSiteVariableToQuery(variable: SiteVariable): FormGroup {
    return this.formBuilder.group({
      variable: variable
    })
  }

  addSiteVariableToQuery(variable) {
    this.siteVariablesToQuery().push(this.newSiteVariableToQuery(variable));
  }

  removeSiteVariableToQuery(i: number) {
    this.siteVariablesToQuery().removeAt(i);
  }

  getTimeSeriesListFromTimerSeriesFormObject() {
    return this.siteVariablesToQuery().value.map(x => ({
      variable: x.variable.variable,
      site: x.variable.station
    }))
  }

  public getDateFromTimeSeriesFormDateObject(formFieldName: string): string {
    let date = this.timeSeriesForm.get(formFieldName).value;
    return `${date["year"]}-${date["month"].toString().padStart(2, '0')}-${date["day"].toString().padStart(2, '0')}`;
  }

  //#endregion

}
