import { Component, OnInit } from '@angular/core';
import { HttpService } from '../../../../services/http.service';
import { AuthenticatorService } from '../../../../services/authenticator.service';
import { MessageShowService } from '../../../../services/message-show.service';
import { CommonApiCallService } from '../../../../services/common-api-call.service';
declare var $;


@Component({
  selector: 'app-school-exam-type',
  templateUrl: './school-exam-type.component.html',
  styleUrls: ['./school-exam-type.component.scss']
})
export class SchoolExamTypeComponent implements OnInit {
  type: string = '';
  instituteId: string = '';
  obj: any = [];
  addExamType: any = {
    exam_type_id: "",
    exam_type: "",
    description: "",
    institution_id: sessionStorage.getItem('institute_id'),
    is_active: 'Y',
  }
  isExamTypeUpdate: boolean = false;
  headerSetting: any;
  tableSetting: any;
  rowColumns: any;
  staticPageData: any = [];

  constructor(private http: HttpService, private auth: AuthenticatorService, private msgSrvc: MessageShowService,private commonApiCall:CommonApiCallService) {
    auth.currentInstituteId.subscribe(key => {
      this.instituteId = key;
    });
    this.fetchInstituteExamTypes(false);
  }

  ngOnInit(): void {
    this.createTable();
  }
  createTable() {
    this.auth.institute_type.subscribe(
      res => {
        if (res == "LANG") {
          this.type = 'batch';
        }
        else {
          this.type = 'course';
        }
      });
    this.headerSetting = [
      {
        primary_key: 'exam_type_id',
        value: "Id",
        charactLimit: 25,
        sorting: true,
        visibility: true
      },
      {
        primary_key: 'exam_type',
        value: "Exam Type",
        charactLimit: 25,
        sorting: true,
        visibility: true
      },
      {
        primary_key: 'description',
        value: "Description",
        charactLimit: 25,
        sorting: false,
        visibility: true
      },
      {
        primary_key: 'is_active',
        value: "Active",
        charactLimit: 25,
        sorting: false,
        visibility: true
      },
      {
        primary_key: 'created_date',
        value: "Created Date",
        charactLimit: 25,
        sorting: true,
        visibility: true
      },
      {
        primary_key: 'action',
        value: "Action",
        charactLimit: 10,
        sorting: false,
        visibility: true,
        edit: true,
        delete: true,
        view: true
      }
    ]

    this.tableSetting = {
      width: "100%",
      height: "58vh"
    }

    this.rowColumns = [
      {
        width: "10%",
        textAlign: "left"
      },
      {
        width: "20%",
        textAlign: "left"
      },
      {
        width: "25%",
        textAlign: "left"
      },
      {
        width: "20%",
        textAlign: "left"
      },
      {
        width: "20%",
        textAlign: "left"
      },
      {
        width: "10%",
        textAlign: "left"
      }

    ]

  }
  fetchInstituteExamTypes(isUpdate:boolean) {
    this.commonApiCall.fetchInstituteExamTypes(this.instituteId).subscribe((data: any) => {
      this.staticPageData = data.result;
      if(isUpdate){
      this.commonApiCall.examTypeList.next(this.staticPageData);
      }
    }, err => {
      this.msgSrvc.showErrorMessage(this.msgSrvc.toastTypes.error, '', err.error.message)
    })
  };

  createExamType() {
    let url = "/api/v1/courseExamSchedule/create-exam-type";
    let payload = {
      exam_type: this.addExamType.exam_type,
      description: this.addExamType.description,
      institution_id: sessionStorage.getItem('institute_id'),
      is_active: this.addExamType.is_active,
    };
    this.http.postData(url, payload).subscribe(data => {
      let temp: any = data;
      this.msgSrvc.showErrorMessage('success', '', temp.message)
      this.auth.hideLoader();
      $('#addExamType').modal('hide');
      this.clearData();
      this.fetchInstituteExamTypes(true);
    }, error => {
      this.auth.hideLoader();
      this.msgSrvc.showErrorMessage(this.msgSrvc.toastTypes.error, '', error.error.message)
    })

  }
  clearData() {
    this.addExamType= {
      exam_type_id: "",
      exam_type: "",
      description: "",
      institution_id: sessionStorage.getItem('institute_id'),
      is_active: 'Y',
    }
  }
  addUpdateExamType() {
    if (this.addExamType.exam_type == '') {
      this.msgSrvc.showErrorMessage('info', '', "Enter Exam Type");
      return false;
    }
    if (this.addExamType.exam_type.length > 50) {
      this.msgSrvc.showErrorMessage('info', '', "Exam Type cannot be more than 50 charactor");
      return false;
    }
    if (this.addExamType.description.length > 100) {
      this.msgSrvc.showErrorMessage('info', '', "Description cannot be so long");
      return false;
    }
    if (this.isExamTypeUpdate) {
      this.updateExamType();
    } else {
      this.createExamType();
    }

  }

  openEditExamTypeModal(obj) {
    this.isExamTypeUpdate = true;
    this.addExamType = obj.data;
    $('#addExamType').modal('show');
  }
  updateExamType() {
    let url = "/api/v1/courseExamSchedule/update-exam-type/" + this.addExamType.exam_type_id;
    let payload = {
      exam_type: this.addExamType.exam_type,
      description: this.addExamType.description,
      is_active: this.addExamType.is_active,
    };
    this.http.putData(url, payload).subscribe(data => {
      let temp: any = data;
      this.msgSrvc.showErrorMessage('success', '', temp.message)
      this.auth.hideLoader();
      $('#addExamType').modal('hide');
      this.clearData();
      this.fetchInstituteExamTypes(false);
    }, error => {
      this.auth.hideLoader();
      this.msgSrvc.showErrorMessage(this.msgSrvc.toastTypes.error, '', error.error.message)
    })

  }

}

