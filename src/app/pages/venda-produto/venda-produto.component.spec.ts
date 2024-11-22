import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VendaProdutoComponent } from './venda-produto.component';

describe('VendaProdutoComponent', () => {
  let component: VendaProdutoComponent;
  let fixture: ComponentFixture<VendaProdutoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VendaProdutoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VendaProdutoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
