import { ChangeDetectorRef, Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { SiteFilterEnum } from '../../models/enums/site-filter.enum';
import { SiteVariable } from '../../models/site-variable';
import { StationSelectMapComponent } from '../station-select-map/station-select-map.component';

@Component({
  selector: 'station-select-card',
  templateUrl: './station-select-card.component.html',
  styleUrls: ['./station-select-card.component.scss']
})
export class StationSelectCardComponent implements OnInit {

  @ViewChild("mapDiv") mapElement: ElementRef;
  @ViewChild(StationSelectMapComponent)
  private mapComponent!: StationSelectMapComponent;

  @Input()
  public mapID: string;
  @Input()
  public defaultSelectedMapFilter: number = SiteFilterEnum.AllSites
  @Input()
  public selectedVariables: SiteVariable[];
  @Input()
  public variableNamesAllowedToBeAdded: string[] = ["All"];
  @Input()
  public disableAddingVariables: boolean = false;
  @Output()
  public addingVariableEvent = new EventEmitter<SiteVariable>();

  public selectedSiteProperties: any;
  public selectedSiteAvailableVariables: SiteVariable[] = [];
  public selectedSiteStation: string = null;
  public selectedSiteName: string = null;
  public canViewTributaryArea: boolean = false;
  public canZoomTributaryArea: boolean = false;

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
    let baseSiteVariable = new SiteVariable(
      {
        stationShortName: featureProperties.shortname,
        station: featureProperties.station,
        nearestRainfallStationInfo: {
          stationLongName: featureProperties.nearest_rainfall_station_info.stname,
          station: featureProperties.nearest_rainfall_station_info.station
        }
      });

    if (featureProperties.variables == null || featureProperties.variables.length == 0) {
      return;
    }

    for (let variableName of featureProperties.variables) {
      let variableInfo = featureProperties[variableName];
      let siteVariable = Object.assign(new SiteVariable({
        name: variableInfo.name,
        variable: variableInfo.variable,
        startDate: new Date(`${variableInfo.period_start.slice(0, 4)}-${variableInfo.period_start.slice(4, 6)}-${variableInfo.period_start.slice(6, 8)}`).toLocaleDateString(),
        endDate: new Date(`${variableInfo.period_end.slice(0, 4)}-${variableInfo.period_end.slice(4, 6)}-${variableInfo.period_end.slice(6, 8)}`).toLocaleDateString(),
        allowedAggregations: variableInfo.allowed_aggregations
      }), baseSiteVariable);
      this.selectedSiteAvailableVariables.push(siteVariable);
    }

    if (!featureProperties.has_rainfall && featureProperties.nearest_rainfall_station != null) {
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

    this.canViewTributaryArea = featureProperties.upstream;
  }

  public siteSelectedAndVariablesFound(): boolean {
    return this.selectedSiteName && this.selectedSiteAvailableVariables != null && this.selectedSiteAvailableVariables.length > 0
  }

  public variableNameCanBeAddedToSelection(variableName: string): boolean {
    if (this.variableNamesAllowedToBeAdded.length == 1 && this.variableNamesAllowedToBeAdded[0] == "All") {
      return true;
    }

    return this.variableNamesAllowedToBeAdded.length > 0 && this.variableNamesAllowedToBeAdded.includes(variableName);
  }

  public addVariableToSelection(variable: SiteVariable): void {
    this.selectedVariables.push(variable);
    this.addingVariableEvent.emit(variable);
    this.cdr.detectChanges();
  }

  public variableNotPresentInSelectedVariables(variable: SiteVariable): boolean {
    return this.selectedVariables.length == 0 || !this.selectedVariables.some(x => x.name == variable.name && x.station == variable.station);
  }

  public viewTributaryArea() {
    this.mapComponent.viewTributaryArea();
  }

  public updateCanZoomTributaryArea(value : boolean) {
    debugger;
    this.canZoomTributaryArea = value;
  }

  public zoomInOnTributaryArea() {
    this.mapComponent.zoomInOnTributaryArea();
  }
}
