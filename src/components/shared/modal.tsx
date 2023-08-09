import React, { useState } from 'react';
import { Button, Drawer } from 'antd';
import { useAccountContext } from '../../contexts/Account_Context';
import { useAppContext } from '../../contexts/AppContext';
import { ROLES } from '../../contexts/types';
import { web3FromAddress } from '@polkadot/extension-dapp';

const RolesApp: React.FC = () => {
  const [open, setOpen] = useState(false);
  const { api, selectedAccount } = useAppContext();
  const { role } = useAccountContext();

  const showDrawer = () => {
    setOpen(true);
  };

  const onClose = () => {
    setOpen(false);
  };

  const getRole = async (num: number) => {
    if (!api || !selectedAccount || ROLES.includes(role.toString())) {
      console.log('No Roles possible!');
    } else {
      let who = selectedAccount.address;
      const tx = await api.tx.rolesModule.setRole(who, ROLES[num].toString());
      const injector = await web3FromAddress(who);
      tx.signAndSend(who, { signer: injector.signer }, ({ status }) => {
        if (status.isInBlock) {
          console.log(`Completed at block hash #${status.asInBlock.toString()}`);
        } else {
          console.log(`Current status: ${status.type}`);
        }
      }).catch((error: any) => {
        console.log(':( transaction failed', error);
      });
    }
  };

  return (
    <>
      <Button type="primary" className="bg-blue-600" onClick={showDrawer}>
        Select a Role
      </Button>
      <Drawer title="Basic Drawer" placement="right" onClose={onClose} open={open}>
        <p>
          <Button type="primary" className="bg-pink-600 rounded" onClick={() => getRole(0)}>
            {ROLES[0].toString()}
          </Button>
        </p>
        <br />
        <p>
          <Button type="primary" className="bg-pink-600 rounded" onClick={() => getRole(1)}>
            {ROLES[1].toString()}
          </Button>
        </p>
        <br />
        <p>
          <Button type="primary" className="bg-pink-600 rounded" onClick={() => getRole(2)}>
            {ROLES[2].toString()}
          </Button>
        </p>
        <br />
        <p>
          <Button type="primary" className="bg-pink-600 rounded" onClick={() => getRole(3)}>
            {ROLES[3].toString()}
          </Button>
        </p>
        <br />
        <p>
          <Button type="primary" className="bg-pink-600 rounded" onClick={() => getRole(4)}>
            {ROLES[4].toString()}
          </Button>
        </p>
        <br />
        <p>
          <Button type="primary" className="bg-pink-600 rounded" onClick={() => getRole(5)}>
            {ROLES[5].toString()}
          </Button>
        </p>
      </Drawer>
    </>
  );
};

export default RolesApp;