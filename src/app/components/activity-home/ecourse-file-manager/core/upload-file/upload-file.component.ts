import { Component, OnInit, Input, ViewChild, ElementRef } from '@angular/core';
import { Tree } from 'primeng/tree';
import { Subject } from 'rxjs/Subject';
import { HttpService } from '../../../../../services/http.service';
import { AuthenticatorService } from '../../../../../services/authenticator.service';
import { AppComponent } from '../../../../../app.component';
import { MessageShowService } from '../../../../../services/message-show.service';

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
  varJson = {
    category_id: 0,
    name:'',
    topic_id: -0,
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
    private appC: AppComponent
  ) {
    this.auth.currentInstituteId.subscribe(id => {
      this.institute_id = id;
    });
  }

  ngOnInit() {
    this.dragoverflag = true;
    this.getcategoriesList();
    this.getCategories();
  }


  uploadHandler($event, values) {

    if(this.checkCategoriesType($event.files)){
      let filesForUpload = $event.files;
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
  
      if (filesForUpload && filesForUpload.length) {
        filesForUpload.forEach(file => formData.append('files', file));
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
      newxhr.setRequestHeader("Access-Control-Allow-Origin", "*");
      newxhr.setRequestHeader("Access-Control-Allow-Credentials", "true");
      newxhr.setRequestHeader("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
      newxhr.setRequestHeader("Access-Control-Allow-Headers", "Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers");
      newxhr.setRequestHeader("enctype", "multipart/form-data");
      newxhr.setRequestHeader("Authorization", Authorization);
      newxhr.onreadystatechange = () => {
        if (newxhr.readyState == 4) {
          if (newxhr.status >= 200 && newxhr.status < 300) {
            let data = {
              type: 'success',
              title: "File uploaded successfully",
              body: newxhr.response.fileName
            }
            this.appC.popToast(data);
          } else {
            let data = {
              type: 'error',
              title: "File uploaded Failed",
              body: newxhr.response.fileName
            }
            this.appC.popToast(data);
          }
        }
      }
      newxhr.send(formData);
    }
    console.log($event)
  }

  setCategoryType(value){
    console.log(value);
    this.categiesTypeList.forEach(element => {
      if(element.category_id==value){
        this.varJson.name = value;
      }
    });
  }


  checkCategoriesType(files) {
    if (this.varJson.category_id == 0) {
      let data = {
        type: 'error',
        title: "select category to upload data",
        body: ''
      }
      this.appC.popToast(data);
      return false;
    }

    switch (this.varJson.name) {
      case "Notes": {
      
        break;
      }
      case "Images": {
        
        break;
      }
      case "Assignment": {
        
        break;
      }
      case "Ebooks": {
       
        break;
      }
      case "Audio Notes": {
      
        break;
      }
      case "Previous Year Question Paper": {
    
        break;
      }
    }
    return true;

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
    ///topic_manager/{institute_id}/subjects/{subject_id}
    let url = "/api/v1/topic_manager/" + this.institute_id + "/subjects/" + subjectId + "/topics";
    this._http.getData(url).subscribe((res: any) => {
      console.log(res);
      this.isRippleLoad = false;
      this.topicList = res;
    }, err => {
      this.isRippleLoad = false;
    });
  }

  //Get Subtopic of a Parent Topic
  getSubtopicList(subjectId) {
    this.subtopicList = [];
    this.isRippleLoad = true;
    //>/topic_manager/subTopicList/{institute_id}/{parent_topic_id}
    let url = "/api/v1/topic_manager/subTopicList/" + this.institute_id + "/" + subjectId;
    this._http.getData(url).subscribe((res: any) => {
      console.log(res);
      this.isRippleLoad = false;
      this.subtopicList = res;
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
    ///ecourse/{institute_id}/{ecourse_id}/subjects
    let url = "/api/v1/ecourse/" + this.institute_id + "/" + ecourseId + "/subjects";
    this._http.getData(url).subscribe((res: any) => {
      console.log(res);
      this.subjectList = res;
      this.isRippleLoad = false;
    }, err => {
      this.isRippleLoad = false;
    });
  }

}
