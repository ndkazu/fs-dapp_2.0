import React, { useEffect, useState } from 'react';
import { Button, Drawer } from 'antd';
import { useAccountContext } from '../../contexts/Account_Context';
import { useAppContext } from '../../contexts/AppContext';
import { ROLES } from '../../contexts/types';
import { web3FromAddress } from '@polkadot/extension-dapp';
import { Toast } from 'flowbite-react';

const RolesApp: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [event, setEvents] = useState('No Roles');
  const [showToast, setShowToast] = useState(false);
  const [warning, setWarning] = useState(false);
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
      tx.signAndSend(who, { signer: injector.signer }, ({ status, events, dispatchError }) => {
        if (dispatchError) {
          if (dispatchError.isModule) {
            console.log(`Current status: ${status.type}`);
            // for module errors, we have the section indexed, lookup
            const decoded = api.registry.findMetaError(dispatchError.asModule);
            const { docs, name, section } = decoded;
            setEvents(name.toString());
            setShowToast(true);
            setWarning(true);

            console.log(`${section}.${name}: ${docs.join(' ')}`);
          }
        } else if (status.isFinalized) {
          console.log(`Current status: ${status.type}`);
          events.forEach(({ event: { method, section } }) => {
            if (section.toString().includes('rolesModule')) {
              setEvents(method.toString());
              setShowToast(true);
              setWarning(false);
            }
          });
        } else {
          console.log(`Current status: ${status.type}`);
        }
      });
    }
  };

  useEffect(() => {
    if (event !== 'No Roles') console.log(event);
  }, [event]);

  return (
    <>
      <Button
        type="primary"
        className="bg-blue-600 text-white font-bold py-2 pb-10 text-xl"
        onClick={showDrawer}
      >
        Select a Role
      </Button>
      {!(event === 'No Roles' || showToast === false) ? (
        <Toast
          className={
            'shadow-md rounded-md flex items-start text-white text-xl font-bold' +
            (warning === true ? ' bg-red-500 animate-bounce ' : ' bg-blue-500  animate-pulse')
          }
        >
          <div className="ml-3 text-sm font-normal">{event}</div>
          <Toast.Toggle
            onClick={() => {
              setShowToast(false);
            }}
          />
        </Toast>
      ) : (
        <div className=" p-5"> </div>
      )}

      <Drawer title="Basic Drawer" placement="right" onClose={onClose} open={open}>
        <p>
          <Button
            type="primary"
            className="bg-pink-600 rounded"
            onClick={() => {
              getRole(0);
            }}
          >
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
