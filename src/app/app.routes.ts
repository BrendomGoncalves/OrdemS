import { Routes } from '@angular/router';
import {PaginaInicialComponent} from './pages/pagina-inicial/pagina-inicial.component';
import {ClientesListaComponent} from './pages/clientes-lista/clientes-lista.component';
import {OrdemServicoComponent} from './pages/ordem-servico/ordem-servico.component';
import {ServicosListaComponent} from './pages/servicos-lista/servicos-lista.component';
import {CategoriasListaComponent} from './pages/categorias-lista/categorias-lista.component';
import {ProdutosListaComponent} from './pages/produtos-lista/produtos-lista.component';

export const routes: Routes = [
  { path: '', redirectTo: 'pagina-inicial', pathMatch: 'full' },
  { path: 'pagina-inicial', component: PaginaInicialComponent },
  { path: 'clientes', component: ClientesListaComponent },
  { path: 'produtos', component: ProdutosListaComponent},
  { path: 'servicos', component: ServicosListaComponent},
  { path: 'categorias', component: CategoriasListaComponent},
  { path: 'os', component: OrdemServicoComponent},
  { path: '**', redirectTo: 'pagina-inicial' }
];
