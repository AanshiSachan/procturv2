import { Component, OnInit, AfterContentChecked } from '@angular/core';
import { Router } from '@angular/router';
import { AppComponent } from '../../../app.component';
import { AuthenticatorService } from '../../../services/authenticator.service';
import { CommonServiceFactory } from '../../../services/common-service';
import { AddBookService } from '../../../services/library/add/add-book.service';
import { IssueBookService } from '../../../services/library/issue/issue-book.service';
import * as moment from 'moment';
import 'rxjs/add/observable/merge';

@Component({
  selector: 'app-issue-book',
  templateUrl: './issue-book.component.html',
  styleUrls: ['./issue-book.component.scss']
})
export class IssueBookComponent implements OnInit {

  filter: boolean = false;
  searchResult: boolean = false;
  suggestion: boolean = false;
  bookSuggestion: boolean = false;
  borSuggestions: boolean = false;
  borrower: any;
  selectedBorrowerId: any;
  searchInput: string;
  isRippleLoad: boolean = false;
  multiClickDisabled: boolean = false;
  hoverTitle: string = "";
  hoverTitleAuthor: string = "";

  searchTitle: any = "";
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

  pageNo: number;
  noOfRecords: number;
  searchDataList: any;
  suggestionList: any;
  authorSuggestionList: any;
  tempFromDate: any;
  tempToDate: any;
  bookFromDate: any;
  bookToDate: any;
  booksInHandStatus: boolean = false;
  bookInHand: number = 0;
  booksInHandDetails: any;

  bookSuggestionForTitle: boolean = false;
  bookSuggestionListForTitle: any;

  bookSearchData: any;
  bookDataForIssue: any;
  borrowerSearchData: any;

  numberOfLateDaysWithoutFine: number;

  // FOR PAGINATION
  pageIndex: number = 1;
  displayBatchSize: number = 20;
  totalCount: number = 0;
  sizeArr: any[] = [20, 50, 100, 150, 200, 500];

  constructor(
    private router: Router,
    private auth: AuthenticatorService,
    private commonService : CommonServiceFactory,
    private appC: AppComponent,
    private addBookService: AddBookService,
    private issueBookService: IssueBookService,
  ) { }

  ngOnInit() {

    this.tempFromDate = moment(new Date()).format("DD MMM YYYY");
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
        this.numberOfLateDaysWithoutFine = res.lib_issue_for_days
        console.log(this.numberOfLateDaysWithoutFine)

        this.tempToDate = moment(new Date()).add(this.numberOfLateDaysWithoutFine, 'days').format("DD MMM YYYY");

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

  searchInBookList(search_string: any){
    this.isRippleLoad = true;
    this.issueBookService.getSearchedBooks(this.searchTitle).subscribe(
      response => {
        let res: any;
        res = response;
        this.isRippleLoad = false;
        if(res.response.length > 0){
          this.bookSuggestionForTitle = true;
          this.bookSuggestionListForTitle = res.response;
        }
        else{
          this.bookSuggestionForTitle = false;
        }
      })
  }

  closeBookTitleSuggestion(){
    this.bookSuggestionForTitle = false;
  }

  selectBookForAdvanceSearch(title){
    this.searchTitle = title;
    this.bookSuggestionForTitle = false;
  }

  searchInList(search_string: any){
    if (search_string.which <= 90 && search_string.which >= 48 || search_string.which == 8 || search_string.which == 13){
      this.filter = false;
      this.suggestionList = [];
      if(this.searchInput != ''){
        this.getSearchData();
      }
      if(search_string.which == 13){
        this.showSearchResult();
      }

    }
    if(this.searchInput == '' || this.searchInput == null){
      this.suggestion = false;
      this.filter = false;
    }
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

  searchBorrower(search_string: any){
    if (search_string.which <= 90 && search_string.which >= 48 || search_string.which == 8){
      this.selectedBorrowerId = "";
      this.getBorrowerData();
    }
    if(this.borrower.length == 0 || this.borrower == '' || this.borrower == null){
      this.borSuggestions = false;
    }
  }

  getBorrowerData(){

    this.issueBookService.getBorrowerData(this.borrower).subscribe(
      response => {
        this.isRippleLoad = false;
        let res: any;
        res = response;
        if(res.response != null && res.response.length != 0){
          console.log(response)
          this.borSuggestions = true;
          this.borrowerSearchData = res.response;
        }
        else{
          if(res.errorResponse[0].errorCode == 700){
            this.messageHandler('error', 'Book alredy exists', '');
          }
        }

      })
  }

  showSearchResult(){
    this.bookSuggestion = false;
    this.searchResult = true;
  }

  getSearchData(){
    this.isRippleLoad = true;
    this.issueBookService.getSearchedBooks(this.searchInput).subscribe(
      response => {
        let res: any;
        res = response;
        this.isRippleLoad = false;
        if(res.response.length > 0){
          this.suggestion = true;
          this.suggestionList = res.response;
        }
        else{
          this.suggestion = false;
        }

        // this.authorSuggestionList = res.response
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
      // "sort": [
      //   {
      //     "column": "updated",
      //     "assending" : false
      //   }
      // ],
    	"pageNo": this.pageIndex,
    	"noOfRecords": this.displayBatchSize
    }

    // console.log(obj);

    this.isRippleLoad = true;
    this.issueBookService.getBookFilterData(obj).subscribe(
      response => {
        this.isRippleLoad = false;
        let res: any;
        res = response;
        this.bookSearchData = [];
        this.totalCount =0;
        this.searchResult = true;
        if(res.response.results.length  > 0){
          console.log(response)
          this.bookSearchData = res.response.results;
          this.totalCount = res.response.totalRecords;
          this.searchResult = true;
        }
        else{
          this.messageHandler('info', 'No data found', '');
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

  selectBookForIssue(book_id){
    this.suggestion = false;
    this.isRippleLoad = true;
    this.issueBookService.getBookDetails(book_id).subscribe(
      response => {

        let res: any;
        res = response;
        if(res.response != null){
          console.log(response)
          this.searchResult = true;
          this.bookSearchData = res.response.results;
          this.isRippleLoad = false;
        }
        else{
          if(res.errorResponse[0].errorCode == 700){
            this.messageHandler('error', 'Book alredy exists', '');
          }
          this.isRippleLoad = false;
        }

      })
  }

  selectStudent(borrower_details){
    this.borrower = borrower_details.student_name;
    this.selectedBorrowerId = borrower_details.student_id;
    this.borSuggestions = false;

    this.getBooksStatusForStudent();

  }

  getBooksStatusForStudent(){

    this.issueBookService.getBooksStatusForStudent(this.selectedBorrowerId).subscribe(
      response => {
        this.isRippleLoad = false;
        let res: any;
        res = response;
        if(res.response != null){
          console.log(response)
          this.booksInHandStatus = true;
          this.bookInHand = res.response.length;
          this.booksInHandDetails = res.response;
        }
        else{
          this.messageHandler('error', 'Internal server error', '');
        }
    })

  }

  selectBookFromDate(){
    let fromDateNotGreaterThanToday = this.graterThanToday(this.bookFromDate);
    if(fromDateNotGreaterThanToday){
      this.tempFromDate = moment(this.bookFromDate).format("DD MMM YYYY");
      this.tempToDate = moment(this.bookFromDate).add(this.numberOfLateDaysWithoutFine, 'days').format("DD MMM YYYY");
    }
    else{
      this.messageHandler('error', 'From date cannot be future date', '');
      return;
    }
    let check = this.dateGreaterThanCheck(this.bookFromDate, this.bookToDate);
    if(check){
      this.tempFromDate = moment(this.bookFromDate).format("DD MMM YYYY");
    }
    else{
      this.messageHandler('error', 'From date can not be greater than To date', '');
      this.bookFromDate = moment(this.tempFromDate).format("DD MMM YYYY");
      return;
    }
  }

  selectBookToDate(){
    let check = this.dateGreaterThanCheck(this.bookFromDate, this.bookToDate);
    if(check){
      this.tempToDate = moment(this.bookToDate).format("DD MMM YYYY");
    }
    else{
      this.messageHandler('error', 'To date can not be lesser than From date', '');
      this.bookToDate = moment(this.tempToDate).format("DD MMM YYYY");
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

  dateGreaterThanCheck(from_date, to_date){
    from_date = new Date(from_date);
    to_date = new Date(to_date);
    let currentDate = new Date();

    if(from_date > to_date){
      return false;
    }
    else if(from_date > currentDate){
      return false;
    }
    else{
      return true;
    }
  }

  issueBook(){
    if(this.selectedBorrowerId == "" || this.selectedBorrowerId == null){
      this.messageHandler('error', 'Please enter borrower name', '');
    }
    else{
      let obj = {
        "book_id": this.bookDataForIssue.book_id,
       "issued_on": moment(this.tempFromDate).unix() * 1000,
       "to_return_on_date": moment(this.tempToDate).unix() * 1000,
       "issued_to": this.selectedBorrowerId
      }

      console.log(obj)
      this.isRippleLoad = true;
      this.multiClickDisabled = true;
      this.issueBookService.issueBook(obj).subscribe(
        response => {
          this.isRippleLoad = false;
          this.multiClickDisabled = false;
          let res: any;
          res = response;
          if(res.response != null){
            console.log(response)
            this.messageHandler('success', 'Book issued successfully', '');
            this.clearIssueBookRecord();
            this.searchResult = false;
            this.bookSuggestion = false;
            this.filter = false;
            this.searchInput = "";
          }
          else if(res.errorResponse[0].errorCode == 2000){
            this.messageHandler('error', 'No book available in stock', '');
          }
          else{
            this.messageHandler('error', 'Internal server error', '');
          }

        })
    }
  }

  clearIssueBookRecord(){
    this.selectedBorrowerId = "";
    this.tempFromDate = moment(new Date()).format("DD MMM YYYY");
    this.tempToDate = moment(new Date()).format("DD MMM YYYY");
    this.bookFromDate = moment(new Date()).format("DD MMM YYYY");
    this.bookToDate = moment(new Date()).format("DD MMM YYYY");

    this.booksInHandStatus = false;
    this.bookInHand = 0;
    this.booksInHandDetails = [];
  }

  showIssueBookPopup(bookData){
    this.bookSuggestion = true;
    this.searchResult = false;
    this.borrower = "";
    this.booksInHandDetails = [];
    this.booksInHandStatus = false;
    this.bookInHand = 0;
    this.tempFromDate = moment(new Date()).format("DD MMM YYYY");
    // this.tempToDate = moment(new Date()).format("DD MMM YYYY");
    this.bookFromDate = moment(new Date()).format("DD MMM YYYY");
    this.bookToDate = this.tempToDate;
    this.bookDataForIssue = bookData;

  }

  concatString(authorArray){
    this.hoverTitle = "";
      for(let i = 0; i < authorArray.length; i++){
        this.hoverTitle += authorArray[i].author_name;
        if(i < authorArray.length - 1 && authorArray.length > 1){
          this.hoverTitle += ", ";
        }
      }
    return this.hoverTitle;
  }

  concatAuthorList(authorArray){
    this.hoverTitleAuthor = "";
      for(let i = 0; i < authorArray.length; i++){
        this.hoverTitleAuthor += authorArray[i].author_name;
        if(i >= 0 && i < authorArray.length - 1 && authorArray.length > 1){
          this.hoverTitleAuthor += ", ";
        }
      }
    return this.hoverTitleAuthor;
  }

  messageHandler(type, title, body){
    let obj = {
         type: type,
         title: title,
         body: body
       }
    this.appC.popToast(obj);
  }

  closeSuggestionAndFilter(){
    this.suggestion = false;
    this.filter = false;
    this.borSuggestions = false;
  }

  clearResult(){
    this.borrower = "";
    this.booksInHandStatus = false;
    this.booksInHandDetails = [];
  }

  openCalendar(id) {
    document.getElementById(id).click();
  }

  /*** pagination functions */
  /* Fetch next set of data from server and update table */
  fetchNext() {
      this.pageIndex++;
      this.fectchTableDataByPage(this.pageIndex);
  }

  /* Fetch previous set of data from server and update table */
  fetchPrevious() {
      this.pageIndex--;
      this.fectchTableDataByPage(this.pageIndex);
  }

  /* Fetch table data by page index */
  fectchTableDataByPage(index) {
    this.pageIndex = index;
    let startindex = this.displayBatchSize * (index - 1);
    this.advanceSearch();
  }

  /* Fetches Data as per the user selected batch size */
  updateTableBatchSize(num) {
    this.pageIndex = 1;
    this.displayBatchSize = parseInt(num);
    this.advanceSearch();
  }

}