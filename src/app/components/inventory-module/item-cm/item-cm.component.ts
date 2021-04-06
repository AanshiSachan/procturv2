import { Component, OnInit, ViewChild } from '@angular/core';
import { MessageShowService } from '../../../services/message-show.service';
import { HttpService } from '../../../services/http.service';
import { AuthenticatorService } from '../../../services/authenticator.service';
import { NgForm } from '@angular/forms';
import { Category, Item } from './item';
import { ExportToPdfService } from '../../../services/export-to-pdf.service';
import { ExcelService } from '../../../services/excel.service';
declare var $;
@Component({
  selector: 'app-item-cm',
  templateUrl: './item-cm.component.html',
  styleUrls: ['./item-cm.component.scss']
})
export class ItemCmComponent implements OnInit {
  activeSession: any = 'onev';
  arr: any = [];
  category_model: Category = new Category();
  categoryAllData: any = [];
  classRoomData: any = [];
  CourseList:any=[];
  displayBatchSize: number = 25;
  headerSetting: any;
  is_add_item: boolean = false;
  isaddcat: boolean = true;
  isedit = false;
  item:Item =new Item();
  itemAllData:any =[];
  masterCourseList: any = [];
  pagedclassRoomData: any[] = [];
  pagedItemData:any[]=[];
  pageIndex: number = 1;
  pageIndexforItem: number = 1;
  rowColumns: any;
  searchData: any = [];
  searchflag: boolean = false;
  searchText: string = "";
  sizeArr: any[] = [25, 50, 100, 150, 200, 500, 1000];
  tableSetting: any;
  totalItemRow:number=0;
  totalRow: number = 0;
  type: string = '';
  url = `/api/v1/inventory/`;
  constructor(private msgService: MessageShowService,
    private httpService: HttpService,
    private auth: AuthenticatorService,
    private _pdfService: ExportToPdfService,
    private excelService: ExcelService) {
    this.category_model.institution_id = sessionStorage.getItem('institution_id');
    this.item.institution_id = sessionStorage.getItem('institution_id');
    this.getSubBranches();
  }

  ngOnInit(): void {
    this.getCategoryDetails();
    this.setTableData();
    this.getAllMasterCourseList();
    this.getItemDetails();

  }
 toggle(id, param) {
    this.activeSession = id;
    this.isaddcat = !param;
    this.is_add_item = param;
  }

  @ViewChild('catForm', { static: false }) catForm: NgForm;
  @ViewChild('itemForm', { static: false }) itemForm: NgForm;
  @ViewChild('allcateForm', { static: false }) allcateForm: NgForm;
  @ViewChild('history', { static: false }) history: NgForm;

  /*======================================CRUD For Category===============*/
  saveCategoryDetails() {
    if (this.catForm.valid) {
      delete(this.category_model.id)
            this.httpService.postData(this.url + 'category/', this.category_model).subscribe(
        (res: any) => {
          $('#addModal').modal('hide');
          this.auth.hideLoader();
          this.getCategoryDetails();
          if (res.statusCode == 200) {
            this.msgService.showErrorMessage(this.msgService.toastTypes.success, '', 'A new category has been created in the system');
            this.getCategoryDetails();
          }
        },
        err => {
          this.auth.hideLoader();
          this.msgService.showErrorMessage(this.msgService.toastTypes.error, '', err.error.message);
        }
      )
    }
    else {
      this.msgService.showErrorMessage(this.msgService.toastTypes.error, '', 'Category name is mandatory');
    }

  }
  getCategoryDetails() {
    //this.auth.showLoader();
    this.httpService.getData(this.url + 'category/all/' + this.category_model.institution_id).subscribe(
      (res: any) => {
        this.auth.hideLoader();
        this.categoryAllData =res;
        this.classRoomData = res;
        this.totalRow = res.length;
        this.fetchTableDataByPage(this.pageIndex);
        this.auth.hideLoader();
      },
      err => {
        this.auth.hideLoader();
      }
    );
  }

  editRow(object) {
    this.isedit = true;
    this.category_model.id = object.data.id;
    this.category_model.institution_id = object.data.institution_id;
    this.category_model.category_name = object.data.category_name;
    this.category_model.desc = object.data.desc;
    this.category_model.category_id = object.data.category_id;
    $('#addModal').modal('show');
  }

  updateCategoryDetails() {
    let obj = {
      id: this.category_model.id,
      institution_id: this.category_model.institution_id,
      category_name: this.category_model.category_name,
      desc: this.category_model.desc,
      category_id: this.category_model.category_id
    }
    if (this.catForm.valid) {
      this.httpService.putData(this.url + 'category', obj).subscribe(() => {
        $('#addModel').modal('hide');
        this.msgService.showErrorMessage(this.msgService.toastTypes.success, '', " Category has been edited from Previous details to Current edited details")
        this.getCategoryDetails();
      },
        err => {
          this.msgService.showErrorMessage(this.msgService.toastTypes.error, '', err.error.message);
          this.auth.hideLoader();
        })
    }
    else {
      this.msgService.showErrorMessage(this.msgService.toastTypes.error, '', "All fields Required")
    }
  }
  cancel(param) {
    this.category_model ={
      category_name:'',
      desc:'',
      institution_id:sessionStorage.getItem('institution_id'),
      id:'',
      category_id:''
    }
    this.item ={
      category_name:'',
      standard_name:'',
      alloted_units:'',
      category_id:'',
      desc:'',
      institution_id:sessionStorage.getItem('institution_id'),
      item_id:'',
      item_name:'',
      out_of_stock_indicator_units:'',
      sale_price:'',
      standard_id:'',
      subject_id:'',
      tax_percent:'',
      unit_cost:'',
      subject_name:'',
    }
    this.catForm.resetForm(this.category_model);
    this.itemForm.resetForm(this.item);
    this.history.resetForm()
    this.isedit = false;

  }
  deleteRow(obj) {
    // $('#deleteModal').modal('show');
    let deleteconfirm = confirm("Are you really want to delete?");
    if (deleteconfirm == true) {
      this.auth.showLoader();
      this.httpService.deleteData(this.url + 'category/' + obj.data.category_id, null).subscribe(
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

  /*======================================CRUD For Item===============*/

saveItemDetails(){
 if(this.itemForm.valid){
    this.httpService.postData(this.url + 'item', this.item).subscribe(
      (res: any) => {
         $('#itemModal').modal('hide');
        this.auth.hideLoader();
        this.getItemDetails();
        if (res.statusCode == 200) {
          this.msgService.showErrorMessage(this.msgService.toastTypes.success, '', 'Item' + '' + this.item.item_name + ''+ 'is added succesfully');
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
  this.msgService.showErrorMessage(this.msgService.toastTypes.error, '', "Please fill all manadatory fields"); 
 }
}
//get item data
getItemDetails() {
 // this.auth.showLoader();
  this.httpService.getData(this.url + 'item/all/' + this.category_model.institution_id).subscribe(
    (res: any) => {
      this.auth.hideLoader();
      this.itemAllData =res;
      // this.classRoomData = res;
      this.totalItemRow = res.length;
       this.fetchTableDataByPageforItem(this.pageIndex);
      this.auth.hideLoader();
    },
    err => {
      this.auth.hideLoader();
    }
  );
}
//edit items
editItem(data){
this.isedit = true;
this.item.standard_name =data.standard_name;
this.item.item_id=data.item_id;
this.item.category_id =data.category_id;
this.item.item_name =data.item_name;
this.item.desc =data.desc;
this.item.alloted_units =data.alloted_units;
this.item.unit_cost =data.unit_cost;
this.item.sale_price =data.sale_price;
this.item.tax_percent =data.tax_percent;
this.item.out_of_stock_indicator_units =data.out_of_stock_indicator_units;
this.item.institution_id =data.institution_id;
this.item.standard_id =data.standard_id;
this.item.subject_id =data.subject_id;
this.item.standard_id=data.standard_name;
this.item.subject_name =data.subject_name;
}
//update item
updateItemDetails(){
  let obj = {
    item_id: this.item.item_id,
    institution_id: sessionStorage.getItem('institution_id'),
    item_name:this.item.item_name,
    desc:this.item.desc,
    category_id:this.item.category_id,
    alloted_units:this.item.alloted_units,
    unit_cost:this.item.unit_cost,
    sale_price:this.item.sale_price,
    tax_percent:this.item.tax_percent,
    out_of_stock_indicator_units:this.item.out_of_stock_indicator_units,
    standard_id:this.item.standard_id,
    subject_id:this.item.subject_id,
    standard_name:this.item.standard_name,
    subject_name:this.item.subject_name,
  }
  if (this.itemForm.valid) {
    this.httpService.putData(this.url + 'item', obj).subscribe(() => {
      $('#itemModal').modal('hide');
      this.msgService.showErrorMessage(this.msgService.toastTypes.success, '', " Item is Updated Successfully")
      this.getItemDetails();
   },
      err => {
        this.msgService.showErrorMessage(this.msgService.toastTypes.error, '', err.error.message);
        this.auth.hideLoader();
      })
  }
  else {
    this.msgService.showErrorMessage(this.msgService.toastTypes.error, '', "All fields Required")
  }

}
tempObj={
  item_id:'',
  item_name:''
}
showConfirm(obj) {
  this.tempObj=obj;
  this.tempObj.item_id =obj.item_id
  $('#deleteitemModal').modal('show');
}
showConfirmdelete(obj){
  this.tempObj=obj;
  this.tempObj.item_id =obj.item_id
  $('#deleteModal').modal('show');
}
//delete
deleteItem(obj) {
    //this.auth.showLoader();
    this.httpService.deleteData(this.url + 'item/' + obj.item_id, null).subscribe(
      (res: any) => {
        this.auth.hideLoader();
        this.msgService.showErrorMessage('success', '', 'Item Deleted Successfully');
        this.getItemDetails();
        $('#deleteitemModal').modal('hide');
        $('#deleteModal').modal('hide');
      },
      err => {
        this.msgService.showErrorMessage('error', '', err.error.message);
        this.auth.hideLoader();
      }
    );

}
showAllocationHistory(obj){
  this.tempObj=obj;
  this.tempObj.item_id =obj.item_id
  $('#historyModal').modal('show');
  this.getAllocationHistrory(obj.item_id);
}
/*======================================APi Clla For Item===============*/
getAllMasterCourseList() {
  // this.auth.showLoader();
    this.httpService.getData('/api/v1/standards/all/'+this.item.institution_id +'?active=Y').subscribe(
      res => {
        this.masterCourseList = res;
        this.auth.hideLoader();
      },
      err => {
        //console.log(err);
      }
    )
  
}
onMasterCourseSelection(standard_id){
  if(standard_id==undefined){

  }
  else{
   // this.auth.showLoader();
    this.httpService.getData('/api/v1/subjects/standards/'+ standard_id).subscribe(
      res => {
        this.CourseList = res;
        this.auth.hideLoader();
      },
      err => {
        //console.log(err);
      }
    )
  }
 
}

   /*======================================Table setting For Category===============*/
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

  /* ==========================================pagination for category=============*/
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

 /* ==========================================pagination for item=============*/

  fetchTableDataByPageforItem(index) {
    this.pageIndexforItem = index;
    let startindex = this.displayBatchSize * (index - 1);
    this.pagedItemData = this.getItemTableFromSource(startindex);
  }
  fetchNextItem() {
    this.pageIndexforItem++;
    this.fetchTableDataByPageforItem(this.pageIndexforItem);
  }
  fetchPreviousItem() {
    if (this.pageIndexforItem != 1) {
      this.pageIndexforItem--;
      this.fetchTableDataByPageforItem(this.pageIndexforItem);
    }
  }
  getItemTableFromSource(startindex) {
    if (this.searchflag) {
      let t = this.searchData.slice(startindex, startindex + this.displayBatchSize);
      return t;
    } else {
      let t = this.itemAllData.slice(startindex, startindex + this.displayBatchSize);
      return t;
    }
  }

  /* ==========================================Search for category=============*/

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
  searchTextforItem:string ;
 /* ==========================================pagination for Item=============*/
 searchDatabaseforItem() {
 if (this.searchTextforItem != "" && this.searchTextforItem != null) {
      this.pageIndexforItem = 1;
      let searchRes: any;

      searchRes = this.itemAllData.filter(item =>
        Object.keys(item).some(
          k => item[k] != null && item[k].toString().toLowerCase().includes(this.searchTextforItem.toLowerCase()))
      );
      this.searchData = searchRes;
      this.totalItemRow = searchRes.length;
      this.searchflag = true;
      this.fetchTableDataByPageforItem(this.pageIndexforItem);
    }
    else {
      this.searchflag = false;
      this.fetchTableDataByPageforItem(this.pageIndexforItem);
      this.totalItemRow = this.itemAllData.length;

    }
  }
 /* ==========================================Download Data for category=============*/
  categoryDataForDownload=[
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
  ]
  //download pdf
  downloadPdf() {
    let arr =[];
  this.categoryAllData.map(
      (ele: any) => {
        let json = [
          ele.category_name,
          ele.desc,
       ]
        arr.push(json);
      })

    let rows = [];
    rows = [['Name',  ' Description']]
    let columns = arr;
    this._pdfService.exportToPdf(rows, columns, 'category List');
    this.auth.hideLoader();
  }
//download in excel format
exportToExcel(){
 let Excelarr = [];
      this.categoryAllData.map(
      (ele: any) => {
        let json = {}
        this.categoryDataForDownload.map((keys) => {
          json[keys.value] = ele[keys.primary_key]
        })
        Excelarr.push(json);
      }
    )
    this.excelService.exportAsExcelFile(
      Excelarr,
      'inventory_category'
    );
     this.auth.hideLoader();

}
/* ==========================================Download Data for Item=============*/
downloadPdffoItem() {
  let arrforItem =[];
this.itemAllData.map(
    (ele: any) => {
      let json = [
        ele.item_name,
        ele.category_name,
        ele.alloted_units,
        ele.available_units,
        ele.unit_cost,
        ele.sale_price,
        ele.tax_percent,
        ele.out_of_stock_indicator_units,
     ]
     arrforItem.push(json);
    })

  let rows = [];
  rows = [['Item',  ' Category','Total Units','Available Units','Buying/Unit Price','Sale Price',
  'Taxes (%)','Low Stock indicator (Units)']]
  let columns = arrforItem;
  this._pdfService.exportToPdf(rows, columns, 'item List');
  this.auth.hideLoader();
}
ItemDataForDownload=[
  {
    primary_key: 'item_name',
    value: "Item",
   },
   {
    primary_key: 'category_name',
    value: "Category",
   },
   {
    primary_key: 'alloted_units',
    value: "Total Units",
   },
   {
    primary_key: 'available_units',
    value: "Available Units",
   },
   {
    primary_key: 'unit_cost',
    value: "Buying/Unit Price",
   },
   {
    primary_key: 'sale_price',
    value: "Sale Price",
   },
  {
    primary_key: 'tax_percent',
    value: "Taxes (%)",
  },
  {
    primary_key: 'out_of_stock_indicator_units',
    value: "Low Stock indicator (Units)",
  },
]
exportToExcelItem(){
  alert("hi")
 let Excelarr = [];
      this.itemAllData.map(
      (ele: any) => {
        let json = {}
        this.ItemDataForDownload.map((keys) => {
          json[keys.value] = ele[keys.primary_key]
        })
        Excelarr.push(json);
      }
    )
    this.excelService.exportAsExcelFile(
      Excelarr,
      'inventory_item'
    );
     this.auth.hideLoader();

}
//allocate to subbranch
allocatedata ={
    item_name:'',
    item_id:'',
    alloted_units:'',
    date_of_dispatch:'',
    available_units:'',
    sub_branch_id:'',
    // sub_branch_name:'',
    sub_branch_item_id:'',
    institution_id:sessionStorage.getItem('institution_id')
}
subBranchAllData:any=[];

allocateToSubBranch(data){
 // this.allocatedata.student_id=data.student_id;
this.allocatedata.item_id=data.item_id;
this.allocatedata.item_name=data.item_name;
this.allocatedata.available_units=data.available_units;
}
saveAllocatedData(){
  if(this.allcateForm.valid){
    // let date:any = new Date();
    // this.allocatedata.date_of_dispatch =date;
      
    // this.allocatedata.date_of_dispatch
    this.httpService.postData(this.url + 'item/allocate/subBranch', this.allocatedata).subscribe(
      (res: any) => {
         $('#subbranchModal').modal('hide');
        this.auth.hideLoader();
        this.getItemDetails();
        if (res.statusCode == 200) {
          this.msgService.showErrorMessage(this.msgService.toastTypes.success, '', 'Item Allocated successfully');
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
    this.msgService.showErrorMessage(this.msgService.toastTypes.error, '', "Please fill all manadatory fields");
     
  }
 
}
getSubBranches(){
  //this.auth.showloader()
  this.httpService.getData('/api/v1/institutes/all/subBranches/'+this.item.institution_id +'?active=Y').subscribe(
    res => {
      this.subBranchAllData = res;
      this.auth.hideLoader();
    },
    err => {
      //console.log(err);
    }
  )

}
itemfromSubbrach:any=[];
getItemAgainSubBranch(id){
  console.log(id)
  this.httpService.getData('/api/v1/inventory/item/all/100074').subscribe(
    res => {
      this.itemfromSubbrach = res;
      this.auth.hideLoader();
    },
    err => {
      //console.log(err);
    }
  )
}
allocationHistoryData:any =[]
getAllocationHistrory(id){
  console.log(id)
//this.auth.showLoader();
 this.httpService.getData('/api/v1/inventory/item/txHistory/'+id).subscribe(
  res => {
    this.allocationHistoryData = res;
    this.auth.hideLoader();
  },
  err => {
    //console.log(err);
  }
)
}
manageData={
  item_id:'',
  units_added:'',
  available_units:'',
  alloted_units:'',
  institution_id:sessionStorage.getItem('institution_id')

}
//manage units
manageUnit(data){
  this.manageData.item_id =data.item_id;
  this.manageData.available_units=data.available_units;
  this.manageData.alloted_units=data.alloted_units;
}
updataeManageUnit(){

  this.httpService.putData(this.url + 'item/stockUpdate', this.manageData).subscribe(() => {
    $('#manageunitModal').modal('hide');
    this.msgService.showErrorMessage(this.msgService.toastTypes.success, '', " Units Updated Successfully")
    this.getItemDetails();
  },
    err => {
      this.msgService.showErrorMessage(this.msgService.toastTypes.error, '', err.error.message);
      this.auth.hideLoader();
    })
}
}
