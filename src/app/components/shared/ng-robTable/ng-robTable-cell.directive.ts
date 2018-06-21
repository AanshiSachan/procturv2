import {
    Directive, ElementRef,
    Input, Renderer, OnInit
} from '@angular/core';
@Directive({ selector: '[ctStyleCell]' })
export class RobTableCellDirective implements OnInit {
    @Input() ctStyleCell: string;
    constructor(
        private el: ElementRef,
        private renderer: Renderer) { }
    ngOnInit() {
        if (this.ctStyleCell === 'left') {
        }
        else if (this.ctStyleCell === 'redleft') {
            this.renderer.setElementStyle(this.el.nativeElement,'text-align','right');
            this.renderer.setElementStyle(this.el.nativeElement,'color','red');
        }
        else if (this.ctStyleCell === 'blueleft') {
            this.renderer.setElementStyle(this.el.nativeElement,'text-align','right');
            this.renderer.setElementStyle(this.el.nativeElement,'color','blue');
        }
        else if(this.ctStyleCell === 'width25'){
            this.renderer.setElementStyle(this.el.nativeElement,'text-align','left');
            this.renderer.setElementStyle(this.el.nativeElement,'width','15%');
        }
        else if (this.ctStyleCell === 'right') {
        }
    }
}