import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SendToMessagesComponent } from './send-to-messages.component';

describe('SendToMessagesComponent', () => {
  let component: SendToMessagesComponent;
  let fixture: ComponentFixture<SendToMessagesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SendToMessagesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SendToMessagesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
