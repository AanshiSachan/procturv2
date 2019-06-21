import { Component, OnInit, ViewChild, ElementRef, Renderer2, ViewEncapsulation, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators, FormControl, AbstractControl, ValidatorFn } from '@angular/forms';
import { AppComponent } from '../../../app.component';
import { AuthenticatorService } from '../../../services/authenticator.service';
import { CommonServiceFactory } from '../../../services/common-service';
import { MastersService } from '../../../services/library/master/masters.service';

@Component({
  selector: 'app-masters',
  templateUrl: './masters.component.html',
  styleUrls: ['./masters.component.scss']
})
export class MastersComponent implements OnInit {

  currentSectionName: string = '';
  searchInput: string = '';
  isRippleLoad: boolean = false;
  multiClickDisabled: boolean = false;

  // FOR Category and Subcategory
  categorySuggestions: boolean = false;
  categoryList: any;
  newSubCat: boolean = false;
  categoryName: string = '';
  subcategoryName: string = '';
  categorySubCatList: any = [];
  editCategoryName: string = '';
  editSubCategoryName: string = '';
  selectedRowForCat = '';
  tempCatSubList: any;
  subcatEdit: boolean = false;

// For Subject
  subjectList: any = [];
  subjectName: string = '';
  editSubjectName: string = '';
  selectedRowForSubject = '';

  // For Publication
  publicationName: string = '';
  publicationList: any = [];
  editPublicationName: string = '';
  selectedRowForPublication = '';

  // For Author
  authorName: string = '';
  authorList: any = [];
  editAuthorName: string = '';
  selectedRowForAuthor = '';

  // For Reference
  referenceName: string = '';
  referenceList: any = [];
  editReferenceName: string = '';
  selectedRowForReference = '';

  // For Language
  languageName: string = '';
  languageList: any = [];
  editLanguageName: string = '';
  selectedRowForLanguage = '';


  constructor(
    private router: Router,
    private auth: AuthenticatorService,
    private commonService : CommonServiceFactory,
    private appC: AppComponent,
    private masterService: MastersService

  ) { }

  ngOnInit() {

    this.changeMasterCategory('item1', 'for_category');
  }

  changeMasterCategory(itemId, section_name){
    for(let i = 1; i <= 6 ; i++){
      document.getElementById("item"+i).classList.remove("active");
    }
    document.getElementById(itemId).classList.add("active");

    for(let i = 0; i < 6; i++){
      document.getElementsByClassName("middle_section")[i].classList.add("hide");
    }
    document.getElementById(section_name).classList.remove("hide");

    this.searchInput = '';
    this.getCategory(section_name);
  }

  searchInList(search_string: any){
    if(this.searchInput != '' && this.searchInput != null){
      if (search_string.which <= 90 && search_string.which >= 48 || search_string.which == 8){
        this.isRippleLoad = true;
        this.masterService.searchData(this.currentSectionName, this.searchInput).subscribe(
          response => {
            let res: any;
            res = response;
            this.isRippleLoad = false;
            if(res.response != null){
              if(this.currentSectionName.includes('category')){
                this.categorySubCatList = res.response;
              }
              if(this.currentSectionName.includes('subject')){
                this.subjectList = res.response;
              }
              if(this.currentSectionName.includes('publication')){
                this.publicationList = res.response;
              }
              if(this.currentSectionName.includes('author')){
                this.authorList = res.response;
              }
              if(this.currentSectionName.includes('reference')){
                this.referenceList = res.response;
              }
              if(this.currentSectionName.includes('language')){
                this.languageList = res.response;
              }
            }
            else{
              console.log(res.errorResponse)
            }
          })
      }
    }
    else{
      this.getCategory(this.currentSectionName)
    }
  }

  getCategory(section_name){
    if(section_name.includes('category')){
      this.categoryName = "";
      this.subcategoryName = ""
      this.currentSectionName = 'category';
      this.getAllCategory();
      this.getAllParentCategory();
    }
    if(section_name.includes('subject')){
      this.subjectName = "";
      this.currentSectionName = 'subject';
      this.getAllSubjects();
    }
    if(section_name.includes('publication')){
      this.publicationName = "";
      this.currentSectionName = 'publication';
      this.getAllPublications();
    }
    if(section_name.includes('author')){
      this.authorName = "";
      this.currentSectionName = 'author';
      this.getAllAuthors();
    }
    if(section_name.includes('reference')){
      this.referenceName = "";
      this.currentSectionName = 'reference';
      this.getAllReferences();
    }
    if(section_name.includes('language')){
      this.languageName = "";
      this.currentSectionName = 'language';
      this.getAllLanguages();
    }
  }

  showCategorySuggestions(search_string: any){
    this.categoryList = this.tempCatSubList;
    for(let i = 0; i < this.categoryList.length; i++){
      if(this.categoryList[i].category_name.includes(search_string.key)){
        i++;
      }
      else{
        this.categoryList.splice(i, 1);
      }
    }

    if(this.categoryList.length > 0){
      this.categorySuggestions = true;
    }
    else{
      this.categorySuggestions = false;
    }

    if(this.categoryName == "" || this.categoryName == null){
      this.categoryList = this.tempCatSubList;
      this.categorySuggestions = false;
    }
  }

  showSuggestions(){
    if(this.categorySuggestions){
      this.categorySuggestions = false;
    }
    else{
      this.categorySuggestions = true;
    }

  }

  chooseCategory(cat_name){
    this.categoryName = cat_name;
    this.categorySuggestions = false;
  }

  addCatAndSubCat(){
    if(this.categoryName != '' && this.categoryName != null){
      let obj = {
        "category_name" : this.categoryName
      }
      if(this.subcategoryName != '' && this.subcategoryName != null){
        this.addBulkCatAndSubCat();
      }
      else{
        this.isRippleLoad = true;
        this.multiClickDisabled = true;
        this.masterService.addCategory(obj).subscribe(
          response => {
            let res: any;
            res = response;
            this.multiClickDisabled = false;
            this.isRippleLoad = false;
            if(res.response != null){
              this.messageHandler('success', 'Category added successfully', '');
              this.categoryName = "";
              this.subcategoryName = "";
              this.categorySuggestions = false;
              this.getAllCategory();
              this.getAllParentCategory();
            }
            else{
              if(res.errorResponse[0].errorCode == 700){
                this.messageHandler('error', 'Category already exists', '');
              }
              this.categorySuggestions = false;
              console.log(res.errorResponse)
            }
          })
      }

    }
    else{
      this.messageHandler('error', 'Enter category name', '');
    }
  }

  addBulkCatAndSubCat(){
    let obj = {
      "category_name" : this.categoryName,
      "sub_category_name": this.subcategoryName
    }
    this.isRippleLoad = true;
    this.multiClickDisabled = true;
    this.masterService.addCatAndSubCat(obj).subscribe(
      response => {
        let res: any;
        res = response;
        this.multiClickDisabled = false;
        this.isRippleLoad = false;
        if(res.response != null){
          this.messageHandler('success', 'Category added successfully', '');
          this.categoryName = "";
          this.subcategoryName = "";
          this.categorySuggestions = false;
          this.getAllCategory();
          this.getAllParentCategory();
        }
        else{
          if(res.errorResponse[0].errorCode == 700){
            this.messageHandler('error', 'Category already exists', '');
          }
          this.categorySuggestions = false;
          console.log(res.errorResponse[0].errorCode == 700)
        }
      })
  }

  getAllCategory(){
    this.isRippleLoad = true;
    this.masterService.getAllCategory().subscribe(
      response => {
        let res: any;
        res = response;
        this.isRippleLoad = false;
        if(res.response != null){
          this.categorySubCatList = res.response;
          this.tempCatSubList = res.response;
          console.log(this.categorySubCatList);
        }
        else{
          console.log(res.errorResponse)
        }
      })
  }

  getAllParentCategory(){
    this.isRippleLoad = true;
    this.masterService.getAllParentCategory().subscribe(
      response => {
        let res: any;
        res = response;
        this.isRippleLoad = false;
        if(res.response != null){
          this.categoryList = res.response;
          this.tempCatSubList = res.response;
        }
        else{
          console.log(res.errorResponse)
        }
      })
  }


  editCat(category, row_no){
    if(category.sub_category_id != null && category.sub_category_name != null){
      this.subcatEdit = true;
      this.editSubCategoryName = category.sub_category_name;
    }
    else{
      this.subcatEdit = false;
    }
    this.categorySuggestions = false;
    if (this.selectedRowForCat !== "") {
      //console.log(this.selectedRow);
      document.getElementById(("cat_row_dis" + this.selectedRowForCat).toString()).style.display = "flex";
      document.getElementById(("cat_row_edit" + this.selectedRowForCat).toString()).style.display = "none";
    }
    this.selectedRowForCat = row_no;
    document.getElementById(("cat_row_dis" + row_no).toString()).style.display = "none";
    document.getElementById(("cat_row_edit" + row_no).toString()).style.display = "flex";

    this.editCategoryName = category.category_name;

  }

  saveCat(cat_id, subcat_id){
    if(subcat_id != null){
      if(this.editCategoryName != '' && this.editCategoryName != null){
        let obj = {
          "category_name" : this.editCategoryName,
          "category_id": cat_id,
          "sub_category_name": this.editSubCategoryName,
          "sub_category_id": subcat_id
        }
        this.isRippleLoad = true;
        this.masterService.updateCatSubCat(obj).subscribe(
          response => {
            let res: any;
            res = response;
            this.categorySuggestions = false;
            this.isRippleLoad = false;
            if(res.response != null){
              this.messageHandler('success', 'Category updated successfully', '');
              this.editCategoryName = "";
              this.editSubCategoryName = "";
              this.getAllCategory();
            }
            else{
              if(res.errorResponse[0].errorCode == 700){
                this.messageHandler('error', 'Category already exists', '');
              }
              console.log(res.errorResponse)
            }
          })
      }
      else{
        this.messageHandler('error', 'Enter category name', '');
      }
    }
    else{
      if(this.editCategoryName != '' && this.editCategoryName != null){
        let obj = {
          "category_name" : this.editCategoryName,
          "category_id": cat_id
        }
        this.isRippleLoad = true;
        this.masterService.updateCat(obj).subscribe(
          response => {
            let res: any;
            res = response;
            this.categorySuggestions = false;
            this.isRippleLoad = false;
            if(res.response != null){
              this.messageHandler('success', 'Category updated successfully', '');
              this.editCategoryName = "";
              this.editSubCategoryName = "";
              this.getAllCategory();
            }
            else{
              if(res.errorResponse[0].errorCode == 700){
                this.messageHandler('error', 'Category already exists', '');
              }
              console.log(res.errorResponse)
            }
          })
      }
      else{
        this.messageHandler('error', 'Enter category name', '');
      }
    }

  }

  deleteCat(category){
    console.log(category)
    if(category.sub_category_id != null){
      this.delete(category.sub_category_id, 'category')
    }
    else{
      this.delete(category.category_id, 'category')
    }
  }



  // For Subject

  getAllSubjects(){
    this.isRippleLoad = true;
    this.masterService.getAllSubjects().subscribe(
      response => {
        let res: any;
        res = response;
        this.isRippleLoad = false;
        if(res.response != null){
          this.subjectList = res.response;
          console.log(this.subjectList);
        }
        else{
          console.log(res.errorResponse)
        }
      })
  }

  addSubject(){
    if(this.subjectName != '' && this.subjectName != null){
      let obj = {
        "subject_name" : this.subjectName
      }
      this.isRippleLoad = true;
      this.multiClickDisabled = true;
      this.masterService.addSubject(obj).subscribe(
        response => {
          let res: any;
          res = response;
          this.multiClickDisabled = false;
          this.isRippleLoad = false;
          if(res.response != null){
            this.messageHandler('success', 'Subject added successfully', '');
            this.subjectName = "";
            this.getAllSubjects();
          }
          else{
            if(res.errorResponse[0].errorCode == 700){
              this.messageHandler('error', 'Subject already exists', '');
            }
            console.log(res.errorResponse)
          }
        })
    }
    else{
      this.messageHandler('error', 'Enter subject Name', '');
    }

  }

  editSubject(subject, row_no){
    if (this.selectedRowForSubject !== "") {
      //console.log(this.selectedRow);
      document.getElementById(("subject_row_dis" + this.selectedRowForSubject).toString()).style.display = "flex";
      document.getElementById(("subject_row_edit" + this.selectedRowForSubject).toString()).style.display = "none";
    }
    this.selectedRowForSubject = row_no;
    document.getElementById(("subject_row_dis" + row_no).toString()).style.display = "none";
    document.getElementById(("subject_row_edit" + row_no).toString()).style.display = "flex";

    this.editSubjectName = subject.subject_name;
  }

  saveSubject(subject_id){

    if(this.editSubjectName != '' && this.editSubjectName != null){
      let obj = {
        "subject_name" : this.editSubjectName,
        "subject_id": subject_id
      }
      this.isRippleLoad = true;
      this.masterService.updateSubject(obj).subscribe(
        response => {
          let res: any;
          res = response;
          this.isRippleLoad = false;
          if(res.response != null){
            this.messageHandler('success', 'Subject updated successfully', '');
            this.editSubjectName = "";
            this.getAllSubjects();
          }
          else{
            console.log(res.errorResponse)
          }
        })
    }
    else{
      this.messageHandler('error', 'Enter subject name', '');
    }
  }


  // FOR PUBLICATION

  getAllPublications(){
    this.isRippleLoad = true;
    this.masterService.getAllPublications().subscribe(
      response => {
        let res: any;
        res = response;
        this.isRippleLoad = false;
        if(res.response != null){
          this.publicationList = res.response;
        }
        else{
          console.log(res.errorResponse)
        }
      })
  }

  addPublication(){
    if(this.publicationName != '' && this.publicationName != null){
      let obj = {
        "publication_name" : this.publicationName
      }
      this.isRippleLoad = true;
      this.multiClickDisabled = true;
      this.masterService.addPublication(obj).subscribe(
        response => {
          let res: any;
          res = response;
          this.multiClickDisabled = false;
          this.isRippleLoad = false;
          if(res.response != null){
            this.messageHandler('success', 'Publication added successfully', '');
            this.publicationName = "";
            this.getAllPublications();
          }
          else{
            if(res.errorResponse[0].errorCode == 700){
              this.messageHandler('error', 'Publication already exists', '');
            }
            console.log(res.errorResponse)
          }
        })
    }
    else{
      this.messageHandler('error', 'Enter publication name', '');
    }
  }

  editPublication(publication, row_no){
    if (this.selectedRowForPublication !== "") {
      //console.log(this.selectedRow);
      document.getElementById(("publication_row_dis" + this.selectedRowForPublication).toString()).style.display = "flex";
      document.getElementById(("publication_row_edit" + this.selectedRowForPublication).toString()).style.display = "none";
    }
    this.selectedRowForPublication = row_no;
    document.getElementById(("publication_row_dis" + row_no).toString()).style.display = "none";
    document.getElementById(("publication_row_edit" + row_no).toString()).style.display = "flex";

    this.editPublicationName = publication.publication_name;
  }

  savePublication(publication_id){

    if(this.editPublicationName != '' && this.editPublicationName != null){
      let obj = {
        "publication_name" : this.editPublicationName,
        "publication_id": publication_id
      }
      this.isRippleLoad = true;
      this.masterService.updatePublication(obj).subscribe(
        response => {
          let res: any;
          res = response;
          this.isRippleLoad = false;
          if(res.response != null){
            this.messageHandler('success', 'Publication updated successfully', '');
            this.editPublicationName = "";
            this.getAllPublications();
          }
          else{
            console.log(res.errorResponse)
          }
        })
    }
    else{
      this.messageHandler('error', 'Enter publication name', '');
    }
  }


  // FOR AUTHOR

  getAllAuthors(){
    this.isRippleLoad = true;
    this.masterService.getAllAuthors().subscribe(
      response => {
        let res: any;
        res = response;
        this.isRippleLoad = false;
        if(res.response != null){
          this.authorList = res.response;
        }
        else{
          console.log(res.errorResponse)
        }
      })
  }

  addAuthor(){
    if(this.authorName != '' && this.authorName != null){
      let obj = {
        "author_name" : this.authorName
      }
      this.isRippleLoad = true;
      this.multiClickDisabled = true;
      this.masterService.addAuthor(obj).subscribe(
        response => {
          let res: any;
          res = response;
          this.isRippleLoad = false;
          this.multiClickDisabled = false;
          if(res.response != null){
            this.messageHandler('success', 'Author added successfully', '');
            this.authorName = "";
            this.getAllAuthors();
          }
          else{
            if(res.errorResponse[0].errorCode == 700){
              this.messageHandler('error', 'Author already exists', '');
            }
            console.log(res.errorResponse)
          }
        })
    }
    else{
      this.messageHandler('error', 'Enter author name', '');
    }
  }

  editAuthor(author, row_no){
    if (this.selectedRowForAuthor !== "") {
      //console.log(this.selectedRow);
      document.getElementById(("author_row_dis" + this.selectedRowForAuthor).toString()).style.display = "flex";
      document.getElementById(("author_row_edit" + this.selectedRowForAuthor).toString()).style.display = "none";
    }
    this.selectedRowForAuthor = row_no;
    document.getElementById(("author_row_dis" + row_no).toString()).style.display = "none";
    document.getElementById(("author_row_edit" + row_no).toString()).style.display = "flex";

    this.editAuthorName = author.author_name;
  }

  saveAuthor(author_id){

    if(this.editAuthorName != '' && this.editAuthorName != null){
      let obj = {
        "author_name" : this.editAuthorName,
        "author_id": author_id
      }
      this.isRippleLoad = true;
      this.masterService.updateAuthor(obj).subscribe(
        response => {
          let res: any;
          res = response;
          this.isRippleLoad = false;
          if(res.response != null){
            this.messageHandler('success', 'Author updated successfully', '');
            this.editAuthorName = "";
            this.getAllAuthors();
          }
          else{
            console.log(res.errorResponse)
          }
        })
    }
    else{
      this.messageHandler('error', 'Enter author name', '');
    }
  }


  // FOR REFERENCES

  getAllReferences(){
    this.isRippleLoad = true;
    this.masterService.getAllReferences().subscribe(
      response => {
        let res: any;
        res = response;
        this.isRippleLoad = false;
        if(res.response != null){
          this.referenceList = res.response;
        }
        else{
          console.log(res.errorResponse)
        }
      })
  }

  addReference(){
    if(this.referenceName != '' && this.referenceName != null){
      let obj = {
        "reference_name" : this.referenceName
      }
      this.isRippleLoad = true;
      this.multiClickDisabled = true;
      this.masterService.addReference(obj).subscribe(
        response => {
          let res: any;
          res = response;
          this.isRippleLoad = false;
          this.multiClickDisabled = false;
          if(res.response != null){
            this.messageHandler('success', 'Reference added successfully', '');
            this.referenceName = "";
            this.getAllReferences();
          }
          else{
            if(res.errorResponse[0].errorCode == 700){
              this.messageHandler('error', 'Reference already exists', '');
            }
            console.log(res.errorResponse)
          }
        })
    }
    else{
      this.messageHandler('error', 'Enter reference name', '');
    }
  }

  editReference(reference, row_no){
    if (this.selectedRowForReference !== "") {
      //console.log(this.selectedRow);
      document.getElementById(("reference_row_dis" + this.selectedRowForReference).toString()).style.display = "flex";
      document.getElementById(("reference_row_edit" + this.selectedRowForReference).toString()).style.display = "none";
    }
    this.selectedRowForReference = row_no;
    document.getElementById(("reference_row_dis" + row_no).toString()).style.display = "none";
    document.getElementById(("reference_row_edit" + row_no).toString()).style.display = "flex";

    this.editReferenceName = reference.reference_name;
  }

  saveReference(reference_id){

    if(this.editReferenceName != '' && this.editReferenceName != null){
      let obj = {
        "reference_name" : this.editReferenceName,
        "reference_id": reference_id
      }
      this.isRippleLoad = true;
      this.masterService.updateReference(obj).subscribe(
        response => {
          let res: any;
          res = response;
          this.isRippleLoad = false;
          if(res.response != null){
            this.messageHandler('success', 'Reference updated successfully', '');
            this.editReferenceName = "";
            this.getAllReferences();
          }
          else{
            console.log(res.errorResponse)
          }
        })
    }
    else{
      this.messageHandler('error', 'Enter reference name', '');
    }
  }


  // For Language

  getAllLanguages(){
    this.isRippleLoad = true;
    this.masterService.getAllLanguages().subscribe(
      response => {
        let res: any;
        res = response;
        if(res.response != null){
          this.isRippleLoad = false;
            this.languageList = res.response;
        }
        else{
          this.isRippleLoad = false;
          console.log(res.errorResponse)
        }
      })
  }

  addLanguage(){
    if(this.languageName != '' && this.languageName != null){
      let obj = {
          "language_name" : this.languageName
      }
      this.isRippleLoad = true;
      this.multiClickDisabled = true;
      this.masterService.addLanguage(obj).subscribe(
        response => {
          let res: any;
          res = response;
          this.multiClickDisabled = false;
          if(res.response != null){
            this.isRippleLoad = false;
            this.messageHandler('success', 'Language added successfully', '');
            this.languageName = "";
            this.getAllLanguages();
          }
          else{
            this.isRippleLoad = false;
            if(res.errorResponse[0].errorCode == 700){
              this.messageHandler('error', 'Language already exists', '');
            }
            console.log(res.errorResponse)
          }
        })
    }
    else{
      this.messageHandler('error', 'Enter language name', '');
    }
  }

  editLanguage(language, row_no){
    if (this.selectedRowForLanguage !== "") {
      //console.log(this.selectedRow);
      document.getElementById(("language_row_dis" + this.selectedRowForLanguage).toString()).style.display = "flex";
      document.getElementById(("language_row_edit" + this.selectedRowForLanguage).toString()).style.display = "none";
    }
    this.selectedRowForLanguage = row_no;
    document.getElementById(("language_row_dis" + row_no).toString()).style.display = "none";
    document.getElementById(("language_row_edit" + row_no).toString()).style.display = "flex";

    this.editLanguageName = language.language_name;
  }

  saveLanguage(language_id){

    if(this.editLanguageName != '' && this.editLanguageName != null){
      let obj = {
        "language_name" : this.editLanguageName,
        "language_id": language_id
      }
      this.isRippleLoad = true;
      this.masterService.updateLanguage(obj).subscribe(
        response => {
          let res: any;
          res = response;
          if(res.response != null){
            this.isRippleLoad = false;
            this.messageHandler('success', 'Language updated successfully', '');
            this.editLanguageName = "";
            this.getAllLanguages();
          }
          else{
            this.isRippleLoad = false;
            console.log(res.errorResponse)
          }
        })
    }
    else{
      this.messageHandler('error', 'Enter language name', '');
    }
  }


  delete(id, key_name){
    let name = key_name.charAt(0).toUpperCase() + key_name.slice(1);
    this.isRippleLoad = true;
    this.masterService.delete(id, key_name).subscribe(
      response => {
        let res: any;
        res = response;
        if(res.response != null){
          this.isRippleLoad = false;
          this.messageHandler('success', name +' deleted successfully', '');

          if(key_name.includes('category')){
            this.categoryName = "";
            this.subcategoryName = "";
            this.getAllCategory();
          }
          if(key_name.includes('subject')){
            this.subjectName = "";
            this.getAllSubjects();
          }
          if(key_name.includes('publication')){
            this.publicationName = "";
            this.getAllPublications();
          }
          if(key_name.includes('author')){
            this.authorName = "";
            this.getAllAuthors();
          }
          if(key_name.includes('reference')){
            this.referenceName = "";
            this.getAllReferences();
          }
          if(key_name.includes('language')){
            this.languageName = "";
            this.getAllLanguages();
          }
        }
        else if(res.errorResponse[0].errorCode == 3000){
          this.messageHandler('error', name +' is linked with data and cannot be deleted', '');
          this.isRippleLoad = false;
        }
        else{
          this.isRippleLoad = false;
          console.log(res.errorResponse)
        }

      })
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