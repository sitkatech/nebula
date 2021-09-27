import { ApplicationRef, ChangeDetectorRef, Component, ElementRef, EventEmitter, HostListener, Input, OnInit, Output, ViewChild } from '@angular/core';
import { SiteFilterEnum } from '../../models/enums/site-filter.enum';
import { SiteVariable } from '../../models/site-variable';
import * as L from 'leaflet';
import * as esri from 'esri-leaflet'
import { GestureHandling } from "leaflet-gesture-handling";
import 'leaflet.snogylop';
import 'leaflet-loading';
import { CustomCompileService } from 'src/app/shared/services/custom-compile.service';
import { environment } from 'src/environments/environment';
import { WatershedService } from 'src/app/services/watershed/watershed.service';
import { forkJoin } from 'rxjs';
import { LyraService } from 'src/app/services/lyra.service';
import './leaflet.topojson.js'

declare var $: any;

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
  public defaultSelectedMapFilter: number = SiteFilterEnum.AllSites
  @Input()
  public selectedVariables: SiteVariable[];
  @Input()
  public lyraStationAvailableVariablesKey: string = "variables";
  @Input()
  public variableNamesAllowedToBeAdded: string[] = ["All"];
  @Input()
  public disableAddingVariables: boolean = false;
  @Input()
  public mapHeight: string = "500px";
  @Input()
  public layerControlOpen: boolean = false;
  @Input()
  public defaultMapZoom = 12;
  @Input()
  public canAddDuplicateVariable: boolean = false;
  @Output()
  public addingVariableEvent = new EventEmitter<SiteVariable>();
  @Output()
  public afterSetControl = new EventEmitter();
  @Output()
  public afterLoadMap = new EventEmitter();
  @Output()
  public onMapMoveEnd = new EventEmitter();
  @Output()
  public selectedStationPropertiesUpdateEvent = new EventEmitter();
  @Output()
  public displayingTributaryAreaLayerUpdateEvent = new EventEmitter<boolean>();
  @Output()
  public mapAndStationsLoadedEvent = new EventEmitter();

  public selectedSiteProperties: any;
  public selectedSiteAvailableVariables: SiteVariable[] = [];
  public selectedSiteStation: string = null;
  public selectedSiteDescription: string = null;
  public selectedSiteShortName: string = null;
  public canViewTributaryArea: boolean = false;
  public canZoomTributaryArea: boolean = false;

  public map: L.Map;
  public featureLayer: any;
  public layerControl: L.Control.Layers;
  public tileLayers: { [key: string]: any } = {};
  public overlayLayers: { [key: string]: any } = {};
  public maskLayer: any;
  public siteLocationLayer: any;
  public wmsParams: any;
  public currentMask: L.Layers;
  public iconDefault: any;
  public selectedIconDefault: any;
  public selectedStationProperties: any;
  public selectedStationTributaryAreaLayer: any;
  public allStationsLayer: any;
  public hasRainfallLayer: any;
  public hasDischargeLayer: any;
  public hasConductivityLayer: any;
  public rainfallIconDefault: any;
  public dischargeIconDefault: any;
  public conductivityIconDefault: any;
  public currentlySelectedLayer: any;
  public currentlySelectedUnderlyingLayer: any;
  public markers: L.FeatureGroup;
  public topoJSONrsbs: any;

  public allStations: any;

  public stationFilterTypes: StationFilterSelect[] = [];
  public selectedStationFilter: StationFilterSelect;

  public searchText: string;
  public searchSuggestions: any[];
  public isSearching: boolean;
  public availableSitesToSearchFrom: any;

  constructor(
    private appRef: ApplicationRef,
    private cdr: ChangeDetectorRef,
    private compileService: CustomCompileService,
    private watershedService: WatershedService,
    private lyraService: LyraService
  ) { }

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


    this.overlayLayers = Object.assign({}, {
      "<span><img src='../../assets/data-dashboard/backbone.png' height='12px' style='margin-bottom:3px;' /> Streams</span>": L.tileLayer.wms(environment.geoserverMapServiceUrl + "/wms?", backboneWMSOptions),
      "<span><img src='../../assets/data-dashboard/watershed.png' height='12px' style='margin-bottom:3px;' /> Watersheds</span>": L.tileLayer.wms(environment.geoserverMapServiceUrl + "/wms?", watershedsWMSOptions),
      "<span>Stormwater Network <br/> <img src='../../assets/data-dashboard/stormwaterNetwork.png' height='50'/> </span>": esri.dynamicMapLayer({ url: "https://ocgis.com/arcpub/rest/services/Flood/Stormwater_Network/MapServer/" })
    })

    this.compileService.configure(this.appRef);
  }

  public externalAddSiteVariableReturnMessageIfFailed(station:string, variableName:string) : string {
    let selectedStation = this.allStations.filter(x => x.properties.station == station)[0];
    if (selectedStation == null || selectedStation == undefined) {
      return `Could not find station with ID:${station}`;
    }

    let stationAvailableVariables = this.getAvailableVariables(selectedStation.properties);
    if (stationAvailableVariables == null || stationAvailableVariables == undefined || stationAvailableVariables.length == 0) {
      return `Station with ID:${station} has no available variables`
    }

    let selectedVariable = stationAvailableVariables.filter(x => x.variable == variableName)[0];
    if (selectedVariable == null || selectedVariable == undefined) {
      return  `Station with ID:${station} does not have an available variable that is associated with the key:${variableName}`;
    }
    
    this.addVariableToSelection(stationAvailableVariables.filter(x => x.variable == variableName)[0]);
  }

  public updateSelectedStation(selectedStationProperties: any) {
    this.selectedSiteAvailableVariables = this.getAvailableVariables(selectedStationProperties);
    this.canViewTributaryArea = selectedStationProperties.upstream;
    this.selectedSiteDescription = selectedStationProperties.stname;
    this.selectedSiteShortName = selectedStationProperties.shortname;
    this.selectedSiteStation = selectedStationProperties.station;
  }

  public getAvailableVariables(featureProperties: any) : SiteVariable[] {
    let availableVariables = [];
    let baseSiteVariable = new SiteVariable(
      {
        stationShortName: featureProperties.shortname,
        station: featureProperties.station,
        nearestRainfallStationInfo: {
          stationLongName: featureProperties.nearest_rainfall_station_info.stname,
          station: featureProperties.nearest_rainfall_station_info.station
        }
      });

    if (featureProperties[this.lyraStationAvailableVariablesKey] == null || featureProperties[this.lyraStationAvailableVariablesKey].length == 0) {
      return availableVariables;
    }

    for (let variableName of featureProperties[this.lyraStationAvailableVariablesKey]) {
      let variableInfo = featureProperties[variableName];
      let siteVariable = Object.assign(new SiteVariable({
        name: variableInfo.name,
        description: variableInfo.description,
        variable: variableInfo.variable,
        startDate: new Date(`${variableInfo.period_start.slice(0, 4)}-${variableInfo.period_start.slice(4, 6)}-${variableInfo.period_start.slice(6, 8)}`).toLocaleDateString(),
        endDate: new Date(`${variableInfo.period_end.slice(0, 4)}-${variableInfo.period_end.slice(4, 6)}-${variableInfo.period_end.slice(6, 8)}`).toLocaleDateString(),
        allowedAggregations: variableInfo.allowed_aggregations
      }), baseSiteVariable);
      availableVariables.push(siteVariable);
    }

    if (!featureProperties.has_rainfall && featureProperties.nearest_rainfall_station != null) {
      let rainfallStationProperties = featureProperties.nearest_rainfall_station_info;
      let rainfallInfo = rainfallStationProperties.rainfall_info;
      let rainfallSiteVariable = new SiteVariable({
        name: rainfallInfo.name,
        description: rainfallInfo.description,
        variable: rainfallInfo.variable,
        gage: rainfallStationProperties.stname,
        startDate: new Date(`${rainfallInfo.period_start.slice(0, 4)}-${rainfallInfo.period_start.slice(4, 6)}-${rainfallInfo.period_start.slice(6, 8)}`).toLocaleDateString(),
        endDate: new Date(`${rainfallInfo.period_end.slice(0, 4)}-${rainfallInfo.period_end.slice(4, 6)}-${rainfallInfo.period_end.slice(6, 8)}`).toLocaleDateString(),
        allowedAggregations: rainfallInfo.allowed_aggregations,
        stationShortName: rainfallStationProperties.shortname,
        station: rainfallStationProperties.station
      });
      availableVariables.push(rainfallSiteVariable);
    }

    return availableVariables;
  }

  public siteSelectedAndVariablesFound(): boolean {
    return this.selectedSiteDescription && this.selectedSiteAvailableVariables != null && this.selectedSiteAvailableVariables.length > 0
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

  public variablePresentInSelectedVariables(variable: SiteVariable): boolean {
    return this.selectedVariables.length > 0 && this.selectedVariables.some(x => x.name == variable.name && x.station == variable.station);
  }

  public disableAddingVariable(variable: SiteVariable): boolean {
    if (this.disableAddingVariables) {
      return true;
    }

    if (this.canAddDuplicateVariable) {
      return false;
    }

    return this.variablePresentInSelectedVariables(variable);
  }

  //#region mapFunctions
  public ngAfterViewInit(): void {
    this.initializeMap();
  }

  public initializeMap(): void {

    const mapOptions: L.MapOptions = {
      minZoom: 6,
      maxZoom: 22,
      layers: [
        this.tileLayers["Street"],
        this.overlayLayers["<span><img src='../../assets/data-dashboard/backbone.png' height='12px' style='margin-bottom:3px;' /> Streams</span>"],
        this.overlayLayers["<span><img src='../../assets/data-dashboard/watershed.png' height='12px' style='margin-bottom:3px;' /> Watersheds</span>"],
      ],
      gestureHandling: true,
      loadingControl: true

    } as L.MapOptions;

    this.map = L.map(this.mapID, mapOptions);
    this.initializePanes();
    this.initializeMapEvents();

    forkJoin([
      this.watershedService.getWatershedMask("Aliso Creek"),
      this.lyraService.getRSBTopoJson(),
      this.lyraService.getSiteLocationGeoJson()
    ])
      .subscribe(([maskString, topoJSON, sites]) => {
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

        this.setupMarkers();

        this.topoJSONrsbs = topoJSON;

        var topoJSONOverlay = L.topoJson(topoJSON, {
          style: function (feature) {
            return {
              color: "#ff4500",
              opacity: 1,
              weight: 1,
              fillColor: "#35495d",
              fillOpacity: 0.0,
            };
          },
          onEachFeature: function (feature, layer) {
            layer.bindPopup(
              "<p>" + `CatchIDN: ${feature.properties.CatchIDN}` + "</p>"
            );
          },
        });

        this.overlayLayers[
          "<span><img src='../../assets/data-dashboard/regionalSubbasin.png' height='12px' style='margin-bottom:3px;' /> Regional Subbasins</span>"] = topoJSONOverlay;

        this.setControl();

        this.allStations = sites.features;
        this.allStations.forEach(x => {
          if (x.properties.nearest_rainfall_station != null) {
            x.properties.nearest_rainfall_station_info = this.allStations.filter(y => y.properties.station === x.properties.nearest_rainfall_station)[0].properties;
          }
        });
        this.setupStationFilterAndLayers();

        this.selectedStationFilter = this.stationFilterTypes.filter(x => x.SiteFilterEnum == this.defaultSelectedMapFilter)[0];
        this.updateMarkerDisplay();
        this.mapAndStationsLoadedEvent.emit();
      });
  }

  public selectFeature(feature) {
    if (this.currentlySelectedLayer) {
      this.markers.clearLayers();
      this.currentlySelectedLayer = null;
    }

    this.clearTributaryAreaLayer();

    this.currentlySelectedLayer = new L.GeoJSON(feature, {
      pointToLayer: (feature, latlng) => {
        return L.marker(latlng, { icon: this.selectedIconDefault, zIndexOffset: 1000 });
      }
    });

    this.markers.addLayer(this.currentlySelectedLayer);
    this.map.setView(this.currentlySelectedLayer.getBounds().getCenter());
    this.selectedStationProperties = feature.properties;
    this.updateSelectedStation(this.selectedStationProperties);
  }

  public setupStationFilterAndLayers() {
    this.allStationsLayer = L.geoJSON(this.allStations);

    let allSitesOption = new StationFilterSelect({ Display: "All Sites", SiteFilterEnum: SiteFilterEnum.AllSites, Layer: this.allStationsLayer, Stations: this.allStations });

    let rainfallOptions = this.allStations.filter(x => x.properties.has_rainfall);
    this.hasRainfallLayer = L.geoJSON(rainfallOptions, {
      pointToLayer: function (feature, latlng) {
        return L.marker(latlng, { icon: this.rainfallIconDefault });
      }.bind(this)
    });

    let rainfallOption = new StationFilterSelect({ Display: "Has Rainfall Data", SiteFilterEnum: SiteFilterEnum.HasRainfall, Layer: this.hasRainfallLayer, Stations: rainfallOptions });

    let dischargeOptions = this.allStations.filter(x => x.properties.has_discharge)
    this.hasDischargeLayer = L.geoJSON(dischargeOptions, {
      pointToLayer: function (feature, latlng) {
        return L.marker(latlng, { icon: this.dischargeIconDefault });
      }.bind(this)
    });

    let dischargeOption = new StationFilterSelect({ Display: "Has Discharge Data", SiteFilterEnum: SiteFilterEnum.HasDischarge, Layer: this.hasDischargeLayer, Stations: dischargeOptions });

    let conductivityOptions = this.allStations.filter(x => x.properties.has_conductivity)
    this.hasConductivityLayer = L.geoJSON(conductivityOptions, {
      pointToLayer: function (feature, latlng) {
        return L.marker(latlng, { icon: this.conductivityIconDefault });
      }.bind(this)
    });

    let conductivityOption = new StationFilterSelect({ Display: "Has Conductivity Data", SiteFilterEnum: SiteFilterEnum.HasConductivity, Layer: this.hasConductivityLayer, Stations: conductivityOptions });

    this.stationFilterTypes = [allSitesOption, rainfallOption, dischargeOption, conductivityOption];
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

  //Known bug in leaflet that during bundling the default image locations can get messed up
  //https://stackoverflow.com/questions/41144319/leaflet-marker-not-found-production-env
  //We could do some kind of custom marker which would require less extra, but this should work for now
  public setupMarkers() {
    this.iconDefault = this.buildMarker('assets/marker-icon.png', 'assets/marker-icon-2x.png');
    this.rainfallIconDefault = this.buildMarker('/assets/main/map-icons/marker-icon-orange.png', '/assets/main/map-icons/marker-icon-2x-orange.png');
    this.dischargeIconDefault = this.buildMarker('/assets/main/map-icons/marker-icon-red.png', '/assets/main/map-icons/marker-icon-2x-red.png');
    this.conductivityIconDefault = this.buildMarker('/assets/main/map-icons/marker-icon-violet.png', '/assets/main/map-icons/marker-icon-2x-violet.png');

    //this will be for the selected icon
    this.markers = new L.FeatureGroup().addTo(this.map);
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

  public viewTributaryArea() {
    if (!this.selectedStationProperties || !this.selectedStationProperties.upstream) {
      this.canZoomTributaryArea = false;
      this.canViewTributaryArea = false;
      return;
    }

    let upstreamCatchIDNs = this.selectedStationProperties.upstream;
    let tempRSBs = Object.assign({}, this.topoJSONrsbs);
    let topoJSONObjects = tempRSBs.objects.data.geometries.filter(x => upstreamCatchIDNs.includes(x.properties.CatchIDN));
    tempRSBs.objects = topoJSONObjects;
    this.selectedStationTributaryAreaLayer = L.topoJson(tempRSBs, {
      style: function (feature) {
        return {
          color: "#D55E00",
          opacity: 1,
          weight: 1,
          fillColor: "#D55E00",
          fillOpacity: 0.5,
        };
      },
      onEachFeature: function (feature, layer) {
        layer.bindPopup(
          "<p>" + `CatchIDN: ${feature.properties.CatchIDN}` + "</p>"
        );
      },
    });

    this.selectedStationTributaryAreaLayer.addTo(this.map);
    this.selectedStationTributaryAreaLayer.bringToFront();
    this.canZoomTributaryArea = true;
  }

  public zoomInOnTributaryArea() {
    if (!this.selectedStationTributaryAreaLayer) {
      this.canZoomTributaryArea = false;
      return;
    }

    this.map.fitBounds(this.selectedStationTributaryAreaLayer.getBounds());
  }

  public updateMarkerDisplay() {
    if (!this.stationFilterTypes) {
      return;
    }

    if (this.currentlySelectedUnderlyingLayer) {
      this.currentlySelectedUnderlyingLayer = null;
    }

    if (this.siteLocationLayer) {
      this.map.removeLayer(this.siteLocationLayer);
      this.siteLocationLayer = null;
    }

    this.clearTributaryAreaLayer();

    this.siteLocationLayer = this.selectedStationFilter.Layer;
    this.siteLocationLayer.on("click", (event: L.LeafletEvent) => {
      this.selectFeature(event.propagatedFrom.feature);
    })

    this.siteLocationLayer.addTo(this.map);

    this.availableSitesToSearchFrom = this.selectedStationFilter.Stations;
  }

  clearTributaryAreaLayer() {
    if (!this.selectedStationTributaryAreaLayer) {
      return;
    }
    this.map.removeLayer(this.selectedStationTributaryAreaLayer);
    this.selectedStationTributaryAreaLayer = null;
    this.canZoomTributaryArea = false;
    this.canViewTributaryArea = false;
  }
  //#endregion

  public select(event) {
    this.searchText = event.StationPropertyValue;
    let selectedFeature = this.availableSitesToSearchFrom.find(x => x.properties.station === event.StationID);
    this.selectFeature(selectedFeature);
  }

  public search(event) {
    this.isSearching = true;
    this.searchSuggestions = [];

    let searchText = event.query.trim();
    if (searchText == null || searchText == undefined) {
      this.isSearching = false;
      return;
    }

    searchText = searchText.toLowerCase();

    this.availableSitesToSearchFrom.forEach(x => {
      if (x.properties.station != null && x.properties.station != undefined && x.properties.station.toLowerCase().includes(searchText)) {
        let obj = {
          StationProperty: 'StationID',
          StationPropertyValue: x.properties.station,
          StationID: x.properties.station
        }
        this.searchSuggestions.push(obj);
      }

      if (x.properties.shortname != null && x.properties.shortname != undefined && x.properties.shortname.toLowerCase().includes(searchText)) {
        let obj = {
          StationProperty: 'Short Name',
          StationPropertyValue: x.properties.shortname,
          StationID: x.properties.station
        }
        this.searchSuggestions.push(obj);
      }

      if (x.properties.stname != null && x.properties.stname != undefined && x.properties.stname.toLowerCase().includes(searchText)) {
        let obj = {
          StationProperty: 'Description',
          StationPropertyValue: x.properties.stname,
          StationID: x.properties.station
        }
        this.searchSuggestions.push(obj);
      }
    });

    if (this.searchSuggestions && this.searchSuggestions.length > 0) {
      this.searchSuggestions.sort((a, b) => {
        if (a.StationPropertyValue > b.StationPropertyValue) {
          return 1;
        }

        if (a.StationPropertyValue < b.StationPropertyValue) {
          return -1;
        }

        return 0;
      })
    }
  }

  //The dropdown closes when we remove focus, so if we go back in and still have text we should show the search suggestions
  reFocus(stationMapSearch) {
    if (this.searchText != undefined && this.searchText != '') {
      stationMapSearch.show();
    }
  }
}

export class StationFilterSelect {
  Display: string;
  SiteFilterEnum: SiteFilterEnum
  Layer: any;
  Stations: any[];

  public constructor(obj?: any) {
    Object.assign(this, obj);
  }
}
