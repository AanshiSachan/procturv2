import { Component, NgZone, OnInit, ViewChild, ElementRef, EventEmitter, Output, Input } from '@angular/core';
import { Tree } from 'primeng/tree';
import { TreeNode } from 'primeng/api';
import { FileManagerService } from '../file-manager.service';
import { UploadPopupComponent } from '../upload-popup/upload-popup.component';
import { MessageShowService } from '../../../../services/message-show.service';

@Component({
  selector: 'app-drive-home',
  templateUrl: './drive-home.component.html',
  styleUrls: ['./drive-home.component.scss']
})
export class DriveHomeComponent implements OnInit {

  jsonFlag = {
    isRippleLoad: false,
    downloading: false,
    uploading: false
  };

  @ViewChild('DragContainer') dragBox: ElementRef;
  @ViewChild('dropZone') dropZone: ElementRef;
  @ViewChild('uploaders') uploaders: ElementRef;
  @ViewChild('expandingTree') expandingTree: Tree;
  nodes: TreeNode;
  treeNodeData: TreeNode[] = [
    {
      label: "My Drive",
      data: null,
      expandedIcon: "fa fa-folder-open",
      collapsedIcon: "fa fa-folder",
      type: "folder",
      children: []
    }];

  createFetchFolder = {
    folderName: "",
    institute_id: this.fileService.institute_id,
    keyName: ""
  }

  customstyle: string = "drop-area";
  fileIdGet: string;
  shareOptions: any;
  selectedFiles: FileList[] = [];
  getCategoryData: any[] = [];
  addNewRow = []
  fileName: any[];
  pathArray = [];
  localFolder: any[];
  children: any[] = [];
  fileDisplayArr: any[] = [];
  folderDisplayArr: any[] = [];
  folderFileArr: any[] = [];
  usedSpaceDetails: any;
  isFolderEmpty: boolean = false;
  collapseFlag: boolean = false;
  getPopupOpen: boolean = false;
  createFolderControl: boolean = false;
  dragoverflag: boolean = false;
  addCategoryPopup: boolean = false;
  isGridView: boolean = true;
  isFirstTimeLoad: boolean = false;
  manualUpload = false;
  msg = '';
  selectedFolder: any;
  prevLocalFolder: any;
  filePath1: "";
  filePathPopup: "";
  str: string;
  getPath: string = "";
  headertext: string = '';

  constructor(private zone: NgZone,
    private fileService: FileManagerService,
    private msgService: MessageShowService) { }


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
        this.children = res;
        this.getPath = obj.keyName;
        this.pathArray = this.getPath.split('/');
        this.pathArray.pop();
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
      this.fetchPrefillFolderAndFiles(this.filePathPopup, true);
    }
  }

  closeSharePopup(event) {
    console.log(event);
   this.getPopupOpen = event;
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
    // console.log(this.pathArray);
    let basePath = this.pathArray.join('/');
    // console.log(basePath);
    if (this.pathArray.length == 1) {
      basePath = basePath + '/';
      this.fetchPrefillFolderAndFiles(basePath, true);
    } else {
      this.collapseFlag = true;
      this.fetchPrefillFolderAndFiles(basePath + '/');
    }
  }


  getFilesDeleted(data) {
    let path = this.pathArray.join('/') + '/' + data.label + "/";
    let getDeletedFiles = [{
      file_id: "0",
      keyName: path
    }]
    if (confirm('Are you sure, you want to delete the file?')) {
      this.fileService.deleteFiles(getDeletedFiles).subscribe(
        (data: any) => {
          this.msgService.showErrorMessage('success', '', "Folder Deleted Successfully");
          let path = getDeletedFiles[0].keyName.split('/');
          path.pop();
          path.pop();
          let newPath = path.join('/');
          if (newPath == this.fileService.institute_id + '/') {
            this.fetchPrefillFolderAndFiles(newPath + "/", true);
          }
          else {
            this.fetchPrefillFolderAndFiles(newPath + '/', true);
          }
        },
        (error: any) => {
          this.msgService.showErrorMessage('success', '', error.error.message);
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

  duplicateFolderCheck(name) {
    for (let i = 0; i < this.folderDisplayArr.length; i++) {
      if (this.folderDisplayArr[i].label == name) {
        this.msgService.showErrorMessage('error', '', "Folder already exists");
        return false
      }

    }
    return true;
  }

  createFolder() {
    if (this.duplicateFolderCheck(this.createFetchFolder.folderName) == false) {
      return
    }

    else if (this.createFetchFolder.folderName == "") {
      this.msgService.showErrorMessage('error', '', "Folder name is manadatory");
      return
    }
    else {
      let path: string = "";
      let institute_id = sessionStorage.getItem("institute_id");
      path = this.pathArray.join('/') + '/'
      this.createFetchFolder.keyName = path;
      this.jsonFlag.isRippleLoad = true;
      this.fileService.craeteFolder(this.createFetchFolder).subscribe(
        (data: any) => {
          this.jsonFlag.isRippleLoad = false;
          this.createFolderControl = false;
          this.createFetchFolder.folderName = "";
          this.msgService.showErrorMessage('success', '', "Folder Created successfully");
          this.fetchPrefillFolderAndFiles(this.createFetchFolder.keyName, true);
          // this.ngOnInit(true);
        },
        (error: any) => {
          this.jsonFlag.isRippleLoad = false;
          this.msgService.showErrorMessage('error', '', error.error.message);
        }
      )
    }
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
      this.fetchPrefillFolderAndFiles(folder.data.keyName, true);
    }
  }

  generateTreeNodes(res, path: string, backLoad?) {
    if (backLoad == true) {
      this.isFirstTimeLoad = false;
    } else {
      this.prevLocalFolder = this.folderDisplayArr;
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
    if (backLoad == true) {
      this.prevLocalFolder = localFolder;
    }
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
      if (this.collapseFlag == true) {
        this.collapseFlag = false
      }
      else {
        this.updateTreeNode(localFolder);
      }
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
    console.log(folder);
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
      this.fetchPrefillFolderAndFiles(this.filePath1 + '/', true);
      // this.generateTreeNodes(event, "");
    }
    else {

    }
  }

  downloadStatus(event){
    this.jsonFlag.isRippleLoad = event;
    this.jsonFlag.downloading = event;
  }

  uploadStatus(event){
    this.jsonFlag.isRippleLoad = event;
    this.jsonFlag.uploading = event;
  }

  treeUpdater(event) {
    let institute_id = this.fileService.institute_id;
    if (event == true) {
      this.fetchPrefillFolderAndFiles(this.getPath, true);// it maintain the state of file  user stay in that state -- laxmi
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
