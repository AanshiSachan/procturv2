import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AuthenticatorService } from '../../../../services/authenticator.service';
import { HttpService } from '../../../../services/http.service';
import { MessageShowService } from '../../../../services/message-show.service';
declare var $;

@Component({
  selector: 'app-add-edit-category',
  templateUrl: './add-edit-category.component.html',
  styleUrls: ['./add-edit-category.component.scss']
})
export class AddEditCategoryComponent implements OnInit {

  jsonFlag = {
    isProfessional: false,
    institute_id: ''
  };

  addCategory = {
    Name: '',
    Description: '',
    isActive: true,
    category_id: '',
    expense_category_type: ''
  }

  editAccountDetails: any;
  account: any[] = [];
  showCategoryDropdown: any = '';

  @Output() closePopup = new EventEmitter<boolean>();
  @Input() isEditCategory: boolean;
  @Input() editCategory: any;

  constructor(
    private httpService: HttpService,
    private auth: AuthenticatorService,
    private msgService: MessageShowService,
  ) {
    this.jsonFlag.institute_id = sessionStorage.getItem('institution_id');
  }

  ngOnInit(): void {
    $('#addCategory').modal('show');
    // this.getCategoryDetails()
    if(sessionStorage.getItem('expense_category_type')) {
      this.showCategoryDropdown = false;
    } else {
      this.showCategoryDropdown = true;
    }
    if (this.isEditCategory) {
      this.setEditValues();
      this.showCategoryDropdown = false;
    }
  }

  setEditValues() {
    console.log(this.editCategory);
    this.addCategory.Name = this.editCategory.category_name;
    this.addCategory.Description = this.editCategory.category_desc;
    this.addCategory.isActive = (this.editCategory.is_active == 'Y') ? true : false;
    this.addCategory.category_id = this.editCategory.category_id;
    this.addCategory.expense_category_type = this.editCategory.expense_category_type
  }

  saveCategoryDetails() {
    if (this.addCategory.Name != '') {
      if((this.isEditCategory || !this.showCategoryDropdown) || this.addCategory.expense_category_type != '') {
      let obj: any = {
        category_name: this.addCategory.Name,
        category_desc: this.addCategory.Description,
        is_active: 'Y',
        expense_category_type:this.addCategory.expense_category_type

      }
      if (this.isEditCategory) {
        obj.category_id = this.addCategory.category_id;
        obj.is_active = (this.addCategory.isActive) ? 'Y' : 'N';
      } else {
        obj.institute_id = this.jsonFlag.institute_id;
        obj.expense_category_type = this.addCategory.expense_category_type;
        if(sessionStorage.getItem('expense_category_type')) {
          obj.expense_category_type = sessionStorage.getItem('expense_category_type');
        }
      }
      this.auth.showLoader();
      const url = !this.isEditCategory ? '/api/v1/expense/category/add' : '/api/v1/expense/category/update';
      if (this.isEditCategory) {
        this.httpService.putData(url, obj).subscribe(
          (res: any) => {
            this.auth.hideLoader();
            this.msgService.showErrorMessage('success', '', "Category Updated successfully");
            $('#addCategory').modal('hide');
            this.closePopups(false);
          },
          err => {
            this.auth.hideLoader();
            this.msgService.showErrorMessage(this.msgService.toastTypes.error, '', err.error.message);
          }
        )
      } else {
        this.httpService.postData(url, obj).subscribe(
          (res: any) => {
            this.auth.hideLoader();
            this.msgService.showErrorMessage('success', '', "Category added successfully");
            $('#addCategory').modal('hide');
            this.closePopups(false);
          },
          err => {
            this.auth.hideLoader();
            this.msgService.showErrorMessage(this.msgService.toastTypes.error, '', err.error.message);
          }
        )
      }
    } else {
      this.msgService.showErrorMessage('error', '', "Please Select Category type");
    }
    } else {
      this.msgService.showErrorMessage('error', '', "Please Enter Category Name");
    }
  }

  closePopups($event) {
    $('#addCategory').modal('hide');
    this.closePopup.emit(false);
  }

}
