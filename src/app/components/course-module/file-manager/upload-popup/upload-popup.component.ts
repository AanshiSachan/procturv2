import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, EventEmitter, Input, OnChanges, OnInit, Output, ViewChild } from '@angular/core';
import { AppComponent } from '../../../../app.component';
import { AuthenticatorService } from '../../../../services/authenticator.service';
import { FileManagerService } from '../file-manager.service';
import { HttpService } from '../../../../services/http.service';


class fileObj {
  private fileName: string;
  private fileType: string;
  private fileSize: any;


  constructor(fileName: string, fileType: string, fileSize: any) {
    this.fileName = fileName;
    this.fileType = fileType;
    this.fileSize = this.getSizeMB(fileSize);
  }

  public getSizeMB(size: any): string {
    return size + "KB";
  }

  public getSize(): any {
    return this.fileSize;
  }

}

@Component({
  selector: 'app-upload-popup',
  templateUrl: './upload-popup.component.html',
  styleUrls: ['./upload-popup.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UploadPopupComponent implements OnInit, OnChanges {

  getCategoryData: any[] = [];
  @ViewChild('icon') icon: ElementRef;
  @Output() closePopupValue = new EventEmitter<boolean>(true);
  @Input() selectedFiles: any[] = [];
  @Input() currentFolder: any = null;
  @Input() fetchPrefillFolderAndFiles: any;
  @Input() manualUpload: boolean = false;
  @Input() pathArray: any[] = [];
  @Input() currentFilesArray: any[] = [];
  @Input() editView: any;
  @Output() getFilesAndFolder: any = new EventEmitter<any>();
  @Output() filesAndFolder: any = new EventEmitter<any>();
  @Output() filePath: any = new EventEmitter<any>();
  fileLoading: string = "";
  @Output() uploadStatus = new EventEmitter<any>();

  progress: number = 0;
  type: string = "";
  customFileArr: fileObj[] = [];
  category_id: number | string = "-1";
  youtubeUrl: any = '';

  category_image = {
    png: "1",
    jpg: "4",
    jpeg: "5",
    bmp: "6",
    mp4: "7",
    mp3: "8"
  }

  category_docx = {
    xls: "4",
    xlsx: "5",
  }

  category_pdf = {
    pdf: "2",
  }

  category_txt = {
    txt: "6",
    rtf: "7",
    gif: "7",
    tif: "8"
  }

  acceptedFiles = {
    62: {
      png: "1",
      pdf: "2",
      mp4: "3",
      jpg: "4",
      jpeg: "5",
      bmp: "6",
      gif: "7",
      tif: "8",
    },
    63: {
      pdf: "1",
      doc: "2",
      docx: "3",
      xls: "4",
      xlsx: "5",
      txt: "6",
      rtf: "7",
      jpg: "8",
      jpeg: "9",
      png: "10",
      pptx: "11",
      ppt: "12",
      zip:'13'
    },
    66: {
      pdf: "1",
      doc: "2",
      docx: "3",
      xls: "4",
      xlsx: "5",
      txt: "6",
      rtf: "7",
      jpg: "8",
      jpeg: "9",
      png: "10",
      pptx: "11",
      ppt: "12",
      zip:'13',
      mp3: "14",
      wav: "15",
    },
    67: {
      pdf: "1",
      doc: "2",
      docx: "3",
      xls: "4",
      xlsx: "5",
      txt: "6",
      rtf: "7",
      zip:'8'
    },
    182: {
      pdf: "1",
      doc: "2",
      docx: "3",
      xls: "4",
      xlsx: "5",
      txt: "6",
      rtf: "7",
      zip:'8'
    }
  }

  /*category_gallery = {
    png: "1",
    pdf: "2",
    mp4: "3",
    jpg: "4",
    jpeg: "5",
    bmp: "6",
    gif: "7",
    tif: "8"
  }

  category_assignment = {
    pdf:"1",
    doc:"2",
    docx:"3",
    xls:"4",
    xlsx:"5",
    txt:"6",
    rtf:"7",
    jpg:"8",
    jpeg:"9",
    png:"10"
  }

  category_exam = {
    pdf:"1",
    doc:"2",
    docx:"3",
    xls:"4",
    xlsx:"5",
    txt:"6",
    rtf:"7",
    jpg:"8",
    jpeg:"9",
    png:"10"
  }

  category_other = {
    pdf:"1",
    doc:"2",
    docx:"3",
    xls:"4",
    xlsx:"5",
    txt:"6",
    rtf:"7"
  } */

  tempArr: any[] = [];
  inputFiles: any;
  isUploadingXls: boolean = false;

  constructor(
    private cd: ChangeDetectorRef,
    private fileService: FileManagerService,
    private appC: AppComponent,
    private auth: AuthenticatorService,
    private httpService: HttpService
    ) { }

  ngOnInit() {
    this.getCategories();
    if(this.editView && this.editView.editView == true) {
      this.category_id = this.editView.res.category_id;
      this.youtubeUrl = this.editView.res.file_name;
    }
    console.log(this.editView)
  }

  ngOnChanges() {
    this.customFileArr = this.generateFilePreview(this.selectedFiles);
    this.cd.detectChanges();
  }

  getCategories() {
    this.fileService.getCategories().subscribe(
      (data: any) => {
        this.getCategoryData = data;
        this.getCategoryData.map((ele: any) => {
          if (ele.category_id == "182") {
            ele.category_name = "Study Material"
          }
        })
        this.cd.detectChanges();
      },
      (error: any) => {
        let msg = {
          type: "error",
          body: error.error.message
        }
        this.appC.popToast(msg);
      }
    )
  }

  close() {
    this.manualUpload = false;
    this.closePopupValue.emit(false);
    this.cd.detectChanges();
  }

  getName(file: string): string {
    return file.split(".")[0];
  }

  getType(file: string): string {
    let str = file.substring(file.lastIndexOf(".") + 1, file.length);
    return str;
  }

  generateFilePreview(fileList: any[]): fileObj[] {
    let size = fileList.length;
    let tempArr: fileObj[] = [];
    this.tempArr = tempArr
    let file;
    if (size > 0) {
      for (let i = 0; i < size; i++) {
        file = fileList[i];
        tempArr.push(new fileObj(this.getName(file.name), this.getType(file.name), file.size));
      }
    }
    return tempArr;
  }


  convertBase64ToArray(val) {

    var binary_string = window.atob(val);
    var len = binary_string.length;
    var bytes = new Uint8Array(len);
    for (var i = 0; i < len; i++) {
      bytes[i] = binary_string.charCodeAt(i);
    }
    return bytes.buffer;

  }


  updateXlsHeaders(ev) {
    ev.xhr.setRequestHeader("processData", "false");
    ev.xhr.setRequestHeader("contentType", "false");
    ev.xhr.setRequestHeader("Access-Control-Allow-Origin", "*");
    ev.xhr.setRequestHeader("enctype", "multipart/form-data");
    ev.xhr.setRequestHeader("Authorization", sessionStorage.getItem("Authorization"));
  }


  uploadHandler() {

    if(this.category_id!=230){
    if (this.categoryCheck(this.category_id) == true) {

      if (this.selectedFiles.length == 0) {
        this.appC.popToast({ type: "error", body: "No file selected" })
        return
      }

      if (this.duplicateFileCheck() == false) {
        this.appC.popToast({ type: "error", body: "File already exists" })
        return
      }

      this.uploadFile();
    }
  } else {
    this.uploadFile();
  }


  }

  uploadFile() {
    this.uploadStatus.emit(true);
      let path: string = "";
      let institute_id = sessionStorage.getItem("institute_id");

      path = this.pathArray.join('/') + '/'

      let formData = new FormData();
      // formData.append("file", this.selectedFiles[0]);

      let arr = Array.from(this.selectedFiles)
      arr.map((ele, index) => {
        formData.append("file_" + index, ele);
      })
      let base = this.auth.getBaseUrl();
      let urlPostXlsDocument = base + "/api/v1/instFileSystem/createFiles";
      let newxhr = new XMLHttpRequest();
      let auths: any = {
        userid: sessionStorage.getItem('userid'),
        userType: sessionStorage.getItem('userType'),
        password: sessionStorage.getItem('password'),
        institution_id: sessionStorage.getItem('institute_id'),
        category_id: this.category_id,
      }
      let Authorization = btoa(auths.userid + "|" + auths.userType + ":" + auths.password + ":" + auths.institution_id);

      newxhr.open("POST", urlPostXlsDocument, true);

      // newxhr.setRequestHeader("Pragma", "no-cache");
      // newxhr.setRequestHeader("Cache-Control", "no-cache, no-store, must-revalidate");
      // newxhr.setRequestHeader("processData", "false");
      newxhr.setRequestHeader("category_id", this.category_id.toString());
      newxhr.setRequestHeader("institute_id", institute_id);
      newxhr.setRequestHeader("youtubeUrl", this.youtubeUrl);
      newxhr.setRequestHeader("Authorization", Authorization);
      newxhr.setRequestHeader("enctype", "multipart/form-data;");
      newxhr.setRequestHeader("keyName", path);
      newxhr.setRequestHeader("Accept", "application/json, text/javascript");
      // newxhr.setRequestHeader("Access-Control-Allow-Headers", "*");
      // newxhr.setRequestHeader("dataType", "json");
      newxhr.setRequestHeader("Access-Control-Allow-Origin", "*");


      this.isUploadingXls = true;
      for (let file of this.tempArr) {
        newxhr.upload.addEventListener('progress', (e: ProgressEvent) => {
          if (e.lengthComputable) {
            this.progress = Math.round((e.loaded * 100) / e.total);
            document.getElementById('progress-width').style.width = this.progress + '%';
            this.fileLoading = file.name;
          }
        }, false);
      }
      newxhr.onreadystatechange = () => {
        if (newxhr.readyState == 4) {
          this.progress = 0;

          if (newxhr.status >= 200 && newxhr.status < 300) {
            this.isUploadingXls = false;
            let data = {
              type: 'success',
              title: "File uploaded successfully",
              body: newxhr.response.fileName
            }
            this.appC.popToast(data);
            this.uploadStatus.emit(false);
            this.manualUpload = false;
            this.filePath.emit(path);
            this.closePopupValue.emit(false);
            this.getFilesAndFolder.emit(newxhr.status);

          } else {
            this.isUploadingXls = false;
            this.uploadStatus.emit(false);
            let data = {
              type: 'error',
              title: "File uploaded failed",
              body: newxhr.response.fileName
            }
            this.appC.popToast(data);

          }
        }
      }
      newxhr.send(formData);
  }

  duplicateFileCheck() {
    for (let i = 0; i < this.selectedFiles.length; i++) {
      for (let j = 0; j < this.currentFilesArray.length; j++) {
        if (this.selectedFiles[i].name == this.currentFilesArray[j].file_name) {

          return false
        }
      }
    }
    return true;
  }

  categoryCheck(id) {

    if (this.category_id == '-1') {
      this.createErrorToast("Please select a category");
      return false;
    }
    else {
      if(this.category_id!=230){
      this.type = Object.keys(this.acceptedFiles[this.category_id]).join()
      for (let i = 0; i < this.selectedFiles.length; i++) {
        let type = this.getType(this.selectedFiles[i].name);
        if (this.acceptedFiles[this.category_id].hasOwnProperty(type) == false) {
          this.createErrorToast("File doesn\'t match with the selected category ");
          return false;
        }
      }
      }
      return true;
    }
  }

  fillFiles(files) {
    setTimeout(() => {
      let manualUploadedFileList = (<HTMLInputElement>document.getElementById('uploadFileControl')).files;
      let filesArr = Array.from(manualUploadedFileList);
      this.selectedFiles = filesArr;
      this.customFileArr = this.generateFilePreview(this.selectedFiles);
    }, 500)
  }

  createErrorToast(message) {
    let msg = {
      type: "error",
      body: message
    }
    this.appC.popToast(msg);
  }

  updateYoutubeURL() {
    let obj = {
        "title":this.youtubeUrl,
        "institute_id": sessionStorage.getItem('institute_id'),
        "category_id":230
    }
    this.auth.showLoader();
    this.httpService.putData('/api/v1/instFileSystem/update/'+this.editView.res.file_id, obj).subscribe(
      (res:any) => {
        this.auth.hideLoader();
        this.manualUpload = false;
        let temp = this.editView.res.keyName.split('/https');
        if(temp && temp.length) {
        let newPath = temp[0].concat('/');
        this.filePath.emit(newPath);
        }
        this.getFilesAndFolder.emit(200);
        this.closePopupValue.emit(false);
      }
    )
  }
}
