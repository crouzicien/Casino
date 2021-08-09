import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { JeuDeLoisComponent } from './jeu-de-lois.component';

describe('JeuDeLoisComponent', () => {
  let component: JeuDeLoisComponent;
  let fixture: ComponentFixture<JeuDeLoisComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JeuDeLoisComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JeuDeLoisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
