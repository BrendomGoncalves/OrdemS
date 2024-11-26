import {Cliente} from './cliente';
import {StatusEnum} from '../enums/statusEnum';
import {Servico} from './servico';
import {Produto} from './produto';
import {Pagamento} from './pagamento';

export interface OrdemServico{
  id: string
  cliente: Cliente | null
  equipamento: string
  dataAbertura: Date | null
  dataConclusao: Date | null
  descricaoProblema: string
  descricaoSolucao: string
  status: StatusEnum
  valorTotal: number
  servicos: Servico[]
  produtosUtilizados: Produto[]
  pagamento: Pagamento | null
}
