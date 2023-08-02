import { InjectedAccountWithMeta } from '@polkadot/extension-inject/types';
import { ApiPromise } from '@polkadot/api';
import BN from 'bn.js';

export type Address = string | undefined;
export type AccountRole = string[];
export interface AppState {
  api: ApiPromise | null;
  accounts: InjectedAccountWithMeta[];
  selectedAccount: InjectedAccountWithMeta | undefined;
  selectedAddress: Address;
  blocks: string;
  total_users_nbr: number;
  inv_nbr: number;
  seller_nbr: number;
  awaiting_seller_nbr: number;
  tenant_nbr: number;
  treasury_balance: BN | undefined;
}

export interface AccountContextState {
  address: Address;
  role: AccountRole;
  balance: BN | undefined;
}

export interface CouncilSessionContextState {
  approved: boolean;
  role: AccountRole;
  session_closed: boolean;
  ayes: number;
  nay: number;
  council_members: InjectedAccountWithMeta[];
}

export const isRoleValid = (_role: string): boolean => {
  if (!_role) return false;
  return ROLES.indexOf(_role) !== -1;
};

export const ROLES = ['INVESTOR', 'TENANT', 'SERVICER', 'SELLER', 'NOTARY', 'REPRESENTATIVE'];
