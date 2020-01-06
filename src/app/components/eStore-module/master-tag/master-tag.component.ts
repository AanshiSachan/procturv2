import {Component} from '@angular/core';
import { MasterTagService } from '../master-tag/master-tag.component.service'
import { MessageShowService } from '../../../../app/services/message-show.service';
import { AuthenticatorService } from '../../../../../src/app/services/authenticator.service';

declare var $;


@Component({
    selector: 'master-tag',
    templateUrl: './master-tag.component.html',
    styleUrls: ['./master-tag.component.scss']
})
export class MasterTagComponent {
    isRippleLoad: boolean = true;
    allTagsList: any = [];
    selectedTag: string = '-1';
    tagDetailsData: any = [];
    tagName: string = '';
    tagDescription: string = '';
    instituteId: any = '';
    idToBeDeleted: any;
    disableDelete: boolean = false;
    editTagName: string;
    editTagDescription: string;
    editTagStatus: any;
    tagId: number;
    searchTag: string = '';
    constructor(private tagSrvc: MasterTagService,
        private msgSrvc: MessageShowService,
        private auth: AuthenticatorService){
    }
    ngOnInit(){
        this.auth.currentInstituteId.subscribe(id => {
            this.instituteId = id;
          });
        this.getAllTags();
    }
    //fetch master courses
    getAllTags(){
        this.isRippleLoad = true;
        this.tagDetailsData = [];
        this.allTagsList = [];
        this.tagSrvc.fetchAllMasterTags().subscribe(data =>{
            this.allTagsList = data;
            this.tagDetailsData = this.allTagsList;
            this.isRippleLoad = false;
            if(!this.allTagsList.length){
                this.msgSrvc.showErrorMessage('info', '', 'No tags linked');
            }
           
        },error =>{
            this.isRippleLoad = false;
            this.msgSrvc.showErrorMessage('Error', '',error.error.message);
        })
    }

    selectTag(tagId){
        this.selectedTag = tagId;
      //  this.showDetails = false;
    }
    //fetch tag details wrt tagId
    getTagDetails(){
        this.isRippleLoad = true;
        if(this.selectedTag != '-1'){
        this.tagSrvc.fetchTagDetails(this.selectedTag).subscribe(data =>{
          //  this.showDetails = true;
            this.tagDetailsData = data;
            //converting object to array
            this.tagDetailsData = new Array(this.tagDetailsData);
            this.isRippleLoad = false;            
        }, err =>{
            this.isRippleLoad = false;
            this.msgSrvc.showErrorMessage(this.msgSrvc.toastTypes.error, '', err.error.message);
        })
     }
     else {
         this.isRippleLoad = false;
         this.getAllTags();
       //  this.msgSrvc.showErrorMessage(this.msgSrvc.toastTypes.error,'', 'Please select master tag')
     }
    }

    openDeleteModal(id) {
        this.idToBeDeleted = id;
        this.disableDelete = false;
        $('#deleteTag').modal('show');
    }
    openEditModal(tagObject){
        this.tagId = tagObject.tagId;
        this.editTagName = tagObject.tagName;
        this.editTagDescription = tagObject.description;
        this.editTagStatus = tagObject.is_active;
        $('#updateTag').modal('show');
    }

    updateMasterTag(){
         this.isRippleLoad = true;
         let payload = {
            'tagId': this.tagId,
            'tagName': this.editTagName,
            'description': this.editTagDescription,
            'instituteId': this.instituteId,
            'is_active': this.editTagStatus
        } 

        this.tagSrvc.updateTagDetails(payload).subscribe(resp =>{
            let temp : any = resp;
            this.msgSrvc.showErrorMessage('success', '', temp.message);
            $('#updateTag').modal('hide');
            this.isRippleLoad = false;
            this.getAllTags();
            this.getTagDetails();
        }, err =>{
            this.isRippleLoad = false;
            this.msgSrvc.showErrorMessage(this.msgSrvc.toastTypes.error, '', err.error.message)
        })
    }

    // delete functionality
    deleteMasterTag(){
        this.isRippleLoad = true;
        this.disableDelete = true;
        this.tagSrvc.deleteTagDetails(this.idToBeDeleted).subscribe(data =>{
            let temp: any = data;
            this.msgSrvc.showErrorMessage('success','', temp.message);
            this.isRippleLoad = false;
            $('#deleteTag').modal('hide');
            this.selectedTag = '-1';
            this.getTagDetails();
        }, err =>{
            this.isRippleLoad = false;
            this.disableDelete = false;
            this.msgSrvc.showErrorMessage(this.msgSrvc.toastTypes.error, '', err.error.message)
        })
    }

    createMasterTag(){        
        if(this.tagName == ''){
            this.msgSrvc.showErrorMessage('info','',"Enter Tag Name")
        }
        else {
            this.isRippleLoad = true;
            let payload = {};
             payload = {
                "tagName":this.tagName,
	            "description":this.tagDescription,
	            "instituteId":this.instituteId
            }
            this.tagSrvc.addMasterTagInInstitute(payload).subscribe(data =>{
                let temp: any = data;                           
                this.msgSrvc.showErrorMessage('success', '', temp.message)
                this.isRippleLoad = false;   
                this.tagDescription = '';
                this.tagName = ''; 
                $('#addTag').modal('hide'); 
                this.getAllTags();
                //this.getTagDetails();   
            }, error =>{
                this.isRippleLoad = false;
                this.msgSrvc.showErrorMessage('Error', '', error.error.message)
            })
        }
    }

    //search/filter tags
    filterTag(){        
        if(this.searchTag != null && this.searchTag != ''){
            console.log(this.searchTag)
            let searchItem: any ;
            console.log(this.allTagsList);
            //searchItem = this.allTagsList.filter(el => el.tagName.toLowerCase() == 'ddf')
             searchItem = this.allTagsList.filter(el => 
               (el.tagName.toLowerCase().indexOf(this.searchTag.toLowerCase()) > -1 )
                ); 
            this.tagDetailsData = searchItem;
        }
        else {
            this.getAllTags();
        }
    }
    
}