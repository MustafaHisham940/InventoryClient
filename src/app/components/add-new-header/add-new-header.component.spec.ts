import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddNewHeaderComponent } from './add-new-header.component';

describe('AddNewHeaderComponent', () => {
  let component: AddNewHeaderComponent;
  let fixture: ComponentFixture<AddNewHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddNewHeaderComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AddNewHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
