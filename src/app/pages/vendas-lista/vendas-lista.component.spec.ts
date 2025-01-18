import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VendasListaComponent } from './vendas-lista.component';

describe('VendasComponent', () => {
  let component: VendasListaComponent;
  let fixture: ComponentFixture<VendasListaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VendasListaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VendasListaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
