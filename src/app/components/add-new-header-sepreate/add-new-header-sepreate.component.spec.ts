import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddNewHeaderSepreateComponent } from './add-new-header-sepreate.component';

describe('AddNewHeaderSepreateComponent', () => {
  let component: AddNewHeaderSepreateComponent;
  let fixture: ComponentFixture<AddNewHeaderSepreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddNewHeaderSepreateComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AddNewHeaderSepreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
