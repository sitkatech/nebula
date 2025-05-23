import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { AlertService } from 'src/app/shared/services/alert.service';
import { Alert } from 'src/app/shared/models/alert';
import { AlertContext } from 'src/app/shared/models/enums/alert-context.enum';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { forkJoin } from 'rxjs';
import { RoleDto, RoleService, UserDto, UserInviteDto, UserService } from 'src/app/shared/generated';



@Component({
  selector: 'nebula-user-invite',
  templateUrl: './user-invite.component.html',
  styleUrls: ['./user-invite.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserInviteComponent implements OnInit, OnDestroy {
    
  private currentUser: UserDto;

  public roles: Array<RoleDto>;
  public model: UserInviteDto;
  public isLoadingSubmit: boolean = false;

  constructor(
    private cdr: ChangeDetectorRef, 
    private route: ActivatedRoute,
    private router: Router, 
    private userService: UserService, 
    private roleService: RoleService, 
    private authenticationService: AuthenticationService, 
    private alertService: AlertService
  ) { }

  ngOnInit(): void {
    this.authenticationService.getCurrentUser().subscribe(currentUser => {
      this.currentUser = currentUser;
      this.roleService.rolesGet().subscribe(result => {
        this.roles = result;
        this.cdr.detectChanges();
      });

      this.model = new UserInviteDto();

      const userID = parseInt(this.route.snapshot.paramMap.get('userID'));
      if (userID) {
        forkJoin([
          this.userService.usersUserIDGet(userID)
        ]).subscribe(([user]) => {
          if(user.UserGuid === null)
          {
            const userToInvite = user instanceof Array
              ? null
              : user as UserDto;
            this.model.Email = userToInvite.Email;
            this.model.FirstName = userToInvite.FirstName;
            this.model.LastName = userToInvite.LastName;
            this.model.RoleID = userToInvite.Role.RoleID;
            this.cdr.detectChanges();
          }
        });
      }
    });
  }

  ngOnDestroy() {
    this.cdr.detach();
  }

  canInviteUser(): boolean {
    return this.model.FirstName && this.model.LastName && this.model.RoleID && this.model.Email && this.model.Email.indexOf('@') != -1;
  }

  onSubmit(inviteUserForm: HTMLFormElement): void {
    this.isLoadingSubmit = true;

    this.userService.usersInvitePost(this.model)
      .subscribe(response => {
        this.isLoadingSubmit = false;
        inviteUserForm.reset();
        this.router.navigateByUrl(`/users/${response.UserID}`).then(x => {
          this.alertService.pushAlert(new Alert('The user invite was successful.', AlertContext.Success));
        });
      }
      ,
      error => {
        this.isLoadingSubmit = false;
        this.cdr.detectChanges();
      }
      );
  }

  public currentUserIsAdmin(): boolean {
    return this.authenticationService.isUserAnAdministrator(this.currentUser);
  }
}
