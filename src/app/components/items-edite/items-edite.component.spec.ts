import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemsEditeComponent } from './items-edite.component';

describe('ItemsEditeComponent', () => {
  let component: ItemsEditeComponent;
  let fixture: ComponentFixture<ItemsEditeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ItemsEditeComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ItemsEditeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
