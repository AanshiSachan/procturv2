
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
  subDomainSystem:string='systemSubDomain';
  domain:string='';
  checkAvailable:string="";
  editString:string="";
  addNewDomain:string="";
  addNewSubDomain:string="";
  showPreview:string="";
  domainModel={
    subDomain_name:'proctur.com',
    domain_name:''

  
  }
availabiltyCheckData:any=[]=[]
  constructor(
    private productService: ProductService,
    private auth: AuthenticatorService,
    private _http: HttpService,
    private msgService:MessageShowService
  ) { }

  ngOnInit(): void {
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
        if(this.pageModel.subdomain_name != '' && this.pageModel.subdomain_name.includes('proctur.com')){
          this. addNewDomain ='Add-New-domains';
          this.subDomainSystem = 'systemSubDomain'

          this.domain=""

        }else{
          //this. domain =='Add-New-domains';
          this.addNewSubDomain  = 'Add-New-SubDomain'
          this.domain = 'domains'
          this.subDomainSystem =""

        }
        
      //   else if(this.pageModel.subdomain_name != '' && !this.pageModel.subdomain_name.includes('proctur.com')){
      //    this. domain =='domains';
        
      // }
      console.log("domain",this.pageModel)
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
  if(!this.domainModel.subDomain_name.includes('https://')){
  let com = this.pageModel.subdomain_name.slice(8)
    if(this.domainModel.subDomain_name != com){
  this.auth.showLoader();
  let url='/api/v1/institutes/subdomain/validate?name='+this.domainModel.subDomain_name+'&instituteId='+ sessionStorage.getItem('institute_id');
  this._http.getData(url).subscribe(
  (res: any) => {
    this.auth.hideLoader();
    this.availabiltyCheckData = res;
    if(res.validate == true ){
      this.checkAvailable ="available"
    }
    // if(res.result == false){
    //   this.msgService.showErrorMessage('error','','Updated url already assigned to another client!');
  
    //  }
  },
  err => {
    this.auth.hideLoader();
    console.log(err.error.validate)
    if(err.error.validate == false){
    this.checkAvailable ='not-available'
    }
    // if(err.error.result == false){
    //   this.msgService.showErrorMessage(this.msgService.toastTypes.error, '', err.error.message);
  
    // }
    console.log("error",err)
  }
);
    }else{
      this.msgService.showErrorMessage('error','','Updated url already assigned to another client!');

    }
  }else{
    this.msgService.showErrorMessage('error', '', 'Please enter valid url');

  }
}
updateSubdomain(){
  let obj={
  old_domain:this.pageModel.subdomain_name !='' ? this.pageModel.subdomain_name.replace("https://",""):null,
  updated_domain:this.domainModel.subDomain_name

  }
  this.auth.showLoader();
  const url = `/api/v1/institutes/subdomain/update/${sessionStorage.getItem('institute_id')}`

  this._http.putData(url,obj).subscribe(
    (res: any) => {
      this.auth.hideLoader();
      this.msgService.showErrorMessage('success', '', "Url updated successfully");
      this.domainModel.subDomain_name="proctur.com"
      this.checkAvailable=""
      this.editString=""
      this.getData();

    
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
        this.domainModel.domain_name=""
        this.editString=""
        this.getData();
  
      
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
  this.editString='edit-url'
  this.domainModel.subDomain_name=obj
console.log("ediiiiiii",this.domainModel.subDomain_name)
}

onclickSubDomain(){
this.subDomainSystem = "systemSubDomain";
this.domain=''
}
onclickDomain(){
  this.domain="domains";
  this.subDomainSystem='';
this.addNewDomain ='Add-New-domains'
this.editString=""

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
  this.domainModel.domain_name=""
  this.domainModel.subDomain_name=""
  this.editString=""

}
}

