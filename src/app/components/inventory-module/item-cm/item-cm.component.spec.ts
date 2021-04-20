import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemCmComponent } from './item-cm.component';

describe('ItemCmComponent', () => {
  let component: ItemCmComponent;
  let fixture: ComponentFixture<ItemCmComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ItemCmComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ItemCmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
