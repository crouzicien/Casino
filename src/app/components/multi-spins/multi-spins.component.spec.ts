import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MultiSpinsComponent } from './multi-spins.component';

describe('MultiSpinsComponent', () => {
  let component: MultiSpinsComponent;
  let fixture: ComponentFixture<MultiSpinsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MultiSpinsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MultiSpinsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
