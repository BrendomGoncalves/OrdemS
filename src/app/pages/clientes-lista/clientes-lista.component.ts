import { Component, OnInit, signal } from '@angular/core';
import { Cliente } from '../../models/cliente/cliente';
import { ClientesService } from '../../services/cliente/clientes.service';
import { RouterLink } from '@angular/router';
import { Button, ButtonDirective } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { FormBuilder, FormGroup, FormsModule, Validators } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { DialogModule } from 'primeng/dialog';
import { NgForOf, NgIf, TitleCasePipe } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MessageModule } from 'primeng/message';
import { RadioButtonModule } from 'primeng/radiobutton';
import { TabViewModule } from 'primeng/tabview';
import { asyncValidator } from '../../ferramentas/utils';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { SkeletonModule } from 'primeng/skeleton';
import { ClienteCreateDto } from '../../models/cliente/clienteCreateDto';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

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
    ToastModule,
    SkeletonModule
  ],
  templateUrl: './clientes-lista.component.html',
  styleUrl: './clientes-lista.component.css'
})
export class ClientesListaComponent implements OnInit {
  Clientes: Cliente[] = []; // Lista de cliente
  filtro: string = ''; // Objeto para filtrar cliente por nome
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
    {
      label: 'E-mail',
      formControl: 'email',
      placeholder: 'Digite o E-mail',
      validation: 'E-mail precisa ser válido'
    },
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
    { label: 'IE', formControl: 'ie', placeholder: 'Digite o IE', validation: 'IE são apenas nº.' },
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
    { label: 'E-mail', formControl: 'email', placeholder: 'Digite o E-mail', validation: 'Email precisa ser válido' },
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

  // Carregamento
  carregandoDados: boolean = true;

  constructor(
    private clientesService: ClientesService,
    private fb: FormBuilder,
    private messageService: MessageService) {
    this.clienteForm = this.fb.group({
      id: [0], // ID do serviço,
      createdAt: [new Date()], // Data de criação do serviço
      updatedAt: [new Date()], // Data de atualização do serviço
      nome: ['', [Validators.required, Validators.minLength(3)], [asyncValidator()]], // Deve ter no mínimo 3 caracteres, é obrigatório,
      fantasia: ['', [Validators.minLength(3)], [asyncValidator()]], // Deve ter no mínimo 3 caracteres,
      cnpj: ['', [Validators.minLength(18), Validators.pattern(/^[0-9]{2}\.[0-9]{3}\.[0-9]{3}\/[0-9]{4}-[0-9]{2}$/)], [asyncValidator()]], // Deve ter no mínimo 14 caracteres,
      ie: ['', [Validators.minLength(10), Validators.maxLength(10), Validators.pattern(/^[0-9]{10}$/)], [asyncValidator()]], // Deve ter no mínimo 9 caracteres,
      cpf: ['', [Validators.minLength(11), Validators.maxLength(11), Validators.pattern(/^[0-9]{3}[0-9]{3}[0-9]{3}[0-9]{2}$/)], [asyncValidator()]], // Deve ter no mínimo 11 caracteres,
      celular: ['', [Validators.minLength(11), Validators.maxLength(11), Validators.pattern(/^[1-9]{2}9[0-9]{4}[0-9]{4}$/)], [asyncValidator()]], // Deve ter no mínimo 11 caracteres,
      telefone: ['', [Validators.minLength(12), Validators.maxLength(12), Validators.pattern(/^[1-9]{2}[0-9]{4}[0-9]{4}$/)], [asyncValidator()]], // Deve ter no mínimo 10 caracteres,
      email: ['', [Validators.email], [asyncValidator()]], // Deve ser um endereço eletrónico válido,
      endereco: ['', [Validators.minLength(3)], [asyncValidator()]], // Deve ter no mínimo 3 caracteres,
      numero: ['', [Validators.minLength(1)], [asyncValidator()]], // Deve ter no mínimo 1 caractere,
      bairro: ['', [Validators.minLength(3)], [asyncValidator()]], // Deve ter no mínimo 3 caracteres,
      cidade: ['', [Validators.minLength(3)], [asyncValidator()]], // Deve ter no mínimo 3 caracteres,
      observacoes: [''],
      tipoCliente: ['PF', [Validators.required]] // Tipo de cliente (PF ou PJ)
    });
    this.resetarEdicao();
  }

  async ngOnInit() {
    await this.carregarClientes().then();
  }

  // Utiliza o serviço de cliente para carregar a lista de cliente
  async carregarClientes() {
    (await this.clientesService.getClientes()).subscribe({
      next: (clientes) => {
        this.Clientes = clientes;
        setTimeout(() => {
          this.carregandoDados = false;
          this.estatisticaClientes(clientes);
        }, 1000);
      },
      error: (err) => {
        this.carregandoDados = false;
        this.messageService.add({
          severity: 'info',
          summary: 'Clientes',
          detail: `${err.error.message}`
        })
      }
    });
  }

  // Utiliza o serviço de cliente para adicionar um novo cliente
  async salvarCliente() {
    this.clienteForm.get('tipoCliente')?.setValue(this.tipoPF_PJ);

    const novoCliente: ClienteCreateDto = {
      nome: this.clienteForm.get('nome')?.value,
      fantasia: this.clienteForm.get('fantasia')?.value,
      cnpj: this.clienteForm.get('cnpj')?.value,
      ie: this.clienteForm.get('ie')?.value,
      cpf: this.clienteForm.get('cpf')?.value,
      celular: this.clienteForm.get('celular')?.value,
      telefone: this.clienteForm.get('telefone')?.value,
      email: this.clienteForm.get('email')?.value,
      endereco: this.clienteForm.get('endereco')?.value,
      numero: this.clienteForm.get('numero')?.value,
      bairro: this.clienteForm.get('bairro')?.value,
      cidade: this.clienteForm.get('cidade')?.value,
      observacoes: this.clienteForm.get('observacoes')?.value,
      tipoCliente: this.tipoPF_PJ as 'PF' | 'PJ',
    };

    if (this.clienteForm.valid) {
      (await this.clientesService.addCliente(novoCliente)).subscribe({
        next: (cliente) => {
          this.carregarClientes().then();
          this.estatisticaClientes(this.Clientes);
          this.fecharAdicionarCliente();
          this.messageService.add({
            severity: 'success',
            summary: 'Cliente',
            detail: `${cliente.nome} adicionado.`
          });
        },
        error: (err) => {
          this.messageService.add({
            severity: 'info',
            summary: 'Cliente',
            detail: `${err.error.message}`
          });
        }
      });
    } else {
      this.messageService.add({
        severity: 'info',
        summary: 'Cliente inválido',
        detail: 'Verifique se os campos estão preenchidos corretamente.'
      });
    }
  }

  // Utiliza o serviço de cliente para deletar um cliente
  async deletarCliente() {
    const idDeletarCliente = this.clienteForm.get('id')?.value;

    if (idDeletarCliente) {
      (await this.clientesService.deleteCliente(idDeletarCliente)).subscribe({
        next: () => {
          this.carregarClientes().then();
          this.fecharDetalhesCliente();
          this.messageService.add({
            severity: 'success',
            summary: 'Cliente',
            detail: 'Cliente deletado'
          });
        },
        error: (err) => {
          this.messageService.add({
            severity: 'info',
            summary: 'Cliente',
            detail: `${err.error.message}`
          });
        }
      }
      );
    } else {
      this.messageService.add({
        severity: 'info',
        summary: 'Cliente inválido',
        detail: 'Verifique se os campos estão preenchidos corretamente'
      })
    }
  }

  // Salva a edição de um campo
  async editarCliente(campo: string) {
    const clienteEditado = this.clienteForm.value;

    if (this.clienteForm.valid) {
      (await this.clientesService.updateCliente(clienteEditado.id, clienteEditado)).subscribe({
        next: () => {
          this.editando[campo] = false;
          this.carregarClientes().then();
          this.messageService.add({
            severity: 'success',
            summary: 'Cliente',
            detail: 'Cliente editado'
          });
        },
        error: (err) => {
          this.editando[campo] = false;
          this.messageService.add({
            severity: 'info',
            summary: 'Cliente',
            detail: `${err.error.message}`
          });
        }
      });
    } else {
      this.editando[campo] = false;
      this.messageService.add({
        severity: 'info',
        summary: 'Cliente inválido',
        detail: 'Verifique se os campos estão preenchidos corretamente.'
      });
    }
  }

  // Atualiza as estatisticas de cliente
  estatisticaClientes(clientes: Cliente[]) {
    this.QClientes.set(clientes.length);
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
    this.clienteForm.setValue(cliente);
    this.verDetalhesCliente = true;
  }

  // Fecha o modal de detalhes do cliente
  fecharDetalhesCliente() {
    this.clienteForm.reset();
    this.resetarEdicao();
    this.verDetalhesCliente = false;
  }

  // Muda o tipo de cliente (Pessoa Física ou Jurídica) ao alternar de aba.
  onTabChange(index: number) {
    this.tipoPF_PJ = index === 0 ? 'PF' : 'PJ';
  }

  // Exporta os clientes para PDF
  exportarPDF() {
    if (this.clientesFiltrados.length === 0) {
      this.messageService.add({
        severity: 'info',
        summary: 'Exportação',
        detail: 'Não há clientes para exportar!'
      });
      return;
    }

    const doc = new jsPDF('landscape', 'mm', 'a4');

    // Cores do tema (vermelho)
    const corPrimaria = [239, 68, 68]; // #ef4444 (red-500)
    const corSecundaria = [220, 38, 38]; // #dc2626 (red-600)
    const corTexto = [31, 41, 55]; // #1f2937 (gray-800)
    const corTextoClaro = [107, 114, 128]; // #6b7280 (gray-500)

    // Cabeçalho
    doc.setFillColor(corPrimaria[0], corPrimaria[1], corPrimaria[2]);
    doc.rect(0, 0, doc.internal.pageSize.getWidth(), 25, 'F');

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(20);
    doc.setFont('helvetica', 'bold');
    doc.text('RELATÓRIO DE CLIENTES', doc.internal.pageSize.getWidth() / 2, 12, { align: 'center' });

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    const dataAtual = new Date().toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
    doc.text(`Gerado em: ${dataAtual}`, doc.internal.pageSize.getWidth() / 2, 18, { align: 'center' });
    doc.text(`Total de clientes: ${this.clientesFiltrados.length}`, doc.internal.pageSize.getWidth() / 2, 22, { align: 'center' });

    // Prepara os dados da tabela
    const dadosTabela = this.clientesFiltrados.map(cliente => {
      const documento = cliente.tipoCliente === 'PF'
        ? (cliente.cpf || '-')
        : (cliente.cnpj || '-');

      const enderecoCompleto = [
        cliente.endereco || '',
        cliente.numero ? `Nº ${cliente.numero}` : '',
        cliente.bairro || '',
        cliente.cidade || ''
      ].filter(Boolean).join(', ');

      return [
        cliente.nome || '-',
        // cliente.tipoCliente || '-',
        documento,
        cliente.tipoCliente === 'PJ' ? (cliente.fantasia || '-') : '-',
        cliente.tipoCliente === 'PJ' ? (cliente.ie || '-') : '-',
        cliente.celular || '-',
        cliente.telefone || '-',
        cliente.email || '-',
        enderecoCompleto || '-',
        // cliente.observacoes || '-'
      ];
    });

    // Cria a tabela
    autoTable(doc, {
      startY: 30,
      head: [[
        'Nome',
        // 'Tipo',
        'CPF/CNPJ',
        'Fantasia',
        'IE',
        'Celular',
        'Telefone',
        'Email',
        'Endereço',
        // 'Observações'
      ]],
      body: dadosTabela,
      theme: 'striped',
      headStyles: {
        fillColor: [corSecundaria[0], corSecundaria[1], corSecundaria[2]],
        textColor: 255,
        fontStyle: 'bold',
        fontSize: 9
      },
      bodyStyles: {
        textColor: [corTexto[0], corTexto[1], corTexto[2]],
        fontSize: 8
      },
      alternateRowStyles: {
        fillColor: [249, 250, 251] // gray-50
      },
      columnStyles: {
        0: { cellWidth: 40 }, // Nome
        1: { cellWidth: 35 }, // CPF/CNPJ
        2: { cellWidth: 30 }, // Fantasia
        3: { cellWidth: 22 }, // IE
        4: { cellWidth: 25 }, // Celular
        5: { cellWidth: 25 }, // Telefone
        6: { cellWidth: 52 }, // Email
        7: { cellWidth: 50 }, // Endereço
      },
      styles: {
        cellPadding: 3,
        overflow: 'linebreak',
        cellWidth: 'wrap'
      },
      margin: { top: 30, left: 10, right: 10 }
    });

    // Calcula estatísticas
    const totalPF = this.clientesFiltrados.filter(c => c.tipoCliente === 'PF').length;
    const totalPJ = this.clientesFiltrados.filter(c => c.tipoCliente === 'PJ').length;
    const totalComEmail = this.clientesFiltrados.filter(c => c.email && c.email.trim() !== '').length;
    const totalComCelular = this.clientesFiltrados.filter(c => c.celular && c.celular.trim() !== '').length;

    // Adiciona número de páginas
    const pageCount = (doc as any).getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.setTextColor(corTextoClaro[0], corTextoClaro[1], corTextoClaro[2]);
      doc.text(
        `Página ${i} de ${pageCount}`,
        doc.internal.pageSize.getWidth() / 2,
        doc.internal.pageSize.getHeight() - 5,
        { align: 'center' }
      );
    }

    // Salva o PDF
    const dataAtualArquivo = new Date().toLocaleDateString('pt-BR').replace(/\//g, '-');
    doc.save(`clientes_${dataAtualArquivo}.pdf`);

    this.messageService.add({
      severity: 'success',
      summary: 'Exportação',
      detail: `PDF exportado com sucesso! ${this.clientesFiltrados.length} cliente(s) exportado(s).`
    });
  }
}
