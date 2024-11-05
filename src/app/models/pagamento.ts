import {MetodoPagamentoEnum} from './metodoPagamentoEnum';
import {StatusPagamentoEnum} from './statusPagamentoEnum';

export interface Pagamento{
  id: number
  valorPago: number
  dataPagamento: Date
  metodoPagamento: MetodoPagamentoEnum.DINHEIRO
  statusPagamento: StatusPagamentoEnum.PENDENTE
}
