import '@polkadot/api-augment';
import '@polkadot/api-augment/polkadot';
import { useAccountContext } from '../..//contexts/Account_Context';
import React, { useEffect } from 'react';
import { useAppContext } from '../../contexts/AppContext';
import { useConcilSessionContext } from '../../contexts/CouncilSessionContext';
import BN from 'bn.js';
import { AnyJson, Codec } from '@polkadot/types-codec/types';

export default function Roles() {
  const { api, blocks, selectedAccount } = useAppContext();

  const { address, role, balance, dispatch0 } = useAccountContext();

  const { approved, session_closed, ayes, nay, council_members, dispatch1 } =
    useConcilSessionContext();

  useEffect(() => {
    if (!api || !selectedAccount) return;
    let add = selectedAccount.address.toString();
    /*get user balance */
    api.query.system.account(add, ({ data: free }: { data: { free: BN } }) => {
      let { free: balance1 } = free;
      dispatch0({ type: 'SET_BALANCE', payload: balance1 });
    });

    dispatch0({ type: 'SET_ADDRESS', payload: add });
    api.query.rolesModule.accountsRolesLog(add, (roles: string[]) => {
      let rl = roles;
      dispatch0({ type: 'SET_ROLES', payload: rl });
    });
  }, [selectedAccount, api, dispatch0, blocks]);

  useEffect(() => {
    if (!api || !selectedAccount) return;
    let add = selectedAccount.address;
    /*requested role */
    api.query.rolesModule.requestedRoles(
      add,
      ({ block, role }: { block: number; role: string }) => {
        let data0 = block;
        let data1 = role;
        console.log('In session:' + data0 + ' & ' + data1);
      },
    );
  });
  return <div>Roles</div>;
}
