import { Component, OnInit, Input, ChangeDetectorRef } from '@angular/core';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { AlertService } from '../../services/alert.service';
import { Alert } from '../../models/alert';
import { AlertContext } from '../../models/enums/alert-context.enum';
import * as ClassicEditor from 'src/assets/main/ckeditor/ckeditor.js';
import { environment } from 'src/environments/environment';
import { CustomRichTextDto, CustomRichTextService, FileResourceService, UserDto } from '../../generated';
import { CkEditorUploadAdapter } from '../../services/ck-editor-upload-adapter.service';

@Component({
  selector: 'custom-rich-text',
  templateUrl: './custom-rich-text.component.html',
  styleUrls: ['./custom-rich-text.component.scss']
})
export class CustomRichTextComponent implements OnInit {
  @Input() customRichTextTypeID: number;
  public customRichTextContent: string;
  public isLoading: boolean = true;
  public isEditing: boolean = false;
  public isEmptyContent: boolean = false;
  public watchUserChangeSubscription: any;
  public Editor = ClassicEditor;
  public editedContent: string;
  public editor;

  currentUser: UserDto;

  public ckConfig = {"removePlugins": ["MediaEmbed"]}

  constructor (
    private customRichTextService: CustomRichTextService,
    private authenticationService: AuthenticationService,
    private cdr: ChangeDetectorRef,
    private alertService: AlertService,
    private fileResourceService: FileResourceService
  ) { }

  ngOnInit() {
    this.authenticationService.getCurrentUser().subscribe(currentUser => {
      this.currentUser = currentUser;
    });
    //window.Editor = this.Editor;

    this.customRichTextService.customRichTextCustomRichTextTypeIDGet(this.customRichTextTypeID).subscribe(x => {
      this.customRichTextContent = x.CustomRichTextContent;
      this.isEmptyContent = x.IsEmptyContent;
      this.isLoading = false;
    });
  }

  // tell CkEditor to use the class below as its upload adapter
  // see https://ckeditor.com/docs/ckeditor5/latest/framework/guides/deep-dive/upload-adapter.html#how-does-the-image-upload-work
  public ckEditorReady(editor) {
    const fileResourceService = this.fileResourceService;
    this.editor = editor;

    editor.plugins.get('FileRepository').createUploadAdapter = (loader) => {
      // disable the editor until the image comes back
      editor.isReadOnly = true;
      return new CkEditorUploadAdapter(loader, fileResourceService, environment.mainAppApiUrl, editor);
    };
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
      this.alertService.pushAlert(new Alert("There was an error updating the rich text content", AlertContext.Danger, true));
    });
  }
  
  public isUploadingImage():boolean{
    return this.editor && this.editor.isReadOnly;
  }

}
