import {Injectable} from '@angular/core';
import {map, Observable} from 'rxjs';
import {Cliente} from '../../models/cliente/cliente';
import {environment} from '../../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {ClienteCreateDto} from '../../models/cliente/clienteCreateDto';

@Injectable({
  providedIn: 'root',
})
export class ClientesService {
  private apiUrl = `${environment.apiUrl}/clientes`;

  constructor(private http: HttpClient) {
  }

  async getClientes(): Promise<Observable<Cliente[]>> {
    return this.http.get<Cliente[]>(this.apiUrl).pipe(
      map(clientes => {
        return clientes;
      })
    );
  }

  async getClienteById(id: string): Promise<Observable<Cliente>> {
    return this.http.get<Cliente>(`${this.apiUrl}/${id}`);
  }

  async getClienteByCpf(cpf: string): Promise<Observable<Cliente>> {
    return this.http.get<Cliente>(`${this.apiUrl}?cpf=${cpf}`);
  }

  async getClienteByCnpj(cnpj: string): Promise<Observable<Cliente>> {
    return this.http.get<Cliente>(`${this.apiUrl}?cnpj=${cnpj}`);
  }

  async getClienteByIe(ie: string): Promise<Observable<Cliente>> {
    return this.http.get<Cliente>(`${this.apiUrl}?ie=${ie}`);
  }

  async addCliente(cliente: ClienteCreateDto): Promise<Observable<ClienteCreateDto>> {
    return this.http.post<ClienteCreateDto>(this.apiUrl, cliente).pipe(
      map(clienteCriado => {
        return clienteCriado;
      })
    );
  }

  async updateCliente(id: number | undefined, cliente: Cliente): Promise<Observable<Cliente>> {
    return this.http.put<Cliente>(`${this.apiUrl}/${id}`, cliente).pipe(
      map(clienteAtualizado => {
        return clienteAtualizado;
      })
    );
  }

  async deleteCliente(id: number): Promise<Observable<void>> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
