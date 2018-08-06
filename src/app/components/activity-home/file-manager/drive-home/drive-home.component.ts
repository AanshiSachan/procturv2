import { Component, NgZone, OnInit, ViewChild, ElementRef, EventEmitter, Output, Input } from '@angular/core';
import { Tree } from 'primeng/tree';
import { TreeNode } from 'primeng/api';
import { FileManagerService } from '../file-manager.service';
import { UploadPopupComponent } from '../upload-popup/upload-popup.component';
import { AppComponent } from '../../../../app.component';

@Component({
  selector: 'app-drive-home',
  templateUrl: './drive-home.component.html',
  styleUrls: ['./drive-home.component.scss']
})
export class DriveHomeComponent implements OnInit {

  @ViewChild('DragContainer') dragBox: ElementRef;
  @ViewChild('dropZone') dropZone: ElementRef;
  @ViewChild('uploaders') uploaders: ElementRef;

  isGridView: boolean = true;
  isFirstTimeLoad: boolean = false;
  manualUpload = false;
  msg = '';

  @ViewChild('expandingTree')

  expandingTree: Tree;
  folderFileArr: any[] = [];
  usedSpaceDetails: any;
  treeNodeData: TreeNode[] = [
    {
      label: "My Drive",
      data: null,
      expandedIcon: "fa fa-folder-open",
      collapsedIcon: "fa fa-folder",
      type: "folder",
      children: []
    }];
  fileDisplayArr: any[] = [];
  folderDisplayArr: any[] = [];
  selectedFolder: any;


  headertext: string = '';
  customstyle: string = "drop-area";
  dragoverflag: boolean = false;

  addCategoryPopup: boolean = false;

  selectedFiles: FileList[] = [];

  getCategoryData: any[] = [];

  addNewRow = []
  sendPayload = {

  }

  getPopupOpen: boolean = false;

  fileIdGet: string;

  fileName: any[];
  shareOptions: any;

  createFolderControl: boolean = false;

  createFetchFolder = {
    folderName: "",
    institute_id: this.fileService.institute_id,
    keyName: ""
  }

  filePath1: "";
  filePathPopup: "";
  str: string;
  getPath: string = "";
  pathArray = [];
  nodes: TreeNode;
  isFolderEmpty: boolean = false;
  localFolder: any[];

  constructor(private zone: NgZone, private fileService: FileManagerService, private appC: AppComponent) { }


  ngOnInit(refreshTree?) {

    let institute_id = sessionStorage.getItem("institute_id");
    if (refreshTree == true) {
      this.fetchPrefillFolderAndFiles(institute_id + "/", refreshTree);
    } else {
      this.fetchPrefillFolderAndFiles(institute_id + "/");
    }
    this.fetchUsedSpace();
  }


  fetchPrefillFolderAndFiles(path: string, backLoad?) {

    let institute_id = sessionStorage.getItem("institute_id");
    let obj = { keyName: path, institute_id: institute_id };

    this.fileService.getAllFolderFiles(obj).subscribe(
      (res: any) => {
        this.getPath = obj.keyName;
        this.pathArray = this.getPath.split('/');
        // for End Empty Character 
        if (backLoad) {
          this.generateTreeNodes(res, obj.keyName, true);
        } else {
          this.generateTreeNodes(res, obj.keyName);
        }
      }
    );
  }

  fetchUsedSpace() {
    this.fileService.getUsedSpace().subscribe(
      (res: any) => {
        this.usedSpaceDetails = res;
      }
    );
  }

  getFilesAndFolder(event) {
    if (event >= 200 && event < 300) {
      this.fetchPrefillFolderAndFiles(this.filePathPopup);
    }
    else {

    }
  }

  closeSharePopup(event) {
    if (event == false) {
      this.getPopupOpen = false;
    }
    else {
      this.getPopupOpen = true;
    }
  }

  collapseString(index) {
    // let pathArray = this.getPath.split('/');
    this.pathArray = this.pathArray.filter((ele, i) => {
      if (index >= i) {
        return true;
      } else {
        return false;
      }
    })
    let basePath = this.pathArray.join('/') + '/';
    if (this.pathArray.length == 1) {
      this.fetchPrefillFolderAndFiles(basePath, true);
    } else {
      this.fetchPrefillFolderAndFiles(basePath);
    }
  }


  getFilesDeleted() {
    let getDeletedFiles = [{
      file_id: "0",
      keyName: this.selectedFolder.data.keyName
    }]

    if (confirm('Are you sure, you want to delete the file?')) {
      this.fileService.deleteFiles(getDeletedFiles).subscribe(
        (data: any) => {
          let msg = {
            type: "success",
            body: "Folder Deleted Successfully"
          }
          this.appC.popToast(msg);
          let path = getDeletedFiles[0].keyName.split('/');
          path.pop();
          path.pop();
          let newPath = path.join('/');
          this.fetchPrefillFolderAndFiles(newPath);
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

  fileId(event) {

    this.fileIdGet = event;
  }

  fileArr(event) {
    this.fileName = event;
  }

  makeFolderOpen() {
    this.createFolderControl = true;
  }

  createFolder() {
    let path: string = "";
    let institute_id = sessionStorage.getItem("institute_id");
    if (this.selectedFolder != null && this.selectedFolder != undefined) {
      path = this.selectedFolder.data.keyName;
    }
    else {
      path = institute_id + "/";
    }
    this.createFetchFolder.keyName = path;
    this.fileService.craeteFolder(this.createFetchFolder).subscribe(
      (data: any) => {
        this.createFolderControl = false;
        let msg = {
          type: "success",
          body: "Folder Created successfully"
        }
        this.appC.popToast(msg);
        this.fetchPrefillFolderAndFiles(this.createFetchFolder.keyName);
        // this.ngOnInit(true);
      },
      (error: any) => {

      }
    )
  }


  toggleView() {
    this.zone.runOutsideAngular(() => {
      if (this.dragBox.nativeElement.classList.contains("grid__container")) {
        this.dragBox.nativeElement.classList.remove("grid__container");
        this.dragBox.nativeElement.classList.add("list__container");
        this.isGridView = false;
      }
      else {
        this.dragBox.nativeElement.classList.add("grid__container");
        this.dragBox.nativeElement.classList.remove("list__container");
        this.isGridView = true;
      }
    });
  }


  openSettings() { }


  onNodeExpand(event) {

  }

  onNodeSelect(event) {

  }

  searchDatabase(eve) {

  }

  onNodeCollapse(event) {

  }


  folderSelected(folder) {
    this.selectedFolder = folder;
    // this.getChildFolders(folder);
    if (folder.data.hasOwnProperty('keyName')) {
      this.fetchPrefillFolderAndFiles(folder.data.keyName);
    }
  }

  generateTreeNodes(res, path: string, backLoad?) {
    if (backLoad == true) {
      this.isFirstTimeLoad = false;
    }
    this.fileDisplayArr = [];
    this.folderDisplayArr = [];
    /* Local Directory Structure to be created from the incoming response */
    let localFolder: any[] = [];
    let childArr: any[] = [];
    let folderArr: any[] = [];

    if (res.files != null) {
      childArr = this.getChildArray(res.files);
    }
    if (res.folders != null) {
      folderArr = this.getChildFolders(res.folders)
    }
    if (res.files == null && res.folders == null) {
      let temp: any = [{
        label: 'empty',
        data: [],
        expandedIcon: "",
        collapsedIcon: "",
        type: "",
        children: []
      }];
      this.isFolderEmpty = true;
      this.updateTreeNode(temp);
      return;
    }
    this.isFolderEmpty = false;
    this.fileDisplayArr = childArr;

    this.folderDisplayArr = folderArr;
    localFolder = folderArr.concat(childArr);
    this.folderFileArr = localFolder;

    /* Only When Calling the Home Folder Refresh the TreeNode */
    if (path.split("/")[1] == "") {
      /* If user has requested API for first time then fetch shell of outer folder */
      if (!this.isFirstTimeLoad) {
        this.treeNodeData = localFolder;
        this.isFirstTimeLoad = true;
      }
      else {
        this.updateTreeNode(localFolder);
      }
    }
    /* Adding Data to Tree Node */
    else {
      this.updateTreeNode(localFolder);
    }

  }

  updateTreeNode(localFolder) {
    this.treeNodeData.forEach(node => {
      if (node.type == "folder") {
        if (node.label == this.selectedFolder.label) {
          if (node.children.length == 0) {
            node.children = localFolder;
          } else {
            this.findNode(node, localFolder);
          }
        }
        else {
          if (node.children.length != 0) {
            this.findNode(node, localFolder);
          }
        }
      }
    });
  }

  getCategories() {
    this.addCategoryPopup = true;
    this.fileService.getCategories().subscribe(
      (data: any) => {
        this.getCategoryData = data;
      },
      (error: any) => {

      }
    )
  }

  closeCategoryPopup() {
    this.addCategoryPopup = false;
  }


  addNewRowToPopup(a) {

    let arr = []

    if (this.addNewRow.length > 4) {

    }
    else {
      this.addNewRow.push(arr);
    }

  }

  findNode(node: TreeNode, localFolder) {
    this.nodes = node;
    this.localFolder = localFolder;

    node.children.forEach(child => {
      if (child.type === "folder") {
        if (child.label === this.selectedFolder.label) {
          child.children = localFolder;
        }
        else {
          if (child.children != null) {
            if (child.children.length != 0) {
              this.findNode(child, localFolder);
            }
            else {
              child.children = [];
            }
          }
          else {
            child.children = [];
          }
        }
      }
    });
  }

  getChildArray(obj): any[] {
    let tempChildArr: any[] = [];
    let size = Object.keys(obj).length;
    if (size > 0) {
      for (let key in obj) {
        /* Structure for child files directly  under a folder */
        let childFile = { label: this.generateName(key, 'file'), icon: this.generateFileType(key), data: obj[key], type: "file" };
        tempChildArr.push(childFile);
      }
      return tempChildArr;
    }

    return tempChildArr;
  }

  getChildFolders(obj): any[] {

    let tempFolderArr: any[] = [];
    let size = Object.keys(obj).length;

    if (size > 0) {
      for (let key in obj) {
        /* Structure to define a folder */
        let folderObj: any = {
          label: this.generateName(key, 'folder'),
          data: obj[key],
          expandedIcon: "fa fa-folder-open",
          collapsedIcon: "fa fa-folder",
          type: "folder",
          children: []
        };
        tempFolderArr.push(folderObj);
      }
      return tempFolderArr;
    }

    return tempFolderArr;
  }

  generateName(key, type): string {
    let tempArr = key.split('/');
    if (tempArr.length >= 1) {
      if (type == "file") {
        return tempArr[tempArr.length - 1];
      }
      return tempArr[tempArr.length - 2];
    }
    return "";
  }

  generateFileType(key): string {

    let tempArr = key.split('.');
    if (tempArr.length >= 1) {
      let type: string = tempArr[1];
      if (type == "pdf") { return "fa-file-pdf-o"; }

      else if (type == "mp3") { return "fa fa-music"; }
      else if (type == "wav") { return "fa fa-music"; }
      else if (type == "wmv") { return "fa fa-music"; }

      else if (type == "mp4") { return "fa fa-film"; }
      else if (type == "flv") { return "fa fa-film"; }
      else if (type == "mov") { return "fa fa-film"; }

      else if (type == "jpg") { return "fa fa-picture-o"; }
      else if (type == "jpeg") { return "fa fa-picture-o"; }
      else if (type == "gif") { return "fa fa-picture-o"; }
      else if (type == "png") { return "fa fa-picture-o"; }


      else if (type == "doc") { return "fa fa-file-word-o"; }
      else if (type == "docx") { return "fa fa-file-word-o"; }

      else if (type == "xls") { return "fa fa-file-excel-o"; }
      else if (type == "xlsx") { return "fa fa-file-excel-o"; }
      else if (type == "csv") { return "fa fa-file-excel-o"; }

      else if (type == "ppt") { return "fa fa-file-powerpoint-o"; }
      else if (type == "pptx") { return "fa fa-file-powerpoint-o"; }

      else if (type == "zip") { return "fa fa-file-archive-o"; }
      else if (type == "rar") { return "fa fa-file-archive-o"; }
      else if (type == "7z") { return "fa fa-file-archive-o"; }

      return "fa-file-o";
    }

    return "fa-file-o";

  }

  navigateTo(location) {
    if (location == "") {
      let institute_id = sessionStorage.getItem("institute_id");
      this.fetchPrefillFolderAndFiles(institute_id + "/");
    }
  }

  private preventAndStop(event) {
    event.stopPropagation();
    event.preventDefault();
  }

  onDragOver(event: any): void {

    this.dragoverflag = true;
    this.dropZone.nativeElement.classList.add("over");
    this.preventAndStop(event);
  }

  onDragLeave(event: any): void {
    if (event.target.classList.contains("ui-fileupload-content")) {
      this.dragoverflag = false;
      this.dropZone.nativeElement.classList.remove("over");
      this.preventAndStop(event);
    }
    this.preventAndStop(event);
  }

  onDrop(event: Event): void {

    this.preventAndStop(event);
    this.dropZone.nativeElement.classList.remove("over");
    this.dragoverflag = false;
    alert("files Uploaded");
  }

  onDragOverFolder(event: Event, folder): void {
    this.dragoverflag = true;
    this.dropZone.nativeElement.classList.add("over");
    this.preventAndStop(event);
    if (folder != null) {
    }
  }

  onDragLeaveFolder(event: Event, folder): void {
    this.dragoverflag = true;
    this.dropZone.nativeElement.classList.add("over");

    this.preventAndStop(event);
    if (folder != null) {
    }
  }

  uploadBox() {
    this.manualUpload = true;
    this.addCategoryPopup = true;
  }


  getPopupValue(event) {

    this.getPopupOpen = true;
  }

  close(event) {
    this.manualUpload = false;
    this.addCategoryPopup = false;
  }

  onSelect(event, uploaders) {
    /* Remove the overlay from layout  */
    this.dropZone.nativeElement.classList.remove("over");
    this.dragoverflag = false;
    this.addCategoryPopup = true;
    this.selectedFiles = event.files;
  }

  status(event) {

    if (event == 200) {
      this.fetchPrefillFolderAndFiles(this.filePath1);
      // this.generateTreeNodes(event, "");
    }
    else {

    }
  }

  filePath(event) {
    this.filePath1 = event;
  }

  filePathUpload(event) {
    this.filePathPopup = event;
  }

  handleOptions(options) {
    this.shareOptions = options;
  }

  closeFolderControl() {
    this.createFolderControl = false;
  }

}
