import {Produto} from './produto';

export interface Venda{
  id: string;
  produtos: Produto[];
  nomeCliente: string;
  documentoCliente: string;
  data: Date;
  total: number;
}
