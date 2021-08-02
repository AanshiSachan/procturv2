import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { ExportToPdfService } from '../../../services/export-to-pdf.service';
import { AuthenticatorService, HttpService, MessageShowService } from '../../..';
declare var $;


@Component({
  selector: 'app-leave-category',
  templateUrl: './leave-category.component.html',
  styleUrls: ['./leave-category.component.scss']
})
export class LeaveCategoryComponent implements OnInit {

  jsonFlag={
    institute_id :''
  }
  leaveType = {
   
    name:"",
    id:0
  }
index :0
  @Output() closePopup = new EventEmitter<boolean>();



leaveSearchInput:any
leaveSearchList:any
  leaveTypeList :any
  ceateLeaveData:any[]=[]
  getbyIdList:any

  constructor( private msgService: MessageShowService,
    private httpService: HttpService,
    private router: Router,
    private auth: AuthenticatorService,    
    private pdf: ExportToPdfService,
    ) {
      this.jsonFlag.institute_id = sessionStorage.getItem('institution_id');
     }

  ngOnInit(): void {
    
    this.getAllleaveType()
  }

  getAllleaveType(){
     this.auth.showLoader();
    const url1 = '/api/v2/leave-type/all/'+this.jsonFlag.institute_id
    this.httpService.getData(url1).subscribe(
      (res: any) => {
        this.auth.hideLoader();
        this.leaveTypeList = res.result;
        this.leaveSearchList = res.result;
      },
      err => {
        this.auth.hideLoader();
        this.msgService.showErrorMessage(this.msgService.toastTypes.error, '', err.error.message);
      }
    )
  }


createLeaveType(){
  
  if(this.leaveType.name.trim() != ''){
  let obj = {
institute_id: this.jsonFlag.institute_id,
name: this.leaveType.name,
 }
  this.auth.showLoader();
  const url ='/api/v2/leave-type'
  this.httpService.postData(url, obj).subscribe((res:any) =>{
    this.ceateLeaveData = res.result
    this.getAllleaveType()
    this.leaveType.name=''
    this.auth.hideLoader();

    if (res.statusCode == 200) {
      this.msgService.showErrorMessage(this.msgService.toastTypes.success, '', 'Leave category created successfully');
      this.closePopups(false);


    }
 
  },
  err => {
    this.auth.hideLoader();
    this.msgService.showErrorMessage(this.msgService.toastTypes.error, '', err.error.message);
  }
)
} else {
  this.msgService.showErrorMessage('error', '', 'Please Enter Leave Category Name');
}


// else {
//   this.msgService.showErrorMessage('error', '', 'Please Enter  Leave Category Id');
// }

}

// editLeave(id){
//   this.leaveType.id =  id
// this.auth.showLoader()
// const url ='/api/v2/leave-type/'+this.jsonFlag.institute_id+'/'+id
// this.httpService.getData(url).subscribe((res:any)=>{
//   this.getbyIdList =res.result
//   this.leaveType.id = this.getbyIdList.id,
//   this.leaveType.name = this.getbyIdList.name,
//   this.jsonFlag.institute_id = this.getbyIdList.institute_id
//   console.log("SSSSSSSSSSS",this.getbyIdList)
//   this.auth.hideLoader()

// })
// }
editLeave(obj){
     this.leaveType.id =  obj.id;
    this.leaveType.name = obj.name;
}
editLeaveType(){

  let obj ={
    id :this.leaveType.id,
    name:this.leaveType.name,
    institute_id : this.jsonFlag.institute_id
  }
this.auth.showLoader()
const url ='/api/v2/leave-type'
this.httpService.putData(url, obj).subscribe((res :any)=>{

  this.auth.hideLoader()
  this.getAllleaveType()

  this.leaveType.name=''

  this.msgService.showErrorMessage('success', '', "Leave category updated successfully");
  $('#editModal').modal('hide');
  



},
err => {
  this.auth.hideLoader();
  this.msgService.showErrorMessage(this.msgService.toastTypes.error, '', err.error.message);

})

}
deletLeavebyId(obj){
  this.leaveType.name = obj.name
  this.leaveType.id =  obj.id;
}

deleteLeave(){
  let obj= {
    id :this.leaveType.id,
    name : this.leaveType.name
  }
  this.auth.showLoader()
  const url = '/api/v2/leave-type/'+this.jsonFlag.institute_id+'/' +this.leaveType.id
  this.httpService.deleteData(url,obj).subscribe((res :any)=>{

  this.getAllleaveType()
  this.auth.hideLoader()

  this.msgService.showErrorMessage('success', '', "Leave category deleted successfully");
  $('#deleteModal').modal('hide');

},
err => {
  this.auth.hideLoader();
  this.msgService.showErrorMessage(this.msgService.toastTypes.error, '', err.error.message);
})
}
   downloadPdf(){
     
     for(let i = 0; i < this.leaveTypeList.length; i++){
       this.leaveTypeList[i].id = i+1;
     }
  let temp =[]
  this.leaveTypeList.map((e:any )=>{
      let obj=[
       e.id ,
      e.name
    ]
    temp.push(obj)
  })
  let row =[]
  row = [['#','name']]
  let column = temp
  this.pdf.exportToPdf(row,column,'Leave_pdf')   
}
searchInput(){
  this.leaveTypeList = this.leaveSearchList
  if( this.leaveSearchInput == undefined || this.leaveSearchInput == null){
this.leaveSearchInput = "";
  }else{
    
    let searchData = this.leaveTypeList.filter(item => Object.keys(item).some(
      k =>item[k] != null && item[k].toString().toLowerCase().includes(this.leaveSearchInput.toLowerCase()))
    );
    this.leaveTypeList = searchData;
  }
}

closePopups($event) {
  $('#addModal').modal('hide');
  this.closePopup.emit(false);
  
}

clear(){
  this.leaveType.name=''
}

}
