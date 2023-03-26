import React from "react";
import { useQuery, useMutation } from "react-query";
import { useParams } from "react-router-dom";

import { API } from "../../config/api";
import { BookType } from "../../utils/types";
import { publishDateFormat, formatRp } from "../../utils/func";
import cartIconWhite from "../../assets/cartWhite.png";
import Swal from "sweetalert2";

const DetailBook = () => {
  const { id } = useParams();
  const [isLoading, setIsLoading] = React.useState(false);

  const getBook = async () => {
    const res: { data: { data: BookType } } = await API.get("/book/" + id);
    return res.data.data;
  };
  const { data: book } = useQuery("book", getBook);

  const getUserBooks = async () => {
    const res: { data: { data: number[] } } = await API.get("/books-user");
    return res.data.data;
  };

  const { data: userBooks } = useQuery("userBooks", getUserBooks);

  const handleAddToCart = useMutation(async () => {
    setIsLoading(true);
    try {
      const res: { data: { data: string } } = await API.post("/cart/" + id);
      Swal.fire({
        icon: "success",
        title: res.data.data,
        showConfirmButton: false,
        timer: 1500,
      });
    } catch (error: any) {
      console.log(error.response.data.message);
      Swal.fire({
        icon: "info",
        text: error.response.data.message,
        showConfirmButton: false,
        timer: 1500,
      });
    } finally {
      setIsLoading(false);
      refetch();
    }
  });

  const getCartList = async () => {
    const res: { data: { data: number[] } } = await API.get("/cart-user");
    return res.data.data;
  };

  let { refetch } = useQuery("cartList", getCartList);

  const bookIsPurchased = userBooks?.includes(Number(id));

  return (
    <div className="flex flex-col mx-auto px-5 md:px-20 lg:px-36 justify-center">
      <div className="flex">
        <img
          src={book?.thumbnail}
          alt={book?.title}
          className="w-40 md:w-52 lg:w-72 h-full object-fill"
        />
        <div className="pl-3 lg:pl-10">
          <h1 className="font-bold text-3xl">{book?.title}</h1>
          <p className="text-slate-500">By {book?.author}</p>
          <div className="mt-3">
            <p className="font-semibold">Publication Date</p>
            <p className="text-slate-500">
              {publishDateFormat(book?.publication_date ?? "2020-01-01")}
            </p>
          </div>
          <div className="mt-3">
            <p className="font-semibold">Pages</p>
            <p className="text-slate-500">{book?.pages}</p>
          </div>
          <div className="mt-3">
            <p className="font-semibold text-red-500">ISBN</p>
            <p className="text-slate-500">{book?.isbn}</p>
          </div>
          <div className="mt-3">
            <p className="font-semibold">Price</p>
            <p className="text-green-500">{formatRp(book?.price ?? 0)}</p>
          </div>
        </div>
      </div>
      <div className="mt-4">
        <div className="flex justify-between items-center">
          <h2 className="font-bold text-xl">About This Book</h2>
          {!bookIsPurchased ? (
            <button
              onClick={() => handleAddToCart.mutate()}
              className="bg-slate-700 text-slate-100 px-3 flex py-2 gap-4 rounded"
              disabled={isLoading}
            >
              <span>{isLoading ? "Adding to cart..." : "Add Cart"}</span>{" "}
              <img src={cartIconWhite} className="text-white" />
            </button>
          ) : (
            <a
              href={book?.content}
              target="_blank"
              className="bg-slate-700 text-slate-100 px-3 flex py-2 gap-4 rounded"
              download
            >
              Download
            </a>
          )}
        </div>
        <p className="text-justify text-slate-500">{book?.about}</p>
      </div>
    </div>
  );
};

export default DetailBook;
