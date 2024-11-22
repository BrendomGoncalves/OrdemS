import { Injectable } from '@angular/core';
import {environment} from '../../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {map, Observable} from 'rxjs';
import {Categoria} from '../../models/categoria';

@Injectable({
  providedIn: 'root'
})
export class CategoriasService {
  private apiUrl = `${environment.apiUrl}/categorias`;

  constructor(private http: HttpClient) {}

  getCategorias(): Observable<Categoria[]> {
    return this.http.get<Categoria[]>(this.apiUrl).pipe(
      map(categorias => categorias.sort((a, b) => a.nome.localeCompare(b.nome)))
    );
  }

  getCategoriaById(id: string): Observable<Categoria> {
    return this.http.get<Categoria>(`${this.apiUrl}/${id}`);
  }

  addCategoria(categoria: Categoria): Observable<Categoria> {
    return this.http.post<Categoria>(this.apiUrl, categoria).pipe(
      map(categoriaAdicionado => {
        if(categoriaAdicionado.id !== undefined) {
          categoriaAdicionado.id = categoriaAdicionado.id.toString();
        }
        return categoriaAdicionado;
      })
    )
  }

  updateCategoria(id: number | undefined, categoria: Categoria): Observable<Categoria>{
    return this.http.put<Categoria>(`${this.apiUrl}/${id}`, categoria).pipe(
      map(categoriaAtualizado => {
        return categoriaAtualizado;
      })
    );
  }

  deleteCategoria(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
