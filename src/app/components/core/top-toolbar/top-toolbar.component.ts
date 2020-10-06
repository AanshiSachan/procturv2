import { Component, ElementRef, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-top-toolbar',
  templateUrl: './top-toolbar.component.html',
  styleUrls: ['./top-toolbar.component.scss']
})
export class TopToolbarComponent implements OnInit {
  instituteName: string;
  instituteId: string;
  isResultDisplayed: boolean = false;
  inputValue: any;
  resultStat: any = 1;
  private userInput: string;
  studentResult: any[] = [];
  enquiryResult: any[] = [];
  sideBar: boolean = false;
  helpMenu: boolean = false;
  searchBar: boolean = false;
  @ViewChild('searchInput', { static: true }) searchInput: ElementRef;
  @ViewChild('seachResult', { static: true }) seachResult: ElementRef;
  @Output() searchViewMore = new EventEmitter<any>();
  @Output() hideSearchPopup = new EventEmitter<any>();
  @Output() enquiryUpdateAction = new EventEmitter<any>();
  constructor(private router: Router) { }

  ngOnInit(): void {
    this.instituteName = sessionStorage.getItem('institute_name');
    this.instituteId = sessionStorage.getItem('institute_id');
  }
  closeSearch(e) {
    this.isResultDisplayed = e;
    this.seachResult.nativeElement.classList.remove('searchView');

  }
  viewMoreRecods(e) {
    let obj = {
      source: e,
      input: this.userInput
    }
    this.closeSearch(false)
    this.searchViewMore.emit(obj);
    this.searchBar = false;
  }
  searchAgain(e) {
    this.userInput = e;
  }
  selectedStudent(s) {
    this.closeSearch(false);
    this.router.navigate(['/view/students'], { queryParams: { id: s.id } });
    this.searchBar = false;
  }
  selectedEnquiry(e) {
    this.closeSearch(false);
    this.router.navigate(['/view/leads'], { queryParams: { id: e.id } });
    this.searchBar = false;
  }
  actionSelected(d) {
    this.closeSearch(false);
    if (d.data.source == "Student") {
      this.router.navigate(['/view/students'], { queryParams: { id: d.data.id, action: d.action } });
      this.searchBar = false;
    }
    else if (d.data.source == "Enquiry") {
      if (d.action == "enquiryUpdate") {
        this.enquiryUpdateAction.emit(d);
        this.searchBar = false;
      }
      else
        this.router.navigate(['/view/leads/enquiry/edit/' + d.data.id]); {
        // this.router.navigate(['/view/leads'], { queryParams: { id: d.data.id, action: d.action } });
        this.searchBar = false;
      }
    }
  }
  closeMenu() {
    this.sideBar = false;
    this.searchBar = false;
    this.helpMenu = false;
    if (document.getElementById('blurBg')) {
      document.getElementById('blurBg').className = 'normal-background';
    }
    for (let i = 0; i < 6; i++) {
      if (document.getElementsByClassName("side-section")[i]) {
        document.getElementsByClassName("side-section")[i].classList.remove('active-current-menu');
        document.getElementsByClassName("side-section")[i].className = ' side-section';
      }
    }

  }
  triggerSearchBox($event) {
    this.showSearchBar();
    $event.preventDefault();
    this.isResultDisplayed = true;
    this.seachResult.nativeElement.classList.add('searchView');
    this.hideSearchPopup.emit(null);
  }
  showSearchBar() {
    this.searchBar = true;
    window.setTimeout(function () {
      document.getElementById("search_bar").focus();
    }, 550);
  }
}
