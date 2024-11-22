import {Produto} from './produto';
import {Cliente} from './cliente';

export interface Venda{
  id: string;
  produtos: Produto[];
  cliente: Cliente;
  data: Date;
  total: number;
}
