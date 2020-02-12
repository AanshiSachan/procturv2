import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { AppComponent } from '../../../app.component';
import { AuthenticatorService } from '../../../services/authenticator.service';
import { CommonServiceFactory } from '../../../services/common-service';
import { AddBookService } from '../../../services/library/add/add-book.service';

@Component({
  selector: 'app-add-book',
  templateUrl: './add-book.component.html',
  styleUrls: ['./add-book.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AddBookComponent implements OnInit {

  today: any;
  tempBillDate: any;
  additiobnalDetailsDisplay: boolean = false;
  addCategory: boolean = false;
  authorSettings = {};
  selectedAuthorList: any[] = [];
  multiClickDisabled: boolean = false;

  // Master add book data
  title: any = '';
  categoryName: any = '-1';
  subcategoryName: any = '-1';
  subjectName: any = '-1';
  publicationName: any = '-1';
  authorName: any = '-1';
  bookAddDate: any = '';
  bookQty: any = '';
  bookAmt: any = '';
  bookBarCodeNumber:any;
  bookISBN: any = '';
  bookPagesCount: any = '';
  bookVolume: any = '';
  bookEdition: any = '';
  bookReference: any = '-1';
  bookLang: any = '-1';
  bookBillNumber: any = '';
  bookLostAmt: any = '';
  bookBillDate: any = '';
  bookRemarks: any = '';

  // master data list
  categoryList: any;
  subcategoryList: any;
  subjectList: any;
  publicationList: any;
  authorList: any;
  languageList: any;
  referenceList: any;

  constructor(
    private router: Router,
    private auth: AuthenticatorService,
    private commonService : CommonServiceFactory,
    private appC: AppComponent,
    private addBookService: AddBookService
  ) { }

  ngOnInit() {
    this.today = moment(new Date()).format("DD MMM YYYY");
    this.tempBillDate = moment(new Date()).format("DD MMM YYYY");

    this.getAllMasterData();

    this.authorSettings = {
      singleSelection: false,
      idField: 'author_id',
      textField: 'author_name',
      itemsShowLimit: 1,
      enableCheckAll: false
    };
  }

  getAllMasterData(){
    this.auth.showLoader();
    this.addBookService.getAllMasterData().subscribe(
      response => {
        this.auth.hideLoader();
        let res: any;
        res = response;
        console.log(response)
        this.categoryList = res.response.categories;
        this.subjectList = res.response.subjects;
        this.publicationList = res.response.publications;
        this.authorList = res.response.authors;
        this.languageList = res.response.languages;
        this.referenceList = res.response.references;
      },
      errorResponse => {
        this.auth.hideLoader();
        console.log(errorResponse)
      }
    )
  }

  getSubCategory(ev){
    this.auth.showLoader();
    this.addBookService.getSubCategories(ev).subscribe(
      response => {
        this.auth.hideLoader();
        let res: any;
        res = response;
        console.log(response)
        this.subcategoryList = res.response;
      },
      errorResponse => {
        this.auth.hideLoader();
        console.log(errorResponse)
      }
    )
  }

  showAdditionalDetails(){
    if(this.additiobnalDetailsDisplay){
      this.additiobnalDetailsDisplay = false;
      return;
    }
    if(!this.additiobnalDetailsDisplay){
      this.additiobnalDetailsDisplay = true;
      return;
    }
  }

  addNewCategory(){
    this.addCategory = true;
  }

  openCalendar(id) {
    document.getElementById(id).click();
  }

  addNewDate() {
    let check = this.dateGreaterThanCheck(this.bookAddDate)
    if(check){
      this.today = moment(this.bookAddDate).format("DD MMM YYYY");
    }
    else{
      this.messageHandler('error', 'Bill date cannot be future date', '');
    }
  }

  addBookDate(){
    let check = this.dateGreaterThanCheck(this.bookBillDate)
    if(check){
      this.tempBillDate = moment(this.bookBillDate).format("DD MMM YYYY");
    }
    else{
      this.messageHandler('error', 'Bill date cannot be future date', '');
    }
  }

  dateGreaterThanCheck(givenDate){

    let currentDate = new Date();
    givenDate = new Date(givenDate);

    if(givenDate > currentDate){
      return false
    }
    else{
      return true;
    }
  }

  addNewBook(){

    let custAuthorIds = [];
    this.selectedAuthorList.map(
      (ele: any) => {
        let x = ele.author_id.toString();
        custAuthorIds.push(x);
      }
    )

    if(this.title == null || this.title == '' ||
       this.categoryName == '-1' || this.categoryName == null || this.categoryName  == '' ||
       this.subjectName == '-1' || this.subjectName == null || this.subjectName  == '' ||
       this.publicationName == '-1' || this.publicationName == null || this.publicationName  == '' ||
       this.bookLang == '-1' || this.bookLang == null || this.bookLang  == '' ||
       custAuthorIds.length == 0 ||
       this.bookQty == null || this.bookQty == '' ||
       this.bookAmt == null || this.bookAmt == ''){
         this.messageHandler('error', 'Mandatory field(s) are required', '');
       }
       else if(this.bookQty == 0){
         this.messageHandler('error', 'Book quantity should not be zero', '');
       }
       else if(this.bookAmt == 0){
         this.messageHandler('error', 'Book amount should not be zero', '');
       }
       else{

         let d;
         if(this.bookBillDate == ""){
           d = ""
         }
         else{
           d = moment(this.bookBillDate).unix()
         }

         let obj = {
           "category_id": this.categoryName,
           "sub_category_id": this.subcategoryName,
           "subject_id": this.subjectName,
           "publication_id": this.publicationName,
           "language_id": this.bookLang,
           "reference_id": this.bookReference,
           "authors": custAuthorIds,
           "title": this.title,
           // "location": ,
           "volume": this.bookVolume,
           // "due_fine_per_day": ,
           "edition": this.bookEdition,
           "book_lost_fine": this.bookLostAmt,
           // "issue_for_days": ,
           "bar_code_number": this.bookBarCodeNumber,
           "isbn_number": this.bookISBN,
           "quantity": this.bookQty,
           "price_per_book": this.bookAmt,
           "no_of_pages": this.bookPagesCount,
           "bill_number": this.bookBillNumber,
           "bill_date": d,
           "bill_remark": this.bookRemarks
         }
         this.auth.showLoader();
         this.multiClickDisabled = true;
         console.log(obj)
         this.addBookService.addNewBook(obj).subscribe(
           response => {
             let res: any;
             res = response;
             if(res.response != null){
               this.auth.hideLoader();
               this.messageHandler('success', 'Book(s) added successfully', '');
               let res: any;
               res = response;
               console.log(response)
               this.multiClickDisabled = false;
               this.clearAllFields();
             }
             else{
               this.multiClickDisabled = false;
               this.auth.hideLoader();
               if(res.errorResponse[0].errorCode == 700){
                 this.messageHandler('error', 'Book alredy exists', '');
               }
               this.messageHandler('error', 'Internal Server Error', '');
             }
           },
           errorResponse => {
             this.auth.hideLoader();
             this.messageHandler('error', 'Internal Server Error', '');
             console.log(errorResponse)
           }
         )
       }

  }


  clearAllFields(){

    this.today = moment(new Date()).format("DD MMM YYYY");
    this.tempBillDate = moment(new Date()).format("DD MMM YYYY");
    this.bookBillDate =  moment(new Date()).format("DD MMM YYYY");

    this.title = "";
    this.categoryName = "-1";
    this.subcategoryName = "-1";
    this.subjectName = "-1";
    this.publicationName = "-1";
    this.authorName = "-1";
    this.bookAddDate = "";
    this.bookQty = "";
    this.bookAmt = "";
    this.bookBarCodeNumber = "";
    this.bookISBN = "";
    this.bookPagesCount = "";
    this.bookVolume = "";
    this.bookEdition = "";
    this.bookReference = "-1";
    this.bookLang = "-1";
    this.bookBillNumber = "";
    this.bookLostAmt = "";
    this.bookRemarks = "";

    this.selectedAuthorList = [];
  }


  messageHandler(type, title, body){
    let obj = {
         type: type,
         title: title,
         body: body
       }
    this.appC.popToast(obj);
  }

}
