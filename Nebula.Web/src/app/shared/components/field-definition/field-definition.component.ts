import { Component, OnInit, Input, ChangeDetectorRef, ViewChild, ElementRef } from '@angular/core';
import { Alert } from '../../models/alert';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { AlertService } from '../../services/alert.service';
import { AlertContext } from '../../models/enums/alert-context.enum';
import { NgbPopover } from '@ng-bootstrap/ng-bootstrap';
import { FieldDefinitionTypeEnum } from '../../generated/enum/field-definition-type-enum';
import { FieldDefinitionDto, FieldDefinitionService, UserDto } from '../../generated';
import { EditorComponent } from '@tinymce/tinymce-angular';
import TinyMCEHelpers from '../../helpers/tiny-mce-helpers';

declare let $ : any

@Component({
  selector: 'field-definition',
  templateUrl: './field-definition.component.html',
  styleUrls: ['./field-definition.component.scss']
})
export class FieldDefinitionComponent implements OnInit {

  @Input() fieldDefinitionType: string;
  @ViewChild('p') public popover: NgbPopover;
  @ViewChild('popContent') public content: any;
  public fieldDefinition: FieldDefinitionDto;
  public isLoading: boolean = true;
  public isEditing: boolean = false;
  public emptyContent: boolean = false;
  public watchUserChangeSubscription: any;
  public editedContent: string;
  @ViewChild('tinyMceEditor') tinyMceEditor : EditorComponent;
  public tinyMceConfig: object;

  currentUser: UserDto;

  constructor(
    private fieldDefinitionService: FieldDefinitionService,
    private authenticationService: AuthenticationService,
    private cdr: ChangeDetectorRef,
    private alertService: AlertService,
    private elem: ElementRef
  ) { }

  ngOnInit() {
    this.fieldDefinitionService.fieldDefinitionsFieldDefinitionTypeIDGet(FieldDefinitionTypeEnum[this.fieldDefinitionType]).subscribe(x => {
      this.loadFieldDefinition(x);
    });
  }

  ngAfterViewInit(): void {
    // We need to use ngAfterViewInit because the image upload needs a reference to the component
    // to setup the blobCache for image base64 encoding
    this.tinyMceConfig = TinyMCEHelpers.DefaultInitConfig(this.tinyMceEditor)
  }

  ngOnDestroy() {
    this.cdr.detach();
  }

  public showEditButton(): boolean {
    return this.authenticationService.isCurrentUserAnAdministrator();
  }

  public enterEdit(): void {
    this.editedContent = this.fieldDefinition.FieldDefinitionValue ?? '';
    this.isEditing = true;
  }

  public cancelEdit(): void {
    this.isEditing = false;
    this.popover.close();
  }

  public saveEdit(): void {
    this.isEditing = false;
    this.isLoading = true;
    this.fieldDefinition.FieldDefinitionValue = this.editedContent;
    this.fieldDefinitionService.fieldDefinitionsFieldDefinitionTypeIDPut(this.fieldDefinition.FieldDefinitionID, this.fieldDefinition).subscribe(x => {
      this.loadFieldDefinition(x);
    }, error => {
      this.isLoading = false;
      this.alertService.pushAlert(new Alert('There was an error updating the field definition', AlertContext.Danger, true));
    });
  }

  private loadFieldDefinition(fieldDefinition:FieldDefinitionDto)
  {
    this.fieldDefinition = fieldDefinition;
    this.emptyContent = fieldDefinition.FieldDefinitionValue?.length > 0 ? false : true;
    this.isLoading = false;
  }

  public notEditingMouseEnter() {
    if (!this.isEditing) {
      this.popover.open();
      this.elem.nativeElement.closest('body')
        .querySelector('.popover')
        .addEventListener('mouseleave', this.mouseLeaveEvent.bind(this));
    }
  }

  public mouseLeaveEvent() {
    if (!this.isEditing) {
      this.popover.close();
    }
  }

  public notEditingMouseLeave() {
    setTimeout( () => {
      const hoveringPopover = this.elem.nativeElement.closest('body')
        .querySelector('.popover:hover')
      if (!hoveringPopover && !this.isEditing) {
        this.popover.close();
      }
    }, 50);
  }
}
