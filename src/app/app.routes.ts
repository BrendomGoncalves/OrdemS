import { Routes } from '@angular/router';
import {PaginaInicialComponent} from './pages/pagina-inicial/pagina-inicial.component';
import {ClientesListaComponent} from './pages/clientes-lista/clientes-lista.component';
import {OrdemServicoComponent} from './pages/ordem-servico/ordem-servico.component';
import {ServicosListaComponent} from './pages/servicos-lista/servicos-lista.component';
import {CategoriasListaComponent} from './pages/categorias-lista/categorias-lista.component';
import {ProdutosListaComponent} from './pages/produtos-lista/produtos-lista.component';
import {VendaProdutoComponent} from './pages/venda-produto/venda-produto.component';
import {VendasListaComponent} from './pages/vendas-lista/vendas-lista.component';
import {OrdemListaComponent} from './pages/ordem-lista/ordem-lista.component';

export const routes: Routes = [
  { path: '', redirectTo: 'pagina-inicial', pathMatch: 'full' },
  { path: 'pagina-inicial', component: PaginaInicialComponent },
  { path: 'clientes', component: ClientesListaComponent },
  { path: 'produtos', component: ProdutosListaComponent},
  { path: 'venda-produto', component: VendaProdutoComponent },
  { path: 'vendas', component: VendasListaComponent},
  { path: 'servicos', component: ServicosListaComponent},
  { path: 'categorias', component: CategoriasListaComponent},
  { path: 'ordem-servico', component: OrdemServicoComponent},
  { path: 'ordens', component: OrdemListaComponent},
  { path: '**', redirectTo: 'pagina-inicial' }
];
