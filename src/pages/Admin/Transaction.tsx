import React, { useState } from "react";
import { Table } from "flowbite-react";
import { useQuery } from "react-query";

import DetailTransactionModal from "../../components/modals/DetailTransaction";

import { API } from "../../config/api";
import { TransactionType } from "../../utils/types";
import { formatRp, transactionDateFormat } from "../../utils/func";

const Transaction = () => {
  const [showDetail, setShowDetail] = useState(false);
  const [transactionDetail, setTransactionDetail] = useState<TransactionType>();

  const handleShowDetail = (transaction: TransactionType) => {
    setTransactionDetail(transaction);
    setShowDetail(true);
  };

  const fetchTransaction = async () => {
    const res: { data: { data: TransactionType[] } } = await API.get(
      "/transactions"
    );
    return res.data.data;
  };

  const { data: transactions } = useQuery("transactions", fetchTransaction);

  return (
    <div className="!bg-transparent mx-4 md:mx-28">
      <h3 className="font-bold py-3">Income Transaction</h3>

      <Table hoverable={true}>
        <Table.Head>
          <Table.HeadCell>Transaction ID</Table.HeadCell>
          <Table.HeadCell>Transaction Date</Table.HeadCell>
          <Table.HeadCell>Users</Table.HeadCell>
          <Table.HeadCell>Book Purchased</Table.HeadCell>
          <Table.HeadCell>Total Payment</Table.HeadCell>
          <Table.HeadCell>Status Payment</Table.HeadCell>
          <Table.HeadCell>Detail</Table.HeadCell>
        </Table.Head>
        <Table.Body className="divide-y">
          {transactions?.map((transaction, idx) => (
            <Table.Row
              key={idx}
              className="bg-white dark:border-gray-700 dark:bg-gray-800"
            >
              <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                {transaction.id}
              </Table.Cell>
              <Table.Cell>
                {transactionDateFormat(transaction.created_at)}
              </Table.Cell>
              <Table.Cell>{transaction.user.name}</Table.Cell>
              <Table.Cell>
                {transaction.books.map((item) => item.title).join(", ")}
              </Table.Cell>
              <Table.Cell>{formatRp(transaction.total_price)}</Table.Cell>
              <Table.Cell>{transaction.status}</Table.Cell>
              <Table.Cell>
                <button
                  onClick={() => {
                    console.log(transaction);
                    handleShowDetail(transaction);
                  }}
                  className="bg-slate-500 text-white whitespace-nowrap px-2 py-1 rounded"
                >
                  View Detail
                </button>
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
        {transactionDetail && (
          <DetailTransactionModal
            show={showDetail}
            onClose={() => setShowDetail(false)}
            transaction={transactionDetail}
          />
        )}
      </Table>
    </div>
  );
};

export default Transaction;
