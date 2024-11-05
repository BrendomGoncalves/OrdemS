import { Injectable } from '@angular/core';
import {Observable, Subject} from 'rxjs';
import {Cliente} from '../../models/cliente';

@Injectable({
  providedIn: 'root',
})
export class ClientesService {
  private clientes: Cliente[] = [
    {
      id: 1,
      nome: "Construtora Almeida Ltda.",
      fantasia: "Almeida Construtora",
      cnpj: "12.345.678/0001-90",
      cpf: 'empty',
      ie: "1234567890",
      celular: "(11) 91234-5678",
      telefone: "(11) 3344-5566",
      email: "contato@almeidaconstrutora.com.br",
      endereco: "Av. das Nações",
      numero: "1000",
      bairro: "Centro",
      cidade: "São Paulo",
      observacoes: "Cliente prioritário",
      tipoCliente: 'PJ',
      dataCadastro: new Date(2024, 5, 1)
    },
    {
      id: 2,
      nome: "Auto Peças Silva ME",
      fantasia: "Silva Auto Peças",
      cnpj: "23.456.789/0001-12",
      cpf: 'empty',
      ie: "2345678901",
      celular: "(21) 92345-6789",
      telefone: "(21) 3344-5566",
      email: "vendas@silvaautopecas.com.br",
      endereco: "Rua dos Mecânicos",
      numero: "450",
      bairro: "Zona Norte",
      cidade: "Rio de Janeiro",
      observacoes: "Atendimento especial",
      tipoCliente: 'PJ',
      dataCadastro: new Date(2024, 8, 10)
    },
    {
      id: 3,
      nome: "Mercado Ideal Ltda.",
      fantasia: "Mercadão Ideal",
      cnpj: "34.567.890/0001-23",
      cpf: 'empty',
      ie: "3456789012",
      celular: "(31) 93456-7890",
      telefone: "(31) 5566-7788",
      email: "compras@mercadaoideal.com.br",
      endereco: "Av. Central",
      numero: "999",
      bairro: "Savassi",
      cidade: "Belo Horizonte",
      observacoes: "Compras em grandes quantidades",
      tipoCliente: 'PJ',
      dataCadastro: new Date(2024, 10, 20)
    },
    {
      id: 4,
      nome: "Restaurante Sabor Caseiro ME",
      fantasia: "Sabor Caseiro",
      cnpj: "45.678.901/0001-34",
      cpf: 'empty',
      ie: "4567890123",
      celular: "(41) 94567-8901",
      telefone: "(41) 6677-8899",
      email: "contato@saborcaseiro.com.br",
      endereco: "Rua das Delícias",
      numero: "150",
      bairro: "Centro",
      cidade: "Curitiba",
      observacoes: "Fornecimento diário",
      tipoCliente: 'PJ',
      dataCadastro: new Date(2024, 7, 30)
    },
    {
      id: 5,
      nome: "Tech Innovators S.A.",
      fantasia: "TechInno",
      cnpj: "56.789.012/0001-45",
      cpf: 'empty',
      ie: "5678901234",
      celular: "(51) 95678-9012",
      telefone: "(51) 7788-9900",
      email: "info@techinno.com",
      endereco: "Rua da Tecnologia",
      numero: "800",
      bairro: "Parque das Indústrias",
      cidade: "Porto Alegre",
      observacoes: "Cliente de TI com necessidade de suporte",
      tipoCliente: 'PJ',
      dataCadastro: new Date(2024, 9, 15)
    },
    {
      id: 6,
      nome: "Editora Cultura Ltda.",
      fantasia: "Editora Cultura",
      cnpj: "67.890.123/0001-56",
      cpf: 'empty',
      ie: "6789012345",
      celular: "(61) 96789-0123",
      telefone: "(61) 8899-0011",
      email: "contato@editoracultura.com.br",
      endereco: "Rua das Letras",
      numero: "1200",
      bairro: "Asa Norte",
      cidade: "Brasília",
      observacoes: "Cliente sazonal",
      tipoCliente: 'PJ',
      dataCadastro: new Date(2024, 10, 5)
    },
    {
      id: 7,
      nome: "João Silva",
      fantasia: "empty",
      cnpj: 'empty',
      cpf: "123.456.789-01",
      ie: 'empty',
      celular: "(11) 91234-5678",
      telefone: "(11) 3456-7890",
      email: "joao.silva@example.com",
      endereco: "Rua das Flores",
      numero: "100",
      bairro: "Centro",
      cidade: "São Paulo",
      observacoes: "Cliente frequente",
      tipoCliente: 'PF',
      dataCadastro: new Date(2024, 6, 15)
    },
    {
      id: 8,
      nome: "Maria Santos",
      fantasia: "empty",
      cnpj: 'empty',
      cpf: "234.567.890-12",
      ie: 'empty',
      celular: "(21) 92345-6789",
      telefone: "(21) 4567-8901",
      email: "maria.santos@example.com",
      endereco: "Av. Paulista",
      numero: "200",
      bairro: "Jardins",
      cidade: "São Paulo",
      observacoes: "Prefere contato por celular",
      tipoCliente: 'PF',
      dataCadastro: new Date(2024, 8, 25)
    },
    {
      id: 9,
      nome: "Carlos Oliveira",
      fantasia: "empty",
      cnpj: 'empty',
      cpf: "345.678.901-23",
      ie: 'empty',
      celular: "(31) 93456-7890",
      telefone: "(31) 5678-9012",
      email: "carlos.oliveira@example.com",
      endereco: "Rua da Paz",
      numero: "300",
      bairro: "Savassi",
      cidade: "Belo Horizonte",
      observacoes: "Visita a cada 3 meses",
      tipoCliente: 'PF',
      dataCadastro: new Date(2024, 10, 10)
    },
    {
      id: 10,
      nome: "Ana Pereira de Almeida dos Santos Parreira",
      fantasia: "empty",
      cnpj: 'empty',
      cpf: "456.789.012-34",
      ie: 'empty',
      celular: "(41) 94567-8901",
      telefone: "(41) 6789-0123",
      email: "ana.pereira@example.com",
      endereco: "Rua Verde",
      numero: "400",
      bairro: "Água Verde",
      cidade: "Curitiba",
      observacoes: "Contato em horário comercial",
      tipoCliente: 'PF',
      dataCadastro: new Date(2024, 7, 5)
    },
    {
      id: 11,
      nome: "Bruno Costa",
      fantasia: "empty",
      cnpj: 'empty',
      cpf: "567.890.123-45",
      ie: 'empty',
      celular: "(51) 95678-9012",
      telefone: "(51) 7890-1234",
      email: "bruno.costa@example.com",
      endereco: "Av. Brasil",
      numero: "500",
      bairro: "Moinhos de Vento",
      cidade: "Porto Alegre",
      observacoes: "Prefere contato por e-mail",
      tipoCliente: 'PF',
      dataCadastro: new Date(2024, 9, 30)
    },
    {
      id: 12,
      nome: "Fernanda Souza",
      fantasia: "empty",
      cnpj: 'empty',
      cpf: "678.901.234-56",
      ie: 'empty',
      celular: "(61) 96789-0123",
      telefone: "(61) 8901-2345",
      email: "fernanda.souza@example.com",
      endereco: "Rua Azul",
      numero: "600",
      bairro: "Asa Sul",
      cidade: "Brasília",
      observacoes: "Cliente nova",
      tipoCliente: 'PF',
      dataCadastro: new Date(2024, 10, 25)
    }
  ]

  private clientListUpdatedSource = new Subject<void>();
  clientListUpdated$ = this.clientListUpdatedSource.asObservable();

  constructor() {}

  getClientes(): Observable<Cliente[]> {
    return new Observable<Cliente[]>(observer => {
      observer.next(this.clientes.sort((a, b) => a.nome.localeCompare(b.nome)));
      observer.complete();
    });
  }

  getClienteById(id: string): Observable<Cliente> {
    return new Observable<Cliente>(observer => {
      const cliente = this.clientes.find(c => c.id === Number(id));
      observer.next(cliente);
      observer.complete();
    });
  }

  addCliente(cliente: Cliente): Promise<void> {
    return new Promise<void>((resolve) => {
      const clientesId = this.clientes.sort((a, b) => a.id! - b.id!);
      const novoId = clientesId.at(-1)?.id! + 1;
      this.clientes.push({ ...cliente, id: novoId });
      this.clientListUpdatedSource.next();
      resolve();
    });
  }

  updateCliente(id: number | undefined, cliente: Cliente): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      const index = this.clientes.findIndex(c => c.id === Number(id));
      if (index >= 0) {
        this.clientes[index] = { ...cliente, id: Number(id) };
        this.clientListUpdatedSource.next();
        resolve();
      } else {
        reject();
      }
    });
  }

  deleteCliente(id: number): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      const index = this.clientes.findIndex(c => c.id === Number(id));
      if (index >= 0) {
        this.clientes.splice(index, 1);
        this.clientListUpdatedSource.next();
        resolve();
      } else {
        reject();
      }
    });
  }

  getQuantidadeClientes(): Observable<number> {
    return new Observable<number>(observer => {
      observer.next(this.clientes.length);
      observer.complete();
    });
  }

  getQuantidadeClientesMes(): Observable<number> {
    return new Observable<number>(observer => {
      const dataAtual = new Date();
      const mesAtual = dataAtual.getMonth();
      const anoAtual = dataAtual.getFullYear();
      const clientesMes = this.clientes.filter(c => c.dataCadastro.getMonth() === mesAtual && c.dataCadastro.getFullYear() === anoAtual);
      observer.next(clientesMes.length);
      observer.complete();
    });
  }
}
