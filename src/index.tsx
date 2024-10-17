import React, { useEffect, useState } from 'react'
import ReactDOM from 'react-dom/client'
import { bitable, ICurrencyField } from '@lark-base-open/js-sdk';
import { Alert, AlertProps } from 'antd';
import { Button } from 'antd';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <LoadApp />
  </React.StrictMode>
)

function LoadApp() {
  const [info, setInfo] = useState('get table name, please waiting ....');
  const [alertType, setAlertType] = useState<AlertProps['type']>('info');
  useEffect(() => {
    const fn = async () => {
      const table = await bitable.base.getActiveTable();
      const view = await table.getActiveView();
      const viewName = await view.getName();
      setInfo(`当前视图为 ${viewName}`);
      setAlertType('success');
    };
    fn();
  }, []);

  const getCsvContent = async () => {
    const table = await bitable.base.getActiveTable();
    const view = await table.getActiveView();
    const recordIdList = await view.getVisibleRecordIdList();
    const fieldIdList = await view.getVisibleFieldIdList();
    let data = [];
    for(const recordId of recordIdList) {
      let recordValue = [];
      for(const fieldId of fieldIdList) {
        const field = await table.getFieldById(fieldId);
        const cell = await field.getCellString(recordId);
        recordValue.push(cell);
      }
      data.push(recordValue);
    }
    console.log(data);
  }

  return <div>
    <Alert message={info} type={alertType} />
    <div style={{ margin: 10 }}>
      <div>下载 csv</div>
      <Button style={{ marginLeft: 10 }} onClick={getCsvContent}>下载</Button>
    </div>
  </div>
}