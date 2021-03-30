import { Component, OnInit, ViewChild } from '@angular/core';
import { MessageShowService } from '../../../services/message-show.service';
import { HttpService  } from '../../../services/http.service';
import { AuthenticatorService } from '../../../services/authenticator.service';
import { NgForm } from '@angular/forms';
import { Category ,Item} from './item';

declare var $;
@Component({
  selector: 'app-item-cm',
  templateUrl: './item-cm.component.html',
  styleUrls: ['./item-cm.component.scss']
})
export class ItemCmComponent implements OnInit {
  isedit = false;
 category_model:Category =new Category();
 headerSetting: any;
 tableSetting: any;
 rowColumns: any;
 pagedclassRoomData: any[] = [];
 searchData: any = [];
 classRoomData: any = [];
 sizeArr: any[] = [25, 50, 100, 150, 200, 500, 1000];
searchText: string = "";
 pageIndex: number = 1;
 displayBatchSize: number = 25;
totalRow: number = 0;
 searchflag: boolean = false;
  url = `/api/v1/inventory/`;
 type: string = '';
 activeSession: any = 'onev';
 categoryAllData:any=[];
  constructor(private msgService: MessageShowService,
    private httpService: HttpService,
    private auth:AuthenticatorService) { 
    this.category_model.institution_id =sessionStorage.getItem('institution_id')
   }

  ngOnInit(): void {
   this.getCategoryDetails();
   this.setTableData();
    
  }
  isaddcat:boolean=true;
  is_add_item:boolean=false;

  toggle(id,param) {
    this.activeSession = id;
    this.isaddcat= !param;
    this.is_add_item= param;
  }
  
  @ViewChild('catForm', { static: false }) catForm: NgForm;
  saveCategoryDetails(){
  if(this.catForm.valid){
  this.auth.showLoader();
  this.httpService.postData(this.url + 'category/',this.category_model).subscribe(
    (res: any) => {
      $('#addModal').modal('hide');
     this.auth.hideLoader();
      this.getCategoryDetails();
      if(res.statusCode == 200){
        this.msgService.showErrorMessage(this.msgService.toastTypes.success, '', 'Category added successfully');
        this.getCategoryDetails();
      }
    },
    err => {
      this.auth.hideLoader();
      this.msgService.showErrorMessage(this.msgService.toastTypes.error, '', err.error.message);
    }
  )
}
else{
  this.msgService.showErrorMessage(this.msgService.toastTypes.error, '', 'Category name is mandatory'); 
}
   
  }


  editRow(object) {
    this.isedit = true;
   this.category_model.id = object.data.id;
   this.category_model.institution_id = object.data.institution_id;
   this.category_model.category_name = object.data.category_name;
   this.category_model.desc = object.data.desc;
   this.category_model.category_id=object.data.category_id;
  $('#addModal').modal('show');
  }

  updateLocationDetails() {
    let obj ={
     id:this.category_model.id,
     institution_id:  this.category_model.institution_id,
     category_name : this.category_model.category_name,
     desc :  this.category_model.desc,
     category_id:this.category_model.category_id
    }
  if (this.catForm.valid) {
     this.httpService.putData(this.url + 'category',obj).subscribe(() => {
      $('#addModel').modal('hide');
      this.msgService.showErrorMessage(this.msgService.toastTypes.success, '', " Catagory is Updated Successfully")
        this.getCategoryDetails();
      },
        err => {
          this.msgService.showErrorMessage(this.msgService.toastTypes.error, '',err.error.message);
         this.auth.hideLoader();
        })
    }
    else {
      this.msgService.showErrorMessage(this.msgService.toastTypes.error, '', "All fields Required")
    }
  }
 cancel(param) {
   this.catForm.resetForm();
    this.isedit = param;
    // this.model.location_code = '';
    // this.model.location_description = '';
    // this.model.location_name = '';

  }
  deleteRow(obj) {debugger
    $('#deleteModal').modal('show');
   let deleteconfirm =  confirm("Are you really want to delete?");
    if (deleteconfirm == true) {
     // this.auth.showLoader();
      this.httpService.deleteData(this.url + 'category/'+ obj.data.category_id ,null).subscribe(
        (res: any) => {
          this.auth.hideLoader();
          this.msgService.showErrorMessage('success', '', 'Category Deleted Successfully');
          this.getCategoryDetails();
        },
        err => {
          this.msgService.showErrorMessage('error', '', 'Category can not be  deleted some item linked to this category');
          this.auth.hideLoader();
        }
      );
    }
  }

  /*==========================================table setting============*/

  setTableData() {
    this.headerSetting = [
      {
        primary_key: 'category_name',
        value: "Name",
        charactLimit: 25,
        sorting: true,
        visibility: true
      },

      {
        primary_key: 'desc',
        value: "Description",
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
        view: false,
        edit: true,
        delete: true,
      },
    ]
    this.tableSetting = {
      width: "100%",
      height: "58vh"
    }

    this.rowColumns = [
      {
        width: "45%",
        textAlign: "left"
      },
      {
        width: "45%",
        textAlign: "left"
      },
      {
        width: "15%",
        textAlign: "left"
      },

    ]
  }

  /* ==========================================pagination=============*/
  fetchTableDataByPage(index) {
    this.pageIndex = index;
    let startindex = this.displayBatchSize * (index - 1);
    this.pagedclassRoomData = this.getClassRoomTableFromSource(startindex);
  }

  fetchNext() {
    this.pageIndex++;
    this.fetchTableDataByPage(this.pageIndex);
  }

  fetchPrevious() {
    if (this.pageIndex != 1) {
      this.pageIndex--;
      this.fetchTableDataByPage(this.pageIndex);
    }
  }

  getClassRoomTableFromSource(startindex) {
    if (this.searchflag) {
      let t = this.searchData.slice(startindex, startindex + this.displayBatchSize);
      return t;
    } else {
      let t = this.classRoomData.slice(startindex, startindex + this.displayBatchSize);
      return t;
    }
  }
  
  
  //searchData
  searchDatabase() {

    if (this.searchText != "" && this.searchText != null) {
      this.pageIndex = 1;
      let searchRes: any;

      searchRes = this.classRoomData.filter(item =>
        Object.keys(item).some(
          k => item[k] != null && item[k].toString().toLowerCase().includes(this.searchText.toLowerCase()))
      );
      this.searchData = searchRes;
      this.totalRow = searchRes.length;
      this.searchflag = true;
      this.fetchTableDataByPage(this.pageIndex);
    }
    else {
      this.searchflag = false;
      this.fetchTableDataByPage(this.pageIndex);
      this.totalRow = this.classRoomData.length;

    }
  }

arr:any=[];
getCategoryDetails() {
     this.auth.showLoader();
      this.httpService.getData(this.url+'category/all/'+this.category_model.institution_id).subscribe(
        (res: any) => {
          this.auth.hideLoader();
          //let obj =Object.keys(res)
          // console.log(res)
        //  console.log(res.length) 
        //   for (let data in res){
         this.classRoomData = res;
            console.log("cat-data" , this.classRoomData)
        //   }
       
        this.totalRow = res.length;
        this.fetchTableDataByPage(this.pageIndex);
          this.auth.hideLoader();
        },
        err => {
          this.auth.hideLoader();
        }
      );
  }
}
