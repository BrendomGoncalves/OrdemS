import {Component, OnInit, signal} from '@angular/core';
import {Button, ButtonDirective} from 'primeng/button';
import {RouterLink} from '@angular/router';
import {Servico} from '../../models/servico';
import {
  AbstractControl,
  AsyncValidatorFn,
  FormBuilder,
  FormGroup, FormsModule,
  ReactiveFormsModule,
  ValidationErrors,
  Validators
} from '@angular/forms';
import {ServicosService} from '../../services/servico/servicos.service';
import {delay, map, Observable, of} from 'rxjs';
import {InputTextModule} from 'primeng/inputtext';
import {MessageService, PrimeTemplate} from 'primeng/api';
import {TableModule} from 'primeng/table';
import {CurrencyPipe, NgIf} from '@angular/common';
import {DialogModule} from 'primeng/dialog';
import {MessageModule} from 'primeng/message';
import {TabViewModule} from 'primeng/tabview';
import {generateUniqueId} from '../../ferramentas/utils';
import {ToastModule} from 'primeng/toast';
import {SkeletonModule} from 'primeng/skeleton';
import {Categoria} from '../../models/categoria';
import {CategoriasService} from '../../services/categoria/categorias.service';
import {DropdownModule} from 'primeng/dropdown';

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
    TabViewModule,
    ToastModule,
    SkeletonModule,
    DropdownModule
  ],
  templateUrl: './servicos-lista.component.html',
  styleUrl: './servicos-lista.component.css'
})
export class ServicosListaComponent implements OnInit {
  Servicos: Servico[] = []; // Lista de serviços
  filtro: string = ''; // Objeto para filtrar serviços por nome
  servicoForm: FormGroup; // Formulário de cadastro de serviços
  editando: { [key: string]: boolean } = {}; // Objeto para controlar a edição de serviços
  listaCategorias: Categoria[] = []; // Lista de categorias

  // Estatisticas
  QServicos = signal(this.Servicos.length); // Quantidade de serviços

  // Dialogos
  verDetalhesServico: boolean = false; // Dialogo para ver detalhes de um serviço
  verAdicionarServico: boolean = false; // Dialogo para adicionar um

  // Carregamento
  carregandoDados: boolean = true; // Indica se os dados estão sendo carregados

  constructor(private servicoService: ServicosService,
              private fb: FormBuilder,
              private categoriasService: CategoriasService,
              private messageService: MessageService) {
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

  async ngOnInit() {
    await this.carregarServicos();
    (await this.categoriasService.getCategorias()).subscribe((categorias) => {
      this.listaCategorias = categorias
    })
  }

  // Utiliza o serviço de cliente para carregar a lista de cliente
  async carregarServicos() {
    (await this.servicoService.getServicos()).subscribe(servicos => {
      this.Servicos = servicos;
      setTimeout(() => {
        this.carregandoDados = false;
        this.estatisticaServicos(servicos);
      }, 1500);
    });
  }

  // Atualiza as estatisticas de cliente
  estatisticaServicos(servicos: Servico[]) {
    this.QServicos.set(servicos.length);
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

  // Utiliza o serviço de cliente para adicionar um novo cliente
  salvarServico() {
    let novoServico: Servico = this.servicoForm.value;
    if (this.Servicos.find(servico => servico.nome === novoServico.nome)?.nome === novoServico.nome) {
      this.messageService.add({
        severity: 'info',
        summary: 'Serviço',
        detail: 'Esse serviço já existe'
      });
    } else if (this.servicoForm.valid) {
      novoServico.id = generateUniqueId();
      this.servicoService.addServico(novoServico).subscribe(() => {
        this.carregarServicos().then();
        this.estatisticaServicos(this.Servicos);
        this.fecharAdicionarServico();
        this.messageService.add({
          severity: 'success',
          summary: 'Serviço',
          detail: 'Serviço adicionado'
        });
      });
    } else {
      this.messageService.add({
        severity: 'error',
        summary: 'Serviço',
        detail: 'Verifique se os campos estão preenchidos corretamente'
      });
    }
  }

  // Utiliza o serviço de cliente para deletar um cliente
  deletarServico() {
    const idDeletar = this.servicoForm.get('id')?.value;
    if(this.Servicos.find(servico => servico.id === idDeletar)?.id === idDeletar) {
      this.servicoService.deleteServico(idDeletar).subscribe(() => {
        this.carregarServicos().then();
        this.estatisticaServicos(this.Servicos);
        this.fecharDetalhesServico();
        this.messageService.add({
          severity: 'success',
          summary: 'Serviço',
          detail: 'Serviço deletado'
        });
      });
    } else {
      this.messageService.add({
        severity: 'error',
        summary: 'Serviço',
        detail: 'Esse serviço não existe'
      });
    }
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
        this.carregarServicos().then();
        this.messageService.add({
          severity: 'success',
          summary: 'Serviço',
          detail: 'Serviço atualizado'
        });
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
          return value === 'invalid' ? {invalidAsync: true} : null;
        })
      );
    };
  }
}
