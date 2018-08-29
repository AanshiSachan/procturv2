import { Component, OnInit } from '@angular/core';
import { FetchprefilldataService } from '../../../services/fetchprefilldata.service';
import { PostEnquiryDataService } from '../../../services/enquiry-services/post-enquiry-data.service';
import { LoginService } from '../../../services/login-services/login.service';
import { AppComponent } from '../../../app.component';
import { Pipe, PipeTransform } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import { Subscription } from 'rxjs';
import 'rxjs/Rx';


@Component({
  selector: 'student-custom-comp',
  templateUrl: './student-custom-comp.component.html',
  styleUrls: ['./student-custom-comp.component.scss']
})

export class StudentCustomComponent implements OnInit {


  isDelete: boolean;
  isEdit: boolean;
  componentShell: any[] = [];
  userCreatedComponent: any[] = [];
  isNewComponent: boolean = false;
  createCustomComponentForm: any = {
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
  busy: Subscription;

  constructor(private prefill: FetchprefilldataService, private postdata: PostEnquiryDataService, private appC: AppComponent, private login: LoginService) {
  }

  ngOnInit() {
    this.fetchPrefillData();
  }

  /* fetches list of user created component and the default type */
  fetchPrefillData() {

    this.prefill.fetchComponentGenerator().subscribe(
      (res: any) => {
        this.componentShell = res;
      }
    );


    return this.prefill.fetchUserCreatedComponentStudent().subscribe(
      (res: any) => {
        this.userCreatedComponent = res;
      }
    );
  }

  /* toggle the visibility of the the new component created */
  toggleNewComponentVisisbility() {

    if (document.getElementById('addComponent-icon').innerHTML == "+") {
      this.isNewComponent = true;
      document.getElementById('addComponent-icon').innerHTML = "-";
    }
    else if (document.getElementById('addComponent-icon').innerHTML == "-") {
      this.isNewComponent = false;
      this.createCustomComponentForm = {
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
      document.getElementById('addComponent-icon').innerHTML = "+"
    }
  }

  addNewCustomComponent() {
    //Case 1 Label/Type is not empty and MaxLength and Sequence
    if (this.createCustomComponentForm.label != "" && this.createCustomComponentForm.label != " "
      && this.createCustomComponentForm.type != "") {

      //Case 2 if its a select or multiselect dropdown list cannot be empty or duplicate
      if (this.createCustomComponentForm.type == "3" || this.createCustomComponentForm.type == "4") {
        /* Validate Prefilled Data */
        if (this.validateDropDown(this.createCustomComponentForm.prefilled_data)) {
          if (this.validateDropdownDefvalue(this.createCustomComponentForm.prefilled_data, this.createCustomComponentForm.defaultValue)) {
            this.postdata.addNewCustomComponent(this.createCustomComponentForm).subscribe(
              res => {
                let alert = {
                  type: 'success',
                  title: 'Form-Field Updated',
                }
                this.isNewComponent = false;
                document.getElementById('addComponent-icon').innerHTML = "+"
                this.clearComponentForm();
                this.appC.popToast(alert);
                this.fetchPrefillData();
              },
              err => {
                let alert = {
                  type: 'error',
                  title: 'Failed To Add Form-Field',
                  body: 'Label name is already created with the same name'
                }
                this.appC.popToast(alert);
              }
            );
            this.fetchPrefillData();
          }
          else {
            let alert = {
              type: 'error',
              title: 'dropdown default value should be present in prefilled data',
              body: ''
            }
            this.appC.popToast(alert);
          }
        }
        else {
          let alert = {
            type: 'error',
            title: 'Prefill data has to be unique and non-empty',
            body: ''
          }
          this.appC.popToast(alert);
        }
      }

      /* Date Custom Component */
      else if (this.createCustomComponentForm.type == "5") {
        /* Date cannot be searchable and does not a default value */
        if (this.createCustomComponentForm.is_searchable == "N" && this.createCustomComponentForm.defaultValue.trim() == "") {
          this.postdata.addNewCustomComponent(this.createCustomComponentForm).subscribe(
            res => {
              let alert = {
                type: 'success',
                title: 'Form-Field Updated',
              }
              this.isNewComponent = false;
              document.getElementById('addComponent-icon').innerHTML = "+"
              this.clearComponentForm();
              this.appC.popToast(alert);
              this.fetchPrefillData();
            },
            err => {
              let alert = {
                type: 'error',
                title: 'Failed To Add Form-Field',
                body: 'There was an error processing your request' + JSON.parse(err._body).message
              }
              this.appC.popToast(alert);
            }
          );
          this.fetchPrefillData();
        }
        else {
          let obj = {
            type: 'error',
            title: 'Date Field Cannot Be Searchable Or have any default value',
            body: ''
          }
          this.appC.popToast(obj);
        }
      }

      /* Textbox and Checkbox */
      else if (this.createCustomComponentForm.type != "3" && this.createCustomComponentForm.type != "4" && this.createCustomComponentForm.type != "5") {
        this.postdata.addNewCustomComponent(this.createCustomComponentForm).subscribe(
          res => {
            let alert = {
              type: 'success',
              title: 'Form-Field Updated',
            }
            this.isNewComponent = false;
            document.getElementById('addComponent-icon').innerHTML = "+"
            this.clearComponentForm();
            this.appC.popToast(alert);
            this.fetchPrefillData();
          },
          err => {
            let alert = {
              type: 'error',
              title: 'Failed To Add Form-Field',
              body: 'Label name is already created with the same name'
            }
            this.appC.popToast(alert);
          }
        );
        this.fetchPrefillData();
        /* if (this.validateDropDown(this.createCustomComponentForm.prefilled_data)) {
        }
        else {
          let obj = {
            type: 'error',
            title: 'Date Field Cannot Be Searchable Or have any default value',
            body: ''
          }
          this.appC.popToast(obj);
        } */
      }

    }
    else {
      let alert = {
        type: 'error',
        title: 'Invalid Input',
        body: 'Please mention a Label/Type'
      }
      this.appC.popToast(alert);
    }
  }

  isDefaultEmpty(obj): boolean {
    if (obj.defaultValue) {
      return true;
    }
  }

  validateDropDown(data) {
    let arr: any[] = data.split(',');
    /* boolean for non empty value */
    let test1 = arr.every(function checkNonEmpty(el) {
      return (el != "" && el != " ");
    });
    /* convert array to set unique value */
    this.createCustomComponentForm.prefilled_data = Array.from(new Set(arr)).join(',');
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

  editRow(data) {
    this.editCustomComponentForm = data;
    this.isEdit = true;
    /* document.getElementById((data.label + data.component_id).toString()).classList.remove('displayComp');
    document.getElementById((data.label + data.component_id).toString()).classList.add('editComp'); */
  }

  cancelEditRow() {
    /* document.getElementById((data.label + data.component_id).toString()).classList.add('displayComp');
    document.getElementById((data.label + data.component_id).toString()).classList.remove('editComp'); */
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
    this.fetchPrefillData();
    this.isEdit = false;
  }

  updateRow() {
    let data = this.editCustomComponentForm;
    //Case 1 Label/Type is not empty and MaxLength and Sequence
    if (data.label.trim() != "" && data.type != "") {

      //Case 2 if its a select or multiselect dropdown list cannot be empty or duplicate
      if (data.type == "3" || data.type == "4") {
        /* Validate Prefilled Data */
        if (this.validateDropDown(data.prefilled_data)) {
          if (this.validateDropdownDefvalue(data.prefilled_data, data.defaultValue)) {
            this.postdata.updateCustomComponent(data).subscribe(
              res => {
                let alert = {
                  type: 'success',
                  title: 'Form-Field Updated',
                }
                this.appC.popToast(alert);
                this.cancelEditRow();
              },
              err => {
                let alert = {
                  type: 'error',
                  title: 'Failed To Update Form-Field',
                  body: JSON.parse(err._body).message
                }
                this.appC.popToast(alert);
              }
            );
          }
          else {
            let alert = {
              type: 'error',
              title: 'dropdown default value should be present in prefilled data',
              body: ''
            }
            this.appC.popToast(alert);
          }
        }
        else {
          let alert = {
            type: 'error',
            title: 'Prefill data has to be unique and non-empty',
            body: ''
          }
          this.appC.popToast(alert);
        }
      }

      /* Date Custom Component */
      else if (data.type == "5") {
        /* Date cannot be searchable and does not a default value */
        if (data.is_searchable == "N" && data.defaultValue.trim() == "") {
          this.postdata.updateCustomComponent(data).subscribe(
            res => {
              let alert = {
                type: 'success',
                title: 'Form-Field Updated',
              }
              this.appC.popToast(alert);
              this.cancelEditRow();
            },
            err => {
              let alert = {
                type: 'error',
                title: 'Failed To Update Component',
                body: JSON.parse(err._body).message
              }
              this.appC.popToast(alert);
            }
          );
        }
        else {
          let obj = {
            type: 'error',
            title: 'Date Field Cannot Be Searchable Or have any default value',
            body: ''
          }
          this.appC.popToast(obj);
        }
      }

      /* Textbox and Checkbox */
      else if (data.type != "3" && data.type != "4" && data.type != "5") {
        this.postdata.updateCustomComponent(data).subscribe(
          res => {
            let alert = {
              type: 'success',
              title: 'Form-Field Updated',
            }
            this.appC.popToast(alert);
            this.cancelEditRow();
          },
          err => {
            let alert = {
              type: 'error',
              title: 'Failed To Update Form-Field',
              body: JSON.parse(err._body).message
            }
            this.appC.popToast(alert);
          }
        );
        /* if (this.validateDropDown(data.prefilled_data)) {
        }
        else {
          let obj = {
            type: 'error',
            title: 'Prefill data has to be unique and non-empty',
            body: ''
          }
          this.appC.popToast(obj);
        } */
      }

    }
    else {
      let alert = {
        type: 'error',
        title: 'Invalid Input',
        body: 'Please mention a Label/Type'
      }
      this.appC.popToast(alert);
    }
  }

  clearComponentForm() {
    this.createCustomComponentForm = {
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

  deleteRow(data) {
    this.editCustomComponentForm = data;
    this.isDelete = true;
  }

  cancelDeleteRow() {
    this.isDelete = false;
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

  DeleteRowConfirmed() {
    let data = this.editCustomComponentForm;
    this.postdata.deleteCustomComponent(data.component_id).subscribe(
      res => {
        this.isDelete = false;
        let alert = {
          type: 'success',
          title: 'Form-field Deleted',
          body: 'requested form-field deleted'
        }
        this.appC.popToast(alert);
        this.fetchPrefillData();
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
      },
      err => {
        let alert = {
          type: 'error',
          title: 'Failed To Delete Form-Field',
          body: err.error.message
        }
        this.appC.popToast(alert);
        this.isDelete = false;
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
    );
  }

}

/* Used to cconvert the input type id to text for user view purpose */
@Pipe({ name: 'checkBoxConverter' })
export class CheckBoxConverter implements PipeTransform {
  transform(value: any, exponent: any): any {
    if (value == 1) {
      return 'textbox';
    }
    else if (value == 2) {
      return "checkbox";
    }
    else if (value == 3) {
      return "dropdown";
    }
    else if (value == 4) {
      return "multiselect";
    }
  }
}

/* Converts Boolean into Y or N depending on condition for user preview */
@Pipe({ name: 'booleanConverter' })
export class BooleanConverter implements PipeTransform {
  transform(value: any, exponent: any): any {
    if (value === 'Y' || value) {
      return "Y";
    }
    else if (value === 'N' || value) {
      return "N";
    }
  }
}
