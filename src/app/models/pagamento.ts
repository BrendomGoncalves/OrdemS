import {MetodoPagamentoEnum} from '../enums/metodoPagamentoEnum';
import {StatusPagamentoEnum} from '../enums/statusPagamentoEnum';

export interface Pagamento{
  id: number
  valorPago: number
  dataPagamento: Date
  metodoPagamento: MetodoPagamentoEnum.DINHEIRO
  statusPagamento: StatusPagamentoEnum.PENDENTE
}
