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
    hourly_grade:'',
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
    template_id:'',
    user_gender:'',
    user_dob:'',
    user_phone:'',
    user_name:'',
    user_role:''


  }
  selectedTeacherId:any
  userId:any
  template_id:any
  salrayDataList:any=[]
  addedListAllownc:any=[]
  addedListDeduct:any=[]
  template_allowances_map_dtos:any=[]
  constructor( private http: HttpService, 
    private auth :AuthenticatorService,
    private msgToast :MessageShowService, private routeParam: ActivatedRoute) { 
      this.jsonFlag.institute_id = sessionStorage.getItem('institute_id')
      //this.selectedTeacherId = sessionStorage.getItem('teacher_id')
      //this.selectedId = sessionStorage.getItem('id')
    }
  ngOnInit(): void {
    this.routeParam.params.subscribe(params => {
      this.selectedTeacherId = params['teacher_id'];
      this.userId =params['user_id']
    });
    this.getsalaryViewById()
  }


  getsalaryViewById(){
     this.auth.showLoader();
    let url='/api/v1/payroll/manage/'+this.jsonFlag.institute_id+'/view/'+this.userId+'/'+this.selectedTeacherId
    this.http.getData(url).subscribe(
      (res :any)=>{
    this.salrayDataList=res.result.template_dto
    this.auth.hideLoader();
      this.ManageSalaryModel=res.result.template_dto
      this.ManageSalaryModel.user_name = res.result.user_name
      this.ManageSalaryModel .user_gender =res.result.user_gender
      this.ManageSalaryModel .user_dob=res.result.user_dob,
      this.ManageSalaryModel .user_phone=res.result.user_phone,
      this.ManageSalaryModel . user_name=res.result.user_name,
      this.ManageSalaryModel . user_role=res.result.user_role
      console.log("view details",this.salrayDataList)
    
    for(let i= 0; i < this.salrayDataList.template_allowances_map_dtos.length; i++){
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
        }
        console.log("edit response",this.salrayDataList)
      }
      },
      err => {
        this.auth.hideLoader();
        this.msgToast.showErrorMessage(this.msgToast.toastTypes.error, '', err.error.message);
      }
    )
  }
  }
  

