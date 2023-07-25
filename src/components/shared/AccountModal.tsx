import { ApiPromise, WsProvider } from '@polkadot/api';
import { web3Accounts, web3Enable } from '@polkadot/extension-dapp';
import { ChangeEvent, useEffect } from 'react';
import { useAppContext } from '../../contexts/AppContext';

const NAME = 'fs-dapp';

function AccountModal() {
  const { api, accounts, selectedAccount, selectedAddress, blocks, dispatch } = useAppContext();

  const setup = async () => {
    const wsProvider = new WsProvider('ws://127.0.0.1:9944');
    const api0 = await ApiPromise.create({ provider: wsProvider });
    dispatch({ type: 'SET_API', payload: api0 });
  };

  const handleConnection = async () => {
    const extensions = await web3Enable(NAME);
    if (!extensions) {
      throw Error('NO_EXTENSION_FOUND');
    }

    const allAccounts = await web3Accounts();
    console.log(allAccounts);
    dispatch({ type: 'SET_ACCOUNTS', payload: allAccounts });

    if (allAccounts.length === 1) {
      dispatch({ type: 'SET_SELECTED_ACCOUNT', payload: allAccounts[0] });
    }
  };

  const handleConnectionChange = () => {
    dispatch({ type: 'SET_SELECTED_ACCOUNT', payload: undefined });
    dispatch({ type: 'SET_SELECTED_ADDRESS', payload: '' });
  };

  const handleAccountSelection = async (e: ChangeEvent<HTMLSelectElement>) => {
    const selectedAddress = e.target.value;
    const account = accounts.find((account) => account.address === selectedAddress);
    if (!account) {
      throw Error('NO_ACCOUNT_FOUND');
    }
    dispatch({ type: 'SET_SELECTED_ACCOUNT', payload: account });
  };

  useEffect(() => {
    setup();
  }, []);

  useEffect(() => {
    if (!api || !selectedAccount) return;

    api.query.system.number((block: number) => {
      dispatch({ type: 'SET_BLOCKS', payload: block.toString() });
    });
  }, [api, selectedAccount, dispatch]);

  return (
    <div>
      {accounts.length === 0 ? (
        <button
          onClick={handleConnection}
          className="rounded-md bg-neutral-900 text-white px-4 py-1"
        >
          Connect
        </button>
      ) : null}

      {accounts.length > 0 && !selectedAccount ? (
        <select
          value={selectedAddress}
          onChange={handleAccountSelection}
          className="outline-neutral-800 rounded-md py-1"
        >
          <option value="" disabled selected hidden key="nothing">
            Select an account
          </option>

          {accounts.map((account) => (
            <option value={account.address} key={account.address}>
              {account.meta.name || account.address}
            </option>
          ))}
        </select>
      ) : null}
      {selectedAccount ? (
        <button
          onClick={handleConnectionChange}
          className="rounded-md bg-green-800 text-white px-4 py-1"
        >
          {' ' +
            selectedAccount.meta.name +
            ' | ' +
            selectedAccount.address.slice(0, 6) +
            '...' +
            selectedAccount.address.slice(-6, -1)}
        </button>
      ) : null}
      <div className="font-bold text-slate-950">
        <p>{blocks ? 'Current block:' + blocks : 'Enter the FairSquares'}</p>
      </div>
    </div>
  );
}

export default AccountModal;
