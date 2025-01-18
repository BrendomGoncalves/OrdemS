import {Component, OnInit} from '@angular/core';
import {Router, RouterLink} from '@angular/router';
import {SplitterModule} from 'primeng/splitter';
import {Produto} from '../../models/produto';
import {Cliente} from '../../models/cliente';
import {ProdutosService} from '../../services/produto/produtos.service';
import {ClientesService} from '../../services/cliente/clientes.service';
import {StepperModule} from 'primeng/stepper';
import {Button, ButtonDirective} from 'primeng/button';
import {DropdownModule} from 'primeng/dropdown';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {ListboxModule} from 'primeng/listbox';
import {AccordionModule} from 'primeng/accordion';
import {CurrencyPipe, NgForOf, NgIf} from '@angular/common';
import {TableModule} from 'primeng/table';
import {Venda} from '../../models/venda';
import {ToastModule} from 'primeng/toast';
import {MessageService} from 'primeng/api';
import {VendasService} from '../../services/venda/vendas.service';

@Component({
  selector: 'app-venda-produto',
  standalone: true,
  imports: [
    RouterLink,
    SplitterModule,
    StepperModule,
    Button,
    DropdownModule,
    FormsModule,
    ListboxModule,
    AccordionModule,
    NgForOf,
    NgIf,
    TableModule,
    CurrencyPipe,
    ReactiveFormsModule,
    ToastModule,
    ButtonDirective
  ],
  templateUrl: './venda-produto.component.html',
  styleUrl: './venda-produto.component.css'
})
export class VendaProdutoComponent implements OnInit {
  produtos: Produto[] = [];
  clientes: Cliente[] = [];

  produtosSelecionados: Produto[] = [];
  clienteSelecionado: Cliente = {
    bairro: "",
    celular: "",
    cidade: "",
    cnpj: "",
    dataCadastro: new Date(),
    fantasia: "",
    ie: "",
    numero: "",
    tipoCliente: "PF",
    id: '',
    nome: '',
    cpf: '',
    email: '',
    telefone: '',
    endereco: '',
    observacoes: ''
  }

  totalVenda: number = 0;

  constructor(
    private produtoService: ProdutosService,
    private clienteService: ClientesService,
    private vendaService: VendasService,
    private router: Router,
    private messageService: MessageService) {
  }

  async ngOnInit() {
    (await this.produtoService.getProdutos())
      .subscribe((produtos) => {
        this.produtos = produtos;
      });
    (await this.clienteService.getClientes())
      .subscribe((clientes) => {
        this.clientes = clientes;
      });
  }

  limparProdutosSelecionados() {
    this.produtosSelecionados = [];
  }

  limparClienteSelecionado() {
    this.clienteSelecionado = {
      bairro: "",
      celular: "",
      cidade: "",
      cnpj: "",
      dataCadastro: new Date(),
      fantasia: "",
      ie: "",
      numero: "",
      tipoCliente: "PF",
      id: '',
      nome: '',
      cpf: '',
      email: '',
      telefone: '',
      endereco: '',
      observacoes: ''
    }
  }

  aumentarQuantidade(produtoId: string) {
    this.produtosSelecionados.forEach(produto => {
      if (produto.id === produtoId) {
        if (produto.quantidadeVenda < produto.estoque) produto.quantidadeVenda++;
      }
    });
    this.totalVenda = this.produtosSelecionados.reduce((acc, produto) => acc + (produto.quantidadeVenda * produto.precoVenda), 0);
  }

  diminuirQuantidade(produtoId: string) {
    this.produtosSelecionados.forEach(produto => {
      if (produto.id === produtoId) {
        if (produto.quantidadeVenda > 0) produto.quantidadeVenda--;
      }
    });
    this.totalVenda = this.produtosSelecionados.reduce((acc, produto) => acc + (produto.quantidadeVenda * produto.precoVenda), 0);
  }

  realizarVenda() {
    if (this.clienteSelecionado.nome === '') {
      this.messageService.add({
        severity: 'info',
        summary: 'Cliente',
        detail: 'Selecione um cliente para realizar a venda.'
      })
    } else if (this.produtosSelecionados.length === 0) {
      this.messageService.add({
        severity: 'info',
        summary: 'Produto(s)',
        detail: 'Selecione pelo menos um produto para realizar a venda.'
      })
    } else if (this.produtosSelecionados.some(produto => produto.quantidadeVenda === 0)) {
      this.messageService.add({
        severity: 'info',
        summary: 'Quantidade(s)',
        detail: this.produtosSelecionados.length > 1 ? 'Selecione as quantidades na seção Produtos.' : 'Selecione a quantidade na seção Produto.'
      })
    } else {
      let novaVenda: Venda = {
        id: '',
        nomeCliente: this.clienteSelecionado.nome,
        documentoCliente: this.clienteSelecionado.tipoCliente === 'PF' ? this.clienteSelecionado.cpf : this.clienteSelecionado.cnpj,
        produtos: this.produtosSelecionados,
        total: this.totalVenda,
        data: new Date()
      }
      this.vendaService.addVenda(novaVenda).subscribe(() => {
        this.produtoService.baixarEstoque(this.produtosSelecionados).subscribe(() => {
          this.messageService.add({
            severity: 'success',
            summary: 'Venda',
            detail: this.produtosSelecionados.length > 1 ? 'Produtos vendidos com sucesso!' : 'Produto vendido com sucesso!'
          });
          this.produtosSelecionados = [];
          this.clienteSelecionado = {
            bairro: "",
            celular: "",
            cidade: "",
            cnpj: "",
            dataCadastro: new Date(),
            fantasia: "",
            ie: "",
            numero: "",
            tipoCliente: "PF",
            id: '',
            nome: '',
            cpf: '',
            email: '',
            telefone: '',
            endereco: '',
            observacoes: ''
          }
          this.totalVenda = 0;
          this.router.navigate(['/vendas']).then(() => {
          });
        });
      });
    }
  }
}
