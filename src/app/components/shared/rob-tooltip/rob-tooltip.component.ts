import {
    Component, EventEmitter, Input, Output, ElementRef,
    Renderer2, ViewChild, OnChanges, SimpleChanges, HostListener
} from '@angular/core';
import { TooltipConfig } from 'ngx-bootstrap/tooltip';

@Component({
    selector: 'rob-tooltip',
    templateUrl: './rob-tooltip.component.html',
    styleUrls: ['./rob-tooltip.component.scss']
})
export class RobTooltipComponent implements OnChanges {

    @Input() textMessage: string = '?';
    @Input() message: string = 'Tooltip';
    @Input() customClass: string = '';
    @Input() placement: string = 'auto';

    constructor() { }

    ngOnChanges() {
        this.customClass = "tooltip-" + this.customClass;
        console.log(this.customClass);
    }

}

// such override allows to keep some initial values

// export function getAlertConfig(): TooltipConfig {
//     return Object.assign(new TooltipConfig(), {
//         placement: 'right',
//         container: 'body'
//     });
// }
