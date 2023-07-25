import { InjectedAccountWithMeta } from '@polkadot/extension-inject/types';
import { ApiPromise } from '@polkadot/api';

export interface AppState {
  api: ApiPromise | null;
  accounts: InjectedAccountWithMeta[];
  selectedAccount: InjectedAccountWithMeta | undefined;
  selectedAddress: string;
  blocks: string;
  total_users_nbr: number;
  inv_nbr: number;
  seller_nbr: number;
  awaiting_seller_nbr: number;
  tenant_nbr: number;
}
