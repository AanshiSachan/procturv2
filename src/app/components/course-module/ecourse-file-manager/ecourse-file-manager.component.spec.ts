import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EcourseFileManagerComponent } from './ecourse-file-manager.component';

describe('EcourseFileManagerComponent', () => {
  let component: EcourseFileManagerComponent;
  let fixture: ComponentFixture<EcourseFileManagerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EcourseFileManagerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EcourseFileManagerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
