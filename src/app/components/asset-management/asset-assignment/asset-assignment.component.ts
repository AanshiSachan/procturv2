import { Component, OnInit, ViewChild } from '@angular/core';
import { MessageShowService } from '../../../services/message-show.service';
import { AuthenticatorService } from '../../../services/authenticator.service';
import { ProductService } from '../../../services/products.service';
import { HttpService } from '../../../services/http.service';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
declare var $;
import * as moment from 'moment';
import { RoleService } from '../../../services/user-management/role.service';
import { ExcelService } from '../../../services/excel.service';
import { ExportToPdfService } from '../../../services/export-to-pdf.service';
@Component({
  selector: 'app-asset-assignment',
  templateUrl: './asset-assignment.component.html',
  styleUrls: ['./asset-assignment.component.scss']
})
export class AssetAssignmentComponent implements OnInit {

  headerSetting: any;
  tableSetting: any;
  rowColumns: any;
  sizeArr: any[] = [25, 50, 100, 150, 200, 500, 1000];
  pageIndex: number = 1;
  totalRecords: number = 0;
  displayBatchSize: number = 25;
  staticPageData: any = [];
  staticPageDataSouece: any = [];
  isedit: any;
  assignedAssetAllData: any = [];
  searchParams: any;
  startDate: string;
  endDate: string;
  purchaseby: any = [];
  assetcategoryData: any = [];
  assetAllData: any = [];
  locationAllData: any = [];
  totalRow: any;
  tempLocationList: any;
  assignDataforDownload=[];
  rolesListDataSource: any = [];
  model = {
    id: '',
    asset_id: '',
   check_out_date: '',
    due_date: '',
    institute_id: sessionStorage.getItem('institute_id'),
    note: '',
    quantity: '',
    status: 'IN_STORAGE',
    check_in_date: '',
    user_type: '',
    check_out_user_id: '',
    category_id: ''

  }
  constructor(private httpService: ProductService,
    private auth: AuthenticatorService,
    private router: Router,
    private msgService: MessageShowService,
    private temp: HttpService,
    private apiService: RoleService,
    private _pdfService: ExportToPdfService,
    private excelService: ExcelService) { }


  ngOnInit(): void {
    this.setTableData();
    this.getCategoryDetails();
    this.getAssetDetails();
    //this.getCheckOutBy();
    this.getRolesList();
    this.getAssignDetails();
  }
  setTableData() {
    this.headerSetting = [
      // {
      //   primary_key: 'id',
      //   value: "Id",
      //   charactLimit: 25,
      //   sorting: true,
      //   visibility: true
      // },
      {
        primary_key: 'asset_name',
        value: "Asset",
        charactLimit: 25,
        sorting: true,
        visibility: true
      },
     
      
      {
        primary_key: 'quantity',
        value: "Assign Qty",
        charactLimit: 25,
        sorting: true,
        visibility: true
      },
      {
        primary_key: 'user_type',
        value: "Role",
        charactLimit: 25,
        sorting: true,
        visibility: true
      },
      {
        primary_key: 'check_out_user_display_name',
        value: "Check out By",
        charactLimit: 25,
        sorting: true,
        visibility: true
      },
      {
        primary_key: 'check_in_date',
        value: "Check In Date",
        charactLimit: 25,
        sorting: false,
        visibility: true
      },
      {
        primary_key: 'check_out_date',
        value: "Check Out Date",
        charactLimit: 25,
        sorting: true,
        visibility: true
      },
      {
        primary_key: 'due_date',
        value: "Due Date",
        charactLimit: 25,
        sorting: true,
        visibility: true
      },
      {
        primary_key: 'note',
        value: "Note",
        charactLimit: 25,
        sorting: false,
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
      // {
      //   width: "10%",
      //   textAlign: "left"
      // },
      {
        width: "10%",
        textAlign: "left"
      },
      
      {
        width: "10%",
        textAlign: "left"
      },
      {
        width: "10%",
        textAlign: "left"
      },
      {
        width: "12%",
        textAlign: "left"
      },
      {
        width: "12%",
        textAlign: "left"
      },
      {
        width: "12%",
        textAlign: "left"
      },
      {
        width: "12%",
        textAlign: "left"
      },
      {
        width: "12%",
        textAlign: "left"
      },
      {
        width: "10%",
        textAlign: "left"
      },


    ]
  }

  fetchTableDataByPage(index) {
    this.pageIndex = index;
    let startindex = this.displayBatchSize * (index - 1);
    this.staticPageData = this.getDataFromDataSource(startindex);
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

  getDataFromDataSource(startindex) {
    this.getAssignDetails();
  }
  updateTableBatchSize(event) {
    this.pageIndex = 1;
    this.displayBatchSize = event;
    this.fetchTableDataByPage(this.pageIndex);
  }
  //save asset purchase details
  @ViewChild('assetAssignmentForm', { static: false }) assetAssignmentForm: NgForm;
  saveAssetAssignDetails() {
    if (this.assetAssignmentForm.valid) {
     this.model.due_date = this.model.due_date ? moment(this.model.due_date).format("YYYY-MM-DD"): '';
      this.model.check_in_date = this.model.check_in_date ? moment(this.model.check_in_date).format("YYYY-MM-DD"): '';
      this.model.check_out_date = moment(this.model.check_out_date).format("YYYY-MM-DD");
        this.httpService.postMethod('api/v2/asset/assignment/create', this.model).then((res) => {
        this.msgService.showErrorMessage(this.msgService.toastTypes.success, '', "Assigned Successfully");
       this.getAssignDetails();
        this.cancel(false);
        $('#modelforassetAssign').modal('hide');
      },
        err => {
          this.msgService.showErrorMessage(this.msgService.toastTypes.error, '', err.error.error[0].error_message);
       
        })
    }
    else {
      this.msgService.showErrorMessage(this.msgService.toastTypes.error, '', "Please fill all mandatory field");
    
    }

  }
  //get asset details

  getAssignDetails() {
    this.auth.showLoader();
    this.httpService.getMethod('api/v2/asset/assignment/all?pageOffset=' + this.pageIndex + '&pageSize=' + this.displayBatchSize + '&instituteId=' + this.model.institute_id, null).subscribe(
      (res: any) => {
       this.assignedAssetAllData = res.result.response;
        this.staticPageData = res.result.response;
        this.tempLocationList = res.result.response;
        this.totalRecords = res.result.total_elements;
        this.auth.hideLoader()
      },
      err => {
        this.auth.hideLoader();
      }
    );
  }

  editRow(object) {
    this.assetAllData=[];
    this.isedit = true;
    this.model.id = object.data.id;
    this.model.asset_id = object.data.asset_id;
   this.model.check_out_date = object.data.check_out_date;
    this.model.check_in_date = object.data.check_in_date;
    this.model.due_date = object.data.due_date;
    this.model.institute_id = object.data.institute_id;
    this.model.quantity = object.data.quantity;
    this.model.status = object.data.status;
    this.model.user_type = object.data.user_type;
    this.model.note = object.data.note;
    this.model.category_id = object.data.category_id;
    this.model.check_out_user_id = object.data.check_out_user_id;
    this.getassetsAndLocation(this.model.category_id);
    $('#modelforassetAssign').modal('show');
    //this.getRolesList();
    this.getCheckOutBy(this.model.user_type);
  }
  tempObj
  deleteRowConfirm(object){
this.tempObj =object.data.id;
$('#deletesModal').modal('show');
  }
  deleteRow(obj) {
    // let deleteconfirm = confirm("Are you really want to delete?");
    // if (deleteconfirm == true) {
    this.auth.showLoader();
    this.httpService.deleteMethod('/api/v2/asset/assignment/delete/' + obj + '?instituteId=' + this.model.institute_id).then(
      (res: any) => {
        this.auth.hideLoader();
        this.msgService.showErrorMessage('success', '', ' Deleted Successfully');
        $('#deletesModal').modal('hide');
        this.getAssignDetails();
      },
      err => {
            this.msgService.showErrorMessage(this.msgService.toastTypes.error, '', err.error[0].error_message);
            
        this.auth.hideLoader();
      }
    );
   // }
  }

  updateAssetAssignDetails() {
    if(this.assetAssignmentForm.valid){
      this.model.due_date = this.model.due_date ? moment(this.model.due_date).format("YYYY-MM-DD"): '';
      this.model.check_in_date = this.model.check_in_date ? moment(this.model.check_in_date).format("YYYY-MM-DD"): '';
      this.model.check_out_date = moment(this.model.check_out_date).format("YYYY-MM-DD");
    this.httpService.putMethod('api/v2/asset/assignment/update', this.model).then(() => {
      this.msgService.showErrorMessage(this.msgService.toastTypes.success,'',"Updated Successfully")
      this.cancel(false)
      $('#modelforassetAssign').modal('hide');
      this.getAssignDetails();
     },
      err => {
            this.msgService.showErrorMessage(this.msgService.toastTypes.error, '', err.error.error[0].error_message);
        
        this.auth.hideLoader();

      })
   }
    else{
      this.msgService.showErrorMessage(this.msgService.toastTypes.error, '', "Please fill all mandatory field")
    }
  }
  cancel(param) {
    this.isedit = false;
    this.model = {
      id: '',
      asset_id: '',
     check_out_user_id: '',
      check_in_date: '',
      check_out_date: '',
      due_date: '',
      institute_id: sessionStorage.getItem('institute_id'),
      note: '',
      quantity: '',
      status: 'IN_STORAGE',
      user_type: '',
      category_id: ''
    }
    this.assetAssignmentForm.resetForm(this.model);
  }
  searchDatabase() {
   if (this.searchParams == undefined || this.searchParams == null) {
      this.searchParams = "";
      this.staticPageData = this.tempLocationList;
    }
    else {
      this.auth.showLoader();
      this.httpService.getMethod('api/v2/asset/assignment/search?searchString='+this.searchParams + '&instituteId='+this.model.institute_id, null).subscribe(
        (res: any) => {
          this.staticPageData = res.result.response;
          this.tempLocationList = res.result.response;
          this.totalRecords = res.result.total_elements;
          this.auth.hideLoader();
          if(this.staticPageData.length==0){
            this.msgService.showErrorMessage(this.msgService.toastTypes.info, '', "No Data Found");
          }
        },
        err => {
          this.auth.hideLoader();
        }
      );
      let searchData = this.tempLocationList.filter(item =>
        Object.keys(item).some(
          k => item[k] != null && item[k].toString().toLowerCase().includes(this.searchParams.toLowerCase()))
      );
      this.staticPageData = searchData;
      this.totalRecords=this.staticPageData;
    }
  }

  //date range
  dateRangeChange(e) {
    this.startDate = moment(e[0]).format("YYYY-MM-DD");
    this.endDate = moment(e[1]).format("YYYY-MM-DD");
  
  }

  getCategoryDetails() {
    this.httpService.getMethod('api/v2/asset/category/all?all=1&instituteId=' + this.model.institute_id, null).subscribe((res: any) => {
      this.assetcategoryData = res.result.response;
    },
      err => {
        this.auth.hideLoader();
      })

  }
  //get asset and cat
  getassetsAndLocation(category_id) {
    if(this.model.category_id!=''){
      this.auth.showLoader();
      let key = this.assetcategoryData.filter(id => (id.id == category_id));
    let key_name = key[0].category_name;
    console.log(key_name)
    this.httpService.getMethod('api/v2/asset/getAssetsWithCategoryName?categoryIdList=' + category_id + '&instituteId=' + this.model.institute_id, null).subscribe((res: any) => {
     
      this.assetAllData = res.result[key_name];
      this.auth.hideLoader();
      if(this.assetAllData.length==0){
        this.msgService.showErrorMessage(this.msgService.toastTypes.info, '', "Asset not available under this category first create asset against this category")
  
      }
      console.log(this.assetAllData)
     },
      err => {
        this.auth.hideLoader();
      })

    }
    

  }

  getLocationData(obj) {
   let key = this.assetAllData.filter(id => (id.id == obj));
   let location_name = key[0].location_names_string.split(',');
    for (let i = 0; i < key[0].location_ids.length; i++) {
      this.locationAllData.push({ 'location_id': key[0].location_ids[i], 'location_name': location_name[i] });
    }
}
  //

  getAssetDetails() {
    this.httpService.getMethod('api/v2/asset/all?all=1&instituteId=' + this.model.institute_id, null).subscribe(
      (res: any) => {
     },
      err => {
        this.auth.hideLoader();
      }
    );
  }
  //purchaseby
  // getCheckOutBy() {
  //   this.temp.getData('/api/v1/profiles/' + this.model.institute_id + '/user-by-type?type=3,0').subscribe(
  //     (res: any) => {
  //      this.purchaseby = res.active_users;
  //     },
  //     err => {
  //       this.auth.hideLoader();
  //     }
  //   );
  // }


  // getRolesList() {
  //   this.apiService.getRoles().subscribe(
  //     (res: any) => {
  //       this.rolesListDataSource = res;
  //       this.totalRow = res.length;
  //    },
  //     err => {
  //    }
  //   )
  // }
//if changes required
role_id;
getCheckOutBy(obj) {
    this.role_id=obj;
    if(this.role_id!=undefined){
      this.temp.getData('/api/v1/inventory/sale/' + this.model.institute_id + '/getUserByRole?roleIds=' + this.role_id).subscribe(
        (res: any) => {
         this.purchaseby = res.result;
        },
        err => {
          this.auth.hideLoader();
        }
      );
    }
    
  }


getRolesList() {
  this.purchaseby=[];
 this.temp.getData('/api/v1/roleApi/allRoles/'+this.model.institute_id).subscribe(
    (res: any) => {
      this.rolesListDataSource = res;
      this.totalRow = res.length;
   },
    err => {
   }
  )
}
  downloadPdf() {
    this.httpService.getMethod('api/v2/asset/assignment/all?all=1&instituteId=' + this.model.institute_id, null).subscribe(
      (res: any) => {
        this.assignDataforDownload = res.result.response;
        let arr = [];
   for(let i=0;i<this.assignDataforDownload.length;i++){
     this.assignDataforDownload[i].id =i +1;
   }
    this.assignDataforDownload.map(
      (ele: any) => {
        let json = [
          // ele.id,
         ele.asset_name,
          ele.quantity,
          ele.user_type,
          ele.check_out_user_display_name,
          ele.check_in_date,
          ele.check_out_date,
          ele.due_date,
          ele.note,
   ]
        arr.push(json);
      })

    let rows = [];
    rows = [['Asset Name', ' Quantity', ' Role','Check Out By','Check in Date ','Check Out Date ','Due Date','Note']]
    let columns = arr;
    this._pdfService.exportToPdf(rows, columns, 'Asset_Assign_List');
    this.auth.hideLoader();
    },
      err => {
        this.auth.hideLoader();
      }
      
    );
    
  }
//download in excel format
headersettingforexcel:any=[  {
  primary_key: 'asset_name',
  value: "Asset",
  charactLimit: 25,
 
},


{
  primary_key: 'quantity',
  value: "Assign Qty",
  charactLimit: 25,
 
},
{
  primary_key: 'user_type',
  value: "Role",
  charactLimit: 25,
  
},
{
  primary_key: 'check_out_user_display_name',
  value: "Check out By",
  charactLimit: 25,
 
},
{
  primary_key: 'check_in_date',
  value: "Check In Date",
  charactLimit: 25,
 
},
{
  primary_key: 'check_out_date',
  value: "Check Out Date",
  charactLimit: 25,
 
},
{
  primary_key: 'due_date',
  value: "Due Date",
  charactLimit: 25,

},
{
  primary_key: 'note',
  value: "Note",
  charactLimit: 25,

}]
exportToExcel(){
  this.httpService.getMethod('api/v2/asset/assignment/all?all=1&instituteId=' + this.model.institute_id, null).subscribe(
    (res: any) => {
      this.auth.showLoader();
      this.assignDataforDownload= res.result.response;
      let Excelarr = [];
      this.assignDataforDownload.map(
      (ele: any) => {
        let json = {}
        this.headersettingforexcel.map((keys) => {
          json[keys.value] = ele[keys.primary_key]
        })
        Excelarr.push(json);
      }
    )
    this.excelService.exportAsExcelFile(
      Excelarr,
      'asset_assign'
    );
      this.auth.hideLoader();
  },
    err => {
      this.auth.hideLoader();
    }
    
  );
  this.auth.hideLoader();
}
maxlenth(data,limit){
  if(data.length>limit){
    this.msgService.showErrorMessage(this.msgService.toastTypes.info, '', "Please Enter upto"+  " " + limit + " "+ "character only");
  }
}
}
