import { AfterViewInit, Component, EventEmitter, Input, OnInit, Output, ChangeDetectionStrategy, ApplicationRef } from '@angular/core';
import { Feature, FeatureCollection, Polygon } from 'geojson';
import { environment } from 'src/environments/environment';
import { WfsService } from '../../services/wfs.service';
import {
  Control, FitBoundsOptions, LeafletEvent,
  LeafletMouseEvent,
  map,
  Map,
  MapOptions,
  Popup,
  tileLayer,
  WMSOptions,
  DomEvent,
  DomUtil,
  LayerGroup
} from 'leaflet';
import 'leaflet.fullscreen';
import { WatershedDetailPopupComponent } from '../watershed-detail-popup/watershed-detail-popup.component';
import { CustomCompileService } from '../../services/custom-compile.service';
import { WatershedIDListDto, WatershedService } from '../../generated';
import { BoundingBoxDto } from '../../models/bounding-box-dto';

declare let $: any

@Component({
  selector: 'watershed-map',
  templateUrl: './watershed-map.component.html',
  styleUrls: ['./watershed-map.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WatershedMapComponent implements OnInit, AfterViewInit {
  @Input()
  public mapID: string = '';

  @Input()
  public selectedWatershedTransparencyStyle: string = 'watershed_purple';

  @Input()
  public selectedWatershedLabelStyle: string = 'watershed_name_only';

  @Input()
  public selectedWatershedIDs: Array<number> = [];

  public allWatershedIDs: Array<number> = [];

  @Input()
  public onEachFeatureCallback?: (feature, layer) => void;

  @Input()
  public zoomMapToDefaultExtent: boolean = true;

  @Input()
  public disableDefaultClick: boolean = false;

  @Input()
  public displaywatershedsLayerOnLoad: boolean = true;

  @Input()
  public mapHeight: string = '300px';

  @Input()
  public defaultFitBoundsOptions?: FitBoundsOptions = null;

  @Input()
  public selectedWatershedLayerName: string = '<img src=\'./assets/main/map-legend-images/watershed.png\' style=\'height:16px; margin-bottom:3px\'> Selected Watersheds';

  @Output()
  public afterSetControl: EventEmitter<Control.Layers> = new EventEmitter();

  @Output()
  public afterLoadMap: EventEmitter<LeafletEvent> = new EventEmitter();

  @Output()
  public onMapMoveEnd: EventEmitter<LeafletEvent> = new EventEmitter();

  public component: any;

  public map: Map;
  public featureLayer: any;
  public layerControl: Control.Layers;
  public tileLayers: { [key: string]: any } = {};
  public overlayLayers: { [key: string]: any } = {};
  boundingBox: BoundingBoxDto;
  private selectedWatershedTransparencyLayer: any;
  private selectedWatershedLabelLayer: any;
  private selectedWatershedLayerGroup: LayerGroup = new LayerGroup();
  private defaultWatershedsWMSOptions: WMSOptions;

  constructor(
    private wfsService: WfsService,
    private watershedService: WatershedService,
    private appRef: ApplicationRef,
    private compileService: CustomCompileService
  ) {
  }

  public ngOnInit(): void {
    // Default bounding box
    this.boundingBox = new BoundingBoxDto();
    this.boundingBox.Left = -117.96363830566408;
    this.boundingBox.Bottom = 33.444047234512354;
    this.boundingBox.Right = -117.23030090332033;
    this.boundingBox.Top = 33.73005042840439;

    this.tileLayers = Object.assign({}, {
      'Aerial': tileLayer('https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
        attribution: 'Aerial',
      }),
      'Street': tileLayer('https://services.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}', {
        attribution: 'Aerial',
      }),
      'Terrain': tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}', {
        attribution: 'Terrain',
      }),
    }, this.tileLayers);

    this.defaultWatershedsWMSOptions = ({
      layers: 'Nebula:Watersheds',
      transparent: true,
      format: 'image/png',
      tiled: true
    } as WMSOptions);

    const watershedsWMSOptions = this.defaultWatershedsWMSOptions;

    this.overlayLayers = Object.assign({
      '<img src=\'./assets/main/map-legend-images/watershed_outline_only.png\' style=\'height:16px; margin-bottom:3px\'> Watersheds': tileLayer.wms(environment.geoserverMapServiceUrl + '/wms?', watershedsWMSOptions)
    }, this.overlayLayers);

    this.compileService.configure(this.appRef);
  }

  public updateSelectedWatershedsOverlayLayer(watershedIDs: Array<number>) {
    if (this.selectedWatershedTransparencyLayer && this.selectedWatershedLabelLayer) {
      this.layerControl.removeLayer(this.selectedWatershedLayerGroup);
      this.map.removeLayer(this.selectedWatershedTransparencyLayer);
      this.map.removeLayer(this.selectedWatershedLabelLayer);
    }

    const wmsParameters = Object.assign({ styles: this.selectedWatershedTransparencyStyle, cql_filter: this.createWatershedMapFilter(watershedIDs) }, this.defaultWatershedsWMSOptions);
    this.selectedWatershedTransparencyLayer = tileLayer.wms(environment.geoserverMapServiceUrl + '/wms?', wmsParameters);
    wmsParameters.styles = this.selectedWatershedLabelStyle;
    this.selectedWatershedLabelLayer = tileLayer.wms(environment.geoserverMapServiceUrl + '/wms?', wmsParameters);
    this.selectedWatershedLayerGroup.addLayer(this.selectedWatershedTransparencyLayer);
    this.selectedWatershedLayerGroup.addLayer(this.selectedWatershedLabelLayer);
    this.layerControl.addOverlay(this.selectedWatershedLayerGroup, this.selectedWatershedLayerName);

    this.selectedWatershedLayerGroup.addTo(this.map);
  }


  private fitBoundsToSelectedWatersheds(watershedIDs: Array<number>) {
    const watershedIDListDto = new WatershedIDListDto({ watershedIDs: watershedIDs});
    this.watershedService.watershedsGetBoundingBoxPost(watershedIDListDto).subscribe((boundingBox: BoundingBoxDto) => {
      this.boundingBox = boundingBox;
      this.map.fitBounds([[this.boundingBox.Bottom, this.boundingBox.Left], [this.boundingBox.Top, this.boundingBox.Right]], this.defaultFitBoundsOptions);
    });
  }

  private createWatershedMapFilter(watershedIDs: Array<number>): any {
    return `WatershedID in (${watershedIDs.join(',')})`;
  }

  public ngAfterViewInit(): void {
    this.watershedService.watershedsGet().subscribe(watersheds => {
      this.allWatershedIDs = watersheds.map(x => x.WatershedID);
      this.initializeMap();
    });
  }

  private initializeMap() {
    const mapOptions: MapOptions = {
      // center: [46.8797, -110],
      // zoom: 6,
      minZoom: 9,
      maxZoom: 17,
      layers: [
        this.tileLayers.Aerial,
      ],
      fullscreenControl: true
    } as MapOptions;
    this.map = map(this.mapID, mapOptions);

    this.map.on('load', (event: LeafletEvent) => {
      this.afterLoadMap.emit(event);
    });
    this.map.on('moveend', (event: LeafletEvent) => {
      this.onMapMoveEnd.emit(event);
    });
    this.map.fitBounds([[this.boundingBox.Bottom, this.boundingBox.Left], [this.boundingBox.Top, this.boundingBox.Right]], this.defaultFitBoundsOptions);

    this.setControl();
    this.registerClickEvents();

    if (this.selectedWatershedIDs.length > 0) {
      this.updateSelectedWatershedsOverlayLayer(this.selectedWatershedIDs);
      this.fitBoundsToSelectedWatersheds(this.selectedWatershedIDs);
    }
    else {
      this.fitBoundsToSelectedWatersheds(this.allWatershedIDs);
    }

    if (!this.disableDefaultClick) {
      const wfsService = this.wfsService;
      const self = this;
      this.map.on('click', (event: LeafletMouseEvent): void => {
        wfsService.getWatershedByCoordinate(event.latlng.lng, event.latlng.lat)
          .subscribe((watershedFeatureCollection: FeatureCollection) => {
            watershedFeatureCollection.features
              .forEach((feature: Feature) => {
                // Flip the coordinates
                switch (feature.geometry.type) {
                case 'Polygon':
                  const polygon: Polygon = feature.geometry as Polygon;
                  polygon.coordinates = polygon.coordinates
                    .map(coordinate => coordinate.map(point => [point[1], point[0]]));
                  break;
                }
                new Popup({
                  minWidth: 200,
                })
                  .setLatLng(event.latlng)
                  .setContent(this.compileService.compile(WatershedDetailPopupComponent, (c) => { c.instance.feature = feature; })
                  )
                  .openOn(self.map);
              });
          });
      });
    }
  }

  public setControl(): void {
    this.layerControl = new Control.Layers(this.tileLayers, this.overlayLayers, { collapsed: false })
      .addTo(this.map);
    if (this.displaywatershedsLayerOnLoad) {
      this.overlayLayers['<img src=\'./assets/main/map-legend-images/watershed_outline_only.png\' style=\'height:16px; margin-bottom:3px\'> Watersheds'].addTo(this.map);
    }
    this.afterSetControl.emit(this.layerControl);
  }

  public registerClickEvents(): void {
    const leafletControlLayersSelector = '.leaflet-control-layers';
    const closeButtonClass = 'leaflet-control-layers-close';

    const closem = DomUtil.create('a', closeButtonClass);
    closem.innerHTML = 'Close';
    DomEvent.on(closem,
      'click',
      function (e) {
        $(leafletControlLayersSelector).removeClass('leaflet-control-layers-expanded');
      });

    $(leafletControlLayersSelector).append(closem);
  }
}

