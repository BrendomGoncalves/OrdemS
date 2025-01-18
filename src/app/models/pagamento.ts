import {MetodoPagamentoEnum} from '../enums/metodoPagamentoEnum';
import {StatusPagamentoEnum} from '../enums/statusPagamentoEnum';
import {Desconto} from './desconto';

export interface Pagamento{
  dataPagamento: Date | null
  metodoPagamento: MetodoPagamentoEnum
  statusPagamento: StatusPagamentoEnum
  descontos: Desconto[]
  observacoes: string
}
