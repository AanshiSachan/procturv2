var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { DataSource } from '../../../../lib/data-source/data-source';
import { Column } from '../../../../lib/data-set/column';
var TitleComponent = (function () {
    function TitleComponent() {
        this.currentDirection = '';
        this.sort = new EventEmitter();
    }
    TitleComponent.prototype.ngOnChanges = function (changes) {
        var _this = this;
        if (changes.source) {
            if (!changes.source.firstChange) {
                this.dataChangedSub.unsubscribe();
            }
            this.dataChangedSub = this.source.onChanged().subscribe(function (dataChanges) {
                var sortConf = _this.source.getSort();
                if (sortConf.length > 0 && sortConf[0]['field'] === _this.column.id) {
                    _this.currentDirection = sortConf[0]['direction'];
                }
                else {
                    _this.currentDirection = '';
                }
                sortConf.forEach(function (fieldConf) {
                });
            });
        }
    };
    TitleComponent.prototype._sort = function (event) {
        event.preventDefault();
        this.changeSortDirection();

        var displaysize = sessionStorage.getItem('displayBatchSize');

        /* Custom server sided sorting */
        var tempFormData = {
            name: "",
            phone: "",
            email: "",
            enquiry_no: "",
            priority: "",
            status: -1,
            follow_type: "",
            followUpDate: "",
            enquiry_date: "",
            assigned_to: -1,
            standard_id: -1,
            subject_id: -1,
            is_recent: "Y",
            slot_id: -1,
            filtered_slots: "",
            isDashbord: "N",
            enquireDateFrom: "",
            enquireDateTo: "",
            updateDate: "",
            updateDateFrom: "",
            updateDateTo: "",
            start_index: 0,
            batch_size: displaysize,
            closedReason: "",
            sorted_by: this.column.id,
            order_by: this.currentDirection == 'asc' ? 'desc' : 'asc'
        };

        var xReq = new XMLHttpRequest();
        var urlSort = "http://test999.proctur.com/StdMgmtWebAPI/api/v2/enquiry_manager/search/" + sessionStorage.getItem('institute_id');

        xReq.open("POST", urlSort, true);

        xReq.setRequestHeader("Content-Type", "application/json");
        xReq.setRequestHeader("Access-Control-Allow-Origin", "*");
        xReq.setRequestHeader("Authorization", sessionStorage.getItem('Authorization'));

        xReq.onreadystatechange = () => {
            if (xReq.readyState == 4) {
                if (xReq.status >= 200 && xReq.status < 300) {
                    this.source.data = JSON.parse(xReq.response);
                    sessionStorage.setItem('sorted_by', this.column.id);
                    sessionStorage.setItem('order_by', this.currentDirection)
                    this.source.setSort([
                        {
                            field: this.column.id,
                            direction: this.currentDirection,
                            compare: this.column.getCompareFunction(),
                        },
                    ]);
                } 
                else {
                    this.source.setSort([
                        {
                            field: this.column.id,
                            direction: this.currentDirection,
                            compare: this.column.getCompareFunction(),
                        },
                    ]);
                }
            }
        }

        xReq.send(JSON.stringify(tempFormData));
        this.sort.emit(null);
    };
    TitleComponent.prototype.changeSortDirection = function () {
        if (this.currentDirection) {
            var newDirection = this.currentDirection === 'asc' ? 'desc' : 'asc';
            this.currentDirection = newDirection;
        }
        else {
            this.currentDirection = this.column.sortDirection;
        }
        return this.currentDirection;
    };
    return TitleComponent;
}());
__decorate([
    Input(),
    __metadata("design:type", Column)
], TitleComponent.prototype, "column", void 0);
__decorate([
    Input(),
    __metadata("design:type", DataSource)
], TitleComponent.prototype, "source", void 0);
__decorate([
    Output(),
    __metadata("design:type", Object)
], TitleComponent.prototype, "sort", void 0);
TitleComponent = __decorate([
    Component({
        selector: 'ng2-smart-table-title',
        styles: ["a.sort.asc,a.sort.desc{font-weight:700}a.sort.asc::after,a.sort.desc::after{content:'';display:inline-block;width:0;height:0;border-bottom:4px solid rgba(0,0,0,.3);border-top:4px solid transparent;border-left:4px solid transparent;border-right:4px solid transparent;margin-bottom:2px}a.sort.desc::after{-webkit-transform:rotate(-180deg);transform:rotate(-180deg);margin-bottom:-2px} /*# sourceMappingURL=title.component.css.map */ "],
        template: "\n    <a href=\"#\" *ngIf=\"column.isSortable\"\n                (click)=\"_sort($event, column)\"\n                class=\"ng2-smart-sort-link sort\"\n                [ngClass]=\"currentDirection\">\n      {{ column.title }}\n    </a>\n    <span class=\"ng2-smart-sort\" *ngIf=\"!column.isSortable\">{{ column.title }}</span>\n  ",
    })
], TitleComponent);
export { TitleComponent };
//# sourceMappingURL=title.component.js.map