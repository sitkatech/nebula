import { ApplicationRef, Component, EventEmitter, HostListener, Input, OnInit, Output } from '@angular/core';
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
  selector: 'nebula-station-select-map',
  templateUrl: './station-select-map.component.html',
  styleUrls: ['./station-select-map.component.scss']
})
export class StationSelectMapComponent implements OnInit {
  @HostListener('document:click', ['$event']) 
  clickout(event) 
  { 
    if(event.target.classList.contains("view-tributary-area"))
      this.viewTributaryArea(); 
  }


  @Input()
  public mapID: string = '';
  @Input()
  public mapHeight: string = "500px";
  @Input()
  public layerControlOpen: boolean = false;
  @Input()
  public defaultMapZoom = 12;
  @Input()
  public selectableStations: any;

  @Output()
  public afterSetControl = new EventEmitter();
  @Output()
  public afterLoadMap = new EventEmitter();
  @Output()
  public onMapMoveEnd = new EventEmitter();
  @Output()
  public selectedStationPropertiesUpdateEvent = new EventEmitter();

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

  public topoJSONrsbs: any;



  constructor(
    private appRef: ApplicationRef,
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
      "<span><img src='../../assets/data-dashboard/backbone.png' height='12px' style='margin-bottom:3px;' /> Watersheds</span>": L.tileLayer.wms(environment.geoserverMapServiceUrl + "/wms?", watershedsWMSOptions),
      "<span>Stormwater Network <br/> <img src='../../assets/data-dashboard/stormwaterNetwork.png' height='50'/> </span>": esri.dynamicMapLayer({ url: "https://ocgis.com/arcpub/rest/services/Flood/Stormwater_Network/MapServer/" })
    })

    this.compileService.configure(this.appRef);
  }

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
        this.overlayLayers["<span><img src='../../assets/data-dashboard/backbone.png' height='12px' style='margin-bottom:3px;' /> Watersheds</span>"],
      ],
      gestureHandling: true,
      loadingControl: true

    } as L.MapOptions;

    this.map = L.map(this.mapID, mapOptions);
    this.initializePanes();
    this.initializeMapEvents();

    forkJoin([
      this.watershedService.getWatershedMask("Aliso Creek"),
      this.lyraService.getRSBTopoJson()
    ])
    .subscribe(([maskString, topoJSON]) => {
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
      this.siteLocationLayer = L.geoJSON(this.selectableStations, {
        onEachFeature: function (feature, layer) {
          layer.bindPopup(`<div class="text-center"><p>${feature.properties.stname}</p>${feature.properties.upstream !== null && feature.properties.upstream !== undefined ? '<button class="btn btn-sm btn-nebula view-tributary-area">View Tributary Area</button></div>' : '<p class="font-italic">No Tributary Area information found</p>'}`);
          layer.on('click', () => {
            this.errorOccurred = false;
            if (this.currentlySelectedLayer) {
              this.currentlySelectedLayer.setIcon(this.iconDefault);
            }
            if (this.selectedStationTributaryAreaLayer) {
              this.map.removeLayer(this.selectedStationTributaryAreaLayer);
              this.selectedStationTributaryAreaLayer = null;
            }
            layer.setIcon(this.selectedIconDefault);
            this.currentlySelectedLayer = layer;
            this.selectedStationProperties = feature.properties;
            this.selectedStationPropertiesUpdateEvent.emit(this.selectedStationProperties);
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

  public viewTributaryArea() {
    if (!this.selectedStationProperties || !this.selectedStationProperties.upstream) {
      return;
    }
    let upstreamCatchIDNs = JSON.parse(this.selectedStationProperties.upstream);
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
    this.map.fitBounds(this.selectedStationTributaryAreaLayer.getBounds(), {maxZoom:this.defaultMapZoom});
  }
}
