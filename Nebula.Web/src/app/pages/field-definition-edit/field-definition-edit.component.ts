import { Component, OnInit, ChangeDetectorRef, ViewChild } from '@angular/core';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Alert } from 'src/app/shared/models/alert';
import { AlertContext } from 'src/app/shared/models/enums/alert-context.enum';
import { AlertService } from 'src/app/shared/services/alert.service';
import { FieldDefinitionDto, FieldDefinitionService, UserDto } from 'src/app/shared/generated';
import { EditorComponent } from '@tinymce/tinymce-angular';
import TinyMCEHelpers from 'src/app/shared/helpers/tiny-mce-helpers';

@Component({
  selector: 'nebula-field-definition-edit',
  templateUrl: './field-definition-edit.component.html',
  styleUrls: ['./field-definition-edit.component.scss']
})
export class FieldDefinitionEditComponent implements OnInit {
  
  private currentUser: UserDto;

  public fieldDefinition: FieldDefinitionDto;
  @ViewChild('tinyMceEditor') tinyMceEditor : EditorComponent;
  public tinyMceConfig: object;

  public isLoadingSubmit: boolean;

  constructor (
    private route: ActivatedRoute,
    private router: Router,
    private alertService: AlertService,
    private fieldDefinitionService: FieldDefinitionService,
    private authenticationService: AuthenticationService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.authenticationService.getCurrentUser().subscribe(currentUser => {
      this.currentUser = currentUser;
      const id = parseInt(this.route.snapshot.paramMap.get('id'));
      if (id) {
        this.fieldDefinitionService.fieldDefinitionsFieldDefinitionTypeIDGet(id).subscribe(fieldDefinition => {
          this.fieldDefinition = fieldDefinition;
        })
      }
    });
  }

  ngOnDestroy() {
    this.cdr.detach();
  }

  ngAfterViewInit(): void {
    // We need to use ngAfterViewInit because the image upload needs a reference to the component
    // to setup the blobCache for image base64 encoding
    this.tinyMceConfig = TinyMCEHelpers.DefaultInitConfig(this.tinyMceEditor)
  }

  public currentUserIsAdmin(): boolean {
    return this.authenticationService.isUserAnAdministrator(this.currentUser);
  }

  saveDefinition(): void {
    this.isLoadingSubmit = true;

    this.fieldDefinitionService.fieldDefinitionsFieldDefinitionTypeIDPut(this.fieldDefinition.FieldDefinitionID, this.fieldDefinition)
      .subscribe(response => {
        this.isLoadingSubmit = false;
        this.router.navigateByUrl('/labels-and-definitions').then(x => {
          this.alertService.pushAlert(new Alert(`The definition for ${this.fieldDefinition.FieldDefinitionType.FieldDefinitionTypeDisplayName} was successfully updated.`, AlertContext.Success));
        });
      }, error => {
        this.isLoadingSubmit = false;
        this.cdr.detectChanges();
      }
      );
  }

}
