import { CanActivate, ActivatedRouteSnapshot, Router, RouterStateSnapshot, ActivatedRoute } from '@angular/router';
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { Injectable } from '@angular/core';
import { AlertService } from '../services/alert.service';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { CustomPageService } from 'src/app/services/custom-page.service';
@Injectable({
  providedIn: 'root'
})
export class CustomPageAccessGuard implements CanActivate {
  constructor(
    private router: Router, 
    private alertService: AlertService, 
    private authenticationService: AuthenticationService, 
    private customPageService: CustomPageService) { }

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    const vanityUrl = next.paramMap.get("vanity-url");
    console.log(vanityUrl);
    let viewableRoleIDs = Array<number>();
    if (vanityUrl) {
      if (!this.authenticationService.isCurrentUserNullOrUndefined()) {
        return this.customPageService.getCustomPageRolesByVanityUrl(vanityUrl)
        .pipe(
          map(roles => {
            viewableRoleIDs = roles.map(x => x.RoleID);
            console.log(viewableRoleIDs);
            if (this.authenticationService.doesCurrentUserHaveOneOfTheseRoles(viewableRoleIDs)) {
              return true;
            } else {
              return this.returnUnauthorized();
            }
          })
        );
      }
    }

    return this.authenticationService.getCurrentUser()
    .pipe(
      map(x => {
        if (viewableRoleIDs.includes(x.Role.RoleID)) {
          return true;
        } else {
          return this.returnUnauthorized();
        }
      })
    );

  }

  private returnUnauthorized() {
    this.router.navigate(["/"]).then(() => {
      this.alertService.pushNotFoundUnauthorizedAlert();
    });
    return false;
  }
}
