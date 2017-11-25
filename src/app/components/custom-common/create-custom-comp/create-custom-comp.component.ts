import { Component, OnInit } from '@angular/core';
import { FetchprefilldataService } from '../../../services/fetchprefilldata.service';
import { PostEnquiryDataService } from '../../../services/enquiry-services/post-enquiry-data.service';
import { AppComponent } from '../../../app.component';
import { Pipe, PipeTransform } from '@angular/core';

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
    is_required: "",
    is_searchable: "",
    label: "",
    page: 2,
    prefilled_data: "",
    sequence_number: "",
    type: ""
  }


  constructor(private prefill: FetchprefilldataService, private postdata: PostEnquiryDataService, private appC: AppComponent) {
  }

  ngOnInit() {
    this.fetchPrefillData();
  }


  /* fetches list of user created component and the default type */
  fetchPrefillData() {


    this.prefill.fetchComponentGenerator().subscribe(
      res => {
        this.componentShell = res;
        console.log(res);
      }
    );


    this.prefill.fetchUserCreatedComponent().subscribe(
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
        is_required: "",
        is_searchable: "",
        label: "",
        page: 2,
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

      //Case 2 if its a select or multiselect dropdown list cannot be empty or duplicate
      if (this.createCustomComponentForm.type == "3" || this.createCustomComponentForm.type == "4") {

        if (this.validateDropDown(this.createCustomComponentForm.prefilled_data)) {

          if (this.createCustomComponentForm.is_required) {
            this.createCustomComponentForm.is_required = "Y";
            if (this.createCustomComponentForm.is_searchable) {
              this.createCustomComponentForm.is_searchable = "Y";
              this.postdata.addNewCustomComponent(this.createCustomComponentForm).subscribe(
                res => {
                  let alert = {
                    type: 'success',
                    title: 'Component Updated',
                  }
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
              this.createCustomComponentForm.is_searchable = "N";
              this.postdata.addNewCustomComponent(this.createCustomComponentForm).subscribe(
                res => {
                  let alert = {
                    type: 'success',
                    title: 'Component Updated',
                  }
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
            this.createCustomComponentForm.is_required = "N";
            if (this.createCustomComponentForm.is_searchable) {
              this.createCustomComponentForm.is_searchable = "Y";
              this.postdata.addNewCustomComponent(this.createCustomComponentForm).subscribe(
                res => {
                  let alert = {
                    type: 'success',
                    title: 'Component Updated',
                  }
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
              this.createCustomComponentForm.is_searchable = "N";
              this.postdata.addNewCustomComponent(this.createCustomComponentForm).subscribe(
                res => {
                  let alert = {
                    type: 'success',
                    title: 'Component Updated',
                  }
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
        if (this.createCustomComponentForm.is_required) {
          this.createCustomComponentForm.is_required = "Y";
          if (this.createCustomComponentForm.is_searchable) {
            this.createCustomComponentForm.is_searchable = "Y";
            this.postdata.addNewCustomComponent(this.createCustomComponentForm).subscribe(
              res => {
                let alert = {
                  type: 'success',
                  title: 'Component Updated',
                }
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
            this.createCustomComponentForm.is_searchable = "N";
            this.postdata.addNewCustomComponent(this.createCustomComponentForm).subscribe(
              res => {
                let alert = {
                  type: 'success',
                  title: 'Component Updated',
                }
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
          this.createCustomComponentForm.is_required = "N";
          if (this.createCustomComponentForm.is_searchable) {
            this.createCustomComponentForm.is_searchable = "Y";
            this.postdata.addNewCustomComponent(this.createCustomComponentForm).subscribe(
              res => {
                let alert = {
                  type: 'success',
                  title: 'Component Updated',
                }
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
            this.createCustomComponentForm.is_searchable = "N";
            this.postdata.addNewCustomComponent(this.createCustomComponentForm).subscribe(
              res => {
                let alert = {
                  type: 'success',
                  title: 'Component Updated',
                }
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

    if (data.is_required || data.is_required == "Y") {
      data.is_required = "Y";
      if (data.is_searchable || data.is_searchable == "Y") {
        data.is_searchable = "Y";
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
        data.is_searchable = "N";
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
      data.is_required = "N";
      if (data.is_searchable || data.is_searchable == "Y") {
        data.is_searchable = "Y";
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
        data.is_searchable = "N";
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


  inputClicked() {
    var nodelist = document.querySelectorAll('.form-ctrl');
    [].forEach.call(nodelist, (elm) => {
      elm.addEventListener('blur', function (event) {
        if (event.target.value != '') {
          event.target.parentNode.classList.add('has-value');
        } else {
          event.target.parentNode.classList.remove('has-value');
        }
      });
    });
  }

}


@Pipe({ name: 'checkBoxConverter' })
export class CheckBoxConverter implements PipeTransform {
  transform(value: any, exponent: any): any {
    switch (value) {

      case 1: {
        return "textbox";
      }
      case 2: {
        return "checkbox";
      }
      case 3: {
        return "dropdown";
      }
      case 4: {
        return "multiselect";
      }
      default: {
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
        break;
      }
    }
  }
}


@Pipe({ name: 'booleanConverter' })
export class BooleanConverter implements PipeTransform {
  transform(value: any, exponent: any): any {
    switch (value) {

      case true: {
        return "Y";
      }
      case false: {
        return "N";
      }
      case "Y": {
        return "Y";
      }
      case "N": {
        return "N";
      }
      default: {
        if (value == true) {
          return "Y";
        }
        else if (value == false) {
          return "N";
        }
        else if (value == "Y") {
          return "Y";
        }
        else if (value == "N") {
          return "N";
        }
      }
    }
  }
}
