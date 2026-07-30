import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerTableSeprateComponent } from './customer-table-seprate.component';

describe('CustomerTableSeprateComponent', () => {
  let component: CustomerTableSeprateComponent;
  let fixture: ComponentFixture<CustomerTableSeprateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CustomerTableSeprateComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CustomerTableSeprateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
