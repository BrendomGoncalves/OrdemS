import {Cliente} from './cliente';
import {StatusOrdemServicoEnum} from '../enums/statusOrdemServicoEnum';
import {Servico} from './servico';
import {Produto} from './produto';
import {Pagamento} from './pagamento';
import {Empresa} from './empresa';

export interface OrdemServico{
  id: string
  empresa: Empresa
  cliente: Cliente | null
  equipamento: string
  dataAbertura: Date | null
  dataConclusao: Date | null
  descricaoProblema: string
  laudoTecnico: string
  status: StatusOrdemServicoEnum
  valorTotal: number
  servicos: Servico[]
  produtosUtilizados: Produto[]
  pagamento: Pagamento
}
