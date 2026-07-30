import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemsShowComponent } from './items-show.component';

describe('ItemsShowComponent', () => {
  let component: ItemsShowComponent;
  let fixture: ComponentFixture<ItemsShowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ItemsShowComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ItemsShowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
