import {Component, OnInit, signal} from '@angular/core';
import {Cliente} from '../../models/cliente';
import {ClientesService} from '../../services/clientes/clientes.service';
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

@Component({
  selector: 'app-clientes-lista',
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
    TabViewModule
  ],
  templateUrl: './clientes-lista.component.html',
  styleUrl: './clientes-lista.component.css'
})
export class ClientesListaComponent implements OnInit {
  Clientes: Cliente[] = []; // Lista de clientes
  filtro: string = ''; // Objeto pra filtrar clientes por nome
  clienteForm: FormGroup; // Formulário de cadastro de cliente
  editando: { [key: string]: boolean } = {}; // Objeto para controlar edição de campos
  tipoPF_PJ: string = 'PF'; // Tipo de cliente (Pessoa Física ou Jurídica)

  // Estatisticas
  QClientes = signal(this.Clientes.length); // Quantidade de clientes
  UltimoCliente = signal(this.Clientes[this.Clientes.length - 1]); // Ultimo cliente

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

  constructor(private clientesService: ClientesService, private fb: FormBuilder) {
    this.clienteForm = this.fb.group({
      id: [''],
      nome: ['', [Validators.minLength(3)], [this.asyncValidator()]], // Deve ter no mínimo 3 caracteres,
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
    this.estatisticaClientes();
  }

  // Utiliza o serviço de clientes para carregar a lista de clientes
  carregarClientes() {
    this.clientesService.getClientes().subscribe(clientes => {
      this.Clientes = clientes;
    });
  }

  // Atualiza as estatisticas de clientes
  estatisticaClientes() {
    this.QClientes.set(this.Clientes.length);
    this.UltimoCliente.set(this.Clientes[this.Clientes.length - 1]);
  }

  // Filtra os clientes por nome
  get clientesFiltrados(): Cliente[] {
    if (!this.filtro) {
      return this.Clientes;
    }
    return this.Clientes.filter(cliente =>
      cliente.nome.toLowerCase().includes(this.filtro.toLowerCase())
    );
  }

  // Utiliza o serviço de clientes para adicionar um novo cliente
  salvarCliente() {
    const novoCliente: Cliente = this.clienteForm.value;
    this.clientesService.addCliente(novoCliente).then(() => {
      this.carregarClientes();
      this.estatisticaClientes();
      this.fecharAdicionarCliente();
    });
  }

  // Utiliza o serviço de clientes para deletar um cliente
  deletarCliente() {
    const idDeletar = Number(this.clienteForm.get('id')?.value);
    this.clientesService.deleteCliente(idDeletar).then(() => {
      this.carregarClientes();
      this.fecharDetalhesCliente();
    });
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
      this.clientesService.updateCliente(clienteEditado.id, clienteEditado).then(() => {
        this.editando[campo] = false;
        this.carregarClientes();
      });
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
      // id: cliente.id,
      // nome: cliente.nome,
      // fantasia: cliente.fantasia,
      // cnpj: cliente.cnpj,
      // ie: cliente.ie,
      // cpf: cliente.cpf,
      // celular: cliente.celular,
      // telefone: cliente.telefone,
      // email: cliente.email,
      // endereco: cliente.endereco,
      // numero: cliente.numero,
      // bairro: cliente.bairro,
      // cidade: cliente.cidade,
      // observacoes: cliente.observacoes,
      // tipoCliente: cliente.tipoCliente
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
