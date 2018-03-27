import { Component, EventEmitter, Input, Output, ElementRef, 
    Renderer2, ViewChild, OnChanges, SimpleChanges, HostListener } from '@angular/core';

@Component({
    selector: 'quick-filter',
    templateUrl: './quick-filter.component.html',
    styleUrls: ['./quick-filter.component.scss']
})
export class QuickFilterComponent implements OnChanges {

    isDropdown: boolean = false;
    selectedOptions: any[] = [];
    selectedOptionsString: string = "";
    dataMap: any[] = [];

    @Input() inputList: any[] = [];
    @Input() modelName: any;

    @Output() selectedValue = new EventEmitter<any>();



    ngOnChanges(): void {
        this.inputList;
        //console.log(this.inputList);
        this.modelName;
        this.selectedOptions = [];
        this.inputList.forEach(e => {
            if(e.checked){
                this.selectedOptions.push(e.prop);
                this.selectedOptionsString = this.selectedOptions.join(",");
            }
        });
    }


    checkBoxUpdated(i) {
        console.log(i);
        if (this.modelName === 'enqList') {
            this.updateEnqArray(i);
        }
    }

    @HostListener('document:click', ['$event', '$event.target'])
    onClick(event: MouseEvent, targetElement: HTMLElement): void {
      if (!targetElement.classList.contains('procturqf')) {
        this.isDropdown = false;
      }
    }
  
    toggleD($event){
        $event.preventDefault();
        $event.stopPropagation();
        this.isDropdown = !this.isDropdown;
    }

    updateEnqArray(i) {
        debugger
        if (i.prop == "All") {
            this.selectedOptions = [];
            this.selectedOptionsString = '';
            if (i.checked) {
                this.inputList.forEach(el => {
                    console.log(el);
                    if (el.prop != "All") {
                        el.checked = false;
                    }
                });
                this.selectedOptions.push(i.prop);
                this.selectedOptionsString = this.selectedOptions.join(",");
                this.selectedValue.emit(i);
            }
            else{

            }
        }
        if (i.prop == "pending") {
            this.selectedOptions = [];
            this.selectedOptionsString = '';
            if (i.checked) {
                this.inputList.forEach(el => {
                    if (el.prop != "pending") {
                        el.checked = false;
                    }
                });
                this.selectedOptions.push(i.prop);
                this.selectedOptionsString = this.selectedOptions.join(",");
                this.selectedValue.emit(i);
            }
            else{

            }
        }
        else if (i.prop != "All" && i.prop != "pending") {
            //console.log(this.selectedOptions);
            if(this.selectedOptions.indexOf("All") !== -1 || this.selectedOptions.indexOf("pending") !== -1){
                if(this.selectedOptions.indexOf("All") !== -1){
                    let indexAll = this.selectedOptions.indexOf("All");
                    this.selectedOptions.splice(indexAll, 1);                    
                }
                if(this.selectedOptions.indexOf("pending") !== -1){
                    let indextod = this.selectedOptions.indexOf("pending");
                    this.selectedOptions.splice(indextod, 1);   
                }
                this.inputList.forEach(el => {
                    if (el.prop == "All" || el.prop == 'pending') {
                        el.checked = false;
                    }
                });
                this.selectedValue.emit(i);
                if (i.checked) {
                    this.selectedOptions.push(i.prop);
                    this.selectedOptionsString = this.selectedOptions.join(",");
                }
                else {
                    let index = this.selectedOptions.indexOf(i.prop);
                    if (index !== -1) {
                        this.selectedOptions.splice(index, 1);
                    }
                    this.selectedOptionsString = this.selectedOptions.join(",");
                }
            }
            else{
                this.inputList.forEach(el => {
                    if (el.prop == "All" || el.prop == "pending") {
                        el.checked = false;
                    }
                });
                this.selectedValue.emit(i);
                if (i.checked) {
                    this.selectedOptions.push(i.prop);
                    this.selectedOptionsString = this.selectedOptions.join(",");
                }
                else {
                    let index = this.selectedOptions.indexOf(i.prop);
                    if (index !== -1) {
                        this.selectedOptions.splice(index, 1);
                    }
                    this.selectedOptionsString = this.selectedOptions.join(",");
                }
            }
        }
    }

    optionSelected(i) {
        if (i.checked) {
            this.selectedOptions.push(i.prop);
            this.selectedOptionsString = this.selectedOptions.join(",");
        }
        else {
            let index = this.selectedOptions.indexOf(i.prop);
            if (index !== -1) {
                this.selectedOptions.splice(index, 1);
            }
            this.selectedOptionsString = this.selectedOptions.join(",");
        }
    }
}