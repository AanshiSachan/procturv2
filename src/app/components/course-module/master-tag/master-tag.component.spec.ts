import { async, ComponentFixture, TestBed } from '@angular/core/testing';
 import { MasterTagService } from '../master-tag/master-tag.component.service'; 
import { MasterTagComponent } from './master-tag.component';

describe('HomeComponent', () => {
  let component: MasterTagComponent;
  let fixture: ComponentFixture<MasterTagComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MasterTagComponent ],
      providers: [MasterTagService]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MasterTagComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
