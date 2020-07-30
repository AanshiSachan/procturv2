import { AfterViewChecked, Component, OnInit, Renderer2 } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticatorService } from '../../../../../services/authenticator.service';
import { HttpService } from '../../../../../services/http.service';
import { MessageShowService } from '../../../../../services/message-show.service';
import { FileService } from '../../file.service';
;

@Component({
  selector: 'app-upload-file',
  templateUrl: './upload-file.component.html',
  styleUrls: ['./upload-file.component.scss']
})
export class UploadFileComponent implements OnInit,AfterViewChecked {

  subjectList: any[] = [];
  topicList: any[] = [];
  subtopicList: any[] = [];
  categiesList: any[] = [];
  categiesTypeList: any[] = [];
  existVideos: any[] = [];
  institute_id: any;
  showModal: boolean = false;
  dragoverflag: boolean = false;
  addCategoryPopup: boolean = false;
  material_dataShow: boolean = false;
  showParentTopicModel: boolean = false;
  material_dataFlag: string = '';
  jsonData = {
    parentTopic: '',
    mainTopic: '',
    selectedVideo: '',
    mainTopicId: '',
    parentTopicId: ''
  }
  file: any;
  payload = {
    "clientPayload": {
      "policy": "",
      "key": "",
      "x-amz-signature": "",
      "x-amz-algorithm": "",
      "x-amz-date": "",
      "x-amz-credential": "",
      "uploadLink": ""
    },
    "videoId": ""
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
    is_readonly: '',
    title: '',
    is_private: false,
    enable_watermark: true,
    description: ''
  }
  progress: number = 0;
  isUploadingXls: boolean = false;
  Existing_video_category_id: any = 0;

  constructor(
    private _http: HttpService,
    private auth: AuthenticatorService,
    private msgService: MessageShowService,
    private router: Router,
    private _fservice: FileService,
    private renderer:Renderer2
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

  ngAfterViewChecked(){
    // if(document.getElementsByClassName('ui-fileupload-row').length){
    //   this.renderer.setStyle(document.getElementsByClassName('ui-fileupload-row')[0].children[2], 'display', 'none');
    // }
  }

  getVDOCipherLinkedDate() {
    let url = "/api/v1/instFileSystem/VDOCipher/" + this.institute_id;
    this.existVideos = [];
    this.auth.showLoader();
    this._http.getData(url).subscribe((res: any) => {
      // console.log(res);
      this.auth.hideLoader();
      if (res) {
        this.existVideos = res;
      }
    }, (err) => {
      this.auth.hideLoader();
      this.existVideos = [];
    });
  }

  linkAlreadyUploadedVideo($event) {
    let url = "/api/v1/instFileSystem/linkVideos";
    let object = {
      "institute_id": this.institute_id,
      "videoID": this.jsonData.selectedVideo,
      "course_types": this.varJson.course_types,
      "subject_id": this.varJson.subject_id,
      "topic_id": this.varJson.topic_id,
      "sub_topic_id": this.varJson.sub_topic_id,
      "title": this.varJson.title,
      "category_id": this.Existing_video_category_id,
    }
    if(!this.showModal) {
      object.sub_topic_id = Number(this.jsonData.mainTopicId),
      object.topic_id = Number(this.jsonData.parentTopicId)
    }
    let flag = this.uploadDatavalidation();
    if (!this.auth.isRippleLoad.getValue() && (flag)) {
      this.auth.showLoader();
      this._http.postData(url, object).subscribe((res: any) => {
        // console.log(res);
        this.auth.hideLoader();
        if (res) {
          this.clearuploadObject();
          this.refreshList();
          this.msgService.showErrorMessage(this.msgService.toastTypes.success, '', res.message);
        }
      }, (err) => {
        this.auth.hideLoader();
        this.msgService.showErrorMessage(this.msgService.toastTypes.error, '', err.error.message);
      });
    }

  }

  getSourceName(video) {
    //{{video.subject_name}}
    let source = video.ecourse_name + ' > ' + video.subject_name;
    if (video.parent_topic_name != null) {
      source += ' > ' + video.parent_topic_name;
      if (video.sub_topic_name != null) {
        source += ' > ' + video.sub_topic_name;
      }
    }
    return source;
  }

  uploadYoutubeURL($event) {
    let flag = this.uploadDatavalidation();
    if (flag) {
      var pattern = /^(http|https|www)?:\/\/[a-zA-Z0-9-\.]+\.[a-z]{2,4}/;
      if (!pattern.test(this.varJson.video_url)) {
        this.msgService.showErrorMessage(this.msgService.toastTypes.error, '', "Incorrect url");
        return false;
      }
      // if (this.varJson.title == '') {
      //   this.msgService.showErrorMessage(this.msgService.toastTypes.error, '', "please add video title");
      //   return false;
      // }
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
        is_readonly: this.varJson.is_readonly ? 'Y' : 'N',
        "size": 0
      }

      if(!this.showModal) {
        fileJson.sub_topic_id = Number(this.jsonData.mainTopicId),
        fileJson.topic_id = Number(this.jsonData.parentTopicId)
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

      if (!this.auth.isRippleLoad.getValue()) {
        this.auth.showLoader();
        newxhr.onreadystatechange = () => {
          this.auth.hideLoader();
          if (newxhr.readyState == 4) {
            if (newxhr.status >= 200 && newxhr.status < 300) {
              this.msgService.showErrorMessage(this.msgService.toastTypes.success, '', "File uploaded successfully");
              this.clearuploadObject();

              // this.material_dataShow ? this._http.updatedDataSelection('material') :
              //   this.material_dataFlag == 'material' ? this._http.updatedDataSelection('material') : this._http.updatedDataSelection('list');

              this.refreshList();
            } else {
              this.msgService.showErrorMessage(this.msgService.toastTypes.error, '', JSON.parse(newxhr.response).message);
            }
          }
        }
        newxhr.send(formData);
      }

    }
  }

  refreshList() {

    if (this.material_dataShow && this.material_dataFlag == 'material') {
      this._http.updatedDataSelection('material')
    }
    else if (this.material_dataShow && this.material_dataFlag == 'subject-list') {
      this._http.updatedDataSelection('subject');
    }
    else {
      this._http.updatedDataSelection('list');
    }
    // console.log(this.material_dataFlag);
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
      is_private: false,
      enable_watermark: true,
      description: ''
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
    // console.log(this.material_dataFlag);
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
      }
      if(!this.showModal) {
        fileJson.sub_topic_id = Number(this.jsonData.mainTopicId),
        fileJson.topic_id = Number(this.jsonData.parentTopicId)
      }
      formData.append('fileJson', JSON.stringify(fileJson));
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
      newxhr.open("POST", urlPostXlsDocument, true);
      newxhr.setRequestHeader("Authorization", Authorization);
      newxhr.setRequestHeader("enctype", "multipart/form-data;");
      newxhr.setRequestHeader("Accept", "application/json, text/javascript");
      newxhr.setRequestHeader("Access-Control-Allow-Origin", "*");

      if (!this.auth.isRippleLoad.getValue()) {
        this.auth.showLoader();
        newxhr.onreadystatechange = () => {
          this.auth.hideLoader();
          if (newxhr.readyState == 4) {
            if (newxhr.status >= 200 && newxhr.status < 300) {
              this.clearuploadObject();
              this.refreshList();
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

  uploadVimeoHandler($event) {
    console.log($event);
    let vimeo_allocated_storage = sessionStorage.getItem('vimeo_allocated_storage');
    let fileSize = (Number($event.files[0].size) / 1024 / 1024 / 1024).toFixed(3);
    console.log(fileSize, vimeo_allocated_storage);
    if(!(fileSize > vimeo_allocated_storage)) {
    let flag = this.uploadDatavalidation();
    if (flag && this.checkCategoriesType($event.files)) {
      const formData = new FormData();
      let fileJson = {
        institute_id: this.institute_id,
        category_id: this.varJson.category_id,
        topic_id: this.varJson.topic_id,
        course_types: this.varJson.course_types,
        sub_topic_id: this.varJson.sub_topic_id,
        subject_id: this.varJson.subject_id,
        description: this.varJson.description,
        title: this.varJson.title
      }
      if(!this.showModal) {
        fileJson.sub_topic_id = Number(this.jsonData.mainTopicId),
        fileJson.topic_id = Number(this.jsonData.parentTopicId)
      }
      if ($event.files && $event.files.length) {
        $event.files.forEach(file => {
          formData.append('file', file);
        });
        // formData.append('files', $event.files);
      }
      formData.append('fileInfoJson', JSON.stringify(fileJson));

      let base = this.auth.getBaseUrl();
      let urlPostXlsDocument = base + "/prod/vimeo/upload-video";
      let newxhr = new XMLHttpRequest();
      let obj: any = {
        userid: sessionStorage.getItem('userid'),
        userType: sessionStorage.getItem('userType'),
        password: sessionStorage.getItem('password'),
        institution_id: sessionStorage.getItem('institute_id'),
      }
      let Authorization = btoa(obj.userid + "|" + obj.userType + ":" + obj.password + ":" + obj.institution_id);
      newxhr.open("POST", urlPostXlsDocument, true);
      newxhr.setRequestHeader("x-prod-user-id", sessionStorage.getItem('userid'));
      newxhr.setRequestHeader("x-prod-inst-id", sessionStorage.getItem('institute_id'));
      newxhr.setRequestHeader("x-proc-authorization", Authorization);
      newxhr.setRequestHeader("enctype", "multipart/form-data;");
      newxhr.setRequestHeader("Accept", "application/json, text/javascript");
      newxhr.setRequestHeader("Access-Control-Allow-Origin", "*");

      if (!this.auth.isRippleLoad.getValue()) {
        this.auth.showLoader();
        newxhr.onreadystatechange = () => {
          this.auth.hideLoader();
          if (newxhr.readyState == 4) {
            if (newxhr.status >= 200 && newxhr.status < 300) {
              this.clearuploadObject();
              this.refreshList();
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
    } else {
      this.msgService.showErrorMessage('error','File Size is more than allocated storage', '');
    }
  }
  setCategoryType(value) {
    // console.log(value);
    this.categiesTypeList.forEach(element => {
      if (element.category_id == value) {
        if (element.category_id == -1) {
          this.varJson.name = element.videoCategoryList[0].category_name;
        } else {
          this.varJson.name = element.category_name;
        }
      }
    });
    if (value == '330') {
      this.jsonData.selectedVideo = '';
      this.getVDOCipherLinkedDate();
    }
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
          // console.log(pattern.test(files[i].name));
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
          this.msgService.showErrorMessage(this.msgService.toastTypes.error, '', "Please add video title");
          flag = false;
        }
        for (let i = 0; i < files.length; i++) {
          let pattern = /([a-zA-Z0-9\s_\\.\-\(\):])+(.AVI|.FLV|.WMV|.MP4|.MOV|.FIV|.flv|.mp4|.mov|.webm|.WEBM|.mkv|.MKV|.ogv|.OGV|.vob|.VOB|.gifv|.GIFV|.mng|.MNG|.avi|.gif|.GIF|.drc|.DRC|.ogg|.OGG|.MTS|.mts|.M2TS|.m2ts|.TS|.ts|.qt|.QT|.wmv|.yuv|.YUV|.rm|.RM|.rmvb|.RMVB)/i;
          if (!pattern.test(files[i].name)) {
            this.msgService.showErrorMessage(this.msgService.toastTypes.error, '', "Please select " + this.varJson.name + " in avi,flv,wmv,mp4 ,webm, mkv ,ogv, vob,gifv, mng, avi,gif, drc, ogg, MTS, M2TS , TS, mov, qt , yuv, rm,rmvb and mov form");
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
      case "Vimeo": {
        if (this.varJson.title == '') {
          this.msgService.showErrorMessage(this.msgService.toastTypes.error, '', "Please add video title");
          flag = false;
        }
        for (let i = 0; i < files.length; i++) {
          let pattern = /([a-zA-Z0-9\s_\\.\-\(\):])+(.AVI|.FLV|.WMV|.MP4|.MOV|.FIV|.flv|.mp4|.mov|.webm|.WEBM|.mkv|.MKV|.ogv|.OGV|.vob|.VOB|.gifv|.GIFV|.mng|.MNG|.avi|.gif|.GIF|.drc|.DRC|.ogg|.OGG|.MTS|.mts|.M2TS|.m2ts|.TS|.ts|.qt|.QT|.wmv|.yuv|.YUV|.rm|.RM|.rmvb|.RMVB)/i;
          if (!pattern.test(files[i].name)) {
            this.msgService.showErrorMessage(this.msgService.toastTypes.error, '', "Please select " + this.varJson.name + " in avi,flv,wmv,mp4 ,webm, mkv ,ogv, vob,gifv, mng, avi,gif, drc, ogg, MTS, M2TS , TS, mov, qt , yuv, rm,rmvb and mov form");
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

  videoGetDetails(video, index) {
    let url = index + ' ) ' + video.ecourse_name + ' > ' + video.subject_name;
    if (video.parent_topic_name) {
      url = url + ' > ' + video.parent_topic_name;
      if (video.sub_topic_name) {
        url = url + ' > ' + video.sub_topic_name;
      }
    }
    return url;
  }

  getCategories() {
    this.categiesTypeList = [];
    // this.auth.showLoader();
    let url = "/api/v1/instFileSystem/v2/categories";
    this._http.getData(url).subscribe((res: any) => {
      // console.log(res);
      let temp = [{ category_id: 330, category_name: 'Existing video' }];
      res.forEach(category => {
        if (category.category_id == -1) {
          category.videoCategoryList.forEach(vdoType => {
            temp.push(vdoType);
          });
        } else {
          temp.push(category);
        }
      });
      // this.auth.hideLoader();
      this.categiesTypeList = temp;
      if (sessionStorage.getItem('enable_vdoCipher_feature') != '1') {
        temp.forEach((object, index) => {
          if (object.category_id == 235 || object.category_id == 330) {
            temp.splice(index, 1);
          }

        });
      }


    }, err => {
      // this.auth.hideLoader();
    });
  }

  getTopicsList(subjectId) {
    this.topicList = [];
    this.auth.showLoader();
    let url = "/api/v1/topic_manager/" + this.institute_id + "/subjects/" + subjectId + "/topics";
    this._http.getData(url).subscribe((res: any) => {
      // console.log(res);
      this.auth.hideLoader();
      this.topicList = res;
      this.varJson.sub_topic_id = 0;
      this.subtopicList = [];
    }, err => {
      this.auth.hideLoader();
    });
  }

  //Get Subtopic of a Parent Topic
  getSubtopicList(subjectId) {
    this.subtopicList = [];
    this.auth.showLoader();
    let url = "/api/v1/topic_manager/subTopicList/" + this.institute_id + "/" + subjectId;
    this._http.getData(url).subscribe((res: any) => {
      // console.log(res);
      this.auth.hideLoader();
      this.subtopicList = res;
      this.varJson.sub_topic_id = 0;
    }, err => {
      this.auth.hideLoader();
    });
  }

  getcategoriesList() {
    this.categiesList = [];
    let url = "/api/v1/instFileSystem/institute/" + this.institute_id + "/ecourses-list";
    this._http.getData(url).subscribe((res: any) => {
      // console.log(res);
      this.categiesList = res;
    }, err => {

    });
  }

  //Get subjects of ecourse
  getSubjectsList(ecourseId) {
    this.subjectList = [];
    this.auth.showLoader();
    let url = "/api/v1/ecourse/" + this.institute_id + "/" + ecourseId + "/subjects";
    this._http.getData(url).subscribe((res: any) => {
      // console.log(res);
      this.subjectList = res;
      if (this.material_dataShow && this.material_dataFlag != 'subject-list') {
        this.varJson.subject_id = 0;
      }
      this.varJson.sub_topic_id = 0;
      this.subtopicList = [];
      this.auth.hideLoader();
    }, err => {
      this.auth.hideLoader();
    });
  }

  onRadioButtonChange($event, video) {
    // console.log(video);
    this.varJson.title = video.video_title;
    this.Existing_video_category_id = video.category_id;
  }


  uploadHandler2($event) {
    // console.log(this.material_dataFlag);
    let flag = this.uploadDatavalidation();

    if (flag && this.checkCategoriesType($event.files)) {
      let is_private = this.varJson.is_private == false ? 'Y' : 'N';
      let enable_watermark = this.varJson.enable_watermark == true ? 'Y' : 'N';
      let size = 0;
      size = $event.files && $event.files[0] ? $event.files[0].size:0;
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
        "is_private": is_private,                                                 // if user wants to make file as private
        "title": this.varJson.title,
        "enable_watermark": enable_watermark,
        "size": (size / (1024*1024)).toFixed(3)
      }
      if(!this.showModal) {
        fileJson.sub_topic_id = Number(this.jsonData.mainTopicId),
        fileJson.topic_id = Number(this.jsonData.parentTopicId)
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
      this.auth.hideLoader();
      if (!this.auth.isRippleLoad.getValue()) {
        this.auth.showLoader();

        // this.isUploadingXls = true;
        // newxhr.upload.addEventListener('progress', (e: ProgressEvent) => {
        //   if (e.lengthComputable) {
        //     this.progress = Math.round((e.loaded * 100) / e.total);
        //     document.getElementById('progress-width').style.width = this.progress + '%';
        //   }
        // }, false);

        newxhr.onreadystatechange = () => {
          this.auth.hideLoader();
          if (newxhr.readyState == 4) {
            // this.progress = 0;
            if (newxhr.status >= 200 && newxhr.status < 300) {
              this.auth.hideLoader();
              // this.isUploadingXls = false;
              var files = $event.files;
              this.file = files[0];
              // console.log(this.file);
              let payloadObject: any = JSON.parse(newxhr.response);
              this.payload = payloadObject;
              this.upload();
            } else {
              // this.isUploadingXls = false;
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
      var parser, xmlDoc;
      if (xhr.readyState == 4 && xhr.status == 201) {
        console.log(xhr.response);
        var text = '' + xhr.response + '';
        parser = new DOMParser();
        xmlDoc = parser.parseFromString(text, "text/xml");
        if (xmlDoc.getElementsByTagName("ETag")) {
          var videoID = xmlDoc.getElementsByTagName("ETag")[0].childNodes[0].nodeValue;
          this.updateVideoStatus(this.payload['videoId']);
        }
      }
    }
    xhr.send(formData);
  }

  updateVideoStatus(videoID) {

    let obj = {
      "videoID": videoID,
      "institute_id": sessionStorage.getItem('institute_id'),
      "video_status": "Queued"
    }
    let url = "/api/v1/instFileSystem/updateVideoStatus";

    this._http.postData(url, obj).subscribe((res: any) => {
      // console.log(res);
      this.clearuploadObject();
      this.refreshList();
      this._http.updatedDataSelection('subject');
      this.msgService.showErrorMessage(this.msgService.toastTypes.success, '', "Video uploaded successfully");
    }, (err) => {
      this.msgService.showErrorMessage(this.msgService.toastTypes.error, '', "some problem arise please check with support ");
    });
  }
}
