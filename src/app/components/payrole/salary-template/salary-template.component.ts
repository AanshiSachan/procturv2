import { Component, OnInit, ɵclearResolutionOfComponentResourcesQueue } from '@angular/core';
import { Router } from '@angular/router';
import { HttpService } from '../../../services/http.service';
import { AuthenticatorService } from '../../../services/authenticator.service';
import { MessageShowService } from '../../../services/message-show.service';
import { ExportToPdfService } from '../../../services/export-to-pdf.service';
import { ExcelService } from '../../../services/excel.service';


@Component({
  selector: 'app-salary-template',
  templateUrl: './salary-template.component.html',
  styleUrls: ['./salary-template.component.scss']
})
export class SalaryTemplateComponent implements OnInit {
jsonFlag={
  institute_id:''
}
varJson:any={
  pageIndex:1,
  sizeArr:[5,25,50,100,150,200,500],
  total_item:0,
  pageSize:5,
  pageOffset:1,
}
template_id:any;
searchInput:any;
salrayDataList:any=[]
tempList:any=[]

  constructor( private router: Router,
    private http: HttpService, 
    private auth :AuthenticatorService,
    private msgToast :MessageShowService,
    private pdf :ExportToPdfService,
    private excel :ExcelService,) { 
      this.jsonFlag.institute_id = sessionStorage.getItem('institute_id')
    }

  ngOnInit(): void {
   // this.getAllSalaryData()
    this.fetchTableDataByPage(1)
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
  this.getAllSalaryData();
}
updateTableBatchSize(num){
  this.varJson.pageOffset =1;
  this.varJson.pageSize = parseInt(num);
  this.fetchTableDataByPage(this.varJson.pageOffset);
}
addSalaryPage(){
  this.router.navigateByUrl("/view/payrole/add-salary")
}
getAllSalaryData(){
this.auth.showLoader();
let url = '/api/v1/payroll/template/salary/'+this.jsonFlag.institute_id+'/all'+'?pageOffset='+this.varJson.pageOffset+'&pageSize='+this.varJson.pageSize
this.http.getData(url).subscribe(
  (res :any)=>{
this.salrayDataList=res.result.response;
 this.varJson.total_item =res.result.totalElements;
this.tempList = res.result.response;
 console.log("page",res.result)
this.auth.hideLoader();
for(let i=0; i<this.salrayDataList.length;i++){
  this.template_id = this.salrayDataList[i].template_id
}
console.log("salaryyyyyy",this.salrayDataList)
  },
  err => {
    this.auth.hideLoader();
    this.msgToast.showErrorMessage(this.msgToast.toastTypes.error, '', err);
  }
)
}

onclickView(id){
  this.router.navigateByUrl('/view/payrole/view-salary-template/' +id)

}

deletSalary(){
 
    this.auth.showLoader();
    let url ='/api/v1/payroll/template/salary/delete/'+this.jsonFlag.institute_id+'/'+this.template_id
    this.http.deleteDataById(url).subscribe(
      res=>{
        console.log("delet",this.template_id)
        this.auth.hideLoader()
        this.msgToast.showErrorMessage('success', '', "Salary delete successfully");
        this.getAllSalaryData()
      },
      err => {
        this.auth.hideLoader();
        this.msgToast.showErrorMessage(this.msgToast.toastTypes.error, '', err.error.message);
      }
    )
  
  }
onClickEdit(id){
  sessionStorage.setItem('id',JSON.stringify(id))

  this.router.navigateByUrl('/view/payrole/edit-salary/' +id);
  console.log("session id",id)

}

searchFun(){
 this.salrayDataList=this.tempList 
        if(this.searchInput == undefined || this.searchInput == null){
          this.searchInput ="";

        }else{
          let searchData = this.salrayDataList.filter(item=>Object.keys(item).some(k=>item[k]!=null && item[k].toString().toLowerCase().includes
          (this.searchInput.toLowerCase())));
          this.salrayDataList = searchData
        }


}




downloadPdf(){
  for(let i=0; i<this.salrayDataList.length;i++){
    this.salrayDataList[i].template_id = i+1
  }
  let temp=[]
  this.salrayDataList.map((e:any)=>{
    let obj =[
    e.template_id,
    e.salary_grade,
    e.basic_salary,
    e.overtime_rate,
    ]
    temp.push(obj)
  })
  let row = []
  row = [["#","Salary Grads","Basic Salary","Overtime Rate"]]
  let column = temp
  this.pdf.exportToPdf(row,column,'salary_template')
}
downloaExcel(){
  for(let i=0; i<this.salrayDataList.length;i++){
    this.salrayDataList[i].template_id = i+1
  }
  let temp:any[]=[]
  temp = this.salrayDataList.map(e =>{
    let obj :any ={
      template_id:e.template_id,
      salary_grade:e.salary_grade,
      basic_salary: e.basic_salary,
      overtime_rate: e.overtime_rate,
  }
  return obj
  })
  this.excel.exportAsExcelFile(temp,'Salary_template')

}





}
