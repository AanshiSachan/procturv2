import { Component, OnInit, Input } from '@angular/core';
import { Tree } from 'primeng/tree';
import { Subject } from 'rxjs/Subject';
import { HttpService } from '../../../../../services/http.service';
import { AuthenticatorService } from '../../../../../services/authenticator.service';
import { MessageShowService } from '../../../../../services/message-show.service';;
import { Router } from '@angular/router';
import { FileService } from '../../file.service';

@Component({
  selector: 'app-upload-file',
  templateUrl: './upload-file.component.html',
  styleUrls: ['./upload-file.component.scss']
})
export class UploadFileComponent implements OnInit {

  subjectList: any[] = [];
  topicList: any[] = [];
  subtopicList: any[] = [];
  categiesList: any[] = [];
  categiesTypeList: any[] = [];
  institute_id: any;
  showModal: boolean = false;
  dragoverflag: boolean = false;
  isRippleLoad: boolean = false;
  addCategoryPopup: boolean = false;
  material_dataShow: boolean = false;
  material_dataFlag: string = '';
  varJson = {
    category_id: 0,
    name: '',
    topic_id: 0,
    course_types: "",
    video_url: "",
    sub_topic_id: 0,
    subject_id: 0,
    file_id: 0,
    is_readonly: 'N'
  }

  constructor(
    private _http: HttpService,
    private auth: AuthenticatorService,
    private msgService: MessageShowService,
    private router: Router,
    private _fservice: FileService
  ) {
    this.auth.currentInstituteId.subscribe(id => {
      this.institute_id = id;
    });
  }

  ngOnInit() {
    this.dragoverflag = true;
    this.getcategoriesList();
    this.getCategories();
    this._http.data.subscribe(data => {
      if (data == 'material-web') {
        this.material_dataFlag = 'material';
        this._http.updatedDataSelection(null);
      }
    });
  }

  uploadYoutubeURL($event) {
    let flag = this.uploadDatavalidation();
    if (flag) {
      var pattern = /^(http|https|www)?:\/\/[a-zA-Z0-9-\.]+\.[a-z]{2,4}/;
      if (!pattern.test(this.varJson.video_url)) {
        this.msgService.showErrorMessage(this.msgService.toastTypes.error, '', "Incorrect url");
        return false;
      }
      let category_id;
      this.categiesTypeList.forEach(element => {
        if (element.category_id == -1) {
          category_id = element.videoCategoryList[0].category_id;
        }
      });
      const formData = new FormData();
      let fileJson = {
        institute_id: this.institute_id,
        category_id: category_id,
        topic_id: this.varJson.topic_id,
        course_types: this.varJson.course_types,
        video_url: this.varJson.video_url,
        sub_topic_id: this.varJson.sub_topic_id,
        subject_id: this.varJson.subject_id,
        file_id: -1,
        is_readonly: 'N'
      }

      let base = this.auth.getBaseUrl();
      let urlPostUpload = base + "/api/v1/instFileSystem/uploadFile";
      let newxhr = new XMLHttpRequest();
      formData.append('fileJson', JSON.stringify(fileJson));
      let auths: any = {
        userid: sessionStorage.getItem('userid'),
        userType: sessionStorage.getItem('userType'),
        password: sessionStorage.getItem('password'),
        institution_id: sessionStorage.getItem('institute_id'),
      }
      let Authorization = btoa(auths.userid + "|" + auths.userType + ":" + auths.password + ":" + auths.institution_id);
      newxhr.open("POST", urlPostUpload, true);
      newxhr.setRequestHeader("Authorization", Authorization);
      newxhr.setRequestHeader("enctype", "multipart/form-data;");
      newxhr.setRequestHeader("Accept", "application/json, text/javascript");
      newxhr.setRequestHeader("Access-Control-Allow-Origin", "*");
      this.isRippleLoad = true;
      newxhr.onreadystatechange = () => {
        this.isRippleLoad = false;
        if (newxhr.readyState == 4) {
          if (newxhr.status >= 200 && newxhr.status < 300) {
            this.msgService.showErrorMessage(this.msgService.toastTypes.success, '', "File uploaded successfully");
            this.clearuploadObject();
            this.material_dataShow ?
              this._http.updatedDataSelection('material') :
              this.material_dataFlag == 'material' ? this._http.updatedDataSelection('material') : this._http.updatedDataSelection('list');
          } else {
            this.msgService.showErrorMessage(this.msgService.toastTypes.error, '', JSON.parse(newxhr.response).message);
          }
        }
      }
      newxhr.send(formData);
    }
  }


  clearuploadObject() {
    this.showModal = false;
    this.varJson = {
      category_id: 0,
      name: '',
      topic_id: -0,
      course_types: "",
      video_url: "",
      sub_topic_id: 0,
      subject_id: 0,
      file_id: 0,
      is_readonly: 'N'
    }
    this.varJson.name = '';
  }

  uploadDatavalidation() {
    if (this.varJson.category_id == 0) {
      this.msgService.showErrorMessage(this.msgService.toastTypes.error, '', "select file type to upload data");
      return false;
    }

    if (this.varJson.course_types == "" || this.varJson.course_types == '0') {
      this.msgService.showErrorMessage(this.msgService.toastTypes.error, '', "please select course to upload data");
      return false;
    }
    if (this.varJson.subject_id == 0) {
      this.msgService.showErrorMessage(this.msgService.toastTypes.error, '', "please select subject to upload data");
      return false;
    }

    if (this.varJson.topic_id == 0) {
      this.msgService.showErrorMessage(this.msgService.toastTypes.error, '', "please select topic to upload data");
      return false;
    }
    return true;
  }

  uploadHandler($event) {
    let flag = this.uploadDatavalidation();

    if (flag && this.checkCategoriesType($event.files)) {
      const formData = new FormData();
      let fileJson = {
        institute_id: this.institute_id,
        category_id: this.varJson.category_id,
        topic_id: this.varJson.topic_id,
        course_types: this.varJson.course_types,
        video_url: this.varJson.video_url,
        sub_topic_id: this.varJson.sub_topic_id,
        subject_id: this.varJson.subject_id,
        file_id: -1,
        is_readonly: 'N'
      }
      if ($event.files && $event.files.length) {
        $event.files.forEach(file => {
          formData.append('files', file);
        });
        // formData.append('files', $event.files);
      }


      let base = this.auth.getBaseUrl();
      let urlPostXlsDocument = base + "/api/v1/instFileSystem/uploadFile";
      let newxhr = new XMLHttpRequest();
      let auths: any = {
        userid: sessionStorage.getItem('userid'),
        userType: sessionStorage.getItem('userType'),
        password: sessionStorage.getItem('password'),
        institution_id: sessionStorage.getItem('institute_id'),
      }
      let Authorization = btoa(auths.userid + "|" + auths.userType + ":" + auths.password + ":" + auths.institution_id);
      formData.append('fileJson', JSON.stringify(fileJson));
      newxhr.open("POST", urlPostXlsDocument, true);
      newxhr.setRequestHeader("Authorization", Authorization);
      newxhr.setRequestHeader("enctype", "multipart/form-data;");
      newxhr.setRequestHeader("Accept", "application/json, text/javascript");
      newxhr.setRequestHeader("Access-Control-Allow-Origin", "*");
      this.isRippleLoad = true;
      newxhr.onreadystatechange = () => {
        this.isRippleLoad = false;
        if (newxhr.readyState == 4) {
          if (newxhr.status >= 200 && newxhr.status < 300) {
            this.clearuploadObject();
              this.material_dataShow ?
              this._http.updatedDataSelection('material') :
              this.material_dataFlag == 'material' ?
              this._http.updatedDataSelection('material') : this._http.updatedDataSelection('list');
              this.msgService.showErrorMessage(this.msgService.toastTypes.success, '', "File uploaded successfully");
              this.getDataUsedInCourseList();

          } else {
            this.msgService.showErrorMessage(this.msgService.toastTypes.error, '', JSON.parse(newxhr.response).message);
          }
        }
      }
      newxhr.send(formData);
    }
  }

  setCategoryType(value) {
    console.log(value);
    this.categiesTypeList.forEach(element => {
      if (element.category_id == value) {
        if (element.category_id == -1) {
          this.varJson.name = element.videoCategoryList[0].category_name;
        } else {
          this.varJson.name = element.category_name;
        }
      }
    });
  }

  // user data usage get
  getDataUsedInCourseList() {
    let url = "/api/v1/instFileSystem/getUsedSpace/" + this.institute_id;
    this._http.getData(url).subscribe((res: any) => {
      console.log(res);
      this._fservice.storageData.storage_allocated = (Number(res.storage_allocated) / 1024).toFixed(2);
      this._fservice.storageData.uploaded_size = res.uploaded_size;
      let width = (100 * this._fservice.storageData.uploaded_size) / this._fservice.storageData.storage_allocated;
      this._fservice.storageData.width = Math.round(width);
    });
  }

  checkCategoriesType(files) {
    let flag = true;
    switch (this.varJson.name) {
      case "Notes":
      case "Assignment":
      case "EBook":
      case "Previous Year Questions Paper": {
        for (let i = 0; i < files.length; i++) {//|.epub|.mp3|.wav|.aac|.wma 
          let pattern = /([a-zA-Z0-9\s_\\.\-\(\):])+(.xls|.xlsx|.doc|.docx|.pdf|.gif|.png|.jpg|.jpeg|.ppt|.pptx)$/i;
          console.log(pattern.test(files[i].name));
          if (!pattern.test(files[i].name)) {
            this.msgService.showErrorMessage(this.msgService.toastTypes.error, '', "please select " + this.varJson.name + " in pdf, doc, docx ,gif, png, jpg , xls, xlsx  form");
            flag = false;
            break;
          }
        }
        break;
      }
      case "Images": {
        for (let i = 0; i < files.length; i++) {
          let pattern = /([a-zA-Z0-9\s_\\.\-\(\):])+(.gif|.png|.jpg|.jpeg)$/i;
          if (!pattern.test(files[i].name)) {
            this.msgService.showErrorMessage(this.msgService.toastTypes.error, '', "please select " + this.varJson.name + "in gif, png, jpg form");
            flag = false;
            break;
          }
        }
        break;
      }
      // case "Assignment": {
      //   for (let i = 0; i < files.length; i++) {
      //     let pattern = /([a-zA-Z0-9\s_\\.\-\(\):])+(.pdf|.doc|.docx|.xls|.xlsx)$/i;
      //     if (!pattern.test(files[i].name)) {
      //       this.msgService.showErrorMessage(this.msgService.toastTypes.error, '', "please select " + this.varJson.name + "in pdf, doc, docx, xls, xlsx form");
      //       flag = false;
      //       break;
      //     }
      //   }
      //   break;
      // }
      // case "EBook": {
      //   for (let i = 0; i < files.length; i++) {
      //     let pattern = /([a-zA-Z0-9\s_\\.\-\(\):])+(.pdf|.epub)$/i;
      //     if (!pattern.test(files[i].name)) {
      //       this.msgService.showErrorMessage(this.msgService.toastTypes.error, '', "please select " + this.varJson.name + " file in epub, pdf form");
      //       flag = false;
      //       break;
      //     }
      //   }
      //   break;
      // }
      case "Audio Notes": {
        for (let i = 0; i < files.length; i++) {
          let pattern = /([a-zA-Z0-9\s_\\.\-\(\):])+(.mp3|.wav|.aac|.wma)$/i;
          if (!pattern.test(files[i].name)) {
            this.msgService.showErrorMessage(this.msgService.toastTypes.error, '', "please select Audio Notes in mp3, wav, aac, wma form");
            flag = false;
            break;
          }
        }
        break;
      }
      case "Slides": {
        for (let i = 0; i < files.length; i++) {
          let pattern = /([a-zA-Z0-9\s_\\.\-\(\):])+(.ppt|.pptx)$/i;
          if (!pattern.test(files[i].name)) {
            this.msgService.showErrorMessage(this.msgService.toastTypes.error, '', "please select slides in ppt, pptx form");
            flag = false;
            break;
          }
        }
        break;
      }
      default:
        {
          this.msgService.showErrorMessage(this.msgService.toastTypes.error, '', "please select type");
          flag = false;
          break;
        }
    }
    return flag;

  }

  getCategories() {
    this.categiesTypeList = [];
    // this.isRippleLoad = true;
    let url = "/api/v1/instFileSystem/v2/categories";
    this._http.getData(url).subscribe((res: any) => {
      console.log(res);
      // this.isRippleLoad = false;
      this.categiesTypeList = res;
    }, err => {
      // this.isRippleLoad = false;
    });
  }

  getTopicsList(subjectId) {
    this.topicList = [];
    this.isRippleLoad = true;
    let url = "/api/v1/topic_manager/" + this.institute_id + "/subjects/" + subjectId + "/topics";
    this._http.getData(url).subscribe((res: any) => {
      console.log(res);
      this.isRippleLoad = false;
      this.topicList = res;
      this.varJson.sub_topic_id = 0;
      this.subtopicList = [];
    }, err => {
      this.isRippleLoad = false;
    });
  }

  //Get Subtopic of a Parent Topic
  getSubtopicList(subjectId) {
    this.subtopicList = [];
    this.isRippleLoad = true;
    let url = "/api/v1/topic_manager/subTopicList/" + this.institute_id + "/" + subjectId;
    this._http.getData(url).subscribe((res: any) => {
      console.log(res);
      this.isRippleLoad = false;
      this.subtopicList = res;
      this.varJson.sub_topic_id = 0;
    }, err => {
      this.isRippleLoad = false;
    });
  }

  getcategoriesList() {
    this.categiesList = [];
    let url = "/api/v1/instFileSystem/institute/" + this.institute_id + "/ecoursesList";
    this._http.getData(url).subscribe((res: any) => {
      console.log(res);
      this.categiesList = res;
    }, err => {

    });
  }

  //Get subjects of ecourse 
  getSubjectsList(ecourseId) {
    this.subjectList = [];
    this.isRippleLoad = true;
    let url = "/api/v1/ecourse/" + this.institute_id + "/" + ecourseId + "/subjects";
    this._http.getData(url).subscribe((res: any) => {
      console.log(res);
      this.subjectList = res;
      if (this.material_dataFlag != 'material') {
        this.varJson.subject_id = 0;
      }
      this.varJson.sub_topic_id = 0;
      this.subtopicList = [];
      this.isRippleLoad = false;
    }, err => {
      this.isRippleLoad = false;
    });
  }

}
