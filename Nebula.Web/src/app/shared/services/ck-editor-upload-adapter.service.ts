import { Injectable } from "@angular/core";
import { FileResourceService } from "../generated";

@Injectable({
    providedIn: 'root'
  })
  export class CkEditorUploadAdapter {
  
    constructor(
        private loader, 
        private editor,
        private fileResourceService: FileResourceService, 
        private apiUrl: string, 
    ) {}
  
    // Starts the upload process.
    upload() {
  
      return this.loader.file.then(file => new Promise((resolve, reject) => {
        this.fileResourceService.fileResourceCkEditorUploadPost(file).subscribe(x => {
          const imageUrl = `${this.apiUrl}${x.imageUrl}`;
          this.editor.isReadOnly = false;
  
          resolve({
            // todo: this should be correct instead of incorrect.
            default: imageUrl
          });
        }, error => {
          this.editor.isReadOnly = false;
  
          reject("There was an error uploading the file. Please try again.")
        });
      })
      );
    }
  
    // Aborts the upload process.
    abort() {
      // NP 4/23/2020 todo? I'm not sure this is actually necessary, I don't see any way for the user to cancel the upload once triggered.
    }
  }