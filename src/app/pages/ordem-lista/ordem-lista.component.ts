import {Component, OnInit, signal} from '@angular/core';
import {MessageService} from 'primeng/api';
import {OrdemServico} from '../../models/ordem-servico';
import {AbstractControl, AsyncValidatorFn, FormBuilder, FormGroup, ValidationErrors, Validators} from '@angular/forms';
import {delay, map, Observable, of} from 'rxjs';

@Component({
  selector: 'app-ordem-lista',
  standalone: true,
  imports: [],
  templateUrl: './ordem-lista.component.html',
  styleUrl: './ordem-lista.component.css'
})
export class OrdemListaComponent implements OnInit {
  Ordens: OrdemServico[] = [];
  filtro: string = '';
  ordemForm: FormGroup;
  editando: boolean = false;

  // Estatisticas
  QOrdens = signal(this.Ordens.length);

  // Dialogos
  verDetalhesOrdem: boolean = false;
  verAdicionarOrdem: boolean = false;

  constructor(
    private messageService: MessageService,
    private fb: FormBuilder) {
    this.ordemForm = this.fb.group({
      id: [''],
      cliente: ['', [Validators.required], [this.asyncValidator()]],
      dataAbertura: ['', [this.asyncValidator()]],
      dataConclusao: ['', [this.asyncValidator()]],
      descricaoProblema: ['', [Validators.minLength(3)], [this.asyncValidator()]],
      descricaoSolucao: ['', [Validators.minLength(3)], [this.asyncValidator()]],
      status: ['', [this.asyncValidator()]],
      valorTotal: ['', [Validators.min(0)], [this.asyncValidator()]],
      servicos: ['', [this.asyncValidator()]],
      produtosUtilizados: ['', [this.asyncValidator()]],
      pagamento: ['', [this.asyncValidator()]]
    });
  }

  ngOnInit() {
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
