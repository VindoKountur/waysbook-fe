import React from "react";
import { Card, TextInput } from "flowbite-react";
import { useQuery } from "react-query";
import { useNavigate } from "react-router-dom";
import { IoSearchSharp } from "react-icons/io5";
import { QueryFunctionContext } from "@tanstack/react-query";

import { formatRp, sliceText } from "../../utils/func";
import { API } from "../../config/api";
import { BookType } from "../../utils/types";

const ListBookHome = () => {
  const [keyword, setKeyword] = React.useState<string>("");
  const fetchBooks = async ({ queryKey }: QueryFunctionContext) => {
    const [_key, search] = queryKey;
    let endpoint = "/books";
    if (search) {
      endpoint += `?keyword=${search}`;
    }
    const { data } = await API.get(endpoint);
    return data.data;
  };
  let { data: books } = useQuery<BookType[], Error>(
    ["books", keyword],
    fetchBooks
  );

  return (
    <div className="bg-slate-100 px-3 md:px-10 pt-10 pb-10">
      <div className="flex justify-between flex-col md:flex-row gap-2">
        <p className="font-bold text-3xl">List Book</p>
        <TextInput
          className="md:w-1/3"
          type="text"
          icon={IoSearchSharp}
          placeholder="Book Title | Author | ISBN number"
          onChange={(e) => setKeyword(e.target.value)}
        />
      </div>
      <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 md:gap-8">
        {books?.map((book, idx) => (
          <ListBookCard key={idx} book={book} />
        ))}
      </div>
    </div>
  );
};

const ListBookCard = ({ book }: { book: BookType }) => {
  const navigate = useNavigate();
  return (
    <div>
      <Card
        role={"button"}
        imgSrc={book.thumbnail}
        onClick={() => navigate("/book/" + book.id)}
        className="h-full flex flex-col"
      >
        <div className="h-full flex flex-col justify-between">
          <div>
            <h5 className="text-xl font-bold tracking-tight text-gray-900 dark:text-white">
              {sliceText(book.title, 38)}
            </h5>
            <p className="text-sm font-normal text-gray-700 dark:text-gray-400">
              By. {book.author}
            </p>
          </div>
          <p className="">{formatRp(book.price)}</p>
        </div>
      </Card>
    </div>
  );
};

export default ListBookHome;
