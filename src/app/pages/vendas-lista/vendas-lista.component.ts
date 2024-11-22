import {Component, OnInit, signal} from '@angular/core';
import {Venda} from '../../models/venda';
import {VendasService} from '../../services/venda/vendas.service';
import {Button, ButtonDirective} from 'primeng/button';
import {RouterLink} from '@angular/router';
import {CurrencyPipe, DatePipe, NgForOf, NgIf, PercentPipe} from '@angular/common';
import {InputTextModule} from 'primeng/inputtext';
import {PrimeTemplate} from 'primeng/api';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {TableModule} from 'primeng/table';
import {DialogModule} from 'primeng/dialog';

@Component({
  selector: 'app-vendas-lista',
  standalone: true,
  imports: [
    ButtonDirective,
    RouterLink,
    Button,
    CurrencyPipe,
    InputTextModule,
    PrimeTemplate,
    ReactiveFormsModule,
    TableModule,
    FormsModule,
    DatePipe,
    DialogModule,
    NgForOf
  ],
  templateUrl: './vendas-lista.component.html',
  styleUrl: './vendas-lista.component.css'
})
export class VendasListaComponent implements OnInit {
  Vendas: Venda[] = []; // Lista de vendas
  vendaSelecionada: Venda = {
    id: '',
    produtos: [],
    nomeCliente: '',
    documentoCliente: '',
    data: new Date(),
    total: 0
  }; // Venda selecionada
  filtro: string = ''; // Objeto para filtrar vendas por nome

  // Estatisticas
  QVendas = signal(this.Vendas.length); // Quantidade de vendas

  // Dialogos
  verDetalhesVenda: boolean = false; // Dialogo para ver mais detalhes de uma venda

  constructor(private vendaService: VendasService) {}

  ngOnInit(): void {
    this.carregarVendas();
  }

  carregarVendas(){
    this.vendaService.getVendas().subscribe(vendas => {
      this.estatisticaVendas(vendas);
      this.Vendas = vendas;
    });
  }

  estatisticaVendas(vendas: Venda[]){
    this.QVendas.set(vendas.length);
  }

  get vendasFiltradas(): Venda[]{
    if(!this.filtro){
      return this.Vendas;
    }
    return this.Vendas.filter(venda => venda.nomeCliente.toLowerCase().includes(this.filtro.toLowerCase()));
  }

  deletarVenda(id: string){
    this.vendaService.deleteVenda(id).subscribe(() => {
      this.carregarVendas();
      this.fecharDetalhesVenda();
    });
  }

  abrirDetalhesVenda(venda: Venda){
    this.vendaSelecionada = venda
    this.verDetalhesVenda = true;
  }

  fecharDetalhesVenda(){
    this.vendaSelecionada = {
      id: '',
      produtos: [],
      nomeCliente: '',
      documentoCliente: '',
      data: new Date(),
      total: 0
    };
    this.verDetalhesVenda = false;
  }
}
