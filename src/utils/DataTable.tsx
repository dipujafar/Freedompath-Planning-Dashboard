import { Table } from "antd";

const DataTable = ({
  columns,
  data,
  pageSize,
}: {
  columns: any;
  data: any;
  pageSize?: number;
}) => {
  return pageSize ? (
    <Table
      columns={columns}
      dataSource={data}
      pagination={{ pageSize: pageSize }}
      scroll={{ x: "max-content" }}
    ></Table>
  ) : (
    <Table
      columns={columns}
      dataSource={data}
      pagination={false}
      scroll={{ x: "max-content" }}
    ></Table>
  );
};

export default DataTable;
