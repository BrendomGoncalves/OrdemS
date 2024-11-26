import {MetodoPagamentoEnum} from '../enums/metodoPagamentoEnum';
import {StatusPagamentoEnum} from '../enums/statusPagamentoEnum';

export interface Pagamento{
  id: string
  valorPago: number
  dataPagamento: Date | null
  metodoPagamento: MetodoPagamentoEnum
  statusPagamento: StatusPagamentoEnum
  observacoes: string
}
