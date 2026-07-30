import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CtgComponent } from './ctg.component';

describe('CtgComponent', () => {
  let component: CtgComponent;
  let fixture: ComponentFixture<CtgComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CtgComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CtgComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
