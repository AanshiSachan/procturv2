import { Component, OnInit, Input, ViewChild, ElementRef } from '@angular/core';
import { Tree } from 'primeng/tree';
import { Subject } from 'rxjs/Subject';
import { HttpService } from '../../../../../services/http.service';
import { AuthenticatorService } from '../../../../../services/authenticator.service';

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
  institute_id: any;
  showModal: boolean = false;
  dragoverflag: boolean = false;
  isRippleLoad:boolean = false;

  @ViewChild('uploaders') uploaders: ElementRef;
  @ViewChild('expandingTree') expandingTree: Tree;
  constructor(
    private _http: HttpService,
    private auth: AuthenticatorService,
  ) {
    this.auth.currentInstituteId.subscribe(id => {
      this.institute_id = id;
    });
  }

  ngOnInit() {
    this.dragoverflag = true;
    this.getcategoriesList();
  }

  onSelect(event, uploaders) {
    /* Remove the overlay from layout  */
    // this.dropZone.nativeElement.classList.remove("over");
    // this.dragoverflag = false;
    // this.addCategoryPopup = true;
    // this.selectedFiles = event.files;
  }
 

  getTopicsList(subjectId) {
    this.topicList = [];
    this.isRippleLoad = true;
    ///topic_manager/{institute_id}/subjects/{subject_id}
    let url = "/api/v1/topic_manager/" + this.institute_id + "/subjects/" + subjectId+"/topics";
    this._http.getData(url).subscribe((res: any) => {
      console.log(res);
      this.isRippleLoad = false;
      this.topicList = res;
    },err=>{
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
    },err=>{
      this.isRippleLoad = false;
    });
  }

  getcategoriesList() {
    this.categiesList = [];
    this.isRippleLoad = true;
    let url = "/api/v1/instFileSystem/institute/" + this.institute_id + "/ecoursesList";
    this._http.getData(url).subscribe((res: any) => {
      console.log(res);
      this.isRippleLoad = false;
      this.categiesList = res;
    },err=>{
      this.isRippleLoad = false;
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
    },err=>{
      this.isRippleLoad = false;
    });
  }

}
