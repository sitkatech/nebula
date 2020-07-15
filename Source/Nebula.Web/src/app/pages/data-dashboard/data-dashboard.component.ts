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
import { SmartWatershedService } from 'src/app/services/smart-watershed.service.js';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { forkJoin } from 'rxjs';
import { CustomRichTextType } from 'src/app/shared/models/enums/custom-rich-text-type.enum';

declare var $ : any;
declare var vegaEmbed : any;

@Component({
  selector: 'nebula-data-dashboard',
  templateUrl: './data-dashboard.component.html',
  styleUrls: ['./data-dashboard.component.scss']
})
export class DataDashboardComponent implements OnInit {

  @ViewChild("mapDiv") mapElement: ElementRef;

  public richTextTypeID = CustomRichTextType.DataDashboard;
  public defaultMapZoom = 12;
  public afterSetControl = new EventEmitter();
  public afterLoadMap = new EventEmitter();
  public onMapMoveEnd = new EventEmitter();

  public component: any;

  public mapID = "DataDashboardMap";
  public mapHeight = "500px";
  public map: L.Map;
  public featureLayer: any;
  public layerControl: L.Control.Layers;
  public tileLayers: { [key: string]: any } = {};
  public overlayLayers: { [key: string]: any } = {};
  public maskLayer: any;

  public wmsParams: any;
  public currentMask: L.Layers;
  public layerControlOpen: boolean = false;
  public vegaSpec: Object = null;

  public hydstraAggregationModes = [{display:"Total", value:"tot"}, {display:"Average", value:"mean"}, {display:"Maximum", value:"max"}, {display:"Minimum", value:"min"}];
  public hydstraIntervals = [{display:"Hourly", value:"hour"}, {display:"Daily", value:"day"}, {display:"Monthly", value:"month"}, {display:"Yearly", value:"year"}];
  public errorMessage: string = null;
  public isPerformingAction: boolean = false;
  public currentDate = new Date();
  public gettingAvailableVariables: boolean = false;

  public timeSeriesForm = new FormGroup({
    startDate: new FormControl({year:this.currentDate.getUTCFullYear()-5, month:this.currentDate.getUTCMonth(), day:this.currentDate.getUTCDate()}, [Validators.required]),
    endDate: new FormControl({year:this.currentDate.getUTCFullYear(), month:this.currentDate.getUTCMonth(), day:this.currentDate.getUTCDate()}, [Validators.required]),
    interval: new FormControl(this.hydstraIntervals[0].value, [Validators.required]),
    aggregationMode: new FormControl(this.hydstraAggregationModes[0].value),
    intervalMultiplier: new FormControl(1, [Validators.min(1), Validators.max(2147483647)])
  });

  public areMetricsCollapsed: boolean = true;
  public siteLocationLayer: any;

  public selectedSiteAvailableVariables: Object[] = new Array<Object>();
  public selectedSiteStation: string = null;
  public selectedSiteName: string =  null;

  constructor(
    private appRef: ApplicationRef,
    private compileService: CustomCompileService,
    private cdr: ChangeDetectorRef,
    private wfsService: WfsService,
    private watershedService: WatershedService,
    private smartWatershedService: SmartWatershedService
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

  get f() {
    return this.timeSeriesForm.controls;
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
      loadingControl:true

    } as L.MapOptions;

    this.map = L.map(this.mapID, mapOptions);
    this.initializePanes();
    this.setControl();
    this.initializeMapEvents();

    forkJoin(
    this.watershedService.getWatershedMask("Aliso Creek"),
    this.smartWatershedService.getSiteLocationGeoJson()
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

      let maskLayerPoints= maskString.features[0].geometry.coordinates[0];
      let alisoStations = siteLocationObject._return.features.filter(feature => {
        let lat = feature.geometry.coordinates[1];
        let lng = feature.geometry.coordinates[0];

        let inside = false;
        for (var i = 0, j = maskLayerPoints.length - 1; i < maskLayerPoints.length; j = i++) {
            var xi = maskLayerPoints[i][1], yi = maskLayerPoints[i][0];
            var xj = maskLayerPoints[j][1], yj = maskLayerPoints[j][0];

            var intersect = ((yi > lng) != (yj > lng))
                && (lat < (xj - xi) * (lng - yi) / (yj - yi) + xi);
            if (intersect) inside = !inside;
        }
        return inside;
      }); 

      this.siteLocationLayer = L.geoJSON(alisoStations, {
        onEachFeature: function  (feature, layer) {
          layer.bindPopup('<p>'+feature.properties.stname+'</p>');
          layer.on('click', () => {
            this.selectedSiteName = feature.properties.stname;
            this.getAvailableVariables(feature.properties.station);
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
      () => {this.layerControlOpen = true;},
      () => {this.layerControlOpen = false;}
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

  public onSubmit() {
    if(this.timeSeriesForm.valid) {
      this.getTimeSeriesData();
    }
  }

  public getTimeSeriesData() {
    let swnTimeSeriesRequestDto = new Object(
      {
        site:this.selectedSiteStation,
        //temporary variable, this should be a dropdown
        variable:11,
        //temporary variable, this should be a dropdown
        datasource:"A",
        start_date:this.getDateFromTimeSeriesFormDateObject('startDate'),
        end_date:this.getDateFromTimeSeriesFormDateObject('endDate'),
        start_time: "00:00:00",
        end_time: "00:00:00",
        data_type:this.timeSeriesForm.get('aggregationMode').value,
        interval: this.timeSeriesForm.get('interval').value,
        multiplier: this.timeSeriesForm.get('intervalMultiplier').value
      });
    this.isPerformingAction = true;
    this.smartWatershedService.getTimeSeriesData(swnTimeSeriesRequestDto).subscribe(result => {
      var spec = JSON.parse(result.spec);
      spec.width = "container";
      vegaEmbed('#vis', spec);
      this.isPerformingAction = false;
    },
    error => {
      this.isPerformingAction = false;
    })
  }

  public getAvailableVariables(station: string) {
    this.gettingAvailableVariables = true;
    this.smartWatershedService.getAvailableVariables(station).subscribe(result => {
      this.selectedSiteAvailableVariables = result._return.sites[0].variables.map(x => {
        return new Object({
          name : x.name,
          startDate : new Date(`${x.period_start.slice(0, 4)}-${x.period_start.slice(4, 6)}-${x.period_start.slice(6, 8)}`).toLocaleDateString(),
          endDate: new Date(`${x.period_end.slice(0, 4)}-${x.period_end.slice(4, 6)}-${x.period_end.slice(6, 8)}`).toLocaleDateString()
        })
      });
      this.gettingAvailableVariables = false;
    },
    error => {
      this.gettingAvailableVariables = false;
    })
  }

  public getDateFromTimeSeriesFormDateObject(formFieldName : string) : string {
    let date = this.timeSeriesForm.get(formFieldName).value;
    return `${date["year"]}-${date["month"].toString().padStart(2, '0')}-${date["day"].toString().padStart(2, '0')}`;
  }

  public catchExtraSymbols(event : KeyboardEvent) : void {
    if (event.code === "KeyE" || event.code === "Equal" || event.code === "Minus" || event.code === "Plus") {
      event.preventDefault();
    }
  }

  public catchPastedSymbols(event : any) : void {
    let val = event.clipboardData.getData('text/plain');
    if (val && (val.includes("+") || val.includes("-") || val.includes("e") || val.includes("E"))) {
      val = val.replace(/\+|\-|e|E/g, '');
      event.preventDefault();
    }
  }

  public triggerTimeSeriesAndScrollIntoView(el: HTMLElement) {
    this.scroll(el);
    this.getTimeSeriesData();
  }

  public scroll(el : HTMLElement) {
    el.scrollIntoView();
  }
}
