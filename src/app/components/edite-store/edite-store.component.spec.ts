import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditeStoreComponent } from './edite-store.component';

describe('EditeStoreComponent', () => {
  let component: EditeStoreComponent;
  let fixture: ComponentFixture<EditeStoreComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditeStoreComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EditeStoreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
