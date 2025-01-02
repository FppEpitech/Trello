import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SettingNavbarComponent } from './setting-navbar.component';

describe('SettingNavbarComponent', () => {
  let component: SettingNavbarComponent;
  let fixture: ComponentFixture<SettingNavbarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SettingNavbarComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SettingNavbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
