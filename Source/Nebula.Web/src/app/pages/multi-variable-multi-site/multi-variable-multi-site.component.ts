import { Component, OnInit, ViewChild, ElementRef, EventEmitter, ApplicationRef, ChangeDetectorRef } from '@angular/core';
import * as L from 'leaflet';
import * as esri from 'esri-leaflet'
import { GestureHandling } from "leaflet-gesture-handling";
import 'leaflet.snogylop';
import 'leaflet-loading';
import { CustomCompileService } from 'src/app/shared/services/custom-compile.service';
import { WfsService } from 'src/app/shared/services/wfs.service';
import { environment } from 'src/environments/environment';
import { WatershedService } from 'src/app/services/watershed/watershed.service';
import { LyraService } from 'src/app/services/lyra.service.js';
import { FormGroup, FormControl, Validators, FormArray, FormBuilder } from '@angular/forms';
import { forkJoin } from 'rxjs';
import { CustomRichTextType } from 'src/app/shared/models/enums/custom-rich-text-type.enum';
import { url } from 'inspector';
import { SiteVariable } from 'src/app/shared/models/site-variable';
import { AlertService } from 'src/app/shared/services/alert.service';
import { Alert } from 'src/app/shared/models/alert';
import { AlertContext } from 'src/app/shared/models/enums/alert-context.enum';

declare var $: any;
declare var vegaEmbed: any;

@Component({
  selector: 'nebula-multi-variable-multi-site',
  templateUrl: './multi-variable-multi-site.component.html',
  styleUrls: ['./multi-variable-multi-site.component.scss']
})
export class MultiVariableMultiSiteComponent implements OnInit {

  @ViewChild("mapDiv") mapElement: ElementRef;

  public richTextTypeID = CustomRichTextType.MultiVariableMultiSite;

  public mapID = "MultiVariableMultiSiteMap";
  public mapHeight = "500px";
  public map: L.Map;
  public featureLayer: any;
  public layerControl: L.Control.Layers;
  public tileLayers: { [key: string]: any } = {};
  public overlayLayers: { [key: string]: any } = {};
  public maskLayer: any;
  public siteLocationLayer: any;
  public wmsParams: any;
  public currentMask: L.Layers;
  public layerControlOpen: boolean = false;
  public iconDefault: any;
  public selectedIconDefault: any;
  public defaultMapZoom = 12;
  public afterSetControl = new EventEmitter();
  public afterLoadMap = new EventEmitter();
  public onMapMoveEnd = new EventEmitter();

  public vegaSpec: Object = null;

  public hydstraAggregationModes = [{ display: "Total", value: "tot" }, { display: "Average", value: "mean" }, { display: "Maximum", value: "max" }, { display: "Minimum", value: "min" }];
  public hydstraIntervals = [{ display: "Hourly", value: "hour" }, { display: "Daily", value: "day" }, { display: "Monthly", value: "month" }, { display: "Yearly", value: "year" }];
  public hydstraFilters = [{ display: "All (Wet + Dry)", value: "both" }, { display: "Dry", value: "dry" }, { display: "Wet", value: "wet" }];

  public currentDate = new Date();
  public timeSeriesForm = new FormGroup({
    startDate: new FormControl({ year: this.currentDate.getUTCFullYear() - 5, month: this.currentDate.getUTCMonth() + 1, day: this.currentDate.getUTCDate() }, [Validators.required]),
    endDate: new FormControl({ year: this.currentDate.getUTCFullYear(), month: this.currentDate.getUTCMonth() + 1, day: this.currentDate.getUTCDate() }, [Validators.required]),
    siteVariablesToQuery: new FormArray([])
  });
  public timeSeriesFormDefault = this.timeSeriesForm.value;

  public selectedSiteAvailableVariables: SiteVariable[] = [];
  public selectedSiteStation: string = null;
  public selectedSiteName: string = null;
  public selectedVariables: SiteVariable[] = [];

  public errorOccurred: boolean;
  public errorMessage: string = null;
  public gettingTimeSeriesData: boolean = false;
  public allStations: any;
  public currentlyDisplayingRequestDto: any;
  public downloadingChartData: boolean;
  public lyraMessages: Alert[] = [];

  constructor(
    private appRef: ApplicationRef,
    private compileService: CustomCompileService,
    private cdr: ChangeDetectorRef,
    private wfsService: WfsService,
    private watershedService: WatershedService,
    private lyraService: LyraService,
    private formBuilder: FormBuilder
  ) {
  }

  public ngOnInit(): void {

    this.tileLayers = Object.assign({}, {
      "Aerial": L.tileLayer('https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
        attribution: 'Aerial',
        maxNativeZoom: 16,
        maxZoom: 22
      }),
      "Street": L.tileLayer('https://services.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}', {
        attribution: 'Street',
        maxNativeZoom: 16,
        maxZoom: 22
      }),
      "Terrain": L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}', {
        attribution: 'Terrain',
        maxNativeZoom: 16,
        maxZoom: 22
      }),
      "Hillshade": L.tileLayer('https://wtb.maptiles.arcgis.com/arcgis/rest/services/World_Topo_Base/MapServer/tile/{z}/{y}/{x}', {
        attribution: 'Hillshade',
        maxNativeZoom: 15,
        maxZoom: 22
      })
    }, this.tileLayers);

    let backboneWMSOptions = ({
      layers: "Nebula:Backbones",
      transparent: true,
      format: "image/png",
      tiled: true,
      pane: "nebulaOverlayPane"
    } as L.WMSOptions);

    let watershedsWMSOptions = ({
      layers: "Nebula:Watersheds",
      transparent: true,
      format: "image/png",
      tiled: true,
      pane: "nebulaOverlayPane"
    } as L.WMSOptions);

    let rsbsWMSOptions = ({
      layers: "Nebula:RegionalSubbasins",
      transparent: true,
      format: "image/png",
      tiled: true,
      pane: "nebulaOverlayPane"
    } as L.WMSOptions);



    this.overlayLayers = Object.assign({}, {
      "<span><img src='../../assets/data-dashboard/backbone.png' height='12px' style='margin-bottom:3px;' /> Streams</span>": L.tileLayer.wms(environment.geoserverMapServiceUrl + "/wms?", backboneWMSOptions),
      "<span><img src='../../assets/data-dashboard/backbone.png' height='12px' style='margin-bottom:3px;' /> Watersheds</span>": L.tileLayer.wms(environment.geoserverMapServiceUrl + "/wms?", watershedsWMSOptions),
      "<span><img src='../../assets/data-dashboard/regionalSubbasin.png' height='12px' style='margin-bottom:3px;' /> Regional Subbasins</span>": L.tileLayer.wms(environment.geoserverMapServiceUrl + "/wms?", rsbsWMSOptions),
      "<span>Stormwater Network <br/> <img src='../../assets/data-dashboard/stormwaterNetwork.png' height='50'/> </span>": esri.dynamicMapLayer({ url: "https://ocgis.com/arcpub/rest/services/Flood/Stormwater_Network/MapServer/" })
    })

    this.compileService.configure(this.appRef);
  }

  public ngAfterViewInit(): void {
    this.initializeMap();
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
      a.download = `SWN_Multi_Site_Multi_Variable_Data_Request_${date.getMonth() + 1}_${date.getDate()}_${date.getFullYear()}_${date.getHours()}_${date.getMinutes()}.csv`;
      a.click();
      window.URL.revokeObjectURL(url);
      this.downloadingChartData = false;
      this.timeSeriesForm.enable();
    })
  }

  public getAvailableAggregationModes(variable: SiteVariable): any[] {
    return this.hydstraAggregationModes.filter(x => variable.allowedAggregations.includes(x.value));
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
      let rainfallStationProperties = this.allStations.filter(x => x.properties.index === featureProperties.nearest_rainfall_station)[0].properties;
      let rainfallInfo = rainfallStationProperties.rainfall_info;
      let rainfallSiteVariable = new SiteVariable({
        name: rainfallInfo.name,
        variable: rainfallInfo.variable,
        gage: rainfallStationProperties.stname,
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

    this.selectedSiteAvailableVariables.push(Object.assign(new SiteVariable({
      name: "Estimated Urban Drool",
      variable: "urban_drool",
      allowedAggregations: this.hydstraAggregationModes.filter(x => x.value == "tot").map(x => x.value)
    }), baseSiteVariable));
  }

  public siteSelectedAndVariablesFound(): boolean {
    return this.selectedSiteName && this.selectedSiteAvailableVariables != null && this.selectedSiteAvailableVariables.length > 0
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
      variable: variable,
      timeInterval: new FormControl(null, [Validators.required]),
      aggregationMode: new FormControl(null, [Validators.required]),
      filter: new FormControl(null, [Validators.required])
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
      weather_condition: x.filter,
      aggregation_method: x.aggregationMode
    }))
  }

  public getDateFromTimeSeriesFormDateObject(formFieldName: string): string {
    let date = this.timeSeriesForm.get(formFieldName).value;
    return `${date["year"]}-${date["month"].toString().padStart(2, '0')}-${date["day"].toString().padStart(2, '0')}`;
  }

  //#endregion

  //#region Map Functionality
  public initializeMap(): void {

    const mapOptions: L.MapOptions = {
      minZoom: 6,
      maxZoom: 22,
      layers: [
        this.tileLayers["Street"],
        this.overlayLayers["<span><img src='../../assets/data-dashboard/backbone.png' height='12px' style='margin-bottom:3px;' /> Streams</span>"],
        this.overlayLayers["<span><img src='../../assets/data-dashboard/backbone.png' height='12px' style='margin-bottom:3px;' /> Watersheds</span>"],
      ],
      gestureHandling: true,
      loadingControl: true

    } as L.MapOptions;

    this.map = L.map(this.mapID, mapOptions);
    this.initializePanes();
    this.setControl();
    this.initializeMapEvents();

    forkJoin(
      this.watershedService.getWatershedMask("Aliso Creek"),
      this.lyraService.getSiteLocationGeoJson()
    ).subscribe(([maskString, siteLocationObject]) => {
      this.maskLayer = L.geoJSON(maskString, {
        invert: true,
        style: function (feature) {
          return {
            fillColor: "#323232",
            fill: true,
            fillOpacity: 0.2,
            color: "#3388ff",
            weight: 5,
            stroke: true
          };
        }
      });

      L.Map.addInitHook("addHandler", "gestureHandling", GestureHandling);

      this.maskLayer.addTo(this.map);
      this.defaultFitBounds();
      let maskLayerPoints = maskString.features[0].geometry.coordinates[0];
      this.allStations = siteLocationObject.features;

      this.setupMarkers();

      this.siteLocationLayer = L.geoJSON(this.allStations, {
        onEachFeature: function (feature, layer) {
          layer.bindPopup('<p>' + feature.properties.stname + '</p>');
          layer.on('click', () => {
            this.errorOccurred = false;
            if (this.currentlySelectedLayer) {
              this.currentlySelectedLayer.setIcon(this.iconDefault);
            }
            layer.setIcon(this.selectedIconDefault);
            this.currentlySelectedLayer = layer;
            this.selectedSiteName = feature.properties.stname;
            this.getAvailableVariables(feature.properties);
            this.selectedSiteStation = feature.properties.station;
          });
        }.bind(this)
      });
      this.siteLocationLayer.addTo(this.map);
      this.siteLocationLayer.bringToFront();
    });
  }

  public initializePanes(): void {
    let nebulaOverlayPane = this.map.createPane("nebulaOverlayPane");
    nebulaOverlayPane.style.zIndex = 10000;
    this.map.getPane("markerPane").style.zIndex = 10001;
    this.map.getPane("popupPane").style.zIndex = 10002;
  }

  public setControl(): void {
    var loadingControl = L.Control.loading({
      separate: true
    });
    this.map.addControl(loadingControl);
    this.layerControl = new L.Control.Layers(this.tileLayers, this.overlayLayers)
      .addTo(this.map);
    this.map.zoomControl.setPosition('topright');

    this.afterSetControl.emit(this.layerControl);
  }

  public initializeMapEvents(): void {
    this.map.on('load', (event: L.LeafletEvent) => {
      this.afterLoadMap.emit(event);
    });
    this.map.on("moveend", (event: L.LeafletEvent) => {
      this.onMapMoveEnd.emit(event);
    });

    let dblClickTimer = null;

    //to handle click for select area vs double click for zoom
    this.map.on("click", (event: L.LeafletEvent) => {
      this.layerControlOpen = false;
      if (dblClickTimer !== null) {
        return;
      }
      dblClickTimer = setTimeout(() => {
        //this.getNeighborhoodFromLatLong(event.latlng, true);
        dblClickTimer = null;
      }, 200);
    }).on("dblclick", () => {
      clearTimeout(dblClickTimer);
      dblClickTimer = null;
      this.map.zoomIn();
    })

    $(".leaflet-control-layers").hover(
      () => { this.layerControlOpen = true; },
      () => { this.layerControlOpen = false; }
    );
  }

  //fitBounds will use it's default zoom level over what is sent in
  //if it determines that its max zoom is further away. This can make the 
  //map zoom out to inappropriate levels sometimes, and then setZoom 
  //won't be honored because it's in the middle of a zoom. So we'll manipulate
  //it a bit.
  public defaultFitBounds(): void {
    let target = this.map._getBoundsCenterZoom(this.maskLayer.getBounds(), null);
    this.map.setView(target.center, this.defaultMapZoom, null);
  }

  public fitBoundsWithPaddingAndFeatureGroup(featureGroup: L.featureGroup): void {
    let paddingHeight = $("#buttonDiv").innerHeight();
    let popupContent = $(".search-popup");
    if (popupContent !== null && popupContent !== undefined && popupContent.length == 1) {
      paddingHeight += popupContent.innerHeight();
    }

    this.map.fitBounds(featureGroup.getBounds(), { padding: [paddingHeight, paddingHeight] });
  }

  //Known bug in leaflet that during bundling the default image locations can get messed up
  //https://stackoverflow.com/questions/41144319/leaflet-marker-not-found-production-env
  //We could do some kind of custom marker which would require less extra, but this should work for now
  public setupMarkers() {
    this.iconDefault = this.buildMarker('assets/marker-icon.png', 'assets/marker-icon-2x.png');
    this.selectedIconDefault = this.buildMarker('/assets/main/map-icons/marker-icon-selected.png', '/assets/main/map-icons/marker-icon-2x-selected.png');

    L.Marker.prototype.options.icon = this.iconDefault;
  }

  public buildMarker(iconUrl: string, iconRetinaUrl: string): any {
    const shadowUrl = 'assets/marker-shadow.png';
    return L.icon({
      iconRetinaUrl,
      iconUrl,
      shadowUrl,
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      tooltipAnchor: [16, -28],
      shadowSize: [41, 41]
    });
  }
  //#endregion
}