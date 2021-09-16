import { Component, OnInit, ViewChild, ElementRef, EventEmitter, ApplicationRef, ChangeDetectorRef } from '@angular/core';
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

declare var $: any;
declare var vegaEmbed: any;

@Component({
  selector: 'nebula-multi-variable-multi-site',
  templateUrl: './multi-variable-multi-site.component.html',
  styleUrls: ['./multi-variable-multi-site.component.scss']
})
export class MultiVariableMultiSiteComponent implements OnInit {
  public watchUserChangeSubscription: any;
  public currentUser: UserDetailedDto;

  @ViewChild("mapDiv") mapElement: ElementRef;

  public mapID: string = 'MultiVariableMultiSiteStationSelectMap';

  public richTextTypeID = CustomRichTextType.MultiVariableMultiSite;

  public vegaSpec: Object = null;

  public hydstraAggregationMethods: HydstraAggregationMethod[] = Object.values(HydstraAggregationMethod);
  public hydstraIntervals: HydstraInterval[] = Object.values(HydstraInterval);
  public hydstraWeatherConditions: HydstraWeatherCondition[] = Object.values(HydstraWeatherCondition)

  public currentDate = new Date();
  public timeSeriesForm = new FormGroup({
    startDate: new FormControl({ year: this.currentDate.getUTCFullYear(), month: this.currentDate.getUTCMonth() - 2, day: this.currentDate.getUTCDate() }, [Validators.required]),
    endDate: new FormControl({ year: this.currentDate.getUTCFullYear(), month: this.currentDate.getUTCMonth() + 1, day: this.currentDate.getUTCDate() }, [Validators.required]),
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
  public currentlyDisplayingRequestDto: any;
  public downloadingChartData: boolean;
  public lyraMessages: Alert[] = [];

  constructor(
    private cdr: ChangeDetectorRef,
    private lyraService: LyraService,
    private formBuilder: FormBuilder,
    private authenticationService: AuthenticationService
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

    if (!this.timeSeriesForm.valid || !this.siteVariablesToQuery().valid) {
      Object.keys(this.timeSeriesForm.controls).forEach(field => {
        const control = this.timeSeriesForm.get(field);
        control.markAsTouched({ onlySelf: true });
      });
      for (let [index, formGroup] of this.siteVariablesToQuery().controls.entries()) {
        if (formGroup instanceof FormGroup) {
          Object.keys(formGroup.controls).forEach(field => {
            const control = this.siteVariablesToQuery().controls[index].get(field);
            control.markAsTouched({ onlySelf: true });
          })
        }
      }
      return;
    }

    let swnTimeSeriesRequestDto =
    {
      start_date: this.getDateFromTimeSeriesFormDateObject('startDate'),
      end_date: this.getDateFromTimeSeriesFormDateObject('endDate'),
      timeseries: this.getTimeSeriesListFromTimerSeriesFormObject()
    };
    this.gettingTimeSeriesData = true;
    this.errorOccurred = false;
    this.vegaSpec = null;
    this.currentlyDisplayingRequestDto = null;
    this.lyraMessages = [];
    this.timeSeriesForm.disable({emitEvent: false});
    this.lyraService.getMultiVariableMultiSitePlot(swnTimeSeriesRequestDto).subscribe(result => {
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
    this.lyraService.downloadMultiVariableMultiSiteData(this.currentlyDisplayingRequestDto).subscribe(result => {
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
      this.timeSeriesForm.enable({emitEvent: false});
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
    this.siteVariablesToQuery().clear();
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
    this.lyraMessages = [];
    this.errorOccurred = false;
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
      variable: variable,
      timeInterval: new FormControl(HydstraInterval.Daily.value, [Validators.required]),
      aggregationMethod: new FormControl(variable.allowedAggregations[0], [Validators.required]),
      weatherCondition: new FormControl(HydstraWeatherCondition.Both.value, [Validators.required])
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
      site: x.variable.station,
      interval: x.timeInterval,
      weather_condition: x.weatherCondition,
      aggregation_method: x.aggregationMethod
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
}
