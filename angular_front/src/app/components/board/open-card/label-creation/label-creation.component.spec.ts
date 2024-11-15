import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LabelCreationComponent } from './label-creation.component';

describe('LabelCreationComponent', () => {
  let component: LabelCreationComponent;
  let fixture: ComponentFixture<LabelCreationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LabelCreationComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(LabelCreationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
