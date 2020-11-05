import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { UserDetailedDto } from 'src/app/shared/models';
import { ActivatedRoute, Router } from '@angular/router';
import { LyraService } from 'src/app/services/lyra.service';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'nebula-station-detail',
  templateUrl: './station-detail.component.html',
  styleUrls: ['./station-detail.component.scss']
})
export class StationDetailComponent implements OnInit {

  private watchUserChangeSubscription: any;
  private currentUser: UserDetailedDto;

  public station: {};
  public variables: Array<Object>;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private lyraService: LyraService,
    private authenticationService: AuthenticationService,
    private cdr: ChangeDetectorRef
  ) {
    // force route reload whenever params change;
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
  }

  ngOnInit() {
    this.watchUserChangeSubscription = this.authenticationService.currentUserSetObservable.subscribe(currentUser => {
      this.currentUser = currentUser;

      const stationCode = this.route.snapshot.paramMap.get("stationCode");
      if (stationCode) {
        forkJoin(
          this.lyraService.getStationsInfo(stationCode),
          this.lyraService.getAvailableVariables(stationCode)
        ).subscribe(([station, variables]) => {
          console.log(station);
          this.station = station._return.rows[0];
          this.variables = variables._return.sites[0].variables;
        });
      }
    });
  }

  getStationName() {
    console.log(this.station['stname']);
    return this.station['stname'] != null && this.station['stname'] != '' ? this.station['stname'] : "No Name Given";
  }

  ngOnDestroy() {
    this.watchUserChangeSubscription.unsubscribe();
    this.authenticationService.dispose();
    this.cdr.detach();
  }
}
