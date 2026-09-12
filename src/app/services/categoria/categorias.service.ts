import {Injectable} from '@angular/core';
import {environment} from '../../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {map, Observable} from 'rxjs';
import {Categoria} from '../../models/categoria/categoria';

@Injectable({
  providedIn: 'root'
})
export class CategoriasService {
  private apiUrl = `${environment.apiUrl}/categorias`;

  constructor(private http: HttpClient) {}

  async getCategorias(): Promise<Observable<Categoria[]>> {
    return this.http.get<Categoria[]>(this.apiUrl).pipe(
      map(categorias => {
        return categorias;
      })
    );
  }

  async getCategoriaById(id: number): Promise<Observable<Categoria>> {
    return this.http.get<Categoria>(`${this.apiUrl}/${id}`);
  }

  async addCategoria(categoria: Categoria): Promise<Observable<Categoria>> {
    return this.http.post<Categoria>(this.apiUrl, categoria).pipe(
      map(categoriaCriada => {
        return categoriaCriada;
      })
    );
  }

  async updateCategoria(id: number, categoria: Categoria): Promise<Observable<Categoria>> {
    return this.http.put<Categoria>(`${this.apiUrl}/${id}`, categoria).pipe(
      map(categoriaAtualizado => {
        return categoriaAtualizado;
      })
    );
  }

  async deleteCategoria(id: number): Promise<Observable<void>> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
