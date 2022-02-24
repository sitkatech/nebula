import { Component, OnInit, ViewChild, ElementRef, EventEmitter, ApplicationRef, ChangeDetectorRef, ViewChildren } from '@angular/core';
import { LyraService } from 'src/app/services/lyra.service.js';
import { FormGroup, FormControl, Validators, FormArray, FormBuilder } from '@angular/forms';
import { CustomRichTextType } from 'src/app/shared/models/enums/custom-rich-text-type.enum';
import { SiteVariable } from 'src/app/shared/models/site-variable';
import { Alert } from 'src/app/shared/models/alert';
import { AlertContext } from 'src/app/shared/models/enums/alert-context.enum';
import { HydstraAggregationMethod } from 'src/app/shared/models/hydstra/hydstra-aggregation-mode';
import { HydstraInterval } from "src/app/shared/models/hydstra/hydstra-interval";
import { HydstraWeatherCondition } from 'src/app/shared/models/hydstra/hydstra-weather-condition';
import { UserDetailedDto } from 'src/app/shared/models';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { ActivatedRoute } from '@angular/router';
import { StationSelectCardComponent } from 'src/app/shared/components/station-select-card/station-select-card.component';
import { DateTime } from 'luxon';

declare var $: any;
declare var vegaEmbed: any;

@Component({
  selector: 'nebula-time-series-analysis',
  templateUrl: './time-series-analysis.component.html',
  styleUrls: ['./time-series-analysis.component.scss']
})
export class TimeSeriesAnalysisComponent implements OnInit {
  public watchUserChangeSubscription: any;
  public currentUser: UserDetailedDto;

  @ViewChild("selectedDataCardRef") selectedDataCardRef: ElementRef;
  @ViewChild("stationSelect") stationSelect: StationSelectCardComponent;

  public mapID: string = 'TimeSeriesAnalysisStationSelectMap';

  public richTextTypeID = CustomRichTextType.TimeSeriesAnalysis;

  public vegaSpec: Object = null;

  public hydstraAggregationMethods: HydstraAggregationMethod[] = Object.values(HydstraAggregationMethod);
  public hydstraIntervals: HydstraInterval[] = Object.values(HydstraInterval);
  public hydstraWeatherConditions: HydstraWeatherCondition[] = Object.values(HydstraWeatherCondition)

  public currentDate = DateTime.utc();
  public startDate = this.currentDate.minus({months:3});
  public timeSeriesForm = new FormGroup({
    start_date: new FormControl({ year: this.startDate.year, month: this.startDate.month, day: this.startDate.day }, [Validators.required]),
    end_date: new FormControl({ year: this.currentDate.year, month: this.currentDate.month, day: this.currentDate.day }, [Validators.required]),
    timeseries: new FormArray([])
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
  public currentlyDisplayingRequestDto: any;
  public downloadingChartData: boolean;
  public lyraMessages: Alert[] = [];
  currentlyDisplayingRequestLinkText: string;

  constructor(
    private cdr: ChangeDetectorRef,
    private lyraService: LyraService,
    private formBuilder: FormBuilder,
    private authenticationService: AuthenticationService,
    private route: ActivatedRoute
  ) {
  }

  ngOnInit() {
    this.watchUserChangeSubscription = this.authenticationService.currentUserSetObservable.subscribe(currentUser => {
      this.currentUser = currentUser;
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

    if (!this.timeSeriesForm.valid || !this.timeseries().valid) {
      Object.keys(this.timeSeriesForm.controls).forEach(field => {
        const control = this.timeSeriesForm.get(field);
        control.markAsTouched({ onlySelf: true });
      });
      for (let [index, formGroup] of this.timeseries().controls.entries()) {
        if (formGroup instanceof FormGroup) {
          Object.keys(formGroup.controls).forEach(field => {
            const control = this.timeseries().controls[index].get(field);
            control.markAsTouched({ onlySelf: true });
          })
        }
      }
      return;
    }

    let swnTimeSeriesRequestDto =
    {
      start_date: this.getDateFromTimeSeriesFormDateObject('start_date'),
      end_date: this.getDateFromTimeSeriesFormDateObject('end_date'),
      timeseries: this.getTimeSeriesListFromTimerSeriesFormObject()
    };
    this.gettingTimeSeriesData = true;
    this.errorOccurred = false;
    this.vegaSpec = null;
    this.currentlyDisplayingRequestDto = null;
    this.lyraMessages = [];
    this.timeSeriesForm.disable({ emitEvent: false });
    this.lyraService.getTimeSeriesAnalysisPlot(swnTimeSeriesRequestDto).subscribe(result => {
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
      this.timeSeriesForm.enable({ emitEvent: false });
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
        this.timeSeriesForm.enable({ emitEvent: false });
      });
  }

  public downloadChartData() {
    if (!this.currentlyDisplayingRequestDto) {
      return;
    }

    this.downloadingChartData = true;
    this.timeSeriesForm.disable({ emitEvent: false });
    this.lyraService.downloadTimeSeriesAnalysisData(this.currentlyDisplayingRequestDto).subscribe(result => {
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
      a.download = `SWN_Multi_Site_Multi_Variable_Data_Request_${date.getMonth() + 1}_${date.getDate()}_${date.getFullYear()}_${date.getHours()}_${date.getMinutes()}.csv`;
      a.click();
      window.URL.revokeObjectURL(url);
      this.downloadingChartData = false;
      this.timeSeriesForm.enable({ emitEvent: false });
    })
  }

  public getAvailableAggregationMethods(variable: SiteVariable): HydstraAggregationMethod[] {
    return this.hydstraAggregationMethods.filter(x => variable.allowedAggregations.includes(x.value));
  }

  public addVariableToSelection(variable: SiteVariable): void {
    this.addSiteVariableToQuery(variable);
    this.clearResults();
    this.cdr.detectChanges();
  }

  public removeVariableFromSelection(index: number): void {
    this.removeSiteVariableToQuery(index);
    this.clearResults();
  }

  public clearAllVariables(): void {
    this.timeseries().clear();
    this.clearResults();
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

  public scrollIntoView(el: ElementRef) {
    el.nativeElement.scrollIntoView(true)
  }

  public formatDateForNgbDatepicker(date: Date): any {
    let dateToChange = new Date(date);
    return { year: dateToChange.getUTCFullYear(), month: dateToChange.getUTCMonth() + 1, day: dateToChange.getUTCDate() };
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

  timeseries(): FormArray {
    return this.timeSeriesForm.get("timeseries") as FormArray
  }

  newSiteVariableToQuery(variable: SiteVariable): FormGroup {
    return this.formBuilder.group({
      variable: variable,
      interval: new FormControl(HydstraInterval.Daily.value, [Validators.required]),
      aggregation_method: new FormControl(variable.allowedAggregations[0], [Validators.required]),
      weather_condition: new FormControl(HydstraWeatherCondition.Both.value, [Validators.required])
    })
  }

  addSiteVariableToQuery(variable) {
    this.timeseries().push(this.newSiteVariableToQuery(variable));
  }

  removeSiteVariableToQuery(i: number) {
    this.timeseries().removeAt(i);
  }

  getTimeSeriesListFromTimerSeriesFormObject() {
    return this.timeseries().value.map(x => ({
      variable: x.variable.variable,
      site: x.variable.station,
      interval: x.interval,
      weather_condition: x.weather_condition,
      aggregation_method: x.aggregation_method
    }))
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

  public populateFormFromURL() {
    this.route.queryParams.subscribe(params => {
      if (params == null || params == undefined || !params.hasOwnProperty("json")) {
        return;
      }

      let queriedParams = JSON.parse(params["json"]);

      //Don't bother if we don't have any timeseries
      if (!queriedParams.hasOwnProperty("timeseries")) {
        return;
      }

      if (queriedParams["start_date"] != null) {
        let start_date = new Date(queriedParams["start_date"]);
        this.timeSeriesForm.patchValue({ start_date: { year: start_date.getUTCFullYear(), month: start_date.getUTCMonth() + 1, day: start_date.getUTCDate() } });
      }

      if (queriedParams["end_date"] != null) {
        let end_date = new Date(queriedParams["end_date"]);
        this.timeSeriesForm.patchValue({ end_date: { year: end_date.getUTCFullYear(), month: end_date.getUTCMonth() + 1, day: end_date.getUTCDate() } });
      }

      let failuresToDecrementBy = 0;
      let errorMessagesToDisplay = [];

      queriedParams["timeseries"].forEach((x, index) => {
        let message = this.stationSelect.externalAddSiteVariableReturnMessageIfFailed(x["site"], x["variable"]);
        if (message != null && message != undefined) {
          errorMessagesToDisplay.push(new Alert(message, AlertContext.Danger, true));
          failuresToDecrementBy++;
          return;
        }

        this.updateFormWithValueIfProvidedAndPresentPopulateErrorIfNot(x, "aggregation_method", (x => this.selectedVariables[index - failuresToDecrementBy].allowedAggregations.some(y => y == x)), this.timeseries().controls[index], errorMessagesToDisplay)
        this.updateFormWithValueIfProvidedAndPresentPopulateErrorIfNot(x, "interval", (x => HydstraInterval.all().some(y => y.value == x)), this.timeseries().controls[index], errorMessagesToDisplay)
        this.updateFormWithValueIfProvidedAndPresentPopulateErrorIfNot(x, "weather_condition", (x => HydstraWeatherCondition.all().some(y => y.value == x)), this.timeseries().controls[index], errorMessagesToDisplay)
      })

      this.lyraMessages = errorMessagesToDisplay;
      this.cdr.detectChanges();
      this.scrollIntoView(this.selectedDataCardRef);
    })
  }

  public updateFormWithValueIfProvidedAndPresentPopulateErrorIfNot(jsonObject: any, key: string, validityFunction: any, toUpdate: any, errors: any) {
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

    toUpdate.patchValue({ [key]: value });
  }
}
