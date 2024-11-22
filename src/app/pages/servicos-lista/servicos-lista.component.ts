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
import { ServicosService } from '../../services/servico/servicos.service';
import { delay, map, Observable, of } from 'rxjs';
import {InputTextModule} from 'primeng/inputtext';
import {PrimeTemplate} from 'primeng/api';
import {TableModule} from 'primeng/table';
import {CurrencyPipe, NgIf} from '@angular/common';
import {DialogModule} from 'primeng/dialog';
import {MessageModule} from 'primeng/message';
import {TabViewModule} from 'primeng/tabview';
import {generateUniqueId} from '../../ferramentas/utils';

@Component({
  selector: 'app-servico-lista',
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
    NgIf,
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
  }

  // Utiliza o serviço de cliente para carregar a lista de cliente
  carregarServicos() {
    this.servicoService.getServicos().subscribe(servicos => {
      this.estatisticaServicos(servicos);
      this.Servicos = servicos;
    });
  }

  // Atualiza as estatisticas de cliente
  estatisticaServicos(servicos: Servico[]) {
    this.QServicos.set(servicos.length);
  }

  // Filtra os cliente por nome
  get servicosFiltrados(): Servico[] {
    if (!this.filtro) {
      return this.Servicos;
    }
    return this.Servicos.filter(servico =>
      servico.nome.toLowerCase().includes(this.filtro.toLowerCase())
    );
  }

  // Utiliza o serviço de cliente para adicionar um novo cliente
  salvarServico() {
    const novoServico: Servico = this.servicoForm.value;
    novoServico.id = generateUniqueId();
    this.servicoService.addServico(novoServico).subscribe(() => {
      this.carregarServicos();
      this.estatisticaServicos(this.Servicos);
      this.fecharAdicionarServico();
    });
  }

  // Utiliza o serviço de cliente para deletar um cliente
  deletarServico() {
    const idDeletar = this.servicoForm.get('id')?.value;
    this.servicoService.deleteServico(idDeletar).subscribe(() => {
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
      this.servicoService.updateServico(servicoEditado.id, servicoEditado).subscribe(() => {
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
      ...servico,
      categoria: servico.categoria.nome,
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
