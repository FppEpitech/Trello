import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkspaceBoardsComponent } from './workspace-boards.component';

describe('WorkspaceBoardsComponent', () => {
  let component: WorkspaceBoardsComponent;
  let fixture: ComponentFixture<WorkspaceBoardsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [WorkspaceBoardsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(WorkspaceBoardsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
