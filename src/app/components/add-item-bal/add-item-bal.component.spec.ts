import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddItemBalComponent } from './add-item-bal.component';

describe('AddItemBalComponent', () => {
  let component: AddItemBalComponent;
  let fixture: ComponentFixture<AddItemBalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddItemBalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AddItemBalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
