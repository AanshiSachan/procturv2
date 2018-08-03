import { Component, OnInit, OnChanges, Input, Output, ViewChild, ElementRef, ChangeDetectionStrategy, ChangeDetectorRef, EventEmitter } from '@angular/core';
import { FileManagerService } from '../file-manager.service';
import { AppComponent } from '../../../../app.component';



export class File {

  private name: string;
  private type: string;
  private res: any;

  constructor(name, type, res) {
    this.name = name;
    this.type = type;
    this.res = res;
  }

}



@Component({
  selector: 'file-card',
  templateUrl: './file-card.component.html',
  styleUrls: ['./file-card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FileCardComponent implements OnChanges {

  @Input() data: any;

  @Output() draggedover = new EventEmitter<any>(null);
  @Output() draggedleave = new EventEmitter<any>(null);

  @Output() fileid = new EventEmitter<any>();

  @ViewChild("fileHeader") fileHeader: ElementRef;
  @ViewChild("fileHeader") fileImage: ElementRef;

  @Output() status = new EventEmitter<any>();
  @Input() fileDisplayArr: any[] = [];

  fileObj: File;

  @Input() selectedFolder: any[] = [];

  @Output() getPopupValue = new EventEmitter<any>();
  getPopupValueOpen: boolean = true;

  @Output() fileArr = new EventEmitter<any>();
  @Output() shareOptions = new EventEmitter<any>();
  dwnldLink = "";

  constructor(private cd: ChangeDetectorRef, private fileService: FileManagerService, private appC: AppComponent) {
  }

  ngOnChanges() {
    this.generateFile(this.data);
  }

  ngOnInit() {
  }

  generateFile(data) {
    let name = data.label.split(".")[0];
    let type = data.label.split(".")[1];
    this.fileObj = new File(name, type, data.data);
    this.setImageAndIcons(type);
    this.cd.detectChanges();
    this.cd.detach();
  }

  setImageAndIcons(type: string) {

    /* Document File */
    if (type === "doc" || type === "docx") {
      this.fileHeader.nativeElement.classList.add("docx");
      this.fileHeader.nativeElement.classList.add("doc-file");

    }

    /* PDF format */
    else if (type === 'pdf') {
      this.fileHeader.nativeElement.classList.add("pdf");
      this.fileHeader.nativeElement.classList.add("pdf-file");

    }

    /* Ms Excel Files */
    else if (type === 'xls' || type === "xlsx" || type === "csv") {
      this.fileHeader.nativeElement.classList.add("xlsx");
      this.fileHeader.nativeElement.classList.add("xlsx-file");

    }


    /* Text & RTF files */
    else if (type === 'txt' || type === "rtf") {
      this.fileHeader.nativeElement.classList.add("texts");
      this.fileHeader.nativeElement.classList.add("text-file");

    }


    /* jpg,jpeg,png */
    else if (type === 'jpg' || type === 'jpeg' || type === 'png' || type == "bmp" || type === "tif") {
      this.fileHeader.nativeElement.classList.add("image");
      this.fileHeader.nativeElement.classList.add("image-file");
    }

    /* Videos */
    else if (type === 'mp4' || type === 'flv' || type === 'wmv' || type === 'mov') {
      this.fileHeader.nativeElement.classList.add("video");
      this.fileHeader.nativeElement.classList.add("video-file");

    }

    /* Power point Slides */
    else if (type === 'ppt' || type === 'pptx') {
      this.fileHeader.nativeElement.classList.add("texts");
      this.fileHeader.nativeElement.classList.add("file-file");

    }

    /* Power point Slides */
    else if (type === 'mp3' || type === 'wav') {
      this.fileHeader.nativeElement.classList.add("audio");
      this.fileHeader.nativeElement.classList.add("audio-file");

    }


    /* Power point Slides */
    else if (type === 'rar' || type === 'zip') {
      this.fileHeader.nativeElement.classList.add("zip");
      this.fileHeader.nativeElement.classList.add("zip-file");

    }


    /* Default Case */
    else {
      this.fileHeader.nativeElement.classList.add("texts");
      this.fileHeader.nativeElement.classList.add(".file-file");

    }

  }

  onDragOver(event: Event) {
    console.log("file over");
    this.draggedover.emit(event);
    this.preventAndStop(event);
  }

  onDragLeave(event: Event) {
    console.log("file leave");
    //this.draggedleave.emit(event);
    this.draggedover.emit(event);
    this.preventAndStop(event);
  }

  private preventAndStop(event) {
    event.stopPropagation();
    event.preventDefault();
  }

  getFilesDeleted(event) {
    console.log(event);
    let getDeletedFiles = [{
      file_id: event.res.file_id,
      keyName: event.res.keyName
    }]

    if (confirm('Are you sure, you want to delete the file?')) {
      this.fileService.deleteFiles(getDeletedFiles).subscribe(
        (data: any) => {
          let msg = {
            type: "success",
            body: "File Deleted Successfully"
          }
          this.appC.popToast(msg);
          this.status.emit(data.statusCode);
        },
        (error: any) => {
          let msg = {
            type: 'error',
            body: error.error.message
          }
          this.appC.popToast(msg);
        }
      )
    }
  }

  getPopupOpen(fileObj) {
    let shareOptions = {
      publicShare: fileObj.res.public_share,
      instituteShare: fileObj.res.inst_share,
      batchShare: fileObj.res.student_batch_share
    }
    if (shareOptions.publicShare == 0 && shareOptions.instituteShare == 0 && shareOptions.batchShare == 0) {
      this.shareOptions.emit("new");
    } else {
      this.shareOptions.emit(shareOptions);
    }
    this.fileArr.emit(fileObj);
    this.fileid.emit(fileObj.res.file_id)
    this.getPopupValue.emit(this.getPopupValueOpen);
  }

  convertBase64ToArray(val) {
    var binary_string = window.btoa(encodeURI(val));
    var len = binary_string.length;
    var bytes = new Uint8Array(len);
    for (var i = 0; i < len; i++) { bytes[i] = binary_string.charCodeAt(i); }
    return bytes.buffer;
  }

  getFileDownloaded(fileObj) {
   
    let url = this.fileService.baseUrl + "/api/v1/instFileSystem/downloadFile/" + this.fileService.institute_id + "?fileId=" + fileObj.res.file_id;
    setTimeout(()=>{
      var hiddenDownload = <HTMLAnchorElement>document.getElementById('downloadFileClick');
      hiddenDownload.href = url;
      hiddenDownload.download = fileObj.res.file_name;
      hiddenDownload.click();
    }, 500);
    console.log(fileObj);
    console.log(url);
  }



}
