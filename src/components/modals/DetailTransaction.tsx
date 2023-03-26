import React from "react";
import { Modal } from "flowbite-react";

import { TransactionType } from "../../utils/types";
import { dateFormat, formatRp } from "../../utils/func";

const DetailTransaction = ({
  show,
  onClose,
  transaction,
}: {
  show: boolean;
  onClose: () => void;
  transaction: TransactionType | undefined;
}) => {
  return (
    <>
      {transaction && (
        <Modal show={show} size="md" popup={true} onClose={onClose}>
          <Modal.Header />
          <Modal.Body>
            <div className="px-2 pb-4 sm:pb-6 lg:px-2 xl:pb-2">
              <div>
                <p>Transaction ID : {transaction.id}</p>
                <p>Date : {dateFormat(transaction.created_at)}</p>
              </div>
              <div className="bg-slate-100 rounded flex flex-col gap-3">
                {transaction.books.map((book) => (
                  <div className="flex gap-4">
                    <img
                      src={book.thumbnail}
                      alt={book.title}
                      className="w-20"
                    />
                    <div className="flex flex-col justify-between">
                      <div>
                        <p className="font-semibold">{book.title}</p>
                        <p className="text-slate-500 text-sm">
                          By {book.author}
                        </p>
                      </div>
                      <p>{formatRp(book.price)}</p>
                    </div>
                  </div>
                ))}
                <p>Total Price : {formatRp(transaction.total_price)}</p>
              </div>
            </div>
          </Modal.Body>
        </Modal>
      )}
    </>
  );
};

export default DetailTransaction;
