import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TopicBulkUploadComponent } from './topic-bulk-upload.component';

describe('TopicBulkUploadComponent', () => {
  let component: TopicBulkUploadComponent;
  let fixture: ComponentFixture<TopicBulkUploadComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TopicBulkUploadComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TopicBulkUploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
