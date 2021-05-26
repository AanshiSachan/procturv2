import { Component, OnInit } from '@angular/core';
import { HttpService } from '../../../services/http.service';
import { AuthenticatorService } from '../../../services/authenticator.service';
import { MessageShowService } from '../../../services/message-show.service';
import { ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-view-manage-template',
  templateUrl: './view-manage-template.component.html',
  styleUrls: ['./view-manage-template.component.scss']
})
export class ViewManageTemplateComponent implements OnInit {
  jsonFlag={
    institute_id:''
  }

  ManageSalaryModel={
    salary_type:'M',
    salary_grade:'',
    basic_salary:'',
    overtime_rate:'',
    allowance:'',
    allowance_amount:'',
    deduction:'',
    deduction_amount:'',
    gross_salary:'',
    total_deduction:'',
    net_salary:'',
    typeA:'A',
    typeD:'D',
    template_id:''
  }
  selectedRolId:any
  selectedId:any
  template_id:any
  salrayDataList:any=[]
  addedListAllownc:any=[]
  addedListDeduct:any=[]
  template_allowances_map_dtos:any=[]
  constructor( private http: HttpService, 
    private auth :AuthenticatorService,
    private msgToast :MessageShowService, private routeParam: ActivatedRoute) { 
      this.jsonFlag.institute_id = sessionStorage.getItem('institute_id')
      this.selectedRolId = sessionStorage.getItem('teacher_id')
      this.selectedId = sessionStorage.getItem('id')
    }
  ngOnInit(): void {
    // this.routeParam.params.subscribe(params => {
    //   this.selectedId = params['id'];
    // });
    if(this.selectedId){
    this.selectedRolId =0
    }
    else if(this.selectedRolId){
    this.selectedId =0
  }
    this.getsalaryById()
  }
  getsalaryById(){
    

    this.auth.showLoader();
    let url='/api/v1/payroll/manage/'+this.jsonFlag.institute_id+'/view/'+this.selectedId+'/'+this.selectedRolId
    this.http.getData(url).subscribe(
      (res :any)=>{
    this.salrayDataList=res.result
    this.auth.hideLoader();
      this.ManageSalaryModel=res.result
    
    for(let i= 0; i<this.salrayDataList.template_allowances_map_dtos.length;i++){
      if(this.salrayDataList.template_allowances_map_dtos[i].type == 'D') {
         let obj ={
          type:this.ManageSalaryModel.typeD,
          deduction:this.salrayDataList.template_allowances_map_dtos[i].deduction,
          deduction_amount:this.salrayDataList.template_allowances_map_dtos[i].deduction_amount,
         }
           this.addedListDeduct.push(obj)
        } else {
             let obj2={
          type:this.ManageSalaryModel.typeA,
         allowance:this.salrayDataList.template_allowances_map_dtos[i].allowance,
         allowance_amount:this.salrayDataList.template_allowances_map_dtos[i].allowance_amount,
        
         }
         this.addedListAllownc.push(obj2)  
         console.log("teacherid",this.selectedRolId)
        }}
      },
      err => {
        this.auth.hideLoader();
        this.msgToast.showErrorMessage(this.msgToast.toastTypes.error, '', err);
      }
    )
  }
  }
  

