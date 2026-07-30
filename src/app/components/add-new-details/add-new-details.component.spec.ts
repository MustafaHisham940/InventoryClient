import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddNewDetailsComponent } from './add-new-details.component';

describe('AddNewDetailsComponent', () => {
  let component: AddNewDetailsComponent;
  let fixture: ComponentFixture<AddNewDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddNewDetailsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AddNewDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
