import { Component, OnInit, signal } from '@angular/core';
import {Button, ButtonDirective} from 'primeng/button';
import { RouterLink } from '@angular/router';
import { Servico } from '../../models/servico';
import {
  AbstractControl,
  AsyncValidatorFn,
  FormBuilder,
  FormGroup, FormsModule,
  ReactiveFormsModule,
  ValidationErrors,
  Validators
} from '@angular/forms';
import { ServicosService } from '../../services/servicos/servicos.service';
import { delay, map, Observable, of } from 'rxjs';
import {InputTextModule} from 'primeng/inputtext';
import {PrimeTemplate} from 'primeng/api';
import {TableModule} from 'primeng/table';
import {CurrencyPipe, NgForOf, NgIf, TitleCasePipe} from '@angular/common';
import {DialogModule} from 'primeng/dialog';
import {MessageModule} from 'primeng/message';
import {TabViewModule} from 'primeng/tabview';

@Component({
  selector: 'app-servicos-lista',
  standalone: true,
  imports: [
    ButtonDirective,
    RouterLink,
    Button,
    InputTextModule,
    PrimeTemplate,
    ReactiveFormsModule,
    TableModule,
    FormsModule,
    CurrencyPipe,
    DialogModule,
    NgForOf,
    NgIf,
    TitleCasePipe,
    MessageModule,
    TabViewModule
  ],
  templateUrl: './servicos-lista.component.html',
  styleUrl: './servicos-lista.component.css'
})
export class ServicosListaComponent implements OnInit {
  Servicos: Servico[] = []; // Lista de serviços
  filtro: string = ''; // Objeto para filtrar serviços por nome
  servicoForm: FormGroup; // Formulário de cadastro de serviços
  editando: { [key: string]: boolean } = {}; // Objeto para controlar a edição de serviços

  // Estatisticas
  QServicos = signal(this.Servicos.length); // Quantidade de serviços
  UltimoServico = signal(this.Servicos[this.Servicos.length - 1]); // Último serviço cadastrado

  // Dialogos
  verDetalhesServico: boolean = false; // Dialogo para ver detalhes de um serviço
  verAdicionarServico: boolean = false; // Dialogo para adicionar um

  constructor(private servicoService: ServicosService, private fb: FormBuilder) {
    this.servicoForm = this.fb.group({
      id: [''],
      nome: ['', [Validators.minLength(3)], [this.asyncValidator()]], // Deve ter no mínimo 3 caracteres
      categoria: [''],
      precoVenda: ['', [Validators.min(0)], [this.asyncValidator()]], // Deve ser maior ou igual a 0
      observacoes: ['', [Validators.minLength(3)], [this.asyncValidator()]], // Deve ter no mínimo 3 caracteres
      dataCadastro: ['']
    });
    this.resetarEdicao();
  }

  ngOnInit() {
    this.carregarServicos();
    this.estatisticaServicos();
  }

  // Utiliza o serviço de clientes para carregar a lista de clientes
  carregarServicos() {
    this.servicoService.getServicos().subscribe(servicos => {
      this.Servicos = servicos;
    });
  }

  // Atualiza as estatisticas de clientes
  estatisticaServicos() {
    this.QServicos.set(this.Servicos.length);
    this.UltimoServico.set(this.Servicos[this.Servicos.length - 1]);
  }

  // Filtra os clientes por nome
  get servicosFiltrados(): Servico[] {
    if (!this.filtro) {
      return this.Servicos;
    }
    return this.Servicos.filter(servico =>
      servico.nome.toLowerCase().includes(this.filtro.toLowerCase())
    );
  }

  // Utiliza o serviço de clientes para adicionar um novo cliente
  salvarServico() {
    const novoServico: Servico = this.servicoForm.value;
    this.servicoService.addServico(novoServico).then(() => {
      this.carregarServicos();
      this.estatisticaServicos();
      this.fecharAdicionarServico();
    });
  }

  // Utiliza o serviço de clientes para deletar um cliente
  deletarServico() {
    const idDeletar = Number(this.servicoForm.get('id')?.value);
    this.servicoService.deleteServico(idDeletar).then(() => {
      this.carregarServicos();
      this.fecharDetalhesServico();
    });
  }

  // Reseta o objeto de edição
  resetarEdicao() {
    Object.keys(this.servicoForm.controls).forEach(key => {
      this.editando[key] = false;
    });
  }

  // Ativa a edição de um campo
  ativarEdicao(campo: string) {
    this.editando[campo] = true;
  }

  // Salva a edição de um campo
  salvarEdicao(campo: string) {
    const servicoEditado = this.servicoForm.value;
    let servicoBanco: Servico = this.Servicos.find(c => c.id === servicoEditado.id)!;
    if (servicoEditado.nome !== servicoBanco.nome) {
      this.servicoService.updateServico(servicoEditado.id, servicoEditado).then(() => {
        this.editando[campo] = false;
        this.carregarServicos();
      });
    } else {
      this.editando[campo] = false;
    }
  }

  // Abre o modal de adicionar cliente
  abrirAdicionarServico() {
    this.servicoForm.reset();
    this.verAdicionarServico = true;
  }

  // Fecha o modal de adicionar cliente
  fecharAdicionarServico() {
    this.servicoForm.reset();
    this.verAdicionarServico = false;
  }

  // Abre o modal de detalhes do cliente
  abrirDetalhesServico(servico: Servico) {
    this.servicoForm.setValue({
      id: servico.id,
      nome: servico.nome,
      categoria: servico.categoria.nome,
      precoVenda: servico.precoVenda,
      observacoes: servico.observacoes,
      dataCadastro: servico.dataCadastro
    });
    this.verDetalhesServico = true;
  }

  // Fecha o modal de detalhes do cliente
  fecharDetalhesServico() {
    this.servicoForm.reset();
    this.resetarEdicao();
    this.verDetalhesServico = false;
  }

  // Função de validação assíncrona
  asyncValidator(): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
      return of(control.value).pipe(
        delay(1000), // Simulate async operation
        map(value => {
          return value === 'invalid' ? { invalidAsync: true } : null;
        })
      );
    };
  }
}
