import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { Injectable } from '@angular/core';
import { AlertService } from '../../services/alert.service';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { RoleEnum } from '../../models/enums/role.enum';


@Injectable({
  providedIn: 'root'
})
export class DataExplorerGuard implements CanActivate {
  constructor(private router: Router, private alertService: AlertService, private authenticationService: AuthenticationService) {
  }
  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    if (!this.authenticationService.isCurrentUserNullOrUndefined()) {
      if (this.authenticationService.isCurrentUserInRole([RoleEnum.Admin, RoleEnum.DataExplorer])) {
        return true;
      } else {
        this.alertService.pushNotFoundUnauthorizedAlert();
        this.router.navigate(["/"]);
        return false;
      }
    }

    return this.authenticationService.getCurrentUser()
      .pipe(
        map(x => {
          if (x.Role.RoleID == RoleEnum.Admin || x.Role.RoleID == RoleEnum.DataExplorer) {
            return true;
          } else {
            this.alertService.pushNotFoundUnauthorizedAlert();
            this.router.navigate(["/"]);
            return false;
          }
        })
      );
  }
}