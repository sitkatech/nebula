import { Component, OnInit, Input, AfterViewChecked, ViewChild } from '@angular/core';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { AlertService } from '../../services/alert.service';
import { Alert } from '../../models/alert';
import { AlertContext } from '../../models/enums/alert-context.enum';
import { CustomRichTextDto, CustomRichTextService, UserDto } from '../../generated';
import TinyMCEHelpers from '../../helpers/tiny-mce-helpers';
import { EditorComponent } from '@tinymce/tinymce-angular';

@Component({
  selector: 'custom-rich-text',
  templateUrl: './custom-rich-text.component.html',
  styleUrls: ['./custom-rich-text.component.scss']
})
export class CustomRichTextComponent implements OnInit, AfterViewChecked {
  @ViewChild('tinyMceEditor') tinyMceEditor : EditorComponent;
  public tinyMceConfig: object;
  
  @Input() customRichTextTypeID: number;
  public customRichTextContent: string;
  public isLoading: boolean = true;
  public isEditing: boolean = false;
  public isEmptyContent: boolean = false;
  public watchUserChangeSubscription: any;
  public editedContent: string;
  public editor;

  currentUser: UserDto;

  constructor (
    private customRichTextService: CustomRichTextService,
    private authenticationService: AuthenticationService,
    private alertService: AlertService
  ) { }

  ngOnInit() {
    this.authenticationService.getCurrentUser().subscribe(currentUser => {
      this.currentUser = currentUser;
    });

    this.customRichTextService.customRichTextCustomRichTextTypeIDGet(this.customRichTextTypeID).subscribe(x => {
      this.customRichTextContent = x.CustomRichTextContent;
      this.isEmptyContent = x.IsEmptyContent;
      this.isLoading = false;
    });
  }

  ngAfterViewChecked() {
    // viewChild is updated after the view has been checked
    this.initalizeEditor();
  }

  initalizeEditor() {
    if (!this.isLoading && this.isEditing) {
      this.tinyMceConfig = TinyMCEHelpers.DefaultInitConfig(
        this.tinyMceEditor
      );
    }
  }

  public showEditButton(): boolean {
    return this.authenticationService.isUserAnAdministrator(this.currentUser);
  }

  public enterEdit(): void {
    this.editedContent = this.customRichTextContent;
    this.isEditing = true;
  }

  public cancelEdit(): void {
    this.isEditing = false;
  }

  public saveEdit(): void {
    this.isEditing = false;
    this.isLoading = true;
    const updateDto = new CustomRichTextDto({ CustomRichTextContent: this.editedContent });
    this.customRichTextService.customRichTextCustomRichTextTypeIDPut(this.customRichTextTypeID, updateDto).subscribe(x => {
      this.customRichTextContent = x.CustomRichTextContent;
      this.isLoading = false;
    }, error => {
      this.isLoading = false;
      this.alertService.pushAlert(new Alert('There was an error updating the rich text content', AlertContext.Danger, true));
    });
  }
}
