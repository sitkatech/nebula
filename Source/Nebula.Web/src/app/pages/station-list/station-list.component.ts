import { Component, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { AgGridAngular } from 'ag-grid-angular';
import { UserDetailedDto } from 'src/app/shared/models';
import { GridOptions } from 'ag-grid-community';
import { LyraService } from 'src/app/services/lyra.service';
import { UtilityFunctionsService } from 'src/app/services/utility-functions.service';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { LinkRendererComponent } from 'src/app/shared/components/ag-grid/link-renderer/link-renderer.component';

@Component({
  selector: 'nebula-station-list',
  templateUrl: './station-list.component.html',
  styleUrls: ['./station-list.component.scss']
})
export class StationListComponent implements OnInit {

  @ViewChild('stationVariablesGrid') stationVariablesGrid: AgGridAngular;

  private watchUserChangeSubscription: any;
  private currentUser: UserDetailedDto;

  //public richTextTypeID : number = CustomRichTextType.WatershedList;
  public gridOptions: GridOptions;
  public stationVariables = [];
  columnDefs: any;

  constructor(private cdr: ChangeDetectorRef,
    private authenticationService: AuthenticationService,
    private utilityFunctionsService: UtilityFunctionsService,
    private lyraService: LyraService) { }

  ngOnInit() {
    this.watchUserChangeSubscription = this.authenticationService.currentUserSetObservable.subscribe(currentUser => {
      this.gridOptions = <GridOptions>{};
      this.currentUser = currentUser;
      this.stationVariablesGrid.api.showLoadingOverlay();
      this.lyraService.getStationsInfo().subscribe(result => {
        this.stationVariables = result._return.rows.map(x => new Object ({Station: x.station, StationName : x.stname, StationType : x.stntype})).sort((x,y) => {
          if (x.StationName > y.StationName) {
              return 1;
          }
      
          if (x.StationName < y.StationName) {
              return -1;
          }
      
          return 0;});
        this.stationVariablesGrid.api.hideOverlay();
        this.cdr.detectChanges();
      });

      this.columnDefs = [
        { valueGetter: function (params: any) {
          return { LinkDisplay: params.data.Station, LinkValue: params.data.Station };
        }, cellRendererFramework: LinkRendererComponent,
        cellRendererParams: { inRouterLink: "/stations/" },
        filterValueGetter: function (params: any) {
          return params.data.Station;
        },
        comparator: function (id1: any, id2: any) {
          if (id1.LinkDisplay < id2.LinkDisplay) {
            return -1;
          }
          if (id1.LinkDisplay > id2.LinkDisplay) {
            return 1;
          }
          return 0;
        }, headerName: 'Station Code', sortable: true, filter: true},
        { headerName: 'Station Name', field: 'StationName', sortable: true, filter: true},
        { headerName: 'Station Type', field: 'StationType', sortable: true, filter: true}
      ];

      this.columnDefs.forEach(x => {
        x.resizable = true;
      });
    });
  }

  ngOnDestroy() {
    this.watchUserChangeSubscription.unsubscribe();
    this.authenticationService.dispose();
    this.cdr.detach();
  }

  public updateGridData() {
    this.lyraService.getStationsInfo().subscribe(result => {
      this.stationVariablesGrid.api.setRowData(result);
    });
  }

  public exportToCsv() {
    this.utilityFunctionsService.exportGridToCsv(this.stationVariablesGrid, 'watersheds.csv', null);
  }

}
