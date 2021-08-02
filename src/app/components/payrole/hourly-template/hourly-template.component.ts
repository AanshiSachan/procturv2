import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpService } from '../../../services/http.service';
import { AuthenticatorService } from '../../../services/authenticator.service';
import { MessageShowService } from '../../../services/message-show.service';
import { ExportToPdfService } from '../../../services/export-to-pdf.service';
import { ExcelService } from '../../../services/excel.service';
declare var $;

@Component({
  selector: 'app-hourly-template',
  templateUrl: './hourly-template.component.html',
  styleUrls: ['./hourly-template.component.scss']
})
export class HourlyTemplateComponent implements OnInit {
  jsonFlag={
    institute_id:''
  }
  varJson:any={
    pageIndex:1,
    sizeArr:[5,25,50,100,150,200,500],
    total_item:0,
    pageSize:10,
    pageOffset:1,
  }
  template_id:any;
  hourlyDataList:any=[]
  tempList:any=[]
  searchInput:any
  constructor( private router: Router,
    private http: HttpService, 
    private auth :AuthenticatorService,
    private msgToast :MessageShowService,
    private pdf :ExportToPdfService,
    private excel :ExcelService,) { 
      this.jsonFlag.institute_id=sessionStorage.getItem('institute_id')
     // this.template_id = sessionStorage.getItem('id')

    }

  ngOnInit(): void {
    this.getAllHourlyData()
    this.fetchTableDataByPage(1)

  }
addHourly(){
  this.router.navigateByUrl("/view/payrole/add-hourly")
}
onEdit(id){
  sessionStorage.setItem('id',JSON.stringify(id))
  this.router.navigateByUrl('/view/payrole/edit-hourly/' +id)
}
fetchNext(){
  this.varJson.pageOffset++;
  this.fetchTableDataByPage(this.varJson.pageOffset)
  
}


fetchPrevious(){
  this.varJson.pageOffset--;
  this.fetchTableDataByPage(this.varJson.pageOffset)
}
fetchTableDataByPage(index){
  this.varJson.pageOffset=index;
  this.getAllHourlyData();
 
}
updateTableBatchSize(num){
  this.varJson.pageOffset =1;
  this.varJson.pageSize = parseInt(num);
  this.fetchTableDataByPage(this.varJson.pageOffset);
}
getAllHourlyData(){
  this.auth.showLoader();
  let url='/api/v1/payroll/template/hourly/'+this.jsonFlag.institute_id+'/all?pageOffset='+this.varJson.pageOffset+'&pageSize='+this.varJson.pageSize
  this.http.getData(url).subscribe(
    (res :any)=>{
  this.hourlyDataList=res.result.response;
   this.varJson.total_item =res.result.totalElements;
  this.tempList = res.result.response;
  for(let i=0; i<this.hourlyDataList.length;i++){
    this.template_id = this.hourlyDataList[i].template_id
  }
   console.log("page",res.result)
  this.auth.hideLoader();
 
  console.log("hourly",this.hourlyDataList)
    },
    err => {
      this.auth.hideLoader();
      this.msgToast.showErrorMessage(this.msgToast.toastTypes.error, '', err);
    }
  )
  }
  deleteById(obj){
    this.template_id = obj
  }
  deleteHourly(obj){
    if (confirm('Are you sure, You want to delete this template?')) {
this.template_id=obj
    this.auth.showLoader();
    let url ='/api/v1/payroll/template/salary/delete/'+this.jsonFlag.institute_id+'/'+this.template_id
    this.http.deleteDataById(url).subscribe(
      res=>{
        console.log("delet",this.template_id)
        this.auth.hideLoader()
        this.getAllHourlyData()
        this.msgToast.showErrorMessage('success', '', "Hourly deleted successfully");
        $('#deleteModal').modal('hide');


        console.log("delete idddd",this.template_id)
      },
      err => {
        this.auth.hideLoader();
        this.msgToast.showErrorMessage(this.msgToast.toastTypes.error, '', err.error.message);
      }
    )
  
  }}
  downloadPdf(){
    for(let i=0; i<this.hourlyDataList.length;i++){
      this.hourlyDataList[i].template_id = i+1
    }
    let temp=[]
    this.hourlyDataList.map((e:any)=>{
      let obj =[
      e.template_id,
      e.hourly_grade,
      e.hourly_rate
      ]
      temp.push(obj)
    })
    let row = []
    row = [["#","Hourly Grades","Hourly Rates"]]
    let column = temp
    this.pdf.exportToPdf(row,column,'Hourly_template')
  }
  downloaExcel(){
    for(let i=0; i<this.hourlyDataList.length;i++){
      this.hourlyDataList[i].template_id = i+1
    }
    let temp:any[]=[]
    temp = this.hourlyDataList.map(e =>{
      let obj :any ={
        "#":e.template_id,
        "Hourly Grades":e.hourly_grade,
       "Hourly Rates": e.hourly_rate
    }
    return obj
    })
    this.excel.exportAsExcelFile(temp,'Hourly_template')
  
  }
  
  searchFun(){
  this.hourlyDataList=this.tempList 
         if(this.searchInput == undefined || this.searchInput == null){
           this.searchInput ="";
 
         }else{
           let searchData = this.hourlyDataList.filter(item=>Object.keys(item).some(k=>item[k]!=null && item[k].toString().toLowerCase().includes
           (this.searchInput.toLowerCase())));
           this.hourlyDataList = searchData
         }
 
 
 }
  
}
