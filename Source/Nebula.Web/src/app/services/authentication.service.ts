import { Injectable } from '@angular/core';
import { OAuthService } from 'angular-oauth2-oidc';
import { UserService } from './user/user.service';
import { Observable, race, Subject } from 'rxjs';
import { filter, finalize, first } from 'rxjs/operators';
import { CookieStorageService } from '../shared/services/cookies/cookie-storage.service';
import { Router } from '@angular/router';
import { RoleEnum } from '../shared/models/enums/role.enum';
import { AlertService } from '../shared/services/alert.service';
import { Alert } from '../shared/models/alert';
import { AlertContext } from '../shared/models/enums/alert-context.enum';
import { environment } from 'src/environments/environment';
import { UserDto } from '../shared/models/generated/user-dto';
import { UserCreateDto } from '../shared/models/user/user-create-dto';
import { UserDetailedDto } from '../shared/models';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  private currentUser: UserDetailedDto;

  private _currentUserSetSubject = new Subject<UserDetailedDto>();
  public currentUserSetObservable = this._currentUserSetSubject.asObservable();
  attemptingToCreateUser: any;
  getUserObservable: any;


  constructor(private router: Router,
    private oauthService: OAuthService,
    private cookieStorageService: CookieStorageService,
    private userService: UserService,
    private alertService: AlertService) {
    this.oauthService.events.subscribe(_ => {
      this.checkAuthentication();
    });

    this.oauthService.events
      .pipe(filter(e => ['token_received'].includes(e.type)))
      .subscribe(e => this.oauthService.loadUserProfile());

    this.oauthService.events
      .pipe(filter(e => ['invalid_nonce_in_state'].includes(e.type)))
      .subscribe(e => {
        //During user creation our nonce can get into an invalid state, but just signing in again mitigates the issue
        if (this.router.url.includes("signin-oidc")) {
          this.oauthService.initCodeFlow();
        }
      });

    this.oauthService.events
      .pipe(filter(e => ['token_refresh_error'].includes(e.type)))
      .subscribe(e => {
        //If we're still authenticated, don't worry about the error
        if (this.isAuthenticated()) {
          return;
        }

        //If we haven't cleared our cookies and done the logout, do so
        var token = this.oauthService.getAccessToken();
        if (token != null && token != undefined && token != "") {
          this.logout();
          return;
        }

        this.router
          .navigateByUrl("/")
          .then(() => this.alertService.pushAlert(new Alert("Your session has been terminated. Please login again.")));
      });

    this.oauthService.setupAutomaticSilentRefresh();
  }

  public initialLoginSequence(): Promise<void> {
    return this.oauthService.loadDiscoveryDocument()
      .then(() => this.oauthService.tryLogin())
      .then(() => {
        if (this.oauthService.hasValidAccessToken()) {
          return Promise.resolve();
        }
        return this.oauthService.silentRefresh().then(() => Promise.resolve());
      }).catch(() => { });
  }

  public checkAuthentication() {
    if (this.isAuthenticated() && !this.currentUser) {
      console.log("Authenticated but no user found...");
      var claims = this.oauthService.getIdentityClaims();
      this.getUser(claims);
    }
  }
  
  public getUser(claims: any) {
    var globalID = claims["sub"];

    this.userService.getUserFromGlobalID(globalID).subscribe(
      result => { this.updateUser(result); },
      error => { this.onGetUserError(error, claims) }
    );
  }

  private getUserCallback(user: UserDetailedDto) {
    this.currentUser = user;
    this._currentUserSetSubject.next(this.currentUser);
  }

  private onGetUserError(error: any, claims: any) {
    if (error.status !== 404) {
      this.alertService.pushAlert(new Alert("There was an error logging into the application.", AlertContext.Danger));
      this.router.navigate(['/']);
    }

    if (!this.attemptingToCreateUser) {
      this.attemptingToCreateUser = true;
      this.alertService.clearAlerts();
      const newUser = new UserCreateDto({
        FirstName: claims["given_name"],
        LastName: claims["family_name"],
        Email: claims["email"],
        RoleID: RoleEnum.Unassigned,
        LoginName: claims["login_name"],
        UserGuid: claims["sub"],
      });

      this.userService.createNewUser(newUser).pipe(
        finalize(() => this.attemptingToCreateUser = false)
      ).subscribe(user => {
        this.updateUser(user);
      });
    }
  }

  private updateUser(user: UserDetailedDto) {
    this.currentUser = user;
    this._currentUserSetSubject.next(this.currentUser);
  }

  public refreshUserInfo(user: UserDetailedDto) {
    this.updateUser(user);
  }

  public getCurrentUser(): Observable<UserDetailedDto> {
    return race(
      new Observable(subscriber => {
        if (this.currentUser) {
          subscriber.next(this.currentUser);
          subscriber.complete();
        }
      }),
      this.currentUserSetObservable.pipe(first())
    );
  }

  public isAuthenticated(): boolean {
    return this.oauthService.hasValidAccessToken();
  }

  public login() {
    this.oauthService.initCodeFlow();
  }

  public createAccount() {
    localStorage.setItem("loginOnReturn", "true");
    window.location.href = `${environment.keystoneAuthConfiguration.issuer}/Account/Register?${this.getClientIDAndRedirectUrlForKeystone()}`;
  }

  public getClientIDAndRedirectUrlForKeystone() {
    return `ClientID=${environment.keystoneAuthConfiguration.clientId}&RedirectUrl=${encodeURIComponent(environment.createAccountRedirectUrl)}`;
  }

  public forcedLogout() {
    sessionStorage["authRedirectUrl"] = window.location.href;
    this.logout();
  }

  public logout() {
    this.oauthService.logOut();

    setTimeout(() => {
      this.cookieStorageService.removeAll();
    });
  }

  dispose() {
    this.getUserObservable.unsubscribe();
  }

  public isUserAnAdministrator(user: UserDto): boolean {
    const role = user && user.Role
      ? user.Role.RoleID
      : null;
    return role === RoleEnum.Admin;
  }

  public isCurrentUserAnAdministrator(): boolean {
    return this.isUserAnAdministrator(this.currentUser);
  }

  public isUserUnassigned(user: UserDto): boolean {
    const role = user && user.Role
      ? user.Role.RoleID
      : null;
    return role === RoleEnum.Unassigned;
  }

  public isUserRoleDisabled(user: UserDto): boolean {
    const role = user && user.Role
      ? user.Role.RoleID
      : null;
    return role === RoleEnum.Disabled;
  }

  public isCurrentUserNullOrUndefined(): boolean {
    return !this.currentUser;
  }

  public hasCurrentUserAcknowledgedDisclaimer(): boolean {
    return this.currentUser != null && this.currentUser.DisclaimerAcknowledgedDate != null;
  }

  public isUserInRole(user: UserDto, roles: RoleEnum[]): boolean {
    const role = user && user.Role ? user.Role.RoleID : null;
    if (role == null) {
      return false;
    }

    return roles.includes(role);
  }

  public isCurrentUserInRole(roles: RoleEnum[]): boolean {
    return this.isUserInRole(this.currentUser, roles);
  }

  public isCurrentUserDisabled(): boolean {
    return this.isUserRoleDisabled(this.currentUser);
  }

  public doesCurrentUserHaveOneOfTheseRoles(roleIDs: Array<number>): boolean {
    if(roleIDs.length === 0)
    {
      return false;
    }
    const roleID = this.currentUser && this.currentUser.Role
      ? this.currentUser.Role.RoleID
      : null;
    return roleIDs.includes(roleID);
  }
}
