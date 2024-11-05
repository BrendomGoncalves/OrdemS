import { Injectable } from '@angular/core';
import {Servico} from '../../models/servico';
import {Observable, Subject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ServicosService {
  private servicos: Servico[] = [
    {
      id: 1,
      nome: "Limpeza de Hardware",
      categoria: {id: 1, nome: "Hardware"},
      precoVenda: 80.0,
      observacoes: "Limpeza completa de componentes internos e externos",
      dataCadastro: new Date("2024-01-15")
    },
    {
      id: 2,
      nome: "Formatação de Computador",
      categoria: {id: 2, nome: "Software"},
      precoVenda: 120.0,
      observacoes: "Formatação e reinstalação do sistema operacional",
      dataCadastro: new Date("2024-01-20")
    },
    {
      id: 3,
      nome: "Remoção de Vírus",
      categoria: {id: 2, nome: "Software"},
      precoVenda: 100.0,
      observacoes: "Remoção completa de vírus e otimização do sistema",
      dataCadastro: new Date("2024-02-05")
    },
    {
      id: 4,
      nome: "Instalação de Software",
      categoria: {id: 2, nome: "Software"},
      precoVenda: 50.0,
      observacoes: "Instalação de software licenciado e configuração inicial",
      dataCadastro: new Date("2024-02-15")
    },
    {
      id: 5,
      nome: "Recuperação de Dados",
      categoria: {id: 1, nome: "Hardware"},
      precoVenda: 200.0,
      observacoes: "Recuperação de dados de HDs, SSDs ou pendrives",
      dataCadastro: new Date("2024-03-01")
    },
    {
      id: 6,
      nome: "Configuração de Rede",
      categoria: {id: 3, nome: "Rede"},
      precoVenda: 150.0,
      observacoes: "Configuração de rede Wi-Fi e cabeada",
      dataCadastro: new Date("2024-03-10")
    },
    {
      id: 7,
      nome: "Troca de Pasta Térmica",
      categoria: {id: 1, nome: "Hardware"},
      precoVenda: 40.0,
      observacoes: "Substituição de pasta térmica para melhor desempenho",
      dataCadastro: new Date("2024-03-20")
    },
    {
      id: 8,
      nome: "Atualização de Sistema Operacional",
      categoria: {id: 2, nome: "Software"},
      precoVenda: 90.0,
      observacoes: "Atualização para a versão mais recente do sistema",
      dataCadastro: new Date("2024-04-05")
    },
    {
      id: 9,
      nome: "Diagnóstico de Hardware",
      categoria: {id: 1, nome: "Hardware"},
      precoVenda: 60.0,
      observacoes: "Verificação completa de problemas em componentes",
      dataCadastro: new Date("2024-04-12")
    },
    {
      id: 10,
      nome: "Backup de Dados",
      categoria: {id: 2, nome: "Software"},
      precoVenda: 70.0,
      observacoes: "Backup completo de dados importantes em mídia externa",
      dataCadastro: new Date("2024-05-01")
    },
    {
      id: 11,
      nome: "Montagem de Computador",
      categoria: {id: 1, nome: "Hardware"},
      precoVenda: 150.0,
      observacoes: "Montagem e teste de todos os componentes",
      dataCadastro: new Date("2024-05-10")
    },
    {
      id: 12,
      nome: "Consultoria em Segurança Digital",
      categoria: {id: 4, nome: "Informação"},
      precoVenda: 200.0,
      observacoes: "Avaliação e configuração de segurança digital",
      dataCadastro: new Date("2024-05-20")
    }
  ];

  private servicoListUpdateSource = new Subject<void>();
  servicoListUpdate$ = this.servicoListUpdateSource.asObservable();

  constructor() {
  }

  getServicos(): Observable<Servico[]> {
    return new Observable<Servico[]>(observer => {
      observer.next(this.servicos.sort((a, b) => a.nome.localeCompare(b.nome)));
      observer.complete();
    });
  }

  getServicoById(id: string): Observable<Servico> {
    return new Observable<Servico>(observer => {
      const servico = this.servicos.find(s => s.id === Number(id));
      observer.next(servico);
      observer.complete();
    });
  }

  addServico(servico: Servico): Promise<void> {
    return new Promise<void>((resolve) => {
      const servicosId = this.servicos.sort((a, b) => a.id! - b.id!);
      const novoId = servicosId.at(-1)?.id! + 1;
      this.servicos.push({...servico, id: novoId});
      this.servicoListUpdateSource.next();
      resolve();
    });
  }

  updateServico(id: number | undefined, servico: Servico): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      const index = this.servicos.findIndex(s => s.id === Number(id));
      if (index >= 0) {
        this.servicos[index] = {...servico, id: Number(id)};
        this.servicoListUpdateSource.next();
        resolve();
      } else {
        reject();
      }
    });
  }

  deleteServico(id: number): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      const index = this.servicos.findIndex(s => s.id === Number(id));
      if (index >= 0) {
        this.servicos.splice(index, 1);
        this.servicoListUpdateSource.next();
        resolve();
      } else {
        reject();
      }
    });
  }

  getQuantidadeServicos(): Observable<number> {
    return new Observable<number>(observer => {
      observer.next(this.servicos.length);
      observer.complete();
    });
  }

  getUltimoServico(): Observable<string> {
    return new Observable<string>(observer => {
      const ultimoServico = this.servicos.sort((a, b) => b.dataCadastro.getTime() - a.dataCadastro.getTime())[0];
      observer.next(ultimoServico.nome);
      observer.complete();
    });
  }
}
