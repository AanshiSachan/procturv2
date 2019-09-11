import { Component, OnInit, ViewChild } from '@angular/core';
import { AuthenticatorService } from '../../../../services/authenticator.service';
import { HttpService } from '../../../../services/http.service';
import { ActivatedRoute, Router } from '../../../../../../node_modules/@angular/router';
import { UploadFileComponent } from '../core/upload-file/upload-file.component';
import { arraySortPipe } from '../../../shared/pipes/sortBarPipe';
import { MessageShowService } from '../../../../services/message-show.service';

@Component({
  selector: 'app-ecourse-subject-list',
  templateUrl: './ecourse-subject-list.component.html',
  styleUrls: ['./ecourse-subject-list.component.scss']
})
export class EcourseSubjectListComponent implements OnInit {

  @ViewChild(UploadFileComponent) uploadFile: UploadFileComponent;
  subjectList: any = [];
  institute_id: any;
  ecourse_id: any;
  isRippleLoad: boolean = false;
  showModal: boolean = false;
  outputMessage: string = '';
  tempfile:any;

  constructor(
    private _http: HttpService,
    private auth: AuthenticatorService,
    private route: ActivatedRoute,
    private router: Router,
    private msgService: MessageShowService,
  ) {
    this.auth.currentInstituteId.subscribe(id => {
      this.institute_id = id;
    });
    this.route.params.subscribe(
      params => {
        this.ecourse_id = params.ecourse_id;
      }
    )
    this.route
      .queryParams
      .subscribe(params => {
        let name = window.atob(params['data']);
        if (sessionStorage.getItem('routeListForEcourse')) {
          this._http.routeList = JSON.parse(sessionStorage.getItem('routeListForEcourse'));
          this._http.routeList.splice(1, this._http.routeList.length);
          let obj = { routeLink: '/view/activity/ecourse-file-manager/ecourses/' + this.ecourse_id + '/subjects', data: { data: params['data'] }, name: name };
          this._http.routeList.push(obj);
          sessionStorage.setItem('routeListForEcourse', JSON.stringify(this._http.routeList));
        }
      });
  }

  ngOnInit() {
    this.getSubjectList();
    this._http.routeList.splice(2, this._http.routeList.length);
    this._http.updatedDataSelection('subject-list');
        this._http.data.subscribe(data => {
            if (data == 'subject') {
                this.getSubjectList();
                this._http.updatedDataSelection(null);
            }
        });
  }

  uploadPopupOpen(topic) {
    // console.log(topic);
    this.uploadFile.showModal = (this.uploadFile.showModal) ? false : true;
    this.uploadFile.material_dataShow = true;
    this.uploadFile.material_dataFlag = 'subject-list';
    this.uploadFile.varJson.course_types = this.ecourse_id;
    this.uploadFile.getSubjectsList(this.ecourse_id);
    this.uploadFile.varJson.subject_id = topic.subject_id;
    this.uploadFile.getTopicsList(topic.subject_id);
  }

  getSubjectList() {
    this.subjectList = [];
    let array = [];
    this.isRippleLoad = true;
    let url = "/api/v1/instFileSystem/subjectMaterials";
    let object = {
      "institute_id": this.institute_id,
      "ecoursesIDArray": [this.ecourse_id],
      "itemTypesArray": []
    }
    this._http.postData(url, object).subscribe((res: any) => {
      console.log(res);
      this.isRippleLoad = false;
      if (res && res.length > 0 && res[0].subjectsList && res[0].subjectsList.length > 0) {
        this.subjectList = res[0].subjectsList;
        this.subjectList.forEach((element) => {
          if (element && element.subject_id) {
            element.isExpand = false;
            this.addMaterialExtension(element);
            array.push(element)
          }

        });

      }
      if (this.subjectList.length == 0) {
        this.outputMessage = 'No Data Found';
      }
      this.subjectList = array;
    }, err => {
      this.isRippleLoad = false;
    });
  }

  toggleObject(topic) {
    topic.isExpand = !topic.isExpand;
  }

  /// removed data
  removeData() {
    this.showModal = false;
    this.isRippleLoad = true;
    let url = "/api/v1/instFileSystem/deleteFiles";
    let data =
    {
      "institute_id": this.institute_id,
      "fileIdArray": [this.tempfile.file_id]  
    }

    this._http.deleteData(url, data).subscribe((res) => {
      // console.log(res);
      this.isRippleLoad = false;
      this.msgService.showErrorMessage('success', '', "File Deleted Successfully");
      this.getSubjectList();
    },
      (err) => {
        this.isRippleLoad = false;
        this.msgService.showErrorMessage('error', '', "something  went wrong while deleting file");
      })
  }


  getToSubjectMaterials(subject) {
    this.router.navigate(["/view/activity/ecourse-file-manager/ecourses/" + this.ecourse_id + "/subjects/" + subject.subject_id + "/materials"], { queryParams: { data: window.btoa(subject.subject_name) } });
  }

  setRemoveDataFile(file) {
    this.tempfile = file;
    this.showModal = true;
  }

  addMaterialExtension(object) {
    let keys = ["notesList", "assignmentList", "studyMaterialList", "imageList", "previousYearQuesList", "audioNotesList", "slidesList"];
    keys.forEach(key => {
      if (object[key]) {
        object[key].forEach(element => {
          let str = element.file_path;
          let ext = str.substr(str.lastIndexOf(".") + 1, str.length);
          switch (ext) {
            case 'epub': {
              element.extension = "fa fa-file epub-color";
              break;
            }
            case 'pdf': {
              element.extension = "fa fa-file-pdf-o pdf-color";
              break;
            }
            case 'docx':
            case 'doc': {
              element.extension = "fa fa-book assign-color ";
              break;
            }
            case 'xls':
            case 'xlsx': {
              element.extension = "fa fa-file-excel-o assign-color";
              break;
            }
            case 'ppt':
            case 'pptx': {
              element.extension = "fa fa-file-powerpoint-o text-blue";
              break;
            }
            case 'mp3':
            case 'wav':
            case 'aac':
            case 'wma': {
              element.extension = "fa fa-file-audio-o audio-color";
              break;
            }

            case 'jpeg':
            case 'jpg':
            case 'png':
            case 'gif': {
              element.extension = "fa fa-file-image-o img-color";
              break;
            }
            default: {
              element.extension = "fa fa-file-o assign-color";
            }
          }

        });
      }

    });


  }
}
