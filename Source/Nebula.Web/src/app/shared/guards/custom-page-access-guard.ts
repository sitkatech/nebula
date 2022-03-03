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

  async canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> {
    let vanityUrl = next.paramMap.get("vanity-url");
    let viewableRoleIDs = Array<number>();
    if (vanityUrl) {
      viewableRoleIDs = await this.getCustomPageRolesByVanityUrl(vanityUrl);
      if (!this.authenticationService.isCurrentUserNullOrUndefined()) {
        if (this.authenticationService.doesCurrentUserHaveOneOfTheseRoles(viewableRoleIDs)) {
          return true;
        }
        return this.returnUnauthorized();
      }

      this.authenticationService.getCurrentUser()
        .pipe(
          map(x => {
            if (viewableRoleIDs.includes(x.Role.RoleID)) {
              return true;
            } else {
              return this.returnUnauthorized();
            }
          })
        );
    } else {
      return this.returnUnauthorized();
    }
  }

  private returnUnauthorized() {
    this.router.navigate(["/"]).then(() => {
      this.alertService.pushNotFoundUnauthorizedAlert();
    });
    return false;
  }

  async getCustomPageRolesByVanityUrl(vanityUrl: string): Promise<Array<number>> {

    return new Promise((resolve, reject) => {
 
      this.customPageService.getCustomPageRolesByVanityUrl(vanityUrl).subscribe(roles => {
        let viewableRoleIDs = roles.map(x => x.RoleID);
        resolve(viewableRoleIDs)
      }, 
      error => {
        let errorMessage = <any>error;
        if(errorMessage != null) {
          reject(errorMessage);
        }
      }
      );

   })
  }

}
