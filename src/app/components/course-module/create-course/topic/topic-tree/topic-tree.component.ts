import { Component, OnInit } from '@angular/core';
import { AuthenticatorService } from '../../../../../services/authenticator.service';
import { HttpService } from '../../../../../services/http.service';
import { MessageShowService } from '../../../../../services/message-show.service';
import { Create_Topic, Topic } from '../topic.model';

declare var $;

/**
 * created by laxmi
 */
@Component({
  selector: 'app-topic-tree',
  templateUrl: './topic-tree.component.html',
  styleUrls: ['./topic-tree.component.scss']
})
export class TopicTreeComponent implements OnInit {

  isProfessional: boolean = false;
  option_type: string = 'Add';
  institute_id: any;
  subjectData: any[] = [];
  subjectTempData: any[] = [];
  standardData: any[] = [];
  subjectList: Topic[] = [];
  teacher_id: any = -1;
  addTopic: Create_Topic = new Create_Topic();
  disableDeleteBtn: boolean = false;
  temp_object: any;
  filterData = {
    standard_id: -1,
    subject_id: -1
  }

  constructor(
    private _http: HttpService,
    private auth: AuthenticatorService,
    private _toastPopup: MessageShowService,
  ) {
    this.auth.currentInstituteId.subscribe(id => {
      this.institute_id = id;
    });
    this.auth.institute_type.subscribe(
      res => {
        if (res == "LANG") {
          this.isProfessional = true;
        }
        else {
          this.isProfessional = false;
        }
      })
      console.log('model typ:',this.isProfessional);
  }

  ngOnInit() {
    let userType: any = sessionStorage.getItem('userType');
    if(userType == 3){
    this.teacher_id = sessionStorage.getItem('login_teacher_id');
  }
    this.getAllStandards();
  }

  getAllSubjectList(standards_id) {
    this.subjectTempData = [];
    this.auth.showLoader();
    let url = "/api/v1/subjects/standards/" + standards_id + '?active=Y';
    this._http.getData(url).subscribe(
      (data: any) => {
        this.auth.hideLoader();
        this.subjectTempData = data;
        console.log(data);
      },
      error => {
        this.auth.hideLoader();
        console.log(error);
      }
    );
  }

  // get subject
  getAllSubjectListFromServer(standards_id) {
    this.subjectData = [];
    this.subjectList = [];
    this.filterData.subject_id = -1;
    this.auth.showLoader();
    let url = "/api/v1/subjects/standards/" + standards_id + '?active=Y';
    this._http.getData(url).subscribe(
      (data: any) => {
        this.auth.hideLoader();
        this.subjectData = data;
        console.log(data);
      },
      error => {
        this.auth.hideLoader();
        console.log(error);
      }
    );
  }

  //
  Update_Topic_Details(type, editObejct) {

    let object = type == 'edit' ? this.addTopic : editObejct;
    this.auth.showLoader();
    let url = "/api/v1/topic_manager/update/" + this.institute_id;
    this._http.putData(url, object).subscribe(
      (res: any) => {
        this.auth.hideLoader();
        if (res.statusCode == 200) {
          console.log(res);
          this.addTopic = new Create_Topic();
          this.option_type = 'Add';
          $('#addTopic').modal('hide');
          this._toastPopup.showErrorMessage('success', '', "Topic Updated Successfully");
          this.getTopicDetails(null);
        } else {
          this._toastPopup.showErrorMessage('error', '', "something went wrong please try again");
        }

      },
      (error: any) => {
        this.auth.hideLoader();
        console.log(error);
        this._toastPopup.showErrorMessage('error', '', "something went wrong please try again");
      }
    )
  }

  // get standard
  getAllStandards() {
    let url = "/api/v1/standards/all/" + this.institute_id + "?active=Y" + '&teacher_id=' + this.teacher_id;
    this.auth.showLoader();
    this._http.getData(url).subscribe(
      (data: any) => {
        this.auth.hideLoader();
        this.standardData = data;
        // console.log(data);
      },
      (error: any) => {
        this.auth.hideLoader();
        console.log(error);
      }
    )
  }

  clearObject() {
    this.addTopic = new Create_Topic();
    this.option_type = 'Add';
  }

  clearFilter() {
    this.filterData = {
      standard_id: -1,
      subject_id: -1
    }
  }

  /**
   * eventaction edit and delete option
   * @param $event
   */
  eventAction($event) {
    console.log($event);
    switch ($event.option) {

      case 'Edit': {
        this.editTopicDetails($event.data);
        break;
      }
      case 'EditSubtopic': {

        let object = {
          "name": $event.data.name,
          "parent_topic_id": $event.data.parentTopicId,
          "institute_topic_id": $event.data.topicId,
          "description":$event.data.description,
          "priority_order": $event.data.priority_order
        }
        this.Update_Topic_Details('EditSubtopic', object);
        break;
      }
      case 'Delete': {
        this.temp_object = $event.data;
        $('#DeleteTopic').modal('show');
        break;
      }
      case 'Subtopic': {
        this.auth.showLoader();
        let object = $event.data;
        object.subject_id = this.filterData.subject_id;
        object.standard_id = this.filterData.standard_id;
       // this.auth.showLoader();
        let url = "/api/v1/topic_manager/add/" + this.institute_id;
        this._http.postData(url, object).subscribe(
          (data: any) => {
            this.auth.hideLoader();
            this._toastPopup.showErrorMessage('success', '', "Subtopic added successfully");
            if ((this.filterData.standard_id != -1) && (this.filterData.subject_id != -1)) {
              this.getTopicDetails(null);
            }
          },
          (error: any) => {
            this.auth.hideLoader();
            this._toastPopup.showErrorMessage('error', '', error.error.message);
            console.log(error);
          }
        );
      }
    }
  }

  //delete object
  deleteTopicObject() {
    this.disableDeleteBtn = true;
    let url = "/api/v1/topic_manager/" + this.institute_id + "/" + this.temp_object.topicId;
    this._http.deleteData(url, null).subscribe(
      (res: any) => {
        this.auth.hideLoader();
        $('#DeleteTopic').modal('hide');
        this._toastPopup.showErrorMessage('success', '', "Topic Deleted Successfully");
        this.getTopicDetails(null);
        this.disableDeleteBtn = false;
      },
      (err: any) => {
        this.auth.hideLoader();
        console.log(err);
        this._toastPopup.showErrorMessage('error', '', err.error.message);
        this.disableDeleteBtn = false;
      });

  }

  //edit object
  editTopicDetails(data) {
    this.auth.showLoader();
    let url = "/api/v1/topic_manager/getTopic/" + this.institute_id + "/" + data.topicId;
    this._http.getData(url).subscribe(
      (data: any) => {
        this.auth.hideLoader();
        console.log(data);
        if (data) {
          this.addTopic = new Create_Topic();
          this.addTopic = data;
          this.getAllSubjectList(data.standard_id);
          this.option_type = 'Edit';
          $('#addTopic').modal('show');
        } else {
          this._toastPopup.showErrorMessage('error', '', "something went wrong please try again");
        }
      },
      (err: any) => {
        this.auth.hideLoader();
        console.log(err);
        this._toastPopup.showErrorMessage('error', '', err.error.message);
      }
    )
  }

  // add topic
  Add_New_Topic_Details() {
    this.auth.showLoader();
    let url = "/api/v1/topic_manager/add/" + this.institute_id;
    this._http.postData(url, this.addTopic).subscribe(
      (data: any) => {
        this.auth.hideLoader();
        this.addTopic = new Create_Topic();
        this._toastPopup.showErrorMessage('success', '', "Topic Added Successfully");
        $('#addTopic').modal('hide');
        if ((this.filterData.standard_id != -1) && (this.filterData.subject_id != -1)) {
          this.getTopicDetails('view');
        }
        console.log(data);
      },
      (error: any) => {
        this.auth.hideLoader();
        this._toastPopup.showErrorMessage('error', '', "Something went wrong try again ");
        console.log(error);
      }
    );
  }

  getTopicDetails(type) {
    if (this.filterData.standard_id == -1) {
      this._toastPopup.showErrorMessage('error', '', "Select the standard");
      return;
    }
    if (this.filterData.subject_id == -1) {
      this._toastPopup.showErrorMessage('error', '', "Select the subject");
      return;
    }
    this.auth.showLoader();
    let url = "/api/v1/topic_manager/standards/" + this.filterData.standard_id + "/subjects/" + this.filterData.subject_id + "/topics";
    this._http.getData(url).subscribe(
      (data: any) => {
        this.auth.hideLoader();
        if (data) {
          if (type == 'view') {
            this.subjectList = data;
            this.subjectList.forEach((object) => {
              object.addSubtopic = [];
            })
          } else {
            for (let i = 0; i < data.length; i++) {
              data[i].isExpand = this.subjectList[i].isExpand;
              if (this.subjectList[i].addSubtopic[0]) {
                let object = this.subjectList[i].addSubtopic[0];
                object.name = object && object.name ? '' : '';
                data[i].addSubtopic = this.subjectList[i].addSubtopic;
              }
              else {
                data[i].addSubtopic = [];
              }
              this.expandAllTopic(data[i], this.subjectList[i]);
            }
            this.subjectList = data;
          }
        }
        if(!data.length || data == null){
          this._toastPopup.showErrorMessage('info','', 'No topics linked')
        }
      },
      (error: any) => {
        this.auth.hideLoader();
        console.log(error);
      }
    )
  }

  expandAllTopic(topic, subjectList) {
    if (topic.subTopic.length == 0) {
      return;
    }
    else {
      for (let i = 0; i < topic.subTopic.length; i++) {
        let object = topic.subTopic[i];
        let subject = subjectList != undefined ?  subjectList.subTopic[i] : '';
        object.addSubtopic = subject && subject.addSubtopic ? subject.addSubtopic : [];
        if (subject && subject.addSubtopic && subject.addSubtopic[0]) {
          let add_sub_object = subject.addSubtopic[0];
          add_sub_object.name = add_sub_object && add_sub_object.name ? '' : '';
          object.addSubtopic = subject.addSubtopic;
        }
        else {
          object.addSubtopic = [];
        }
        object.isExpand = subject && subject.isExpand;
        if (object.subTopic.length > 0) {
          this.expandAllTopic(object, subject);
        }
      }
    }
  }

}
