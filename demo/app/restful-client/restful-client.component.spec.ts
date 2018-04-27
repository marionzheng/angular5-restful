import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {RestfulClientComponent} from './restful-client.component';

describe('RestfulClientComponent', () => {
  let component: RestfulClientComponent;
  let fixture: ComponentFixture<RestfulClientComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [RestfulClientComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RestfulClientComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
