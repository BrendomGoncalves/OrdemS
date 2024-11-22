import {Cliente} from './cliente';
import {StatusEnum} from '../enums/statusEnum';
import {Servico} from './servico';
import {Produto} from './produto';
import {Pagamento} from './pagamento';

export interface OrdemServico{
  id: number
  cliente: Cliente
  dataAbertura: Date
  dataConclusao: Date
  descricaoProblema: string
  descricaoSolucao: string
  status: StatusEnum.PENDENTE
  valorTotal: number
  servicos: Servico[]
  produtosUtilizados: Produto[]
  pagamento: Pagamento
}
