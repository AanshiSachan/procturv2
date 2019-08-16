import { Component, OnInit } from '@angular/core';
import { HttpService } from '../../../services/http.service';
import { MessageShowService } from '../../../services/message-show.service';
import { ProductService } from '../../../services/products.service';

declare var $;

@Component({
  selector: 'app-group',
  templateUrl: './group.component.html',
  styleUrls: ['./group.component.scss']
})
export class GroupComponent implements OnInit {

  groupForm : any = {
    product_group_id : 0,
    title: '',
    tagline : '',
    operation: 'New'
  };

  deleteItem: any = {
    product_group_id : 0,
    title : ''
  };

  groupList : any = [];
  groupListLoading: boolean = true;
  total_items: any;

  constructor(
    private http : ProductService,
    private msgService: MessageShowService
  ){ }

  ngOnInit() {
    this.fetchGroupList();
  }

  // addEditGroup()
  // {
  //   console.log(this.groupForm);
  //   let body = {
  //     title: this.groupForm.title,
  //     tagline: this.groupForm.tagline
  //   };

  //   let url = 'product_groups';
  //   url += (this.groupForm.product_group_id > 0)?'/'+this.groupForm.product_group_id:'';

  //   if(this.groupForm.product_group_id > 0)
  //   {
  //     let editItem = this.groupList.filter(item => item.product_group_id == this.groupForm.product_group_id)[0];
  //     let index = this.groupList.indexOf(editItem);

  //     this.http.putMethod(url, body).then(
  //       (resp) => {
  //         let data = resp['body'];
  //         if(data.validate)
  //         {
  //         this.msgService.showErrorMessage('success', data.message, '');
  //           this.groupList[index].title   = body.title;
  //           this.groupList[index].tagline = body.tagline;
  //           $("#addEditGroupModal").modal('hide');
  //         }
  //         else{
  //           this.toaster.error('', data.errors.message);
  //         }
  //       },
  //       (err) => {
  //         console.log(err)
  //         this.msgService.showErrorMessage('error', err['error'].errors.message, '');
  //       }
  //     );
  //   }
  //   else{
  //     this.http.postMethod(url, body).then(
  //       (resp) => {
  //         let data = resp['body'];
  //         if(data.validate)
  //         {
  //         this.msgService.showErrorMessage('success', data.message, '');
  //           $("#addEditGroupModal").modal('hide');
  //         }
  //         else{
  //           this.toaster.error('', data.errors.message);
  //         }
  //       },
  //       (err) => {
  //         console.log(err)
  //         this.toaster.error('', err['error'].errors.message);
  //       }
  //     );
  //   }
  // }

  fetchGroupList()
  {
    let resp = {"validate":"true","data":{"total_items":17,"product_groups":[{"product_group_id":10,"title":"Video","tagline":"Again","slug":"video_prelims_crash_course_s56jTy","is_active":0,"total_products":77},{"product_group_id":11,"title":"groups 1","tagline":"just view it","slug":"group_prelims_crash_course_s56jTy","is_active":1,"total_products":11},{"product_group_id":12,"title":"groups ","tagline":"just view it","slug":"group_prelims_crash_course_s56jTy","is_active":1,"total_products":9},{"product_group_id":26,"title":"Group 1","tagline":"This is Group 1","slug":"group__oLjlMUc","is_active":1,"total_products":5},{"product_group_id":29,"title":"New Grop","tagline":"Okay","slug":"new_grop_5HSJSXF","is_active":1,"total_products":3},{"product_group_id":30,"title":"Again Groupef","tagline":"sdfsfsdf","slug":"again_groupef_BPTb8Gv","is_active":1,"total_products":0}]}};
    this.groupList = resp.data.product_groups;
    this.total_items = resp.data.total_items;
    this.groupListLoading = false;

    this.http.getData('product_groups', 'web').then(
      (response) => {
        let resp = response['body'];
        console.log(resp);
        this.groupList = resp.data.product_groups;
        this.total_items = resp.data.total_items;
        this.groupListLoading = false;
      },
      (err) => {

      }
    );
  }

  // openAddEditModal(id)
  // {
  //   if(id == 0)
  //   {
  //     this.groupForm = {
  //       product_group_id : 0,
  //       title: '',
  //       tagline : '',
  //       operation: 'New'
  //     }
  //   }
  //   else{
  //     let editItem = this.groupList.filter(item => item.product_group_id == id)[0];
  //     this.groupForm = {
  //       product_group_id: id,
  //       title : editItem.title,
  //       tagline : editItem.tagline,
  //       operation : 'Update'
  //     };
  //     console.log(editItem);
  //   }

  //   $("#addEditGroupModal").modal({
  //       backdrop: 'static',
  //       keyboard: false,
  //       show: true
  //   });
  // }

  // deleteGroupModal(id)
  // {
  //   this.deleteItem = this.groupList.filter(item => item.product_group_id == id)[0];
  //   $("#deleteGroupModal").modal({
  //       backdrop: 'static',
  //       keyboard: false,
  //       show: true
  //   });
  // }

  // confirmDelete(id)
  // {
  //   let item = this.groupList.filter(item => item.product_group_id == id)[0];
  //   let index = this.groupList.indexOf(item);
  //   console.log(index);
  //   this.http.deleteMethod('product_groups/'+id).then(
  //     (resp) => {
  //       let data = resp['body'];
  //       if(data.validate)
  //       {
  //       this.msgService.showErrorMessage('success', data.message, '');
  //         this.groupList.splice(index, 1);
  //         this.total_items--;
  //         $("#deleteGroupModal").modal('hide');
  //       }
  //       else{
  //         this.toaster.error('', data.errors.message);
  //       }
  //     },
  //     (err) => {
  //       console.log(err)
  //       this.toaster.error('', err['error'].errors.message);
  //     }
  //   );
  // }

  // changeStatus(id)
  // {
  //   let item = this.groupList.filter(item => item.product_group_id == id)[0];
  //   let index = this.groupList.indexOf(item);
  //   let status = (item.is_active)?0:1;
  //   this.http.patchMethod('product_groups/'+id, { is_active : status }).then(
  //     (resp) => {
  //       let data = resp['body'];
  //       if(data.validate)
  //       {
  //         this.groupList[index].is_active = status;
  //       this.msgService.showErrorMessage('success', data.message, '');
  //       }
  //       else{
  //         this.toaster.error('', data.errors.message);
  //       }
  //     },
  //     (err) => {
  //       console.log(err)
  //       this.toaster.error('', err['error'].errors.message);
  //     }
  //   );
  // }

  // loadMoreItems()
  // {
  //   this.groupListLoading = true;
  //   if(this.groupList.length < this.total_items)
  //   {
  //     this.http.getData('product_groups?offset='+this.groupList.length,'web').then(
  //       (resp) => {
  //         console.log(this.groupList);
  //         //this.groupList.concat([...(resp['body'].data.product_groups)]);
  //         this.groupList = [...this.groupList, ...resp['body'].data.product_groups];
  //         console.log(this.groupList);
  //         this.groupListLoading = false;
  //       },
  //       (err) => {

  //       }
  //     );
  //   }
  // }

}
