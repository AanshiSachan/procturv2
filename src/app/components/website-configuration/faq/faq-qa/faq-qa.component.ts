import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-faq-qa',
  templateUrl: './faq-qa.component.html',
  styleUrls: ['./faq-qa.component.scss']
})
export class FaqQaComponent implements OnInit {

  activeSession: any;

  constructor() { }

  ngOnInit(): void {
  }

  toggleActiveSession(item) {
    this.activeSession = item;
  }
}
