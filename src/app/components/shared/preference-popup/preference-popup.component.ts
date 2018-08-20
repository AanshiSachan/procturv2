import { Component, OnInit, Input, Output, EventEmitter, ChangeDetectorRef } from '@angular/core';
import { TablePreferencesService } from '../../../services/table-preference/table-preferences.service';

@Component({
  selector: 'preference-popup',
  templateUrl: './preference-popup.component.html',
  styleUrls: ['./preference-popup.component.scss']
})
export class PreferencePopupComponent implements OnInit {

  @Input() settings: any;
  @Input() keys: any;
  @Output() closeButton = new EventEmitter<any>();
  displayKeys = [];
  flag: Boolean = true;

  constructor(private _tablePreferencesService: TablePreferencesService, private ref: ChangeDetectorRef) { }

  ngOnInit() {
    console.log(this.settings, this.keys);
    if (this.settings.keys.length == 0) {
     this.keys.forEach(obj=> obj.checked=false);
    }
    if (this._tablePreferencesService.getTablePreferences(this.settings.tableDetails.key).length > 0) {
      this.displayKeys = this._tablePreferencesService.getTablePreferences(this.settings.tableDetails.key);
      this.settings.keys = this.displayKeys;
      // console.log(this.displayKeys);
      this.keys.forEach((obj) => {
        obj.checked = false;
        this.displayKeys.forEach((obj2) => {
          if (obj2.primaryKey == obj.primaryKey) {
            obj.checked = true;
          }
        })
      })
    }

  }
  ngDoCheck() {
    if (this.displayKeys.length !== this.settings.keys.length) {
      this.ref.markForCheck();
      this.settings.keys = this.displayKeys.length;
    }
  }

  closePopups(obj) {

    this.closeButton.emit(obj);
  }

  change(e, obj) {
    // console.log(obj);
    if (e.target.checked) {
      if (this.displayKeys.filter(e => e.primaryKey === obj.primaryKey).length == 0) {
        obj.checked = true;
        this.displayKeys.push(obj);

      }
    }
    else {
      if (this.displayKeys.filter(e => e.primaryKey === obj.primaryKey).length > 0) {
        this.displayKeys.splice(this.displayKeys.findIndex(i => i.primaryKey === obj.primaryKey), 1);
      }
    }


    this.displayKeys.sort((a, b) => a.priority < b.priority ? -1 : a.priority > b.priority ? 1 : 0);
    console.log(this.displayKeys);
  }

  selctedFieldsDisplay() {
    let obj ={callNotify:true};
    if (this._tablePreferencesService.getTablePreferences(this.settings.tableDetails.key).length == 0) {
        obj["callNotify"] =  false;
    }
    this._tablePreferencesService.setTablePreferences(this.settings.tableDetails.key, this.displayKeys);
    this.closePopups(obj);



  }


}
