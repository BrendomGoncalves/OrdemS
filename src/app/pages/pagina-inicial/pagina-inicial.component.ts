import {Component, OnInit, signal, Signal} from '@angular/core';
import {MenuModule} from 'primeng/menu';
import {ButtonDirective} from 'primeng/button';
import {RouterLink} from '@angular/router';
import {OrdensService} from '../../services/ordem/ordens.service';
import {EntradaEquipamentoService} from '../../services/entrada-equipamento/entrada-equipamento.service';
import {ProdutosService} from '../../services/produto/produtos.service';
import {ClientesService} from '../../services/cliente/clientes.service';
import {ServicosService} from '../../services/servico/servicos.service';
import {CategoriasService} from '../../services/categoria/categorias.service';
import {Empresa} from '../../models/empresa';
import {EmpresaService} from '../../services/empresa/empresa.service';

@Component({
  selector: 'app-pagina-inicial',
  standalone: true,
  imports: [
    RouterLink
  ],
  templateUrl: './pagina-inicial.component.html',
  styleUrl: './pagina-inicial.component.css',
})
export class PaginaInicialComponent implements OnInit {
  QOrdens = signal(0);
  QEntradaEquipamento = signal(0);
  QProdutos = signal(0);
  QClientes = signal(0);
  QServicos = signal(0);
  QCategorias = signal(0);

  empresa: Empresa | undefined;

  constructor(private ordemService: OrdensService,
              private entradaEquipamentoService: EntradaEquipamentoService,
              private produtosService: ProdutosService,
              private clientesService: ClientesService,
              private servicosService: ServicosService,
              private categoriasService: CategoriasService,
              private empresaService: EmpresaService,
  ) {}

  async ngOnInit(): Promise<void> {
    (await this.empresaService.getEmpresa()).subscribe(empresa => {
      this.empresa = empresa;
    });

    (await this.ordemService.getOrdens()).subscribe(ordens => {
      this.QOrdens.set(ordens.length);
    });
    (await this.entradaEquipamentoService.getEntradasEquipamentos()).subscribe(entradas => {
      this.QEntradaEquipamento.set(entradas.length);
    });
    (await this.produtosService.getProdutos()).subscribe(produtos => {
      this.QProdutos.set(produtos.length);
    });
    (await this.clientesService.getClientes()).subscribe(clientes => {
      this.QClientes.set(clientes.length);
    });
    (await this.servicosService.getServicos()).subscribe(servicos => {
      this.QServicos.set(servicos.length);
    });
    (await this.categoriasService.getCategorias()).subscribe(categorias => {
      this.QCategorias.set(categorias.length);
    });
  }
}
