import React, { useState, useEffect } from "react";
import { useQuery } from "react-query";

import { API } from "../../config/api";
import { BookType } from "../../utils/types";

const UserBooks = () => {
  const getUserBooks = async () => {
    const res: { data: { data: number[] } } = await API.get("/books-user");
    return res.data.data;
  };

  let { data: userBooks } = useQuery("userBooks", getUserBooks);
  return (
    <div className="px-20 mt-4">
      <h2>My Books</h2>
      <div className="bg-white p-4 mt-4 border-2 rounded shadow-md grid grid-cols-4 gap-8">
        {userBooks?.map((bookId, idx) => (
          <BookCard id={bookId} key={idx} />
        ))}
      </div>
    </div>
  );
};

const BookCard = ({ id }: { id: number }) => {
  const [book, setBook] = useState<BookType>();

  const getBookDetail = async () => {
    const res: { data: { data: BookType } } = await API.get("/book/" + id);
    setBook(res.data.data);
  };

  useEffect(() => {
    getBookDetail();
  }, []);

  return (
    <div className="flex flex-col">
      <img src={book?.thumbnail} alt={book?.title} />
      <p className="text-xl font-semibold">{book?.title}</p>
      <p className="text-slate-500">By {book?.author}</p>
      <a
        target={"_blank"}
        href={book?.content}
        className="bg-slate-700 text-slate-100 px-3 flex justify-center mt-3 py-2 gap-4 rounded"
        download
      >
        Download
      </a>
    </div>
  );
};

export default UserBooks;
