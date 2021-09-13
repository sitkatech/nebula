import { ChangeDetectorRef, Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { SiteFilterEnum } from '../../models/enums/site-filter.enum';
import { SiteVariable } from '../../models/site-variable';

@Component({
  selector: 'station-select-card',
  templateUrl: './station-select-card.component.html',
  styleUrls: ['./station-select-card.component.scss']
})
export class StationSelectCardComponent implements OnInit {

  @ViewChild("mapDiv") mapElement: ElementRef;

  @Input()
  public mapID: string;
  @Input()
  public defaultSelectedFilter:number = SiteFilterEnum.AllSites
  @Input() 
  public selectedVariables: SiteVariable[];

  @Input()
  public disableAddingVariables: boolean = false;

  @Output()
  public addingVariableEvent = new EventEmitter<SiteVariable>();

  public selectedSiteProperties: any;
  public selectedSiteAvailableVariables: SiteVariable[] = [];
  public selectedSiteStation: string = null;
  public selectedSiteName: string = null;

  constructor(
    private cdr: ChangeDetectorRef
  ) {
  }

  ngOnInit() {
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
        allowedAggregations: conductivityInfo.allowed_aggregations
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
        allowedAggregations: dischargeInfo.allowed_aggregations
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
        allowedAggregations: rainfallInfo.allowed_aggregations
      }), baseSiteVariable);
      this.selectedSiteAvailableVariables.push(rainfallSiteVariable);
    }
    else if (featureProperties.nearest_rainfall_station != null) {
      let rainfallStationProperties = featureProperties.nearest_rainfall_station_info;
      let rainfallInfo = rainfallStationProperties.rainfall_info;
      let rainfallSiteVariable = new SiteVariable({
        name: rainfallInfo.name,
        variable: rainfallInfo.variable,
        gage: featureProperties.nearest_rainfall_station.stname,
        startDate: new Date(`${rainfallInfo.period_start.slice(0, 4)}-${rainfallInfo.period_start.slice(4, 6)}-${rainfallInfo.period_start.slice(6, 8)}`).toLocaleDateString(),
        endDate: new Date(`${rainfallInfo.period_end.slice(0, 4)}-${rainfallInfo.period_end.slice(4, 6)}-${rainfallInfo.period_end.slice(6, 8)}`).toLocaleDateString(),
        allowedAggregations: rainfallInfo.allowed_aggregations,
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
        allowedAggregations: rawLevelInfo.allowed_aggregations
      }), baseSiteVariable);
      this.selectedSiteAvailableVariables.push(rawLevelSiteVariable);
    }

    // this.selectedSiteAvailableVariables.push(Object.assign(new SiteVariable({
    //   name: "Estimated Urban Drool",
    //   variable: "urban_drool",
    //   allowedAggregations: this.hydstraAggregationModes.filter(x => x.value == "tot").map(x => x.value)
    // }), baseSiteVariable));
  }

  public siteSelectedAndVariablesFound(): boolean {
    return this.selectedSiteName && this.selectedSiteAvailableVariables != null && this.selectedSiteAvailableVariables.length > 0
  }

  public addVariableToSelection(variable: SiteVariable): void {
    this.selectedVariables.push(variable);
    this.addingVariableEvent.emit(variable);
    this.cdr.detectChanges();
  }

  public variableNotPresentInSelectedVariables(variable: SiteVariable): boolean {
    debugger;
    return this.selectedVariables.length == 0 || !this.selectedVariables.some(x => x.name == variable.name && x.station == variable.station);
  }
}
