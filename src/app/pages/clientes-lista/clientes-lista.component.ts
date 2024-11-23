import {Component, OnInit, signal} from '@angular/core';
import {Cliente} from '../../models/cliente';
import {ClientesService} from '../../services/cliente/clientes.service';
import {RouterLink} from '@angular/router';
import {Button, ButtonDirective} from 'primeng/button';
import {InputTextModule} from 'primeng/inputtext';
import {FormBuilder, FormGroup, FormsModule, Validators} from '@angular/forms';
import {TableModule} from 'primeng/table';
import {DialogModule} from 'primeng/dialog';
import {NgForOf, NgIf, TitleCasePipe} from '@angular/common';
import {ReactiveFormsModule} from '@angular/forms';
import {MessageModule} from 'primeng/message';
import {RadioButtonModule} from 'primeng/radiobutton';
import {TabViewModule} from 'primeng/tabview';
import {AbstractControl, ValidationErrors, AsyncValidatorFn} from '@angular/forms';
import {delay, map, Observable, of} from 'rxjs';
import {generateUniqueId} from '../../ferramentas/utils';
import {ToastModule} from 'primeng/toast';
import {MessageService} from 'primeng/api';

@Component({
  selector: 'app-cliente-lista',
  standalone: true,
  imports: [
    RouterLink,
    ButtonDirective,
    InputTextModule,
    FormsModule,
    TableModule,
    Button,
    DialogModule,
    NgForOf,
    NgIf,
    TitleCasePipe,
    ReactiveFormsModule,
    MessageModule,
    RadioButtonModule,
    TabViewModule,
    ToastModule
  ],
  templateUrl: './clientes-lista.component.html',
  styleUrl: './clientes-lista.component.css'
})
export class ClientesListaComponent implements OnInit {
  Clientes: Cliente[] = []; // Lista de cliente
  filtro: string = ''; // Objeto pra filtrar cliente por nome
  clienteForm: FormGroup; // Formulário de cadastro de cliente
  editando: { [key: string]: boolean } = {}; // Objeto para controlar edição de campos
  tipoPF_PJ: string = 'PF'; // Tipo de cliente (Pessoa Física ou Jurídica)

  // Estatisticas
  QClientes = signal(this.Clientes.length); // Quantidade de cliente

  // DIALOGOS
  verDetalhesCliente: boolean = false; // Modal de detalhes do cliente
  verAdicionarCliente: boolean = false; // Modal de adicionar cliente

  pessoaFisicaCampos = [
    {
      label: 'Nome',
      formControl: 'nome',
      placeholder: 'Digite o nome',
      validation: 'Nome precisa ter no mínimo 3 caracteres'
    },
    {
      label: 'CPF',
      formControl: 'cpf',
      placeholder: 'Digite o CPF XXXXXXXXXXX',
      validation: 'CPF com 11 caracteres e somente nº.'
    },
    {
      label: 'Celular',
      formControl: 'celular',
      placeholder: 'Digite o nº (XX)9XXXXXXXX',
      validation: 'Nº precisa ter 11 caracteres'
    },
    {
      label: 'Telefone',
      formControl: 'telefone',
      placeholder: 'Digite o nº (XX)XXXXXXXX',
      validation: 'Nº precisa ter 10 caracteres'
    },
    {label: 'E-mail', formControl: 'email', placeholder: 'Digite o E-mail', validation: 'Email precisa ser válido'},
    {
      label: 'Endereço',
      formControl: 'endereco',
      placeholder: 'Digite o Endereço',
      validation: 'Endereço precisa ter no mínimo 3 caracteres'
    },
    {
      label: 'Número',
      formControl: 'numero',
      placeholder: 'Digite o Nº',
      validation: 'Nº precisa ter no mínimo 1 caractere'
    },
    {
      label: 'Bairro',
      formControl: 'bairro',
      placeholder: 'Digite o Bairro',
      validation: 'Bairro precisa ter no mínimo 3 caracteres'
    },
    {
      label: 'Cidade',
      formControl: 'cidade',
      placeholder: 'Digite a Cidade',
      validation: 'Cidade precisa ter no mínimo 3 caracteres'
    }
  ];
  pessoaJuridicaCampos = [
    {
      label: 'Nome',
      formControl: 'nome',
      placeholder: 'Digite o nome',
      validation: 'Nome precisa ter no mínimo 3 caracteres'
    },
    {
      label: 'Nome Fantasia',
      formControl: 'fantasia',
      placeholder: 'Digite o nome fantasia',
      validation: 'Nome fantasia precisa ter no mínimo 3 caracteres'
    },
    {
      label: 'CNPJ',
      formControl: 'cnpj',
      placeholder: 'Digite o CNPJ XX.XXX.XXX/XXXX-XX',
      validation: 'CNPJ com 18 caracteres.'
    },
    {label: 'IE', formControl: 'ie', placeholder: 'Digite o IE', validation: 'IE são apenas nº.'},
    {
      label: 'Celular',
      formControl: 'celular',
      placeholder: 'Digite o nº (XX)9XXXXXXXX',
      validation: 'Nº precisa ter 11 caracteres'
    },
    {
      label: 'Telefone',
      formControl: 'telefone',
      placeholder: 'Digite o nº (XX)XXXXXXXX',
      validation: 'Nº precisa ter 10 caracteres'
    },
    {label: 'E-mail', formControl: 'email', placeholder: 'Digite o E-mail', validation: 'Email precisa ser válido'},
    {
      label: 'Endereço',
      formControl: 'endereco',
      placeholder: 'Digite o Endereço',
      validation: 'Endereço precisa ter no mínimo 3 caracteres'
    },
    {
      label: 'Número',
      formControl: 'numero',
      placeholder: 'Digite o Nº',
      validation: 'Nº precisa ter no mínimo 1 caractere'
    },
    {
      label: 'Bairro',
      formControl: 'bairro',
      placeholder: 'Digite o Bairro',
      validation: 'Bairro precisa ter no mínimo 3 caracteres'
    },
    {
      label: 'Cidade',
      formControl: 'cidade',
      placeholder: 'Digite a Cidade',
      validation: 'Cidade precisa ter no mínimo 3 caracteres'
    }
  ];

  constructor(
    private clientesService: ClientesService,
    private fb: FormBuilder,
    private messageService: MessageService) {
    this.clienteForm = this.fb.group({
      id: [''],
      nome: ['', [Validators.required, Validators.minLength(3)], [this.asyncValidator()]], // Deve ter no mínimo 3 caracteres, é obrigatório,
      fantasia: ['', [Validators.minLength(3)], [this.asyncValidator()]], // Deve ter no mínimo 3 caracteres,
      cnpj: ['', [Validators.minLength(18), Validators.pattern(/^[0-9]{2}\.[0-9]{3}\.[0-9]{3}\/[0-9]{4}-[0-9]{2}$/)], [this.asyncValidator()]], // Deve ter no mínimo 14 caracteres,
      ie: ['', [Validators.minLength(10), Validators.maxLength(10), Validators.pattern(/^[0-9]{10}$/)], [this.asyncValidator()]], // Deve ter no mínimo 9 caracteres,
      cpf: ['', [Validators.minLength(11), Validators.maxLength(11), Validators.pattern(/^[0-9]{3}[0-9]{3}[0-9]{3}[0-9]{2}$/)], [this.asyncValidator()]], // Deve ter no mínimo 11 caracteres,
      celular: ['', [Validators.minLength(13), Validators.maxLength(13), Validators.pattern(/^\([1-9]{2}\)9[0-9]{4}[0-9]{4}$/)], [this.asyncValidator()]], // Deve ter no mínimo 11 caracteres,
      telefone: ['', [Validators.minLength(12), Validators.maxLength(12), Validators.pattern(/^\([1-9]{2}\)[0-9]{4}[0-9]{4}$/)], [this.asyncValidator()]], // Deve ter no mínimo 10 caracteres,
      email: ['', [Validators.email], [this.asyncValidator()]], // Deve ser um email válido,
      endereco: ['', [Validators.minLength(3)], [this.asyncValidator()]], // Deve ter no mínimo 3 caracteres,
      numero: ['', [Validators.minLength(1)], [this.asyncValidator()]], // Deve ter no mínimo 1 caractere,
      bairro: ['', [Validators.minLength(3)], [this.asyncValidator()]], // Deve ter no mínimo 3 caracteres,
      cidade: ['', [Validators.minLength(3)], [this.asyncValidator()]], // Deve ter no mínimo 3 caracteres,
      observacoes: [''],
      tipoCliente: ['PF'],
      dataCadastro: [new Date()]
    });
    this.resetarEdicao();
  }

  ngOnInit() {
    this.carregarClientes();
  }

  // Utiliza o serviço de cliente para carregar a lista de cliente
  carregarClientes() {
    this.clientesService.getClientes().subscribe(clientes => {
      this.estatisticaClientes(clientes);
      this.Clientes = clientes;
    });
  }

  // Atualiza as estatisticas de cliente
  estatisticaClientes(clientes: Cliente[]) {
    this.QClientes.set(clientes.length);
  }

  // Filtra os cliente por nome
  get clientesFiltrados(): Cliente[] {
    if (!this.filtro) {
      return this.Clientes;
    }
    return this.Clientes.filter(cliente =>
      cliente.nome.toLowerCase().includes(this.filtro.toLowerCase())
    );
  }

  // Utiliza o serviço de cliente para adicionar um novo cliente
  salvarCliente() {
    const novoCliente: Cliente = this.clienteForm.value;
    if (this.Clientes.find(cliente => cliente.cpf === novoCliente.cpf)?.cpf === novoCliente.cpf
      || this.Clientes.find(cliente => cliente.cnpj === novoCliente.cnpj)?.cnpj === novoCliente.cnpj) {
      this.messageService.add({
        severity: 'error',
        summary: 'Cliente',
        detail: 'Cliente já existe'
      })
    } else if (this.clienteForm.valid) {
      novoCliente.id = generateUniqueId();
      this.clientesService.addCliente(novoCliente).subscribe(() => {
          this.carregarClientes();
          this.estatisticaClientes(this.Clientes);
          this.fecharAdicionarCliente();
        }
      );
    } else {
      this.messageService.add({
        severity: 'error',
        summary: 'Cliente',
        detail: 'Verifique se todos os campos estão preenchidos corretamente'
      })
    }
  }

  // Utiliza o serviço de cliente para deletar um cliente
  deletarCliente() {
    const idDeletar = this.clienteForm.get('id')?.value;
    if(this.Clientes.find(cliente => cliente.id === idDeletar)?.id === idDeletar) {
      this.clientesService.deleteCliente(idDeletar).subscribe(() => {
          this.carregarClientes();
          this.fecharDetalhesCliente();
          this.messageService.add({
            severity: 'success',
            summary: 'Cliente',
            detail: 'Cliente deletado'
          });
        }
      );
    } else {
      this.messageService.add({
        severity: 'error',
        summary: 'Cliente',
        detail: 'Cliente não encontrado'
      })
    }
  }

  // Reseta o objeto de edição
  resetarEdicao() {
    Object.keys(this.clienteForm.controls).forEach(key => {
      this.editando[key] = false;
    });
  }

  // Ativa a edição de um campo
  ativarEdicao(campo: string) {
    this.editando[campo] = true;
  }

  // Salva a edição de um campo
  salvarEdicao(campo: string) {
    const clienteEditado = this.clienteForm.value;
    let clienteBanco: Cliente = this.Clientes.find(c => c.id === clienteEditado.id)!;
    if (clienteEditado.nome !== clienteBanco.nome) {
      this.clientesService.updateCliente(clienteEditado.id, clienteEditado).subscribe(() => {
          this.editando[campo] = false;
          this.carregarClientes();
          this.messageService.add({
            severity: 'success',
            summary: 'Cliente',
            detail: 'Cliente atualizado'
          });
        }
      );
    } else {
      this.editando[campo] = false;
    }
  }

  // Abre o modal de adicionar cliente
  abrirAdicionarCliente() {
    this.clienteForm.reset();
    this.verAdicionarCliente = true;
  }

  // Fecha o modal de adicionar cliente
  fecharAdicionarCliente() {
    this.clienteForm.reset();
    this.verAdicionarCliente = false;
  }

  // Abre o modal de detalhes do cliente
  abrirDetalhesCliente(cliente: Cliente) {
    this.clienteForm.setValue({
      ...cliente
    })
    this.verDetalhesCliente = true;
  }

  // Fecha o modal de detalhes do cliente
  fecharDetalhesCliente() {
    this.clienteForm.reset();
    this.resetarEdicao();
    this.verDetalhesCliente = false;
  }

  // Muda o tipo de cliente (Pessoa Física ou Jurídica).
  // Recebe o index da tab
  onTabChange(index: number) {
    this.tipoPF_PJ = index === 0 ? 'PF' : 'PJ';
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
