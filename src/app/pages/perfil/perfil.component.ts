import {Component, OnInit} from '@angular/core';
import {ChipModule} from 'primeng/chip';
import {ButtonDirective} from 'primeng/button';
import {Ripple} from 'primeng/ripple';
import {EmpresaService} from '../../services/empresa/empresa.service';
import {Empresa} from '../../models/empresa';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {MessageService} from 'primeng/api';
import {asyncValidator} from '../../ferramentas/utils';
import {NgIf} from '@angular/common';
import {PaginatorModule} from 'primeng/paginator';
import {ChipsModule} from 'primeng/chips';
import {FileUploadModule} from 'primeng/fileupload';
import {ToastModule} from 'primeng/toast';

@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [
    ChipModule,
    ButtonDirective,
    Ripple,
    NgIf,
    PaginatorModule,
    ReactiveFormsModule,
    ChipsModule,
    FileUploadModule,
    ToastModule
  ],
  templateUrl: './perfil.component.html',
  styleUrl: './perfil.component.css'
})
export class PerfilComponent implements OnInit {
  Empresa: Empresa = {
    nome: '',
    tecnico: '',
    endereco: '',
    email: '',
    telefone: '',
    celular: '',
    cnpj: '',
  };

  perfilForm: FormGroup;
  editando: { [key: string]: boolean } = {}; // Objeto para controlar a edição de serviços

  constructor(
    private empresaService: EmpresaService,
    private fb: FormBuilder,
    private messageService: MessageService
  ) {
    this.perfilForm = this.fb.group({
      nome: ['', [Validators.required, Validators.minLength(3)], [asyncValidator()]],
      tecnico: ['', [Validators.required, Validators.minLength(3)], [asyncValidator()]],
      endereco: ['', [Validators.required, Validators.minLength(3)], [asyncValidator()]],
      email: ['', [Validators.required, Validators.email], [asyncValidator()]],
      telefone: ['', [Validators.minLength(12), Validators.maxLength(12), Validators.pattern(/^\([1-9]{2}\)[0-9]{4}[0-9]{4}$/)], [asyncValidator()]],
      celular: ['', [Validators.minLength(13), Validators.maxLength(13), Validators.pattern(/^\([1-9]{2}\)9[0-9]{4}[0-9]{4}$/)], [asyncValidator()]],
      cnpj: ['', [Validators.minLength(18), Validators.pattern(/^[0-9]{2}\.[0-9]{3}\.[0-9]{3}\/[0-9]{4}-[0-9]{2}$/)], [asyncValidator()]],
    });
    this.resetarEdicao();
  }

  async ngOnInit() {
    this.carregarEmpresa().then();
  }

  async carregarEmpresa() {
    (await this.empresaService.getEmpresa()).subscribe(empresa => {
      this.Empresa = empresa;
      this.perfilForm.patchValue(empresa);
    })
  }

  // Reseta o objeto de edição
  resetarEdicao() {
    Object.keys(this.perfilForm.controls).forEach(key => {
      this.editando[key] = false;
    });
  }

  // Ativa a edição de um campo
  ativarEdicao(campo: string) {
    this.editando[campo] = true;
  }

  // Salva a edição de um campo
  async salvarEdicao(campo: string) {
    const perfilEditado = this.perfilForm.value;
    (await this.empresaService.updateEmpresa(perfilEditado)).subscribe(() => {
      this.editando[campo] = false;
      this.carregarEmpresa().then();
      this.messageService.add({
        severity: 'success',
        summary: 'Categoria',
        detail: 'Perfil editado'
      })
    });
  }

  exportarDados() {
    this.empresaService.exportarDados();
  }

  importarDados(event: any) {
    this.empresaService.importarDados(event);
  }
}
