import {Injectable} from '@angular/core';
import {map, Observable} from 'rxjs';
import {Cliente} from '../../models/cliente';
import {environment} from '../../../environments/environment';
import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class ClientesService {
  private apiUrl = `${environment.apiUrl}/clientes`;

  constructor(private http: HttpClient) {}

  getClientes(): Observable<Cliente[]> {
    return this.http.get<Cliente[]>(this.apiUrl).pipe(
      map(clientes => clientes.sort((a, b) => a.nome.localeCompare(b.nome)))
    );
  }

  getClienteById(id: string): Observable<Cliente> {
    return this.http.get<Cliente>(`${this.apiUrl}/${id}`);
  }

  addCliente(cliente: Cliente): Observable<Cliente> {
    return this.http.post<Cliente>(this.apiUrl, cliente).pipe(
      map(clienteAdicionado => {
        if (clienteAdicionado.id !== undefined) {
          clienteAdicionado.id = clienteAdicionado.id.toString();
        }
        return clienteAdicionado;
      })
    );
  }

  updateCliente(id: number | undefined, cliente: Cliente): Observable<Cliente> {
    return this.http.put<Cliente>(`${this.apiUrl}/${id}`, cliente).pipe(
      map(clienteAtualizado => {
        return clienteAtualizado;
      })
    );
  }

  deleteCliente(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
