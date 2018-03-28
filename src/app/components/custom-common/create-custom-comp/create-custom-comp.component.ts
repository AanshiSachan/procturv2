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
  selector: 'app-create-custom-comp',
  templateUrl: './create-custom-comp.component.html',
  styleUrls: ['./create-custom-comp.component.scss']
})

export class CreateCustomCompComponent implements OnInit {


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
    page: 1,
    prefilled_data: "",
    sequence_number: "",
    type: "",
    on_both: "Y"
  }
  busy: Subscription;

  constructor(private prefill: FetchprefilldataService, private postdata: PostEnquiryDataService, private appC: AppComponent, private login: LoginService) {
  }




  ngOnInit() {

    this.busy = this.fetchPrefillData();

    this.login.changeInstituteStatus(sessionStorage.getItem('institute_name'));
    this.login.changeNameStatus(sessionStorage.getItem('name'));

  }




  /* fetches list of user created component and the default type */
  fetchPrefillData() {


    this.prefill.fetchComponentGenerator().subscribe(
      res => {
        this.componentShell = res;
        //console.log(res);
      }
    );


    return this.prefill.fetchUserCreatedComponent().subscribe(
      res => {
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
        page: 1,
        prefilled_data: "",
        sequence_number: "",
        type: ""
      };
      document.getElementById('addComponent-icon').innerHTML = "+"
    }
  }




  addNewCustomComponent() {
    //Case 1 Label/Type is not empty and MaxLength and Sequence
    if (this.createCustomComponentForm.label != "" && this.createCustomComponentForm.label != " "
      && this.createCustomComponentForm.type != "") {
      //console.log("label and type are non empty");
      //Case 2 if its a select or multiselect dropdown list cannot be empty or duplicate
      if (this.createCustomComponentForm.type == "3" || this.createCustomComponentForm.type == "4") {
        //console.log("select or multiselect detected") /* Non  empty and non duplicate then procede */
        if (this.validateDropDown(this.createCustomComponentForm.prefilled_data)) {
          if (this.createCustomComponentForm.is_required == "Y") {
            if (this.createCustomComponentForm.is_searchable == "Y") {
              this.busy = this.postdata.addNewCustomComponent(this.createCustomComponentForm).subscribe(
                res => {
                  let alert = {
                    type: 'success',
                    title: 'Component Updated',
                  }
                  this.isNewComponent = false;
                  document.getElementById('addComponent-icon').innerHTML = "+"
                  this.clearComponentForm();
                  this.appC.popToast(alert);
                },
                err => {
                  let alert = {
                    type: 'error',
                    title: 'Failed To Add Component',
                    body: 'There was an error processing your request' + err.message
                  }
                  this.appC.popToast(alert);
                }
              );
              this.fetchPrefillData();
            }
            else {
              this.busy = this.postdata.addNewCustomComponent(this.createCustomComponentForm).subscribe(
                res => {
                  let alert = {
                    type: 'success',
                    title: 'Component Updated',
                  }
                  this.clearComponentForm();
                  this.isNewComponent = false;
                  this.appC.popToast(alert);
                },
                err => {
                  let alert = {
                    type: 'error',
                    title: 'Failed To Add Component',
                    body: 'There was an error processing your request' + err.message
                  }
                  this.appC.popToast(alert);
                }
              );
              this.fetchPrefillData();
            }
          }
          else {
            if (this.createCustomComponentForm.is_searchable == "Y") {
              this.busy = this.postdata.addNewCustomComponent(this.createCustomComponentForm).subscribe(
                res => {
                  let alert = {
                    type: 'success',
                    title: 'Component Updated',
                  }
                  this.isNewComponent = false;
                  document.getElementById('addComponent-icon').innerHTML = "+"
                  this.clearComponentForm();
                  this.appC.popToast(alert);
                },
                err => {
                  let alert = {
                    type: 'error',
                    title: 'Failed To Add Component',
                    body: 'There was an error processing your request' + err.message
                  }
                  this.appC.popToast(alert);
                }
              );
              this.busy = this.fetchPrefillData();
            }
            else {
              this.busy = this.postdata.addNewCustomComponent(this.createCustomComponentForm).subscribe(
                res => {
                  let alert = {
                    type: 'success',
                    title: 'Component Updated',
                  }
                  this.isNewComponent = false;
                  document.getElementById('addComponent-icon').innerHTML = "+"
                  this.clearComponentForm();
                  this.appC.popToast(alert);
                },
                err => {
                  let alert = {
                    type: 'error',
                    title: 'Failed To Add Component',
                    body: 'There was an error processing your request' + err.message
                  }
                  this.appC.popToast(alert);
                }
              );
              this.busy = this.fetchPrefillData();
            }
          }
        }
        else {
          let alert = {
            type: 'error',
            title: 'Invalid Input',
            body: 'Prefill data has to be unique and non-empty'
          }
          this.appC.popToast(alert);
        }
      }
      else if(this.createCustomComponentForm.type == "5"){
        if (this.validateDropDown(this.createCustomComponentForm.prefilled_data)) {  
          if (this.createCustomComponentForm.is_required == "Y") {
            if (this.createCustomComponentForm.is_searchable == "Y") {
              let alert = {
                type: 'error',
                title: 'Invalid Input',
                body: 'Input cannot be Searchable with Type "Date" '
              }
              this.appC.popToast(alert);
            }
            else {
              this.busy = this.postdata.addNewCustomComponent(this.createCustomComponentForm).subscribe(
                res => {
                  let alert = {
                    type: 'success',
                    title: 'Component Updated',
                  }
                  this.clearComponentForm();
                  this.isNewComponent = false;
                  this.appC.popToast(alert);
                },
                err => {
                  let alert = {
                    type: 'error',
                    title: 'Failed To Add Component',
                    body: 'There was an error processing your request' + err.message
                  }
                  this.appC.popToast(alert);
                }
              );
              this.fetchPrefillData();
            }
          }
          else {
            if (this.createCustomComponentForm.is_searchable == "Y") {
              let alert = {
                type: 'error',
                title: 'Invalid Input',
                body: 'Input cannot be Searchable with Type "Date" '
              }
              this.appC.popToast(alert);
            }
            else {
              this.busy = this.postdata.addNewCustomComponent(this.createCustomComponentForm).subscribe(
                res => {
                  let alert = {
                    type: 'success',
                    title: 'Component Updated',
                  }
                  this.isNewComponent = false;
                  document.getElementById('addComponent-icon').innerHTML = "+"
                  this.clearComponentForm();
                  this.appC.popToast(alert);
                },
                err => {
                  let alert = {
                    type: 'error',
                    title: 'Failed To Add Component',
                    body: 'There was an error processing your request' + err.message
                  }
                  this.appC.popToast(alert);
                }
              );
              this.busy = this.fetchPrefillData();
            }
          }
        }
        else {
          let alert = {
            type: 'error',
            title: 'Invalid Input',
            body: 'Prefill data has to be unique and non-empty'
          }
          this.appC.popToast(alert);
        }
      }
      else {
        //console.log("input text or checkbox");
        if (this.createCustomComponentForm.is_required == "Y") {
          if (this.createCustomComponentForm.is_searchable == "Y") {
            this.busy = this.postdata.addNewCustomComponent(this.createCustomComponentForm).subscribe(
              res => {
                let alert = {
                  type: 'success',
                  title: 'Component Updated',
                }
                this.isNewComponent = false;
                document.getElementById('addComponent-icon').innerHTML = "+"
                this.clearComponentForm();
                this.appC.popToast(alert);
              },
              err => {
                let alert = {
                  type: 'error',
                  title: 'Failed To Add Component',
                  body: 'There was an error processing your request' + err.message
                }
                this.appC.popToast(alert);
              }
            );
            this.busy = this.fetchPrefillData();
          }
          else {
            this.busy = this.postdata.addNewCustomComponent(this.createCustomComponentForm).subscribe(
              res => {
                let alert = {
                  type: 'success',
                  title: 'Component Updated',
                }
                this.isNewComponent = false;
                document.getElementById('addComponent-icon').innerHTML = "+"
                this.clearComponentForm();
                this.appC.popToast(alert);
              },
              err => {
                let alert = {
                  type: 'error',
                  title: 'Failed To Add Component',
                  body: 'There was an error processing your request' + err.message
                }
                this.appC.popToast(alert);
              }
            );
            this.busy = this.fetchPrefillData();
          }
        }
        else {
          if (this.createCustomComponentForm.is_searchable == "Y") {
            this.busy = this.postdata.addNewCustomComponent(this.createCustomComponentForm).subscribe(
              res => {
                let alert = {
                  type: 'success',
                  title: 'Component Updated',
                }
                this.isNewComponent = false;
                document.getElementById('addComponent-icon').innerHTML = "+"
                this.clearComponentForm();
                this.appC.popToast(alert);
              },
              err => {
                let alert = {
                  type: 'error',
                  title: 'Failed To Add Component',
                  body: 'There was an error processing your request' + err.message
                }
                this.appC.popToast(alert);
              }
            );
            this.busy = this.fetchPrefillData();
          }
          else {
            this.busy = this.postdata.addNewCustomComponent(this.createCustomComponentForm).subscribe(
              res => {
                let alert = {
                  type: 'success',
                  title: 'Component Updated',
                }
                this.isNewComponent = false;
                document.getElementById('addComponent-icon').innerHTML = "+"
                this.clearComponentForm();
                this.appC.popToast(alert);
              },
              err => {
                let alert = {
                  type: 'error',
                  title: 'Failed To Add Component',
                  body: 'There was an error processing your request' + err.message
                }
                this.appC.popToast(alert);
              }
            );
            this.busy = this.fetchPrefillData();
          }
        }
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
    document.getElementById((data.label + data.component_id).toString()).classList.remove('displayComp');
    document.getElementById((data.label + data.component_id).toString()).classList.add('editComp');
  }




  deleteRow(data) {

    if (confirm("Do you really wish to delete this component")) {
      this.postdata.deleteCustomComponent(data.component_id).subscribe(
        res => {
          let alert = {
            type: 'success',
            title: 'Component Deleted',
            body: 'requested component deleted'
          }
          this.appC.popToast(alert);
          this.cancelEditRow(data);
        },
        err => {
          let alert = {
            type: 'error',
            title: 'Failed To Delete Component',
            body: 'The requested component is already in use'
          }
          this.appC.popToast(alert);
        }
      );
    }

  }



  cancelEditRow(data) {
    document.getElementById((data.label + data.component_id).toString()).classList.add('displayComp');
    document.getElementById((data.label + data.component_id).toString()).classList.remove('editComp');
    this.fetchPrefillData();
  }




  updateRow(data) {
    
    if(data.type == '3' || data.type == '4'){
      if (this.validateDropDownUpdate(data.prefilled_data)) {
        let arr: any[] = data.prefilled_data.split(',');
        data.prefilled_data = Array.from(new Set(arr)).join(',');
        if (data.is_required == "Y") {
          if (data.is_searchable == "Y") {
           /* this.busy = */ this.postdata.updateCustomComponent(data).subscribe(
              res => {
                let alert = {
                  type: 'success',
                  title: 'Component Updated',
                }
                this.appC.popToast(alert);
                this.cancelEditRow(data);
              },
              err => {
                let alert = {
                  type: 'error',
                  title: 'Failed To Update Component',
                  body: 'component cannot be update as already in use'
                }
                this.appC.popToast(alert);
              }
            );
          }
          else {
            this.postdata.updateCustomComponent(data).subscribe(
              res => {
                let alert = {
                  type: 'success',
                  title: 'Component Updated',
                }
                this.appC.popToast(alert);
                this.cancelEditRow(data);
  
              },
              err => {
                let alert = {
                  type: 'error',
                  title: 'Failed To Update Component',
                  body: 'component cannot be update as already in use'
                }
                this.appC.popToast(alert);
              }
            );
          }
        }
        else {
          if (data.is_searchable == "Y") {
            this.postdata.updateCustomComponent(data).subscribe(
              res => {
                let alert = {
                  type: 'success',
                  title: 'Component Updated',
                }
                this.appC.popToast(alert);
                this.cancelEditRow(data);
  
              },
              err => {
                let alert = {
                  type: 'error',
                  title: 'Failed To Update Component',
                  body: 'component cannot be update as already in use'
                }
                this.appC.popToast(alert);
              }
            );
          }
          else {
            this.postdata.updateCustomComponent(data).subscribe(
              res => {
                let alert = {
                  type: 'success',
                  title: 'Component Updated',
                }
                this.appC.popToast(alert);
                this.cancelEditRow(data);
  
              },
              err => {
                let alert = {
                  type: 'error',
                  title: 'Failed To Update Component',
                  body: 'component cannot be update as already in use'
                }
                this.appC.popToast(alert);
              }
            );
          }
        } 
      }
      else {
        let msg = {
          type: 'error',
          title: 'Invalid Input',
          body: 'Prefilled data should be non-empty and unique'
          }
          this.appC.popToast(msg);        
      }
    }

    else if(data.type == '5'){
      if (this.validateDropDown(data.prefilled_data)) {      
        if (data.is_required == "Y") {
          if (data.is_searchable == "Y") {
            let msg = {
              type: 'error',
              title: 'Invalid Input',
              body: 'Input cannot be Searchable with Type "Date" '
              }
              this.appC.popToast(msg);        
          }
          else{
            this.postdata.updateCustomComponent(data).subscribe(
              res => {
                let alert = {
                  type: 'success',
                  title: 'Component Updated',
                }
                this.appC.popToast(alert);
                this.cancelEditRow(data);
  
              },
              err => {
                let alert = {
                  type: 'error',
                  title: 'Failed To Update Component',
                  body: 'component cannot be update as already in use'
                }
                this.appC.popToast(alert);
              }
            );
          }
        }
        else{
          if (data.is_searchable == "Y") {
            let msg = {
              type: 'error',
              title: 'Invalid Input',
              body: 'Input cannot be Searchable with Type "Date" '
              }
              this.appC.popToast(msg);        
          }
          else{
            this.postdata.updateCustomComponent(data).subscribe(
              res => {
                let alert = {
                  type: 'success',
                  title: 'Component Updated',
                }
                this.appC.popToast(alert);
                this.cancelEditRow(data);
  
              },
              err => {
                let alert = {
                  type: 'error',
                  title: 'Failed To Update Component',
                  body: 'component cannot be update as already in use'
                }
                this.appC.popToast(alert);
              }
            );
          }
        }
    }
    else{
      let msg = {
          type: 'error',
          title: 'Invalid Input',
          body: 'Prefilled data should be non-empty and unique'
          }
          this.appC.popToast(msg);        
      }
    }

    else{
      if (data.is_required == "Y") {
        if (data.is_searchable == "Y") {
         /* this.busy = */ this.postdata.updateCustomComponent(data).subscribe(
            res => {
              let alert = {
                type: 'success',
                title: 'Component Updated',
              }
              this.appC.popToast(alert);
              this.cancelEditRow(data);
            },
            err => {
              let alert = {
                type: 'error',
                title: 'Failed To Update Component',
                body: 'component cannot be update as already in use'
              }
              this.appC.popToast(alert);
            }
          );
        }
        else {
          this.postdata.updateCustomComponent(data).subscribe(
            res => {
              let alert = {
                type: 'success',
                title: 'Component Updated',
              }
              this.appC.popToast(alert);
              this.cancelEditRow(data);

            },
            err => {
              let alert = {
                type: 'error',
                title: 'Failed To Update Component',
                body: 'component cannot be update as already in use'
              }
              this.appC.popToast(alert);
            }
          );
        }
      }
      else {
        if (data.is_searchable == "Y") {
          this.postdata.updateCustomComponent(data).subscribe(
            res => {
              let alert = {
                type: 'success',
                title: 'Component Updated',
              }
              this.appC.popToast(alert);
              this.cancelEditRow(data);

            },
            err => {
              let alert = {
                type: 'error',
                title: 'Failed To Update Component',
                body: 'component cannot be update as already in use'
              }
              this.appC.popToast(alert);
            }
          );
        }
        else {
          this.postdata.updateCustomComponent(data).subscribe(
            res => {
              let alert = {
                type: 'success',
                title: 'Component Updated',
              }
              this.appC.popToast(alert);
              this.cancelEditRow(data);

            },
            err => {
              let alert = {
                type: 'error',
                title: 'Failed To Update Component',
                body: 'component cannot be update as already in use'
              }
              this.appC.popToast(alert);
            }
          );
        }
      }
    }
  }




  /* Customiized click detection strategy */
  inputClicked(ev) {
    if (ev.target.classList.contains('form-ctrl')) {
      if (ev.target.classList.contains('bsDatepicker')) {
        var nodelist = document.querySelectorAll('.bsDatepicker');
        [].forEach.call(nodelist, (elm) => {
          elm.addEventListener('focusout', function (event) {
            event.target.parentNode.classList.add('has-value');
          });
        });
      }
      else if ((ev.target.classList.contains('form-ctrl')) && !(ev.target.classList.contains('bsDatepicker'))) {
        //document.getElementById(ev.target.id).click();
        ev.target.addEventListener('blur', function (event) {
          if (event.target.value != '') {
            event.target.parentNode.classList.add('has-value');
          } else {
            event.target.parentNode.classList.remove('has-value');
          }
        });
      }
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
      page: 1,
      prefilled_data: "",
      sequence_number: "",
      type: "",
      on_both: "Y"
    }
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
