import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { Router } from '../../../../../../node_modules/@angular/router';

@Component({
  selector: 'app-study-material',
  templateUrl: './study-material.component.html',
  styleUrls: ['./study-material.component.scss']
})
export class StudyMaterialComponent implements OnInit {

  @Input()
  product_id: any;
  @Input()
  prodForm: any;
  @Output() nextForm = new EventEmitter<string>();
  @Output() startForm = new EventEmitter<string>();
  @Output() toggleLoader = new EventEmitter<boolean>();

  constructor(private router: Router) { }

  ngOnInit() {
  }

  toggleRows(event) {
    console.log(event);
    let operation = event.target.attributes['data'].value;
    let length = event.target.parentNode.parentNode.parentNode.children.length;
    for (let i = 1; i < length; i++) {
      let child_el = event.target.parentNode.parentNode.parentNode.children[i];
      if (operation == 'hide') {
        child_el.classList.remove('fade-in');
        child_el.classList.add('fade-out');

        event.target.classList.remove('btn-close');
        event.target.classList.add('btn-open');
        event.target.attributes['data'].value = 'show';
      }
      else {
        child_el.classList.remove('fade-out');
        child_el.classList.add('fade-in');

        event.target.classList.add('btn-close');
        event.target.classList.remove('btn-open');
        event.target.attributes['data'].value = 'hide';
      }
    }

  }

  gotoBack() {
    this.router.navigateByUrl('/products');
  }

  gotoNext() {
    this.nextForm.emit();
  }
}
