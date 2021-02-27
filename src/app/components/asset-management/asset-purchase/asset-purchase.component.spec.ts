import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AssetPurchaseComponent } from './asset-purchase.component';

describe('AssetPurchaseComponent', () => {
  let component: AssetPurchaseComponent;
  let fixture: ComponentFixture<AssetPurchaseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AssetPurchaseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AssetPurchaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
