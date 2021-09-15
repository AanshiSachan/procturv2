
import { Component, OnInit } from '@angular/core';
import { AuthenticatorService } from '../../../services/authenticator.service';
import { ProductService } from '../../../services/products.service';
import { HttpService } from '../../../services/http.service';
import { MessageShowService } from '../../../services/message-show.service';


@Component({
  selector: 'app-url',
  templateUrl: './url.component.html',
  styleUrls: ['./url.component.scss']
})
export class UrlComponent implements OnInit {
  pageModel: any = '';
  subDomainSystem:string='';
  domain:string='';
  checkAvailable:string="";
  editString:string="";
  addNewDomain:any="";
  showPreviewTab:string="hide";
  addNewSubDomain:string="";
  showPreview:string="";
  showOldUI = true;
  domainModel={
    subDomain_name:'.proctur.com',
    domain_name:'',
    editSubDomain_name:'',
    subDomain_name2:''
  
  }
availabiltyCheckData:any=[]=[]
  constructor(
    private productService: ProductService,
    private auth: AuthenticatorService,
    private _http: HttpService,
    private msgService:MessageShowService
  ) { }

  ngOnInit(): void {
    if(sessionStorage.getItem('institute_id') == '100058' || sessionStorage.getItem('institute_id') == '100127'){
      this.showOldUI = false;
    }
      this.getData();
  }

  getData() {
    this.auth.showLoader();
    this.productService.getMethod('/api/v2/website/configuration/' + sessionStorage.getItem('institute_id'), null).subscribe(
      (res: any) => {
        this.auth.hideLoader();
        this.pageModel = res.result;
        if(this.pageModel.subdomain_name != '' && !this.pageModel.subdomain_name.includes('https://')) {
          let temp = 'https://' + this.pageModel.subdomain_name;
          this.pageModel.subdomain_name = temp;
      }
// =====================new-added============================
      if(!this.showOldUI) {
        if(this.pageModel.subdomain_name != '' && this.pageModel.subdomain_name.includes('proctur.com')){
         this.domainModel.editSubDomain_name =this.pageModel.subdomain_name;
         this.subDomainSystem = "systemSubDomain";
         

         }
        else{
          
          this. addNewDomain = this.pageModel.subdomain_name;
          this.domain="domains";
        }
      }
      },
      err => {
        this.auth.hideLoader();

      }
    );
  }

  previewSite() {
    if(this.pageModel.subdomain_name!='' && this.pageModel.subdomain_name!=null) {
      window.open(this.pageModel.subdomain_name, '_blank');
    }
  }

// =====================new-UI-functionality===========================
checkAvailability(){
  if(this.domainModel.subDomain_name2.trim() != ''){
  if(!this.domainModel.subDomain_name2.includes('https://')){
  let com = this.pageModel.subdomain_name.slice(8)
    if(this.domainModel.subDomain_name2 != com){
  this.auth.showLoader();
  let url='/api/v1/institutes/subdomain/validate?name='+this.domainModel.subDomain_name2+this.domainModel.subDomain_name+'&instituteId='+ sessionStorage.getItem('institute_id');
  this._http.getData(url).subscribe(
  (res: any) => {
    this.auth.hideLoader();
    this.availabiltyCheckData = res;
    if(res.validate == true ){
      this.checkAvailable ="available"
    }
   
  },
  err => {
    this.auth.hideLoader();
    console.log(err.error.validate)
    if(err.error.validate == false){
    this.checkAvailable ='not-available'
    }
   
    console.log("error",err)
  }
);
    }else{
      this.msgService.showErrorMessage('error','','Updated url already assigned to another client!');

    }
  }else{
    this.msgService.showErrorMessage('error', '', 'Please enter valid url');
  }
  }else{
    this.msgService.showErrorMessage('error', '', 'Please enter  url');

  }
}
updateSubdomain(){
  //  this.domainModel.subDomain_name =this.domainModel.subDomain_name2 

  let obj={
  old_domain:this.pageModel.subdomain_name !='' ? this.pageModel.subdomain_name.replace("https://",""):null,
  updated_domain: this.editString == 'edit-url' ? this.domainModel.subDomain_name2 :this.domainModel.subDomain_name2 + this.domainModel.subDomain_name

  }
  this.auth.showLoader();
  const url = `/api/v1/institutes/subdomain/update/${sessionStorage.getItem('institute_id')}`

  this._http.putData(url,obj).subscribe(
    (res: any) => {
      this.auth.hideLoader();
      this.msgService.showErrorMessage('success', '', "Url updated successfully");
      this.getData();
      this.domainModel.subDomain_name=".proctur.com";
      this.checkAvailable="";
      this.showPreviewTab ='hide';
      this.addNewDomain="";
     this.editString ="";
     this.domainModel.domain_name="";
     

    
  },
  err => {
    this.auth.hideLoader();
    this.msgService.showErrorMessage(this.msgService.toastTypes.error, '', err.error.message);
    this.checkAvailable =""
  }
  )
  
}
updateDomain(){
  if(!this.domainModel.domain_name.includes("https://")){
  let obj={
    old_domain:this.pageModel.subdomain_name !='' ? this.pageModel.subdomain_name.replace("https://",""):null,
    updated_domain:this.domainModel.domain_name
  
    }
    this.auth.showLoader();
    const url = `/api/v1/institutes/subdomain/update/${sessionStorage.getItem('institute_id')}`
  
    this._http.putData(url,obj).subscribe(
      (res: any) => {
        this.auth.hideLoader();
        this.msgService.showErrorMessage('success', '', "Domain updated successfully");
        this.getData();
        this.domainModel.domain_name="";
        this.domainModel.subDomain_name=".proctur.com";
        this.domainModel.editSubDomain_name ="";
        this.showPreviewTab ='hide';
       
        this.editString=""
    
       
  
      
    },
    err => {
      this.auth.hideLoader();
      this.msgService.showErrorMessage(this.msgService.toastTypes.error, '', err.error.message);
  
    }
    )
    
  }else{
    this.msgService.showErrorMessage('error', '', 'Please enter valid url');

  }
}
onclickEdit(obj){
  let str = obj.slice(8)
  this.editString='edit-url'
  this.domainModel.subDomain_name2=str

  this.showPreviewTab ='';
}
editDomain(obj){
  
  let str = obj.slice(8)
  
  this.editString = 'domain-edit'
this.domainModel.domain_name = str
this.showPreviewTab ='';

}
onclickSubDomain(){
this.subDomainSystem = "systemSubDomain";
this.domain=''
this.domainModel.subDomain_name2 ="";
  





}
onclickDomain(){
  this.domain="domains";
  this.subDomainSystem='';
  
  this.domainModel.subDomain_name2 ="";
  


}
clearSubdomainDiv(){
  this.domain=''
  this.editString=""
}
clearDomain(){
  this.subDomainSystem='';
  this.editString=""
 
}
onclickCancel(){
  this.domainModel.domain_name="";
  this.domainModel.subDomain_name=".proctur.com";
  this.editString=""
  this.showPreviewTab ='hide';

}
}

