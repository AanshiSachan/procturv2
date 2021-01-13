import { Component, OnInit } from '@angular/core';
import { AuthenticatorService } from '../../../services/authenticator.service';
import { ProductService } from '../../../services/products.service';

@Component({
  selector: 'app-url',
  templateUrl: './url.component.html',
  styleUrls: ['./url.component.scss']
})
export class UrlComponent implements OnInit {
  pageModel: any = '';

  constructor(
    private productService: ProductService,
    private auth: AuthenticatorService,
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
        //this.fetchTableDataByPage(this.pageIndex);
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

}
