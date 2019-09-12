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
  existVideos:any[]=[{
    "video_id": "f62d50c9522c4d6aa6e510438b606e28",
    "video_title": "new-file-video",
    "video_thumbnail": null,
    "video_size": 0,
    "video_upload_date": "07-Sep-2019 12:26:06 PM",
    "ecourse_name": "Aniket course",
    "subject_name": "Artificial Intelligence",
    "parent_topic_name": null,
    "sub_topic_name": null,
    "link_video_list": [
      {
        "ecourse_name": "gogo12",
        "subject_name": "Bio",
        "parent_topic_name": null,
        "sub_topic_name": null
      },
      {
        "ecourse_name": "Aniket course",
        "subject_name": "Artificial Intelligence",
        "parent_topic_name": null,
        "sub_topic_name": null
      }
    ]
  },
  {
    "video_id": "f62d50c9522c4d6aa6e510438b606e28",
    "video_title": "new-file-title",
    "video_thumbnail": null,
    "video_size": 0,
    "video_upload_date": "07-Sep-2019 12:26:06 PM",
    "ecourse_name": "Aniket course",
    "subject_name": "Artificial Intelligence",
    "parent_topic_name": null,
    "sub_topic_name": null,
    "link_video_list": []
  }];
  institute_id: any;
  showModal: boolean = false;
  dragoverflag: boolean = false;
  isRippleLoad: boolean = false;
  addCategoryPopup: boolean = false;
  material_dataShow: boolean = false;
  showParentTopicModel: boolean = false;
  material_dataFlag: string = '';
  jsonData = {
    parentTopic: '',
    mainTopic: '',
    selectedVideo:''
  }
  file: any;
  payload = {
    "clientPayload": {
      "policy": "eyJleHBpcmF0aW9uIjoiMjAxOS0wOC0wOVQxMzozNDowMi42NTJaIiwiY29uZGl0aW9ucyI6W3siYnVja2V0IjoidmRvLWFwLXNvdXRoZWFzdCJ9LHsia2V5Ijoib3JpZy9LbTdCenZibk9sQ1lLIn0seyJ4LWFtei1jcmVkZW50aWFsIjoiQUtJQUoyUzJMQldLR04zVzMzR1EvMjAxOTA4MDgvYXAtc291dGhlYXN0LTEvczMvYXdzNF9yZXF1ZXN0In0seyJ4LWFtei1hbGdvcml0aG0iOiJBV1M0LUhNQUMtU0hBMjU2In0seyJ4LWFtei1kYXRlIjoiMjAxOTA4MDhUMDAwMDAwWiJ9LFsic3RhcnRzLXdpdGgiLCIkc3VjY2Vzc19hY3Rpb25fc3RhdHVzIiwiIl0sWyJzdGFydHMtd2l0aCIsIiRzdWNjZXNzX2FjdGlvbl9yZWRpcmVjdCIsIiJdXX0=",
      "key": "orig/Km7BzvbnOlCYK",
      "x-amz-signature": "822fc67703da52612f3de3ffcea962ae82442f3e1df101aba3eee668b4f81757",
      "x-amz-algorithm": "AWS4-HMAC-SHA256",
      "x-amz-date": "20190808T000000Z",
      "x-amz-credential": "AKIAJ2S2LBWKGN3W33GQ/20190808/ap-southeast-1/s3/aws4_request",
      "uploadLink": "https://vdo-ap-southeast.s3-accelerate.amazonaws.com"
    },
    "videoId": "d2863726e1c1407092cd9674f170719d"
  };
  varJson = {
    category_id: 0,
    name: '',
    topic_id: 0,
    course_types: "",
    video_url: "",
    sub_topic_id: 0,
    subject_id: 0,
    file_id: 0,
    is_readonly: 'N',
    title: '',
    is_private:'Y'
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
    console.log("UploadFileComponent");
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

  getSourceName(video){
    //{{video.subject_name}}
    if(video.sub_topic_name!=null){
      return video.sub_topic_name+'  ( '+video.ecourse_name+' )';
    }else{
      if(video.parent_topic_name!=null){
        return video.parent_topic_name+'  ( '+video.ecourse_name+' )';
      }else{        
          return video.subject_name+'  ( '+video.ecourse_name+' )';        
      }
    }
  }

  getLocationName(video){
  return video.sub_topic_name;
  }
  uploadYoutubeURL($event) {
    let flag = this.uploadDatavalidation();
    if (flag) {
      var pattern = /^(http|https|www)?:\/\/[a-zA-Z0-9-\.]+\.[a-z]{2,4}/;
      if (!pattern.test(this.varJson.video_url)) {
        this.msgService.showErrorMessage(this.msgService.toastTypes.error, '', "Incorrect url");
        return false;
      }
      if (this.varJson.title == '') {
        this.msgService.showErrorMessage(this.msgService.toastTypes.error, '', "please add video title");
        return false;
      }
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

      if (!this.isRippleLoad) {
        this.isRippleLoad = true;
        newxhr.onreadystatechange = () => {
          this.isRippleLoad = false;
          if (newxhr.readyState == 4) {
            if (newxhr.status >= 200 && newxhr.status < 300) {
              this.msgService.showErrorMessage(this.msgService.toastTypes.success, '', "File uploaded successfully");
              this.clearuploadObject();

              this.material_dataShow ? this._http.updatedDataSelection('material') :
                this.material_dataFlag == 'material' ? this._http.updatedDataSelection('material') : this._http.updatedDataSelection('list');
              console.log(this.material_dataFlag);
            } else {
              this.msgService.showErrorMessage(this.msgService.toastTypes.error, '', JSON.parse(newxhr.response).message);
            }
          }
        }
        newxhr.send(formData);
      }

    }
  }

  checkListCall() {

    switch (this.material_dataFlag) {
      default:
        this._http.updatedDataSelection('subject');
    }
  }

  clearuploadObject() {
    this.showModal = false;
    this.showParentTopicModel = false;
    this.varJson = {
      category_id: 0,
      name: '',
      topic_id: -0,
      course_types: "",
      video_url: "",
      sub_topic_id: 0,
      subject_id: 0,
      file_id: 0,
      is_readonly: 'N',
      title: '',
      is_private:'Y'
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

    // if (this.varJson.topic_id == 0) {
    //   this.msgService.showErrorMessage(this.msgService.toastTypes.error, '', "please select topic to upload data");
    //   return false;
    // }
    return true;
  }

  uploadHandler($event) {
    let flag = this.uploadDatavalidation();
    console.log(this.material_dataFlag);
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

      if (!this.isRippleLoad) {
        this.isRippleLoad = true;
        newxhr.onreadystatechange = () => {
          this.isRippleLoad = false;
          if (newxhr.readyState == 4) {
            if (newxhr.status >= 200 && newxhr.status < 300) {
              this.clearuploadObject();

              if (this.material_dataShow && this.material_dataFlag == 'material') {
                this._http.updatedDataSelection('material')
              }
              else if (this.material_dataShow && this.material_dataFlag == 'subject-list') {
                this._http.updatedDataSelection('subject');
              }
              else {
                this._http.updatedDataSelection('list');
              }
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
      // console.log(res);
      this._fservice.storageData.storage_allocated = (Number(res.storage_allocated) * 0.001048576);
      this._fservice.storageData.uploaded_size = (Number(res.uploaded_size) * 0.001048576);
      let width = 1;
      if (this._fservice.storageData.uploaded_size != 0 &&
        this._fservice.storageData.uploaded_size <= this._fservice.storageData.storage_allocated) { width = (100 * this._fservice.storageData.uploaded_size) / this._fservice.storageData.storage_allocated; }
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
        for (let i = 0; i < files.length; i++) {//
          let pattern = /([a-zA-Z0-9\s_\\.\-\(\):])+(.xls|.xlsx|.doc|.docx|.pdf|.gif|.png|.jpg|.jpeg|.ppt|.pptx|.epub|.mp3|.wav|.aac|.wma )$/i;
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
      case "VDOCipher": {
        if (this.varJson.title == '') {
          this.msgService.showErrorMessage(this.msgService.toastTypes.error, '', "please add video title");
          flag = false;
        }
        for (let i = 0; i < files.length; i++) {
          let pattern = /([a-zA-Z0-9\s_\\.\-\(\):])+(.AVI|.FLV|.WMV|.MP4|.MOV)$/i;
          if (!pattern.test(files[i].name)) {
            this.msgService.showErrorMessage(this.msgService.toastTypes.error, '', "please select " + this.varJson.name + "in avi,flv,wmv,mp4 and mov form");
            flag = false;
            break;
          }
        }
        break;
      }
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
      // console.log(res);
      let temp = [{category_id:330,category_name:'existing video'}];
      res.forEach(category => {
        if (category.category_id == -1) {
          category.videoCategoryList.forEach(vdoType => {
            temp.push(vdoType);
          });
        } else {
          temp.push(category);
        }
      });
      // this.isRippleLoad = false;
      this.categiesTypeList = temp;
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
      // console.log(res);
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
      if (this.material_dataFlag != 'material' && this.material_dataFlag != 'subject-list') {
        this.varJson.subject_id = 0;
      }
      this.varJson.sub_topic_id = 0;
      this.subtopicList = [];
      this.isRippleLoad = false;
    }, err => {
      this.isRippleLoad = false;
    });
  }

  uploadHandler2($event) {
    debugger;
    console.log(this.material_dataFlag);
    let flag = this.uploadDatavalidation();

    if (flag && this.checkCategoriesType($event.files)) {
      let fileJson = {
        "institute_id": this.institute_id,
        "category_id": this.varJson.category_id,
        "topic_id": this.varJson.topic_id,
        "course_types": this.varJson.course_types,
        "video_url": null,
        "sub_topic_id": this.varJson.sub_topic_id,
        "subject_id": this.varJson.subject_id,
        "is_raw_data": "Y",                                             //if send only video title then this key value should be 'Y' ; else set 'N'
        "is_url": "N",                                                        //if send video url & title then this key value should be 'Y' ; else set 'N'
        "is_private": this.varJson.is_private,                                                 // if user wants to make file as private
        "title": this.varJson.title
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
      const formData = new FormData();
      formData.append('fileJson', JSON.stringify(fileJson));
      newxhr.open("POST", urlPostXlsDocument, true);
      newxhr.setRequestHeader("Authorization", Authorization);
      newxhr.setRequestHeader("enctype", "multipart/form-data;");
      newxhr.setRequestHeader("Accept", "application/json, text/javascript");
      newxhr.setRequestHeader("Access-Control-Allow-Origin", "*");
      this.isRippleLoad = false;
      if (!this.isRippleLoad) {
        this.isRippleLoad = true;
        newxhr.onreadystatechange = () => {
          this.isRippleLoad = false;
          if (newxhr.readyState == 4) {
            if (newxhr.status >= 200 && newxhr.status < 300) {
              this.isRippleLoad = false;
              var files = $event.files;
              this.file = files[0];
              console.log(this.file);
              let payloadObject: any = newxhr;
              this.payload = payloadObject;
              this.upload();
            } else {
              this.msgService.showErrorMessage(this.msgService.toastTypes.error, '', JSON.parse(newxhr.response).message);
            }
          }
        }
        newxhr.send(formData);
      }
    }

    // var files = $event.files;
    // this.file = files[0];
    // console.log(this.file);
    // this.upload();
  }

  upload() {
    var formData = new FormData();
    var xhr = new XMLHttpRequest();
    var self = this;
    //Build AWS S3 Request
    formData.append('key', this.payload.clientPayload.key);
    formData.append('x-amz-credential', this.payload.clientPayload['x-amz-credential']);
    formData.append('x-amz-algorithm', this.payload.clientPayload['x-amz-algorithm']);
    formData.append('x-amz-date', this.payload.clientPayload['x-amz-date']);
    formData.append('policy', this.payload.clientPayload['policy']);
    formData.append('x-amz-signature', this.payload.clientPayload['x-amz-signature']);
    formData.append("success_action_status", "201");
    formData.append("success_action_redirect", "");
    formData.append('file', this.file);
    xhr.open('POST', this.payload.clientPayload['uploadLink'], false);
    xhr.onreadystatechange = () => {
      if (xhr.readyState == 4 && xhr.status == 201) {
        console.log(xhr.response);
        this.msgService.showErrorMessage(this.msgService.toastTypes.success, '', "Video uploaded successfully");
      }
    }
    xhr.send(formData);
  }

}
