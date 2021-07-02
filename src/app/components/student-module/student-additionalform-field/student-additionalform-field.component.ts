import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AppComponent } from './../../../app.component';
import { CoursesServiceService } from './../../../services/archiving-service/courses-service.service';
import { AuthenticatorService } from './../../../services/authenticator.service';
import { MessageShowService } from './../../../services/message-show.service';
import { HttpService } from './../../../services/http.service';
import { PostEnquiryDataService } from '../../../services/enquiry-services/post-enquiry-data.service';
import { FetchprefilldataService } from '../../../services/fetchprefilldata.service';


// import { TablePreferencesService } from './../../../services/table-preference/table-preferences.service';

declare var $;
@Component({
  selector: 'app-student-additionalform-field',
  templateUrl: './student-additionalform-field.component.html',
  styleUrls: ['./student-additionalform-field.component.scss']
})
export class StudentAdditionalformFieldComponent implements OnInit {

  editCustomComponentForm: any = {
    comp_length: "",
    description: "",
    institution_id: sessionStorage.getItem('institute_id'),
    is_required: "N",
    is_searchable: "N",
    label: "",
    page: 2,
    prefilled_data: "",
    sequence_number: "",
    type: "",
    defaultValue: ""
  }

  headerSetting: any;
  tableSetting: any;
  rowColumns: any;
  isEdit:string=''
allAdditionFormFielData:any=[]
componentShell:any=[]
  constructor(
    private students: CoursesServiceService,
    private auth: AuthenticatorService,
    private appc: AppComponent,
    private router: Router,
    private _http: HttpService,
    private _msgService: MessageShowService,
    private postdata: PostEnquiryDataService,
    private prefill: FetchprefilldataService
    // private _tablePreferencesService: TablePreferencesService
  ) { }
  ngOnInit(): void {
   this.getAllFormFieldData();
   this.setTableData();
   this.fetchPrefillData()
  }
  setTableData() {
    this.headerSetting = [
      {
        primary_key: 'label',
        value: "Lable",
        charactLimit: 30,
        sorting: false,
        visibility: true
      },
      {
        primary_key: 'type| checkBoxConverter',
        value: "Type",
        charactLimit: 20,
        sorting: false,
        visibility: true
      },
      {
        primary_key: 'is_required',
        value: "Is Required",
        charactLimit: 20,
        sorting: false,
        visibility: true
      },
      {
        primary_key: 'is_searchable',
        value: "Is Searchable",
        charactLimit: 20,
        sorting: false,
        visibility: true
      },
      {
        primary_key: 'sequence_number',
        value: "Sequence",
        charactLimit: 10,
        sorting: false,
        visibility: true
      },
      {
        primary_key: 'comp_length',
        value: "Max Length",
        charactLimit: 30,
        sorting: false,
        visibility: true
      },
      {
        primary_key: 'defaultValue',
        value: "Default Value",
        charactLimit: 30,
        sorting: false,
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

     },
      // {
      //   primary_key: 'archived_date',
      //   value: "Archived Date Time",
      //   charactLimit: 30,
      //   sorting: false,
      //   visibility: true
      // },


    ]

    this.tableSetting = {
      width: "100%",
      height: "60vh"
    }

    this.rowColumns = [
      {
        width: "12%",
        textAlign: "center"
      },
      {
        width: "12%",
        textAlign: "center"
      },
      {
        width: "12%",
        textAlign: "center"
      },
      {
        width: "12%",
        textAlign: "center"
      },
      {
        width: "12%",
        textAlign: "center"
      },
      {
        width: "12%",
        textAlign: "center"
      },
      {
        width: "12%",
        textAlign: "center"
      },
      {
        width: "12%",
        textAlign: "center"
      },
     

    ]
  }
  getAllFormFieldData(){
    this.auth.showLoader();
    let url='/api/v1/instCustomComp/getAll/'+ sessionStorage.getItem('institute_id') + "?page=2"
    this._http.getData(url).subscribe(
      res =>{
        this.auth.hideLoader()
        this.allAdditionFormFielData = res
        console.log("additional field",this.allAdditionFormFielData)
      }, err => {
        this.auth.hideLoader();
        this._msgService.showErrorMessage(this._msgService.toastTypes.error, '', err);
      }
    )

  }
  fetchPrefillData() {
    this.auth.showLoader();
    this.prefill.fetchComponentGenerator().subscribe(
      (res: any) => {
        this.auth.hideLoader();
        this.componentShell = res;
      },(err)=>{
        this.auth.hideLoader();
      }
    );
  }

  addNewStudentCustomFormFiel(){
    
    this.auth.showLoader();
    this.postdata.addNewCustomComponent(this.editCustomComponentForm).subscribe(
      res => {
        this.auth.hideLoader();
        this._msgService.showErrorMessage('success', '', 'Form-Field  created Successfully');
        this.cleareForm();
        this.getAllFormFieldData()
      },
      err => {
        this.auth.hideLoader();
        this._msgService.showErrorMessage('error', '', 'Label name is already created with the same name');
      }
    );
          }
          tempObj
deletCustumField(object){
  let lable = this.editCustomComponentForm.label
  if (confirm('You are about to delete '+lable+', kindy confirm your action. ?')) {
    this.tempObj = object.data.component_id

    this.auth.showLoader();
    this.postdata.deleteCustomComponent(this.tempObj).subscribe(
      res => {
        this.auth.hideLoader();
        this._msgService.showErrorMessage('success', 'Form-field Deleted', 'requested form-field deleted successfully');
        this.cleareForm();
      },
      err => {
        this.auth.hideLoader();
        this._msgService.showErrorMessage('error', '', err.error.jpMessage);
        this.cleareForm();
      }
    );
  
    }
}
      
  validateDropdownDefvalue(tocheck, tomatch) {
    let arr = tocheck.split(',');
    for (let i = 0; i < arr.length; i++) {
      if (tomatch === arr[i].trim()) {
        return true;
      }
    }
    return false;
  }

  validateDropDownUpdate(data) {
    let arr: any[] = data.split(',');
    /* boolean for non empty value */
    let test1 = arr.every(function checkNonEmpty(el) {
      return (el != "" && el != " ");
    });
    /* convert array to set unique value */
    return test1
  }
  onClickAddField(type){
    this.isEdit = type
  }
  cleareForm(){
    this.emptyInput()
    this.fetchPrefillData()
    this.isEdit=''
  }
  emptyInput(){
    this.editCustomComponentForm = {
      comp_length: "",
      description: "",
      institution_id: sessionStorage.getItem('institute_id'),
      is_required: "N",
      is_searchable: "N",
      label: "",
      page: 2,
      prefilled_data: "",
      sequence_number: "",
      type: "",
      defaultValue: ""
    }
  }
}
