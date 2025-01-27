import {Component, OnInit} from '@angular/core';
import {Cliente} from '../../models/cliente';
import {ActivatedRoute, Router, RouterLink} from '@angular/router';
import {ButtonDirective} from 'primeng/button';
import {StepperModule} from 'primeng/stepper';
import {DropdownModule} from 'primeng/dropdown';
import {FormsModule} from '@angular/forms';
import {AccordionModule} from 'primeng/accordion';
import {DatePipe, NgIf} from '@angular/common';
import {InputTextareaModule} from 'primeng/inputtextarea';
import {CalendarModule} from 'primeng/calendar';
import {ListboxModule} from 'primeng/listbox';
import {InputNumberModule} from 'primeng/inputnumber';
import {TableModule} from 'primeng/table';
import {EntradaEquipamento} from '../../models/entrada-equipamento';
import {ToastModule} from 'primeng/toast';
import {ClientesService} from '../../services/cliente/clientes.service';
import {EmpresaService} from '../../services/empresa/empresa.service';
import {EntradaEquipamentoService} from '../../services/entrada-equipamento/entrada-equipamento.service';
import {MessageService} from 'primeng/api';

@Component({
  selector: 'app-entrada-equipamento',
  standalone: true,
  imports: [
    RouterLink,
    ButtonDirective,
    StepperModule,
    DropdownModule,
    FormsModule,
    AccordionModule,
    NgIf,
    InputTextareaModule,
    CalendarModule,
    ListboxModule,
    InputNumberModule,
    TableModule,
    ToastModule,
    DatePipe
  ],
  templateUrl: './entrada-equipamento.component.html',
  styleUrl: './entrada-equipamento.component.css'
})
export class EntradaEquipamentoComponent implements OnInit {
  entradaEquipamento: EntradaEquipamento = {
    id: '',
    empresa: {
      nome: '',
      cnpj: '',
      tecnico: '',
      telefone: '',
      endereco: '',
      celular: '',
      email: ''
    },
    cliente: null,
    equipamento: '',
    dataRecebimento: null,
    descricaoProblema: '',
  }
  clienteSelecionado: Cliente | null = null;

  // Listas
  listaClientes: Cliente[] = [];

  carregandoBotao = false;

  constructor(
    private activateRoute: ActivatedRoute,
    private router: Router,
    private messageService: MessageService,
    private entradaEquipamentoService: EntradaEquipamentoService,
    private empresaService: EmpresaService,
    private clientesService: ClientesService) {
  }

  async ngOnInit() {
    this.activateRoute.paramMap.subscribe(async params => {
      const id = params.get('id');
      if(id !== null){
        (await this.entradaEquipamentoService.getEntradaEquipamentoById(id)).subscribe((entradaEquipamento) => {
          this.entradaEquipamento = {
            ...entradaEquipamento,
            dataRecebimento: entradaEquipamento.dataRecebimento ? new Date(entradaEquipamento.dataRecebimento) : null
          }
          this.clienteSelecionado = entradaEquipamento.cliente;
        });
      } else {
        this.entradaEquipamento.id = await this.entradaEquipamentoService.novoId()
        this.entradaEquipamento.dataRecebimento = new Date();
      }
    });
    (await this.empresaService.getEmpresa()).subscribe((empresa) => {
      this.entradaEquipamento.empresa = {
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
  }

  limparClienteSelecionado() {
    this.clienteSelecionado = null;
  }

  imprimir() {
    window.print();
  }

  async salvarEntradaEquipamento() {
    this.carregandoBotao = true;
    let entradaEquipamentoBanco;
    (await this.entradaEquipamentoService.getEntradaEquipamentoById(this.entradaEquipamento.id)).subscribe(entradaEquipamento => {
      entradaEquipamentoBanco = entradaEquipamento;
    });

    if (entradaEquipamentoBanco !== undefined) {
      (await this.entradaEquipamentoService.updateEntradaEquipamento(this.entradaEquipamento.id, this.entradaEquipamento)).subscribe(() => {
        setTimeout(() => {
          this.carregandoBotao = false;
          this.messageService.add({
            severity: 'success',
            summary: 'Entrada de Equipamento',
            detail: 'Os dados foram atualizados',
            life: 5000
          });
          this.router.navigate(['/ordens']);
        }, 2000);
      });
    } else {
      if (this.entradaEquipamento !== undefined) {
        if (this.entradaEquipamento.empresa === undefined || this.entradaEquipamento.cliente === undefined || this.entradaEquipamento.equipamento === '' || this.entradaEquipamento.dataRecebimento === null || this.entradaEquipamento.descricaoProblema === '') {
          this.messageService.add({
            severity: 'error',
            summary: 'Entrada de Equipamento',
            detail: 'Preencha os campos obrigatórios',
            life: 5000
          });
        } else {
          (await this.entradaEquipamentoService.addEntradaEquipamento(this.entradaEquipamento)).subscribe(() => {
            this.entradaEquipamento = {
              id: '',
              empresa: {
                nome: '',
                cnpj: '',
                tecnico: '',
                telefone: '',
                endereco: '',
                celular: '',
                email: ''
              },
              cliente: null,
              equipamento: '',
              dataRecebimento: null,
              descricaoProblema: '',
            }
            setTimeout(() => {
              this.carregandoBotao = false;
              this.messageService.add({
                severity: 'success',
                summary: 'Entrada de Equipamento',
                detail: 'Dados cadastrados',
                life: 5000
              });
              this.router.navigate(['/entradas-equipamentos']);
            }, 2000);
          });
        }
      }
    }
  }
}
