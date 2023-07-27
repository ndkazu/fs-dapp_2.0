import React, { useEffect } from 'react';
import { useAppContext } from '../../contexts/AppContext';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';
import BN from 'bn.js';

ChartJS.register(ArcElement, Tooltip, Legend);
const treasury_address = '5EYCAe5ijiYfyeZ2JJCGq56LmPyNRAKzpG4QkoQkkQNB5e6Z';
function toUnit(balance: BN, decimals: number) {
  let base = new BN(10).pow(new BN(decimals));
  let dm = new BN(balance).divmod(base);
  return parseFloat(dm.div.toString() + '.' + dm.mod.toString());
}
export default function Dashboard() {
  const {
    api,
    blocks,
    total_users_nbr,
    inv_nbr,
    seller_nbr,
    awaiting_seller_nbr,
    tenant_nbr,
    treasury_balance,
    dispatch,
  } = useAppContext();

  useEffect(() => {
    if (!api) return;
    (async () => {
      const inv_nbr = (await api.query.rolesModule.investorLog.entries()).length as number;
      console.log(inv_nbr.toString);
      dispatch({ type: 'SET_INVESTORS_NBR', payload: inv_nbr });

      const tenant_nbr = (await api.query.rolesModule.tenantLog.entries()).length as number;
      console.log(tenant_nbr.toString);
      dispatch({ type: 'SET_TENANTS_NBR', payload: tenant_nbr });

      await api.query.system.account(treasury_address, ({ data: free }: { data: { free: BN } }) => {
        let { free: balance1 } = free;
        let decimals = toUnit(balance1, 4);
        console.log('BALANCE:' + decimals.toString());
        dispatch({ type: 'SET_TREASURY_BALANCE', payload: balance1 });
      });

      const sellerApprovalListRaw = await api.query.rolesModule.sellerApprovalList();

      const awaiting_seller_nbr = JSON.stringify(sellerApprovalListRaw)
        .split(/[\]}{[]+/)
        .filter((str) => str !== '')
        .filter((str) => str !== ',');
      console.log('SELLER: ' + awaiting_seller_nbr);
      dispatch({ type: 'SET_A_SELLERS_NBR', payload: awaiting_seller_nbr.length });

      const seller_nbr = (await api.query.rolesModule.houseSellerLog.entries()).length as number;
      console.log(seller_nbr.toString);
      dispatch({ type: 'SET_SELLERS_NBR', payload: seller_nbr });

      const total_users_nbr = (await api.query.rolesModule.totalMembers()).toPrimitive() as number;
      console.log(total_users_nbr.toString);
      dispatch({ type: 'SET_TOTAL', payload: total_users_nbr });
    })();
  }, [api, blocks, dispatch]);

  const data = {
    labels: ['Investors', 'Tenants', 'Sellers', 'Awaiting Sellers'],
    datasets: [
      {
        label: '# of roles',
        data: [inv_nbr, tenant_nbr, seller_nbr, awaiting_seller_nbr],
        backgroundColor: [
          'rgba(255, 99, 132, 0.2)',
          'rgba(54, 162, 235, 0.2)',
          'rgba(255, 206, 86, 0.2)',
          'rgba(75, 192, 192, 0.2)',
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
        ],
        borderWidth: 2,
      },
    ],
  };

  return (
    <div className="flex flex-col">
      <h1 className="text-3xl text-slate-700 font-bold">DASHBOARD</h1>
      <p className="text-xl font-bold">
        House Fund: {!treasury_balance ? '0' : toUnit(treasury_balance, 3).toString()}
      </p>
      <p className="text-xl font-bold">Total Number of Users: {total_users_nbr}</p>
      <Pie data={data} />
    </div>
  );
}
