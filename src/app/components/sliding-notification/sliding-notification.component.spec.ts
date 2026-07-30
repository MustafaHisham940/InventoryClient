import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SlidingNotificationComponent } from './sliding-notification.component';

describe('SlidingNotificationComponent', () => {
  let component: SlidingNotificationComponent;
  let fixture: ComponentFixture<SlidingNotificationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SlidingNotificationComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SlidingNotificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
