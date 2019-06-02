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

  perDayFine: number = 2;
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
    private commonService : CommonServiceFactory,
    private appC: AppComponent,
    private addBookService: AddBookService,
    private issueBookService: IssueBookService,
    private returnBookService: ReturnBookService
  ) { }

  ngOnInit() {

    this.tempReturnDate = moment(new Date()).format("DD MMM YYYY");
    this.tempLostDate = moment(new Date()).format("DD MMM YYYY");

    this.getAllMasterData();
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


  showReturnBook(returnBookData){
    this.lostBookAmt = 0;
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
      if(this.noOfLateDays == 0 || this.noOfLateDays == null && !this.disableReturnAmt){
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
          this.bookSuggestion = false
          this.searchResult = false;
          this.searchInput = "";
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
  }

  selectReturnDate(){
    let fromDateNotGreaterThanToday = this.graterThanToday(this.returnDate);
    if(fromDateNotGreaterThanToday){
      this.tempReturnDate = moment(this.returnDate).format("DD MMM YYYY");
    }
    else{
      this.messageHandler('error', 'Return date cannot be future date', '');
      return;
    }
  }

  selectBookLostDate(){
    let fromDateNotGreaterThanToday = this.graterThanToday(this.lostDate);
    if(fromDateNotGreaterThanToday){
      this.tempLostDate = moment(this.lostDate).format("DD MMM YYYY");
    }
    else{
      this.messageHandler('error', 'Book lost date cannot be future date', '');
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

  messageHandler(type, title, body){
    let obj = {
         type: type,
         title: title,
         body: body
       }
    this.appC.popToast(obj);
  }
}
