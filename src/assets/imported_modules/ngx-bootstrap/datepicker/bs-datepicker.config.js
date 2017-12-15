import { Injectable } from '@angular/core';
var BsDatepickerConfig = (function () {
    function BsDatepickerConfig() {
        /** CSS class which will be applied to datepicker container,
         * usually used to set color theme
         */
        this.containerClass = 'theme-dark-blue';
        // DatepickerRenderOptions
        this.displayMonths = 1;
        /**
         * Allows to hide week numbers in datepicker
         */
        this.showWeekNumbers = false;
        this.dateInputFormat = 'DD-MMM-YYYY';
        // range picker
        this.rangeSeparator = ' - ';
        this.rangeInputFormat = 'DD-MMM-YYYY';
        // DatepickerFormatOptions
        /**
         * Allows to globally set default locale of datepicker,
         * see documentation on how to enable custom locales
         */
        this.locale = 'en';
        this.monthTitle = 'MMMM';
        this.yearTitle = 'YYYY';
        this.dayLabel = 'D';
        this.monthLabel = 'MMMM';
        this.yearLabel = 'YYYY';
        this.weekNumbers = 'w';
    }
    BsDatepickerConfig.decorators = [
        { type: Injectable },
    ];
    /** @nocollapse */
    BsDatepickerConfig.ctorParameters = function () { return []; };
    return BsDatepickerConfig;
}());
export { BsDatepickerConfig };
//# sourceMappingURL=bs-datepicker.config.js.map