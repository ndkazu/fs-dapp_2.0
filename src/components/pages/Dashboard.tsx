import React, { useEffect } from 'react';
import { useAppContext } from '../../contexts/AppContext';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

export default function Dashboard() {
  const {
    api,
    blocks,
    total_users_nbr,
    inv_nbr,
    seller_nbr,
    awaiting_seller_nbr,
    tenant_nbr,
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
      <div>DASHBOARD</div>
      <div className="font-bold text-xl">Total Number of Users: {total_users_nbr}</div>
      <div>
        <Pie data={data} />
      </div>
    </div>
  );
}
