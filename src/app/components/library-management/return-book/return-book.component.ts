import { Component, OnInit, ViewChild, ElementRef, Renderer2, ViewEncapsulation, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators, FormControl, AbstractControl, ValidatorFn } from '@angular/forms';
import { AppComponent } from '../../../app.component';
import { AuthenticatorService } from '../../../services/authenticator.service';
import { CommonServiceFactory } from '../../../services/common-service';
import { AddBookService } from '../../../services/library/add/add-book.service';
import { IssueBookService } from '../../../services/library/issue/issue-book.service';
import { ReturnBookService } from '../../../services/library/return/return-book.service';
import * as moment from 'moment';
import { of } from 'rxjs/observable/of';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'app-return-book',
  templateUrl: './return-book.component.html',
  styleUrls: ['./return-book.component.scss']
})

export class ReturnBookComponent implements OnInit {

  searchInput: any;
  filter: boolean = false;
  searchResult: boolean = false;
  suggestion: boolean = false;
  returnBookPopup: boolean = false;
  lostBook: boolean = false;
  isRippleLoad: boolean = false;
  bookSuggestion: boolean = false;
  hoverTitle: string = "";

  pageNo: number;
  noOfRecords: number;
  searchDataList: any;
  suggestionList: any;
  returnBookData: any;
  multiClickDisabled: boolean = false;

  tempReturnDate: any;
  tempLostDate: any;
  returnDate: any;
  lostDate: any;

  searchTitle: any;
  searchCategoryId: any = '-1';
  searchSubcategoryId: any = '-1';
  searchSubjectId: any = '-1';
  searchPublicationId: any = '-1';
  searchAuthorId: any = '-1';
  searchLangId: any = '-1';

  // master data list
  categoryList: any;
  subcategoryList: any;
  subjectList: any;
  publicationList: any;
  authorList: any;
  languageList: any;

  perDayFine: number;
  noOfLateDays: number;
  totalLateFine: number;

  // FOR RETURN
  returnBookIssuedDate: any;
  returnBookReturnDate: any;
  returnBookRemarks: any;
  returnBookTitle: any;
  issueBookId: any;
  lostBookAmt: number;
  returnIssueBookId: any;
  bookId: any;
  disableReturnAmt: boolean = false;

  constructor(
    private router: Router,
    private auth: AuthenticatorService,
    private _commService : CommonServiceFactory,
    private appC: AppComponent,
    private addBookService: AddBookService,
    private issueBookService: IssueBookService,
    private returnBookService: ReturnBookService
  ) { }

  ngOnInit() {

    this.tempReturnDate = moment(new Date()).format("DD MMM YYYY");
    this.tempLostDate = moment(new Date()).format("DD MMM YYYY");

    this.getAllMasterData();
    this.getInstituteData();
  }

  getInstituteData(){
    this.isRippleLoad = true;
    this.issueBookService.getInstituteSettingFromServer().subscribe(
      response => {
        this.isRippleLoad = false;
        let res: any;
        res = response;
        this.perDayFine = res.lib_due_date_fine_per_day
        console.log(this.perDayFine)

      },
      errorResponse => {
        this.isRippleLoad = false;
        console.log(errorResponse)
      }
    )
  }

  getAllMasterData(){
    this.isRippleLoad = true;
    this.addBookService.getAllMasterData().subscribe(
      response => {
        this.isRippleLoad = false;
        let res: any;
        res = response;
        console.log(response)

        let tempCatList = res.response.categories;
        this.categoryList = res.response.categories;
        this.subjectList = res.response.subjects;
        this.publicationList = res.response.publications;
        this.authorList = res.response.authors;
        this.languageList = res.response.languages;
      },
      errorResponse => {
        this.isRippleLoad = false;
        console.log(errorResponse)
      }
    )
  }

  getSubCategory(ev){
    this.isRippleLoad = true;
    this.addBookService.getSubCategories(ev).subscribe(
      response => {
        this.isRippleLoad = false;
        let res: any;
        res = response;
        console.log(response)
        this.subcategoryList = res.response;
      },
      errorResponse => {
        this.isRippleLoad = false;
        console.log(errorResponse)
      }
    )
  }

  searchInList(search_string: any){
    if (search_string.which <= 90 && search_string.which >= 48 || search_string.which == 8){
      this.filter = false;
      this.searchResult = false;
      if(this.searchInput != ''){
        this.suggestionList = ""
        this.getSearchData();
      }
      if(search_string.which === 13){
        this.showSearchResult();
      }

    }
    if(this.searchInput == '' || this.searchInput == null){
      this.suggestion = false;
      this.filter = false;
    }
  }

  showSearchResult(){
    this.bookSuggestion = false;
    this.searchResult = true;
  }

  showFilter(){
    if(this.filter){
      this.filter = false;
      return;
    }
    else{
      this.filter = true;
      this.suggestion = false;
      return;
    }
  }

  getSearchData(){
    this.isRippleLoad = true;
    this.returnBookService.getSearchedBooksOrStudents(this.searchInput).subscribe(
      response => {
        let res: any;
        res = response;
        if(res.response.libraryBookDTOs.length > 0 || res.response.students.length > 0){
          if(this.searchInput == '' || this.searchInput == null){
            this.suggestion = false;
            this.filter = false;
          }
          else{
            this.suggestion = true;
          }
          this.suggestionList = res.response;
          this.isRippleLoad = false;
        }

      })
  }

  advanceSearch(){
    this.filter = false;
    this.suggestion = false;
    let obj = {
      "by" : [
        {
          "column": "title",
          "value": this.searchTitle
        },
        {
          "column": "category_id",
          "value": this.searchCategoryId
        },
        {
          "column": "sub_category_id",
          "value": this.searchSubcategoryId
        },
        {
          "column": "subject_id",
          "value": this.searchSubjectId
        },
        {
          "column": "publication_id",
          "value": this.searchPublicationId
        },
        {
          "column": "language_id",
          "value": this.searchLangId
        },
        {
          "column": "author_id",
          "value": this.searchAuthorId
        }
      ],
      "sort": [
        {
          "column": "publication_name",
          "assending" : false
        }
      ],
    	"pageNo": 1,
    	"noOfRecords": 10
    }

    console.log(obj);

    this.isRippleLoad = true;
    this.issueBookService.getBookFilterData(obj).subscribe(
      response => {
        this.isRippleLoad = false;
        let res: any;
        res = response;
        if(res.response.results.length  > 0){
          console.log(response)
          // this.returnBookData = res.response.results;
          this.searchResult = true;
        }
        else{
          this.messageHandler('error', 'No data found', '');
          // if(res.errorResponse[0].errorCode == 700){
          //   this.messageHandler('error', 'No data found', '');
          // }
        }

      })
  }

  resetFilter(){
    this.searchTitle = "";
    this.searchCategoryId = "-1";
    this.searchSubcategoryId = "-1";
    this.searchSubjectId = "-1";
    this.searchPublicationId = "-1";
    this.searchLangId = "-1";
    this.searchAuthorId = "-1";
  }


  getIssuedBooksByBook(book_id, book_title){
    this.isRippleLoad = true;
    this.returnBookService.getIssuedBooksByBook(book_id).subscribe(
      response => {
        let res: any;
        res = response;
        this.isRippleLoad = false;
        this.suggestion = false;
        if(res.response.length > 0){
          this.searchResult = true;
          this.returnBookData = res.response;
        }
        else{
          this.messageHandler('error', book_title+' has not been issued by any borrower', '');
        }
      })
  }

  getIssuedBooksByStudent(student_id, student_name){
    this.returnBookService.getIssuedBooksByStudent(student_id).subscribe(
      response => {
        let res: any;
        res = response;
        this.isRippleLoad = false;
        this.suggestion = false;
        if(res.response.length > 0){
          this.searchResult = true;
          this.returnBookData = res.response;
        }
        else{
          this.messageHandler('error', 'No book to be returned by '+student_name, '');
        }

      })
  }

  downloadReceipt(issueBookId){
    this.isRippleLoad = true;
    this.returnBookService.downloadReceipt(issueBookId).subscribe(
      response => {
        let res: any;
        res = response;
        this.isRippleLoad = false;
        let byteArr = this._commService.convertBase64ToArray(res.document);
        let fileName = res.docTitle;
        let file = new Blob([byteArr], { type: 'text/csv;charset=utf-8;' });
        let url = URL.createObjectURL(file);
        let dwldLink = document.getElementById('feeReceipt_download');
        dwldLink.setAttribute("href", url);
        dwldLink.setAttribute("download", fileName);
        document.body.appendChild(dwldLink);
        dwldLink.click();
      })
  }


  showReturnBook(returnBookData){
    this.lostBookAmt = returnBookData.book_complete_details.book_lost_fine;
    this.noOfLateDays = 0;
    this.totalLateFine = 0;
    this.returnBookRemarks = "";
    this.returnBookPopup = true;
    this.returnBookTitle = returnBookData.book_complete_details.title;
    this.returnBookIssuedDate = moment(returnBookData.issued_book.issued_on).format("DD MMM YYYY");
    this.returnBookReturnDate = moment(returnBookData.issued_book.to_return_on_date).format("DD MMM YYYY");
    this.returnBookRemarks = "";
    this.returnIssueBookId = returnBookData.issued_book.issue_book_id;
    this.bookId = returnBookData.book_complete_details.book_id;
    this.checkForReturnDate(moment(returnBookData.issued_book.to_return_on_date).format("DD MMM YYYY"));
    let timeDiff: any = "";
    let givenDate = new Date(this.returnBookReturnDate);
    let tempDate = new Date(this.tempReturnDate);
    if(givenDate > tempDate){
      this.noOfLateDays = 0;
    } else {
    timeDiff =  Math.abs(moment(this.returnBookReturnDate).diff(moment(this.tempReturnDate), 'days'));
    if(timeDiff > 0){
      this.noOfLateDays = timeDiff;
      this.totalLateFine = this.perDayFine * this.noOfLateDays;
    }
  }
    // this.checkForReturnDate(moment(returnBookData.issued_book.to_return_on_date).format("DD MMM YYYY"));
  }

  returnBook(){
    console.log(this.lostBook)

    let obj;
    if(this.lostBook){
      obj = {
        "issue_book_id" : this.returnIssueBookId,
        "book_id": this.bookId,
        "returned_date": moment(this.tempReturnDate).unix() * 1000,
        "lost_on_date": moment(this.tempLostDate).unix() * 1000,
        "scrapped_on_date": moment(this.tempLostDate).unix() * 1000,
        "paid_fine": this.lostBookAmt,
        "remark": this.returnBookRemarks,
        "no_of_late_days": ""
      }
    }
    else{
      if(this.noOfLateDays == null && !this.disableReturnAmt){
        this.messageHandler('error', 'Enter number of late days', '');
        return;
      }
      else{
        obj = {
          "issue_book_id" : this.returnIssueBookId,
          "book_id": this.bookId,
          "returned_date": moment(this.tempReturnDate).unix() * 1000,
          "lost_on_date": "",
          "scrapped_on_date": "",
          "paid_fine": this.totalLateFine,
          "remark": this.returnBookRemarks,
          "no_of_late_days": this.noOfLateDays
        }
      }

    }
    console.log(obj)
    this.isRippleLoad = true;
    this.multiClickDisabled = true;
    this.returnBookService.returnBook(obj).subscribe(
      response => {
        let res: any;
        res = response;
        this.isRippleLoad = false;
        this.returnBookPopup = false;
        this.multiClickDisabled = false;
        console.log(res.response)
        if(res.statusCode == 200){
          this.downloadReceipt(this.returnIssueBookId)
          this.bookSuggestion = false
          this.searchResult = false;
          this.searchInput = "";
          this.lostBookAmt = 0;
          this.noOfLateDays = 0;
          this.totalLateFine = 0;
          this.returnBookRemarks = "";
          this.messageHandler('success', 'Book returned successfully', '');
        }
        else{
          this.messageHandler('error', 'Internal server error', '');
        }

      })

  }

  cancelReturnBook(){
    this.returnBookPopup = false;
  }

  calculateLateFine(){
    this.totalLateFine = this.perDayFine * this.noOfLateDays;
    this.totalLateFine = Math.round(this.totalLateFine);
  }

  selectReturnDate(){
    const fromDateNotGreaterThanToday = this.lessThanReturnDate(this.returnBookIssuedDate);
    this.tempReturnDate = moment(this.tempReturnDate).format("DD MMM YYYY");
    switch (fromDateNotGreaterThanToday) {
      case 'true':
        let timeDiff: any = "";
        timeDiff = Math.abs(moment(this.returnBookReturnDate).diff(moment(this.tempReturnDate), 'days'));
        this.noOfLateDays = timeDiff;
        this.totalLateFine = this.perDayFine * this.noOfLateDays;
        break;
      case 'lessThanIssueDate':
        this.tempReturnDate = moment().format("DD MMM YYYY");
        this.messageHandler('error', 'Return date can not be less than issue date', '');
        break;
      case 'greaterthanFutureDate':
          this.tempReturnDate = moment().format("DD MMM YYYY");
          this.messageHandler('error', 'Return date can not be future date', '');
          break;
      case 'lessThanReturnDate':
        this.noOfLateDays = 0;
        this.totalLateFine = 0;
        break;
    }

  }

  selectBookLostDate(){
    let fromDateNotGreaterThanToday = this.graterThanToday(this.lostDate);
    if(fromDateNotGreaterThanToday){
      this.tempLostDate = moment(this.lostDate).format("DD MMM YYYY");
    }
    else{
      this.messageHandler('error', 'Book lost/scrap date cannot be future date', '');
      return;
    }
  }

  graterThanToday(givenDate){
    let currentDate = new Date();
    givenDate = new Date(givenDate);

    if(givenDate > currentDate){
      return false;
    }
    else{
      return true;
    }
  }
  lessThanReturnDate(givenDate){
    let currentDate = new Date();
    givenDate = new Date(givenDate);
    let tempDate = this.tempReturnDate;
    tempDate = new Date(tempDate);
    let tempReturnBookReturnDate = this.returnBookReturnDate;
    tempReturnBookReturnDate = new Date(tempReturnBookReturnDate);
    if (tempDate > currentDate){
        return 'greaterthanFutureDate';
    } else if (givenDate > tempDate) {
      return 'lessThanIssueDate';
    } else if (tempDate < tempReturnBookReturnDate) {
      return 'lessThanReturnDate';
    } else {
      return 'true';
    }
  }

  checkForReturnDate(givenDate){
    let currentDate = new Date();
    currentDate.setHours(0,0,0,0);
    givenDate = new Date(givenDate);

    if(givenDate >= currentDate){
      this.disableReturnAmt = true;
    }
    else{
      this.disableReturnAmt = false;
    }

    let timeDiff: any = "";
    let days: any = "";
    timeDiff = Math.floor(<any>currentDate - <any>givenDate);
    days = timeDiff / (1000 * 60 * 60 * 24);
    if(days > 0){
      this.noOfLateDays = days;
      this.totalLateFine = this.perDayFine * this.noOfLateDays;
    }
  }

  openCalendar(id) {
    document.getElementById(id).click();
  }

  clearFilter(){
    this.searchInput = "";
    this.suggestion = false;
  }

  closePopup(){
    this.returnBookPopup = false;
  }

  closeSuggestions(){
    this.suggestion = false;
  }

  concatString(authorArray){
    this.hoverTitle = "";
      for(let i = 0; i < authorArray.length; i++){
        this.hoverTitle += authorArray[i].author_name;
        if(i >= 0 && i < authorArray.length){
          this.hoverTitle += ", ";
        }
      }
    return this.hoverTitle;
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
