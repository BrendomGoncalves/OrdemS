import {Component, OnInit} from '@angular/core';
import {AccordionModule} from 'primeng/accordion';
import {Button, ButtonDirective} from 'primeng/button';
import {DropdownModule} from 'primeng/dropdown';
import {ListboxModule} from 'primeng/listbox';
import {StepperModule} from 'primeng/stepper';
import {TableModule} from 'primeng/table';
import {ActivatedRoute, Route, Router, RouterLink} from '@angular/router';
import {ClientesService} from '../../services/cliente/clientes.service';
import {Cliente} from '../../models/cliente';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {CurrencyPipe, DatePipe, NgForOf, NgIf} from '@angular/common';
import {EmpresaService} from '../../services/empresa/empresa.service';
import {OrdemServico} from '../../models/ordem-servico';
import {Produto} from '../../models/produto';
import {Servico} from '../../models/servico';
import {Categoria} from '../../models/categoria';
import {ProdutosService} from '../../services/produto/produtos.service';
import {ServicosService} from '../../services/servico/servicos.service';
import {CategoriasService} from '../../services/categoria/categorias.service';
import {StatusOrdemServicoEnum} from '../../enums/statusOrdemServicoEnum';
import {SelectButtonModule} from 'primeng/selectbutton';
import {MetodoPagamentoEnum} from '../../enums/metodoPagamentoEnum';
import {StatusPagamentoEnum} from '../../enums/statusPagamentoEnum';
import {InputNumberModule} from 'primeng/inputnumber';
import {CalendarModule} from 'primeng/calendar';
import {InputTextModule} from 'primeng/inputtext';
import {Desconto} from '../../models/desconto';
import {InputTextareaModule} from 'primeng/inputtextarea';
import {MessageService} from 'primeng/api';
import {ToastModule} from 'primeng/toast';
import {OrdensService} from '../../services/ordem/ordens.service';
import {EntradaEquipamentoService} from '../../services/entrada-equipamento/entrada-equipamento.service';

@Component({
  selector: 'app-ordem-servico',
  standalone: true,
  imports: [
    AccordionModule,
    DropdownModule,
    ListboxModule,
    StepperModule,
    TableModule,
    ButtonDirective,
    RouterLink,
    FormsModule,
    NgIf,
    Button,
    ReactiveFormsModule,
    NgForOf,
    CurrencyPipe,
    DatePipe,
    SelectButtonModule,
    InputNumberModule,
    CalendarModule,
    InputTextModule,
    InputTextareaModule,
    ToastModule
  ],
  templateUrl: './ordem-servico.component.html',
  styleUrl: './ordem-servico.component.css'
})
export class OrdemServicoComponent implements OnInit {
  ordemServico: OrdemServico = {
    id: '',
    empresa: {nome: '', cnpj: '', tecnico: '', telefone: '', endereco: '', celular: '', email: ''},
    cliente: null,
    equipamento: '',
    dataAbertura: null,
    dataConclusao: null,
    descricaoProblema: '',
    laudoTecnico: '',
    status: StatusOrdemServicoEnum.EM_ANDAMENTO,
    valorTotal: 0,
    servicos: [],
    produtosUtilizados: [],
    pagamento: {
      metodoPagamento: MetodoPagamentoEnum.DINHEIRO,
      statusPagamento: null,
      observacoes: '',
      dataPagamento: null,
      descontos: [],
      descontoTotal: 0
    }
  };
  clienteSelecionado: Cliente | null = null;
  produtosSelecionados: Produto[] = [];
  servicosSelecionados: Servico[] = [];
  descontoAdicionado: Desconto = {valor: 0, descricao: ''};
  totalServicos: number = 0;
  totalProdutos: number = 0;
  metodoPagamentoItems = [
    {value: MetodoPagamentoEnum.DINHEIRO, icon: 'pi pi-money-bill', color: 'green'},
    {value: MetodoPagamentoEnum.CARTAO_CREDITO, icon: 'pi pi-credit-card', color: 'blue'},
    {value: MetodoPagamentoEnum.CARTAO_DEBITO, icon: 'pi pi-credit-card', color: 'blue'},
    {value: MetodoPagamentoEnum.PIX, icon: 'pi pi-dollar', color: 'gray'}
  ];
  statusPagamentoItems = [
    {value: StatusPagamentoEnum.PAGO, icon: 'pi pi-check-circle', color: 'green'},
    {value: StatusPagamentoEnum.CANCELADO, icon: 'pi pi-times-circle', color: 'red'}
  ];
  adicionarPagamento: boolean = false;

  // Listas
  listaClientes: Cliente[] = [];
  listaProdutos: Produto[] = [];
  listaServicos: Servico[] = [];
  listaCategorias: Categoria[] = [];

  // Carregamento
  carregandoBotao = false;

  protected readonly Object = Object;
  protected readonly StatusOrdemServicoEnum = StatusOrdemServicoEnum;
  protected readonly MetodoPagamentoEnum = MetodoPagamentoEnum;
  protected readonly StatusPagamentoEnum = StatusPagamentoEnum;

  constructor(private empresaService: EmpresaService,
              private clientesService: ClientesService,
              private produtosService: ProdutosService,
              private servicosService: ServicosService,
              private categoriasService: CategoriasService,
              private ordensService: OrdensService,
              private messageService: MessageService,
              private activateRoute: ActivatedRoute,
              private router: Router,
              private entradaEquipamentoService: EntradaEquipamentoService,
  ) {
  }

  async ngOnInit(): Promise<void> {
    let id;
    let isEntradaEquipamento: boolean = false;

    this.activateRoute.url.subscribe(urlSegments => {
      if (urlSegments.length > 1 && urlSegments[1].path !== null) {
        if (urlSegments[1].path === 'entrada-equipamento') {
          isEntradaEquipamento = true;
          id = urlSegments[2].path;
        } else {
          isEntradaEquipamento = false;
          id = urlSegments[1].path;
        }
      }
    });

    if (id && !isEntradaEquipamento) {
      (await this.ordensService.getOrdemById(id)).subscribe(ordem => {
        this.ordemServico = {
          ...ordem,
          dataAbertura: ordem.dataAbertura ? new Date(ordem.dataAbertura) : null,
          dataConclusao: ordem.dataConclusao ? new Date(ordem.dataConclusao) : null,
          pagamento: {
            ...ordem.pagamento,
            dataPagamento: ordem.pagamento.dataPagamento ? new Date(ordem.pagamento.dataPagamento) : null
          }
        }
        this.clienteSelecionado = ordem.cliente;
        this.produtosSelecionados = ordem.produtosUtilizados;
        this.servicosSelecionados = ordem.servicos;
        this.calcularTotalProdutos();
        this.calcularTotalServicos();
        this.calcularTotal();
      });
    } else if (id && isEntradaEquipamento) {
      (await this.entradaEquipamentoService.getEntradaEquipamentoById(id)).subscribe(async (entradaEquipamento) => {
        this.ordemServico = {
          id: '',
          empresa: entradaEquipamento.empresa,
          cliente: entradaEquipamento.cliente,
          equipamento: entradaEquipamento.equipamento,
          dataAbertura: null,
          dataConclusao: null,
          descricaoProblema: entradaEquipamento.descricaoProblema,
          laudoTecnico: '',
          status: StatusOrdemServicoEnum.EM_ANDAMENTO,
          valorTotal: 0,
          servicos: [],
          produtosUtilizados: [],
          pagamento: {
            metodoPagamento: MetodoPagamentoEnum.DINHEIRO,
            statusPagamento: null,
            observacoes: '',
            dataPagamento: null,
            descontos: [],
            descontoTotal: 0
          }
        };
        this.clienteSelecionado = entradaEquipamento.cliente;
        this.ordemServico.id = await this.ordensService.novoId();
      });
    } else {
      this.ordemServico.id = await this.ordensService.novoId();
      this.ordemServico.dataAbertura = new Date();
    }
    (await this.empresaService.getEmpresa()).subscribe((empresa) => {
      this.ordemServico.empresa = {
        nome: empresa.nome,
        cnpj: empresa.cnpj,
        tecnico: empresa.tecnico,
        telefone: empresa.telefone,
        endereco: empresa.endereco,
        celular: empresa.celular,
        email: empresa.email
      };
    });
    (await this.clientesService.getClientes()).subscribe((clientes) => {
      this.listaClientes = clientes;
    });
    (await this.produtosService.getProdutos()).subscribe((produtos) => {
      this.listaProdutos = produtos;
    });
    (await this.servicosService.getServicos()).subscribe((servicos) => {
      this.listaServicos = servicos;
    });
    (await this.categoriasService.getCategorias()).subscribe((categorias) => {
      this.listaCategorias = categorias;
    });
  }

  limparClienteSelecionado() {
    this.clienteSelecionado = null;
  }

  aumentarQuantidadeServico(servicoId: string) {
    this.servicosSelecionados.forEach(servico => {
      if (servico.id === servicoId) {
        if (servico.quantidadeVenda === undefined) {
          servico.quantidadeVenda = 0;
        }
        servico.quantidadeVenda++;
      }
    });
    this.calcularTotalServicos();
  }

  diminuirQuantidadeServico(servicoId: string) {
    this.servicosSelecionados.forEach(servico => {
      if (servico.id === servicoId) {
        if (servico.quantidadeVenda === undefined) {
          servico.quantidadeVenda = 1;
        }
        if (servico.quantidadeVenda > 1) servico.quantidadeVenda--;
      }
    });
    this.calcularTotalServicos();
  }

  aumentarQuantidadeProduto(produtoId: string) {
    this.produtosSelecionados.forEach(produto => {
      if (produto.id === produtoId) {
        if (produto.quantidadeVenda === undefined) {
          produto.quantidadeVenda = 0;
        }
        produto.quantidadeVenda++;
      }
    });
    this.calcularTotalProdutos();
  }

  diminuirQuantidadeProduto(produtoId: string) {
    this.produtosSelecionados.forEach(produto => {
      if (produto.id === produtoId) {
        if (produto.quantidadeVenda === undefined) {
          produto.quantidadeVenda = 1;
        }
        if (produto.quantidadeVenda > 1) produto.quantidadeVenda--;
      }
    });
    this.calcularTotalProdutos();
  }

  limparServicosSelecionados() {
    this.servicosSelecionados = [];
    this.totalServicos = 0;
  }

  protected calcularTotalServicos() {
    this.totalServicos = this.servicosSelecionados.reduce((total, servico) => {
      return total + (servico.precoVenda * servico.quantidadeVenda);
    }, 0);
  }

  protected calcularTotalProdutos() {
    this.totalProdutos = this.produtosSelecionados.reduce((total, produto) => {
      return total + (produto.precoVenda * produto.quantidadeVenda);
    }, 0);
  }

  imprimir() {
    window.print();
  }

  adicionarDesconto() {
    if (this.descontoAdicionado.descricao === '') {
      this.descontoAdicionado.descricao = 'Desconto da loja';
    }
    this.ordemServico.pagamento.descontos.push(this.descontoAdicionado);
    this.ordemServico.pagamento.descontoTotal += this.descontoAdicionado.valor;
    this.ordemServico.pagamento.descontos.sort((a, b) => a.valor - b.valor).reverse();
    this.descontoAdicionado = {valor: 0, descricao: ''};
  }

  deletarDesconto(desconto: Desconto) {
    this.ordemServico.pagamento.descontos = this.ordemServico.pagamento.descontos.filter(d => d !== desconto);
    this.ordemServico.pagamento.descontoTotal -= desconto.valor;
  }

  verificarDataEntrega() {
    if (this.ordemServico.dataConclusao !== null && this.ordemServico.dataAbertura !== null) {
      if (this.ordemServico.dataConclusao < this.ordemServico.dataAbertura) {
        this.messageService.add({
          severity: 'error',
          summary: 'Data de entrega inválida',
          detail: 'Data de entrega não pode ser anterior a data de abertura',
          life: 5000
        });
        this.ordemServico.dataConclusao = this.ordemServico.dataAbertura;
      }
    }
  }

  async salvarOrdem() {
    this.carregandoBotao = true;
    let ordemBanco;
    (await this.ordensService.getOrdemById(this.ordemServico.id)).subscribe(ordem => {
      ordemBanco = ordem;
    });

    if (ordemBanco !== null) {
      (await this.ordensService.updateOrdem(this.ordemServico.id, this.ordemServico)).subscribe(() => {
        setTimeout(() => {
          this.carregandoBotao = false;
          this.messageService.add({
            severity: 'success',
            summary: 'Ordem de serviço',
            detail: 'Ordem de serviço atualizada',
            life: 5000
          });
          this.router.navigate(['/ordens']);
        }, 2000);
      });
    } else {
      if (this.ordemServico !== undefined) {
        if (this.ordemServico.empresa === undefined ||
          this.ordemServico.cliente === undefined ||
          this.ordemServico.equipamento === '' ||
          this.ordemServico.descricaoProblema === '') {
          this.messageService.add({
            severity: 'error',
            summary: 'Ordem de serviço',
            detail: 'Preencha os campos obrigatórios',
            life: 5000
          });
        } else {
          (await this.ordensService.addOrdem(this.ordemServico)).subscribe(() => {
            this.ordemServico = {
              id: '',
              empresa: {nome: '', cnpj: '', tecnico: '', telefone: '', endereco: '', celular: '', email: ''},
              cliente: null,
              equipamento: '',
              dataAbertura: null,
              dataConclusao: null,
              descricaoProblema: '',
              laudoTecnico: '',
              status: StatusOrdemServicoEnum.EM_ANDAMENTO,
              valorTotal: 0,
              servicos: [],
              produtosUtilizados: [],
              pagamento: {
                metodoPagamento: MetodoPagamentoEnum.DINHEIRO,
                statusPagamento: null,
                observacoes: '',
                dataPagamento: null,
                descontos: [],
                descontoTotal: 0
              }
            };
            setTimeout(() => {
              this.carregandoBotao = false;
              this.messageService.add({
                severity: 'success',
                summary: 'Ordem de serviço',
                detail: 'Ordem de serviço cadastrada',
                life: 5000
              });
              this.router.navigate(['/ordens']);
            }, 2000);
          });
        }
      }
    }
  }

  calcularTotal() {
    this.ordemServico.valorTotal = this.totalProdutos + this.totalServicos - this.ordemServico.pagamento.descontoTotal;
  }

  resetPagamento() {
    this.ordemServico.pagamento = {
      metodoPagamento: MetodoPagamentoEnum.DINHEIRO,
      statusPagamento: null,
      observacoes: '',
      dataPagamento: null,
      descontos: [],
      descontoTotal: 0
    };
  }
}
