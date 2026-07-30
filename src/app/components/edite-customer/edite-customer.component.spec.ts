import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditeCustomerComponent } from './edite-customer.component';

describe('EditeCustomerComponent', () => {
  let component: EditeCustomerComponent;
  let fixture: ComponentFixture<EditeCustomerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditeCustomerComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EditeCustomerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
