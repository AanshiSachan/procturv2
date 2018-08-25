import { Directive, Input, HostListener } from '@angular/core';


@Directive({
    selector: '[integerInput]'
})

export class IntegerInputDirective {

    @Input() integerInput: boolean;

    constructor() {
    }

    @HostListener('window:keydown', ['$event'])
    onKeyUpEvent(event: KeyboardEvent) {
        if (96 <= Number(event.which) && Number(event.which) <= 105) {
            // Do nothing 
        } else if (48 <= Number(event.which) && Number(event.which) <= 57) {
            // Do Nothing
        } else if (Number(event.which) == 8 || Number(event.which) == 46 || Number(event.which) == 9) {
            // Do Nothing
        }
        else {
            event.preventDefault();
        }
    }

}