import {Component, OnInit} from '@angular/core';
import {RouterLink} from '@angular/router';
import {SplitterModule} from 'primeng/splitter';
import {Produto} from '../../models/produto';
import {Cliente} from '../../models/cliente';
import {ProdutosService} from '../../services/produto/produtos.service';
import {ClientesService} from '../../services/cliente/clientes.service';
import {StepperModule} from 'primeng/stepper';
import {Button} from 'primeng/button';
import {DropdownModule} from 'primeng/dropdown';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {ListboxModule} from 'primeng/listbox';
import {AccordionModule} from 'primeng/accordion';
import {CurrencyPipe, NgForOf, NgIf, TitleCasePipe} from '@angular/common';
import {TableModule} from 'primeng/table';

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
    TitleCasePipe
  ],
  templateUrl: './venda-produto.component.html',
  styleUrl: './venda-produto.component.css'
})
export class VendaProdutoComponent implements OnInit {
  produtos: Produto[] = [];
  clientes: Cliente[] = [];

  produtosSelecionados: Produto[] = [];
  clientesSelecionados: Cliente[] = [];

  produtoSelecionado: Produto = {
    id: '',
    nome: '',
    unidadeVenda: '',
    precoVenda: 0,
    precoCompra: 0,
    lucro: 0,
    estoque: 0,
    quantidadeVenda: 0,
    observacoes: ''
  };
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

  constructor(private produtoService: ProdutosService, private clienteService: ClientesService) {}

  ngOnInit() {
    this.produtoService.getProdutos().subscribe((produtos) => {
      this.produtos = produtos;
    });
    this.clienteService.getClientes().subscribe((clientes) => {
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
        if(produto.quantidadeVenda < produto.estoque) produto.quantidadeVenda++;
      }
    });
  }

  diminuirQuantidade(produtoId: string) {
    this.produtosSelecionados.forEach(produto => {
      if (produto.id === produtoId) {
        if(produto.quantidadeVenda > 0) produto.quantidadeVenda--;
      }
    });
  }
}
