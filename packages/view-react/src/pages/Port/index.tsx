import { Button, Input, Select, Space, Tag, Typography } from '@arco-design/web-react';
import type { ListTableConstructorOptions } from '@visactor/vtable';
import { useEffect, useMemo, useState } from 'react';
import { BaseListTable } from '../../components/BaseListTable';
import { BaseResizeBox } from '../../components/BaseResizeBox';
import './styles.css';

type PortRecord = {
  id: string;
  name: string;
  device: string;
  protocol: string;
  status: string;
  signalCount: number;
};

const portRecords: PortRecord[] = [
  { id: 'PORT-001', name: '生产线主站', device: 'PLC-A01', protocol: 'Modbus TCP', status: '在线', signalCount: 128 },
  { id: 'PORT-002', name: '环境采集网关', device: 'GW-B12', protocol: 'MQTT', status: '在线', signalCount: 64 },
  { id: 'PORT-003', name: '能源计量终端', device: 'METER-C07', protocol: 'OPC UA', status: '告警', signalCount: 96 },
  { id: 'PORT-004', name: '仓储输送控制器', device: 'PLC-D03', protocol: 'S7', status: '离线', signalCount: 48 },
  { id: 'PORT-005', name: '质量检测设备', device: 'VISION-E02', protocol: 'HTTP', status: '在线', signalCount: 32 },
  { id: 'PORT-006', name: '包装线从站', device: 'PLC-F18', protocol: 'Modbus RTU', status: '在线', signalCount: 80 },
];

const tableTheme = {
  headerStyle: { bgColor: '#f7f8fa', color: '#1d2129', fontWeight: 'bold' as const },
  bodyStyle: { color: '#4e5969' },
};

function Port() {
  const [keyword, setKeyword] = useState('');
  const [status, setStatus] = useState('all');
  const [selectedPort, setSelectedPort] = useState(portRecords[0]);
  const [compact, setCompact] = useState(() => window.innerWidth < 720);

  useEffect(() => {
    const updateLayout = () => setCompact(window.innerWidth < 720);
    window.addEventListener('resize', updateLayout);
    return () => window.removeEventListener('resize', updateLayout);
  }, []);

  const filteredPorts = useMemo(
    () =>
      portRecords.filter((port) => {
        const matchesKeyword = `${port.name}${port.device}${port.protocol}`
          .toLowerCase()
          .includes(keyword.trim().toLowerCase());
        return matchesKeyword && (status === 'all' || port.status === status);
      }),
    [keyword, status],
  );

  const portTableOption = useMemo<ListTableConstructorOptions>(
    () => ({
      columns: [
        { field: 'name', title: '端口名称', width: 145 },
        { field: 'device', title: '设备编码', width: 110 },
        { field: 'protocol', title: '协议', width: 105 },
        { field: 'status', title: '状态', width: 72 },
        { field: 'signalCount', title: '信号数', width: 72 },
      ],
      records: filteredPorts,
      theme: tableTheme,
      defaultRowHeight: 44,
      select: {
        headerSelectMode: 'cell',
        outsideClickDeselect: false,
        blankAreaClickDeselect: false,
        disableHeaderSelect: true,
      },
    }),
    [filteredPorts],
  );

  const signalTableOption = useMemo<ListTableConstructorOptions>(
    () => ({
      columns: [
        { field: 'signal', title: '信号名称12', width: 145 },
        { field: 'type', title: '数据类型', width: 96 },
        // { field: 'address', title: '地址', width: 88 },
        // { field: 'value', title: '当前值', width: 120 },
        // { field: 'quality', title: '质量', width: 76 },
      ],
      records: [],
      emptyTip: { text: 'No Data' },
      theme: tableTheme,
      defaultRowHeight: 44,
      select: { disableSelect: true, disableHeaderSelect: true },
    }),
    [],
  );

  return (
    <main className="port-page">
      <header className="port-page__header">
        <div>
          <Typography.Title heading={5}>Port 管理</Typography.Title>
          <Typography.Text type="secondary">查看端口配置及其关联信号</Typography.Text>
        </div>
        <Space>
          <Tag color="green">在线 {portRecords.filter((item) => item.status === '在线').length}</Tag>
          <Button type="primary">新增端口</Button>
        </Space>
      </header>

      <BaseResizeBox.Split
        className="port-split"
        direction={compact ? 'vertical' : 'horizontal'}
        min={compact ? 0.3 : 0.2}
        max={compact ? 0.75 : 0.8}
        size={compact ? 0.55 : 0.4}
        panes={[
          <section className="port-panel port-panel--left" key="left">
            <div className="port-search">
              <Input.Search
                allowClear
                placeholder="搜索端口、设备或协议"
                value={keyword}
                onChange={setKeyword}
              />
              <Select
                value={status}
                onChange={setStatus}
                options={[
                  { label: '全部状态', value: 'all' },
                  { label: '在线', value: '在线' },
                  { label: '告警', value: '告警' },
                  { label: '离线', value: '离线' },
                ]}
              />
            </div>

            <div className="port-panel__title">
              <div>
                <Typography.Title heading={6}>端口列表</Typography.Title>
                <Typography.Text type="secondary">{filteredPorts.length} 个端口</Typography.Text>
              </div>
            </div>

            <div className="port-table">
              <BaseListTable
                option={portTableOption}
                onClickCell={({ row }) => {
                  const record = filteredPorts[row - 1];
                  if (record) setSelectedPort(record);
                }}
              />
            </div>
          </section>,

          <section className="port-panel port-panel--right" key="right">
            <div className="port-panel__title">
              <div>
                <Typography.Title heading={6}>信号列表</Typography.Title>
                <Typography.Text type="secondary">
                  {selectedPort.name} · {selectedPort.device}
                </Typography.Text>
              </div>
              <Tag color="arcoblue">0 个信号</Tag>
            </div>

            <div className="port-table">
              <BaseListTable option={signalTableOption} />
            </div>
          </section>,
        ]}
      />
    </main>
  );
}

export default Port;
