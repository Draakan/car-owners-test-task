import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemOwnerComponent } from './item-owner.component';

describe('ItemOwnerComponent', () => {
  let component: ItemOwnerComponent;
  let fixture: ComponentFixture<ItemOwnerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ItemOwnerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ItemOwnerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
