import { Component, NgZone, OnInit } from '@angular/core';
import { AuthenticatorService } from '../../../services/authenticator.service';
import { HttpService } from '../../../services/http.service';
import { MessageShowService } from '../../../services/message-show.service';
declare var Razorpay;

@Component({
  selector: 'app-transactional',
  templateUrl: './transactional.component.html',
  styleUrls: ['./transactional.component.scss']
})
export class TransactionalComponent implements OnInit {


  type: string = 'Transactional';
  radioSelected: any = 0;
  institute_id: any;
  transactionSMS: any = [
    { total_sms: 5000, price: 13, tax: 18, total_price: 767 },//767
    { total_sms: 10000, price: 13, tax: 18, total_price: 1534 },
    { total_sms: 25000, price: 13, tax: 18, total_price: 3835 },
    { total_sms: 50000, price: 13, tax: 18, total_price: 7670 },
    { total_sms: 100000, price: 12, tax: 18, total_price: 14160 }];

  constructor(private apiService: HttpService,
    private auth: AuthenticatorService,
    public _msgService: MessageShowService,
    private zone: NgZone) {
    this.auth.currentInstituteId.subscribe(id => {
      this.institute_id = id;
    });
  }

  ngOnInit() {
  }

  changeType(type) {
    this.type = type;;
  }



  openRazorpayCheckout() {
    var self = this;
    let merchant_acc = [{ key_id: "rzp_live_pQXvkbWD4oVatb" }] //rzp_test_vuWxy6G3R70M8C
    // console.log(merchant_acc[0]);
    let total_amount = this.transactionSMS[this.radioSelected].total_price * 100;
    let options = {
      key: merchant_acc[0].key_id,
      amount: total_amount,
      name: "Proctur ",
      description: "Eduspace Technologies Pvt. Ltd",
      theme: {
        color: "blue"
      },
      handler: this.paymentResponseHander.bind(this),
      modal: {
        "ondismiss": function (this) {
          self.paymentCancelled();
        }
      }
    }

    let rzp = new Razorpay(options);
    rzp.open();
  }

  paymentCancelled() {
    // Transaction Cancelled
    console.log('Payment Cancelled Called');
    // this._msgService.showErrorMessage('error', '', "due to some problem your transaction is cancel ");

  }

  paymentResponseHander(response) {
    let data = {
      "sms_quota_allocated": this.transactionSMS[this.radioSelected].total_sms,
      "sms_type": this.type // Promotional
    };

    this.apiService.putData('/api/v1/institute/SMS/transaction/buyOnline/' + this.institute_id, data).subscribe(
      (resp: any) => {
        console.log(resp)
        this.zone.run(() => { // <== added
          this._msgService.showErrorMessage('success', '', "SMS successfully added in your account");
        });
      },
      (err) => {
        console.log(err)
        this.zone.run(() => { // <== added
          this._msgService.showErrorMessage('error', '', "Something went wrong please try again and if your payment deducted from your account it will be added in your account within 5 to 6 days ");
        });
      }
    );
  }
}

