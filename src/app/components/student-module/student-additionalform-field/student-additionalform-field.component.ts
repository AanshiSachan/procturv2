import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AppComponent } from './../../../app.component';
import { CoursesServiceService } from './../../../services/archiving-service/courses-service.service';
import { AuthenticatorService } from './../../../services/authenticator.service';
import { MessageShowService } from './../../../services/message-show.service';
import { HttpService } from './../../../services/http.service';
import { PostEnquiryDataService } from '../../../services/enquiry-services/post-enquiry-data.service';
import { FetchprefilldataService } from '../../../services/fetchprefilldata.service';


import { TablePreferencesService } from './../../../services/table-preference/table-preferences.service';

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
    type: "-1",
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
    private prefill: FetchprefilldataService,
    private _tablePreferencesService: TablePreferencesService
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
        charactLimit: 20,
        sorting: false,
        visibility: true
      },
      {
        primary_key: 'new_type',
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
        width: "15%",
        textAlign: "center"
      },
      {
        width: "12.5%",
        textAlign: "center"
      },
      {
        width: "12.5%",
        textAlign: "center"
      },
      {
        width: "12.5%",
        textAlign: "center"
      },
      {
        width: "12.5%",
        textAlign: "center"
      },
      {
        width: "12.5%",
        textAlign: "center"
      },
      {
        width: "12.5%",
        textAlign: "center"
      },
      {
        width: "12.5%",
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
        for(let i =0; i<this.allAdditionFormFielData.length;i++){
          if(this.allAdditionFormFielData[i].type == 1){
            this.allAdditionFormFielData[i].new_type = 'textbox'
            
          } if(this.allAdditionFormFielData[i].type == 2){
            this.allAdditionFormFielData[i].new_type = 'checkbox'
            
        } if(this.allAdditionFormFielData[i].type == 3){
          this.allAdditionFormFielData[i].new_type = 'dropdown'
        } if(this.allAdditionFormFielData[i].type == 4){
          this.allAdditionFormFielData[i].new_type = 'multiselect'
        } if(this.allAdditionFormFielData[i].type == 5){
          this.allAdditionFormFielData[i].new_type = 'date'
        }
      }
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
    if (this.editCustomComponentForm.label.trim() != "" ){
    if( this.editCustomComponentForm.type != "-1") {

    //Case 2 if its a select or multiselect dropdown list cannot be empty or duplicate
    if (this.editCustomComponentForm.type == "3" || this.editCustomComponentForm.type == "4") {
      /* Validate Prefilled Data */
      if (this.validateDropDown(this.editCustomComponentForm.prefilled_data)) {
        if (this.validateDropdownDefvalue(this.editCustomComponentForm.prefilled_data, this.editCustomComponentForm.defaultValue)) {
          this.auth.showLoader();
          this.postdata.addNewCustomComponent(this.editCustomComponentForm).subscribe(
            res => {
              this.auth.hideLoader();
              this._msgService.showErrorMessage('success', '', 'Form-Field  Createated Successfully');
              this.cleareForm();
              this.getAllFormFieldData()
            },
            err => {
              this.auth.hideLoader();
              this._msgService.showErrorMessage('error', '', 'Label name is already created with the same name');
            }
          );
        }
        else {
          this._msgService.showErrorMessage('error', '', 'dropdown default value should be present in prefilled data');
        }
      }
      else {
        this._msgService.showErrorMessage('error', '', 'Prefill data has to be unique and non-empty');
      }
    }

    /* Date Custom Component */
    else if (this.editCustomComponentForm.type == "5") {
      /* Date cannot be searchable and does not a default value */
      if (this.editCustomComponentForm.is_searchable == "N" && this.editCustomComponentForm.defaultValue.trim() == "") {
        this.auth.showLoader();
        this.postdata.addNewCustomComponent(this.editCustomComponentForm).subscribe(
          res => {
            this.auth.hideLoader();
            this._msgService.showErrorMessage('success', '', 'Form-Field Createated Successfully');
            this.fetchPrefillData();
            this.cleareForm()
          },
          err => {
            this.auth.hideLoader();
            this._msgService.showErrorMessage('error', '',  err.error.message);
          }
        );
      }
      else {
        this._msgService.showErrorMessage('error', 'Date Field Cannot Be Searchable Or have any default value', '');
      }
    }

    /* Textbox and Checkbox */
    else if (this.editCustomComponentForm.type != "3" && this.editCustomComponentForm.type != "4" && this.editCustomComponentForm.type != "5") {
      this.auth.showLoader();
      this.postdata.addNewCustomComponent(this.editCustomComponentForm).subscribe(
        res => {
          this.auth.hideLoader();
          this._msgService.showErrorMessage('success', 'Form-Field Createated Successfully', '');
          this.cleareForm();
          this.getAllFormFieldData()
        },
        err => {
          this.auth.hideLoader();
          this._msgService.showErrorMessage('error', '', 'Label name is already created with the same name');
        }
      );
    }

  }
  else {
    this._msgService.showErrorMessage('error', '', 'Please mention a type');
  }
}
  else {
    this._msgService.showErrorMessage('error', '', 'Please mention a label');
  }

  
}
 

    editRow(object){
this.editCustomComponentForm = object.data
this.isEdit ='Edit'
    }

updateCustomField(){
let obj ={
  comp_length: this.editCustomComponentForm.comp_length,
component_id: this.editCustomComponentForm.component_id,
created_by: null,
defaultValue: this.editCustomComponentForm.defaultValue,
description:this.editCustomComponentForm.description,
enq_custom_id: 0,
enq_custom_value: "",
institution_id: this.editCustomComponentForm.institute_id,
is_active: "Y",
is_external: this.editCustomComponentForm.is_external,
is_required:this.editCustomComponentForm.is_required,
is_searchable:this.editCustomComponentForm.is_searchable,
label: this.editCustomComponentForm.label,
on_both:"Y",
page: 1,
page_name: null,
prefilled_data: this.editCustomComponentForm.prefilled_data,
sequence_number: this.editCustomComponentForm.sequence_number,
type: this.editCustomComponentForm.type
}
  let data = this.editCustomComponentForm;
  console.log("update",data)
    //Case 1 Label/Type is not empty and MaxLength and Sequence
    if (data.label.trim() != "" && data.type != "") {

      //Case 2 if its a select or multiselect dropdown list cannot be empty or duplicate
      if (data.type == "3" || data.type == "4") {
        /* Validate Prefilled Data */
        if (this.validateDropDown(data.prefilled_data)) {
          if (this.validateDropdownDefvalue(data.prefilled_data, data.defaultValue)) {
            this.editCustomComponentForm
            this.postdata.updateCustomComponent(obj).subscribe(
              res => {
                this._msgService.showErrorMessage('success', 'Form-Field Updated', '');
                this.cleareForm();
                this.getAllFormFieldData()
              },
              err => {
                this._msgService.showErrorMessage('error', '', err.error.message);
              }
            );
          }
          else {
            this._msgService.showErrorMessage('error', 'dropdown default value should be present in prefilled data', '');
          }
        }
        else {
          this._msgService.showErrorMessage('error', 'Prefill data has to be unique and non-empty', '');
        }
      }

      /* Date Custom Component */
      else if (data.type == "5") {
        /* Date cannot be searchable and does not a default value */
        if (data.is_searchable == "N" && data.defaultValue.trim() == "") {
          let data = this.editCustomComponentForm
          this.postdata.updateCustomComponent(obj).subscribe(
            res => {
              this._msgService.showErrorMessage('success', 'Form-Field Updated Successfully', '');
              this.cleareForm();
              this.getAllFormFieldData()

            },
            err => {
              this._msgService.showErrorMessage('error', '', err.error.message);
            }
          );
        }
        else {
          this._msgService.showErrorMessage('error', 'Date Field Cannot Be Searchable Or have any default value','');
        }
      }

      /* Textbox and Checkbox */
      else if (data.type != "3" && data.type != "4" && data.type != "5") {
        let data = this.editCustomComponentForm
        this.auth.showLoader();
        this.postdata.updateCustomComponent(obj).subscribe(
          res => {
            this.auth.hideLoader();
            this._msgService.showErrorMessage('success', 'Form-Field Updated','');
            this.cleareForm();
            this.getAllFormFieldData()

          },
          err => {
            this.auth.hideLoader();
            this._msgService.showErrorMessage('error', '', err.error.message);
          }
        );
      }

    }
    else {
      this._msgService.showErrorMessage('error', '', 'Please mention a Label/Type');
    }

}



          tempObj
deletCustumField(object){
  let lable = object.data.label
  if (confirm('You are about to delete '+lable+', kindy confirm your action. ?')) {
    this.tempObj = object.data.component_id
    this.auth.showLoader();
    this.postdata.deleteCustomComponent(this.tempObj).subscribe(
      res => {
        this.auth.hideLoader();
        this._msgService.showErrorMessage('success', 'Form-field Deleted', 'requested form-field deleted successfully');
        this.cleareForm();
        this.getAllFormFieldData()
      },
      err => {
        this.auth.hideLoader();
        this._msgService.showErrorMessage('error', '', err.error.jpMessage);
        this.cleareForm();
      }
    );
  
    }
}
validateDropDown(data) {
  let arr: any[] = data.split(',');
  /* boolean for non empty value */
  let test1 = arr.every(function checkNonEmpty(el) {
    return (el != "" && el != " ");
  });
  /* convert array to set unique value */
  this.editCustomComponentForm.prefilled_data = Array.from(new Set(arr)).join(',');
  return test1
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
  canclePopus(){
    this.isEdit=''
    this.emptyInput()
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
      type: "-1",
      defaultValue: ""
    }
  }
}
