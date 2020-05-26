import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '../../../../../../node_modules/@angular/router';
import { AuthenticatorService } from '../../../../services/authenticator.service';
import { HttpService } from '../../../../services/http.service';
import { MessageShowService } from '../../../../services/message-show.service';
import { UploadFileComponent } from '../core/upload-file/upload-file.component';
import { DomSanitizer } from '@angular/platform-browser';
declare var window;
@Component({
  selector: 'app-ecourse-subject-list',
  templateUrl: './ecourse-subject-list.component.html',
  styleUrls: ['./ecourse-subject-list.component.scss']
})
export class EcourseSubjectListComponent implements OnInit {

  @ViewChild(UploadFileComponent) uploadFile: UploadFileComponent;
  subjectList: any = [];
  existVideos: any = [];
  institute_id: any;
  ecourse_id: any;
  isRippleLoad: boolean = false;
  showModal: boolean = false;
  showVideo: boolean = true;
  videoObject: any;
  type: string = 'delete';
  outputMessage: string = '';
  tempfile: any;
  tempData: any = {};
  videoplayer: boolean = false;
  currentProjectUrl: any;
  subjectId: any = '';

  constructor(
    private _http: HttpService,
    private auth: AuthenticatorService,
    private route: ActivatedRoute,
    private router: Router,
    private msgService: MessageShowService,
    public sanitizer:DomSanitizer
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
    this.uploadFile.showParentTopicModel = (this.uploadFile.showParentTopicModel) ? false : true;
    this.uploadFile.showModal = true;
    this.uploadFile.material_dataShow = true;
    this.uploadFile.material_dataFlag = 'subject-list';
    this.uploadFile.varJson.course_types = this.ecourse_id;
    this.uploadFile.getSubjectsList(this.ecourse_id);
    this.uploadFile.varJson.subject_id = topic.subjectId;
    this.uploadFile.getTopicsList(topic.subjectId);
    // if (a.topicId && a.topicId != '-1') {
    //   this.uploadTopicPopupOpen(a);
    // }
  }

  uploadTopicLevelPopupOpen(topic, subtopic) {
    this.uploadFile.showParentTopicModel = (this.uploadFile.showParentTopicModel) ? false : true;
    this.uploadFile.showModal = true;
    this.uploadFile.material_dataShow = true;
    this.uploadFile.material_dataFlag = 'subject-list';
    this.uploadFile.varJson.course_types = this.ecourse_id;
    this.uploadFile.getSubjectsList(this.ecourse_id);
    this.uploadFile.varJson.subject_id = this.subjectId;
    this.uploadFile.getTopicsList(this.subjectId);
    if(topic.topicId && topic.topicId != '-1') {
      if(subtopic.topicId && subtopic.topicId!='-1'){
        topic.parent_topic_id = topic.topicId;
        topic.parent_topic_name = topic.topicName;
        topic.sub_topic_id = subtopic.topicId;
        topic.topic_name = subtopic.topicName;
      }
      this.uploadTopicPopupOpen(topic);
    } else if(subtopic.topicId && subtopic.topicId != ''){
      this.uploadTopicPopupOpen(subtopic);
    }
  }

  // get otp details to show video 
  getVdocipherVideoOtp(video) {
    if (video.category_name == 'VDOCipher') {
      let url = "/api/v1/instFileSystem/videoOTP";
      let data = {
        "videoID": video.videoID,
        "institute_id": sessionStorage.getItem("institute_id"),
        "user_id": sessionStorage.getItem("userid")
      }
      this.tempData = video;

      console.log(video);
      this.auth.showLoader();
      this._http.postData(url, data).subscribe((response) => {
        this.auth.hideLoader();
        console.log(response);
        if (response == null) {
          let obj = {
            "otp": "20160313versASE323ND0ylfz5VIJXZEVtOIgZO8guUTY5fTa92lZgixRcokG2xm",
            "playbackInfo": "eyJ2aWRlb0lkIjoiNGQ1YjRiMzA5YjQ5NGUzYTgxOGU1ZDE3NDZiNzU2ODAifQ=="
          }
          console.log(obj);
          this.ShowVideo(obj.otp, obj.playbackInfo);
        } else {
          let obj = {
            "otp": response['otp'],
            "playbackInfo": response['playbackInfo']
          }
          console.log(obj);
          this.ShowVideo(obj.otp, obj.playbackInfo);
        }
      },
        (err) => {
          this.auth.hideLoader();
          this.msgService.showErrorMessage('error', '', err.error.message);
        });
    }

  }


   // vdocipher stop video
   stopVideo() {
    this.showVideo = true;
    if(this.videoObject){
       this.videoObject.pause(); // removes video 
    }
  }

  // vdocipher start video
  ShowVideo(otpString, playbackInfoString) {
    this.showVideo = false;
    var video = new window.VdoPlayer({
      otp: otpString,
      playbackInfo: playbackInfoString,
      theme: "9ae8bbe8dd964ddc9bdb932cca1cb59a",// please never changes 
      container: document.querySelector("#embedBox"),
    });
    this.videoObject = video;
    // video.addEventListener(`mpmlLoad`, (data) => {
    //   video.play();
    // });
    var container = document.querySelector('.embedBox');

  }

  uploadTopicPopupOpen(topic) {
    // console.log(topic);
    if (!topic.parent_topic_id || topic.parent_topic_id == 0) {
      this.uploadFile.showModal = true;
      this.uploadFile.varJson.topic_id = topic.topicId;// parent 
      this.uploadFile.getSubtopicList(topic.topicId);
    } else {
      this.uploadFile.showModal = false;
      this.uploadFile.jsonData.mainTopic = topic.topic_name;
      this.uploadFile.jsonData.mainTopicId = topic.sub_topic_id;
      this.uploadFile.varJson.sub_topic_id = topic.sub_topic_id // topic
      this.uploadFile.varJson.topic_id = topic.parent_topic_id;// parent  
      this.uploadFile.jsonData.parentTopic = topic.parent_topic_name;
      this.uploadFile.jsonData.parentTopicId = topic.parent_topic_id;
    }
  }


  getSubjectList() {
    this.subjectList = [];
    let array = [];
    this.auth.showLoader();
    let url = "/api/v1/instFileSystem/get-study-material";
    let object = {
      "institute_id": this.institute_id,
      "ecourse_id": this.ecourse_id,
    }
    this._http.postData(url, object).subscribe((res: any) => {
      console.log(res);
      this.auth.hideLoader();
      if (res.result && res.result.length > 0) {
        this.subjectList = res.result;
        this.subjectList.forEach((element) => {
          if (element && element.subjectId) {
            element.isExpand = false;
            this.addMaterialExtension(element);
            array.push(element)
          }

        });

      }
      this.subjectList = array;
      if (this.subjectList.length == 0) {
        this.outputMessage = 'No data found';
      }
    }, err => {
      this.auth.hideLoader();
    });
  }

  toggleObject(subject) {
    if (subject.subjectId) {
    this.subjectId = subject.subjectId;
    }
    subject.isExpand = !subject.isExpand;
    if (subject.isExpand) {
      subject.topicId = subject.topicId == undefined ? '-1' : subject.topicId;
      this.addMaterialExtension(subject);
      // this.getTopicListData(subject.subject_id, subject);
    }
  }

  /// removed data
  removeData(key) {
    if (key != 'unlink all') {
      let data = [this.tempfile.file_id];
      this.deleteFiles(key, data);
    }
    else {
      this.getVDOCipherLinkedDate(key);
    }

  }

  deleteFiles(key, fileIdArray) {
    this.showModal = false;
    this.auth.showLoader();
    let url = "/api/v1/instFileSystem/deleteFiles?key=" + key;
    let data =
    {
      "institute_id": this.institute_id,
      "fileIdArray": fileIdArray
    }
    console.log(data);
    this._http.deleteData(url, data).subscribe((res:any) => {
      // console.log(res);
      this.auth.hideLoader();
      this.msgService.showErrorMessage('success', '', res.message);
      this.getSubjectList();
    },
      (err) => {
        this.auth.hideLoader();
        this.msgService.showErrorMessage('error', '', err.error.message);
      });
  }

  getVDOCipherLinkedDate(key) {
    this.auth.showLoader();
    let url = "/api/v1/instFileSystem/VDOCipher/" + this.institute_id;
    this.existVideos = [];
    this._http.getData(url).subscribe((res: any) => {
      console.log(res);
      this.auth.hideLoader();
      if (res) {

        this.existVideos = res;
        this.UnlikeAllVideos();
      }
    }, (err) => {
      this.auth.hideLoader();
      this.existVideos = [];
    });
  }

  UnlikeAllVideos() {
    let array_ids = [];
    if (this.existVideos && this.existVideos.length) {
      for (let i = 0; i < this.existVideos.length; i++) {
        let object = this.existVideos[i];
        if (object.video_id == this.tempfile.videoID) {

          object && object.link_video_list && object.link_video_list.forEach((video) => {
            array_ids.push(video.file_id);
          });

          if (array_ids.length) {
            this.deleteFiles('unlink', array_ids);

          }
          else {
            this.showModal = false;
            this.msgService.showErrorMessage('info', '', 'No data found to unlink');
          }

        }
      }
    }
  }

  addDownloadCount(file) {
    this.auth.showLoader();
    let url = "/api/v1/instFileSystem/fileDownloadCount";
    let data =
    {
      "institute_id": this.institute_id,
      "file_id": file.file_id
    }

    this._http.postData(url, data).subscribe((res) => {
      // console.log(res);
      this.auth.hideLoader();
      file.downloads++;

    },
      (err) => {
        this.auth.hideLoader();
      });
  }


  getToSubjectMaterials(subject) {
    this.router.navigate(["/view/activity/ecourse-file-manager/ecourses/" + this.ecourse_id + "/subjects/" + subject.subject_id + "/materials"], { queryParams: { data: window.btoa(subject.subject_name) } });
  }

  setRemoveDataFile(file, type) {
    this.tempfile = file;
    this.type = type;
    this.showModal = true;
  }

  calculateStudyMaterialMapLength(object) {
    return Object.keys(object.studyMaterialMap).length;
  }


  addMaterialExtension(object) {
    let keys = ["Notes", "Assignment", "EBook", "Images", "PreviousYearQuestionsPaper", "AudioNotes", "Slides"];
    keys.forEach(key => {      
      if (object.studyMaterialMap[key]) {
        object.studyMaterialMap[key].forEach(element => {
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
  playYoutubeVideo(obj) {
    this.videoplayer = true;
    const video_id = atob(obj.proc_id);
    this.currentProjectUrl = this.sanitizer.bypassSecurityTrustResourceUrl('https://www.youtube.com/embed/' + video_id);
  }
  closePlayer(){
    this.videoplayer = false;
  }
}