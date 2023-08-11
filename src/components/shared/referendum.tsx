import React from 'react';
import { useConcilSessionContext } from '../../contexts/CouncilSessionContext';
import { Progress, Space } from 'antd';

function Referendum() {
  const { ayes, role_in_session, council_members } = useConcilSessionContext();

  const yes = Number(((ayes / council_members.length) * 100).toFixed(1));

  return (
    <div>
      {role_in_session ? (
        <Space wrap>
          <Progress type="circle" percent={yes} size={80}></Progress>
          <Progress type="circle" percent={100 - yes} size={80} status="exception"></Progress>
        </Space>
      ) : (
        <div>No active referendum</div>
      )}
    </div>
  );
}

export default Referendum;
