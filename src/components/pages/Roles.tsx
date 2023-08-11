import { InjectedAccountWithMeta } from '@polkadot/extension-inject/types';
import { useAccountContext } from '../../contexts/Account_Context';
import React, { useEffect } from 'react';
import { useAppContext } from '../../contexts/AppContext';
import { useConcilSessionContext } from '../../contexts/CouncilSessionContext';
import BN from 'bn.js';
import { toUnit } from '../shared/utils';
import RolesApp from '../shared/modal';
import Referendum from '../shared/referendum';

export default function Roles() {
  const { api, blocks, selectedAccount } = useAppContext();
  const { address, role, balance, dispatch0 } = useAccountContext();
  const { ayes, nay, role_in_session, council_members, dispatch1 } = useConcilSessionContext();

  useEffect(() => {
    if (!api || !selectedAccount) return;
    let address0 = selectedAccount.address;
    api.query.rolesModule.requestedRoles(address0, (data: any) => {
      let data0 = data.toHuman();
      console.log('existing data ' + data0);
      let r_session = data0?.role.toString();

      dispatch1({ type: 'SET_ROLE_IN_SESSION', payload: r_session });
    });
  }, [selectedAccount, blocks, dispatch1, api]);

  useEffect(() => {
    if (!api || !selectedAccount) return;
    let address0 = selectedAccount.address;

    dispatch0({ type: 'SET_ADDRESS', payload: address0 });
    api.query.rolesModule.accountsRolesLog(address0, (roles: string[]) => {
      let rl = roles;
      dispatch0({ type: 'SET_ROLES', payload: rl });
    });

    api.query.system.account(address0, ({ data: free }: { data: { free: BN } }) => {
      let { free: balance1 } = free;

      dispatch0({ type: 'SET_BALANCE', payload: balance1 });
    });

    api.query.council.members((who: InjectedAccountWithMeta[]) => {
      dispatch1({ type: 'SET_COUNCIL_MEMBERS', payload: who });
    });
    api.query.backgroundCouncil.proposals((hash: string[]) => {
      if (hash.length > 0) {
        let hash0 = hash[0];

        api.query.backgroundCouncil.voting(hash0, (data: any) => {
          let data1 = data.toHuman();
          if (data1 !== null) {
            let yes = data1.ayes.length;
            let no = data1.nays.length;
            dispatch1({ type: 'SET_AYES', payload: yes });
            dispatch1({ type: 'SET_NAY', payload: no });
          }
        });
      }
    });
  }, [selectedAccount, api, dispatch0, dispatch1, blocks]);

  return (
    <div className="flex flex-col py-5 justify-evenly">
      <div className="flex flex-row basis-1/3 justify-between">
        <h1>Your Balance: {!balance ? '0' : toUnit(balance, 3).toString()}</h1>
      </div>
      <div className="flex flex-row justify-evenly">
        <h1>
          Your Roles:{' '}
          {!(role.length > 0)
            ? 'None'
            : role.map((value: string, index: number) => <p key={index}>{value.toString()}</p>)}
        </h1>
        <h1 className="flex flex-col">
          Last Requested Role:{' '}
          {!role_in_session || role.includes(role_in_session) ? 'None' : role_in_session}
          <br />
          <div>
            <header>Referendum Status</header>
            <p>
              {!role_in_session || role.includes(role_in_session) ? (
                'No active referendum'
              ) : (
                <Referendum />
              )}
            </p>
          </div>
        </h1>
      </div>
      <br />
      <br />
      <div className="flex flex-row items-start space-x-3 ">
        <RolesApp />
      </div>
    </div>
  );
}
