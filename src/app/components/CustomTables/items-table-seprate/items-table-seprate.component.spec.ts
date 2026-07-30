import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemsTableSeprateComponent } from './items-table-seprate.component';

describe('ItemsTableSeprateComponent', () => {
  let component: ItemsTableSeprateComponent;
  let fixture: ComponentFixture<ItemsTableSeprateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ItemsTableSeprateComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ItemsTableSeprateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
