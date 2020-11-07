import { Directive, ElementRef, 
    Input, Renderer2, OnInit } from '@angular/core';
@Directive({ selector: '[ctStyleCell]'})
export class StyleCellDirective implements OnInit {
@Input() ctStyleCell: string;
constructor(
  private el: ElementRef, 
  private renderer: Renderer2) { }
ngOnInit() {
   if (this.ctStyleCell === undefined) {
       this.renderer.setStyle(
            this.el.nativeElement, 
            'color', 
            '#dcdcdc');
       this.renderer.setStyle(
            this.el.nativeElement, 
            'text-align', 
            'center');
   }
   if (typeof this.ctStyleCell === 'number') {
       this.renderer.setStyle(
            this.el.nativeElement, 
            'text-align', 
            'center');
   }
}
}