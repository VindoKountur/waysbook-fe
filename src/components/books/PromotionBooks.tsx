import { Carousel } from "flowbite-react";
import React from "react";
import { useMutation, useQuery } from "react-query";
import Swal from "sweetalert2";

import { API } from "../../config/api";
import { BookType } from "../../utils/types";
import { formatRp, sliceText } from "../../utils/func";
import { UserContext } from "../../context/userContext";

type BestBookType = {
  book_id: number;
  total: number;
};
const BestBooks = () => {
  const fetchBestBooks = async () => {
    const res: { data: { data: BestBookType[] } } = await API.get("/book-best");
    return res.data.data;
  };

  const { data: bestBooks } = useQuery("bestBook", fetchBestBooks);

  if (!bestBooks) {
    return null;
  }

  return (
    <div className="mx-auto h-56 sm:h-64 xl:h-80 2xl:h-96 w-4/5 md:w-2/3 lg:w-3/5">
      <Carousel slideInterval={5000}>
        {bestBooks?.map((book, i) => (
          <BookCard key={i} bookId={book.book_id} />
        ))}
      </Carousel>
    </div>
  );
};

const BookCard = ({ bookId }: { bookId: number }) => {
  const { state } = React.useContext(UserContext);
  const [book, setBook] = React.useState<BookType>();
  const [isPruchased, setIsPruchased] = React.useState<boolean>(false);
  const [windowSize, setWindowSize] = React.useState(getWindowSize());
  const getBookDetail = async () => {
    const res: { data: { data: BookType } } = await API.get("/book/" + bookId);
    setBook(res.data.data);
  };

  function getWindowSize() {
    const { innerWidth, innerHeight } = window;
    return { innerWidth, innerHeight };
  }
  React.useEffect(() => {
    function handleWindowResize() {
      setWindowSize(getWindowSize());
    }

    window.addEventListener("resize", handleWindowResize);

    return () => {
      window.removeEventListener("resize", handleWindowResize);
    };
  }, []);

  // Add To Cart
  const handleAddToCart = useMutation(async () => {
    try {
      if (state.user.role === "user") {
        const res: { data: { data: string } } = await API.post(
          "/cart/" + bookId
        );
        Swal.fire({
          icon: "success",
          title: res.data.data,
          showConfirmButton: false,
          timer: 1500,
        });
      } else {
        console.log("not login");
      }
    } catch (error: any) {
      console.log(error.response.data.message);
      Swal.fire({
        icon: "info",
        text: error.response.data.message,
        showConfirmButton: false,
        timer: 1500,
      });
    } finally {
      refetch();
    }
  });

  const getCartList = async () => {
    if (state.user.role === "user") {
      const res: { data: { data: number[] } } = await API.get("/cart-user");
      return res.data.data;
    }
  };

  const getUserBooks = async () => {
    if (state.user.role === "user") {
      const res: { data: { data: number[] } } = await API.get("/books-user");
      return res.data.data;
    }
  };

  const { data: userBooks } = useQuery("userBooks", getUserBooks);

  let { refetch } = useQuery("cartList", getCartList);

  React.useEffect(() => {
    getBookDetail();
  }, []);

  React.useEffect(() => {
    setIsPruchased(userBooks?.includes(Number(bookId))!);
  }, [userBooks]);

  return (
    <div className="w-full h-full p-2 bg-white flex gap-5 justify-between border-2 shadow-md">
      <img src={book?.thumbnail} className="w-32 md:w-48" />
      <div className="justify-self-start self-start flex-1 flex justify-between flex-col h-full">
        <div>
          <h5 className="text-lg lg:text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
            {book?.title}
          </h5>
          <p className="text-slate-500">By {book?.author}</p>
          <p className="font-normal text-gray-700 dark:text-gray-400">
            {sliceText(
              book?.about ?? "",
              windowSize.innerWidth < 400
                ? 0
                : windowSize.innerWidth > 900
                ? 200
                : 75
            )}
          </p>
        </div>
        <div>
          <p className="mb-3 text-[#44B200] font-semibold">
            {formatRp(book?.price!)}
          </p>
          {state.user.role === "user" && (
            <>
              {!isPruchased ? (
                <button
                  onClick={() => handleAddToCart.mutate()}
                  className="bg-slate-700 text-slate-100 w-full px-3 py-2 gap-4 rounded"
                >
                  <span>Add Cart</span>
                </button>
              ) : (
                <a
                  target={"_blank"}
                  href={book?.content}
                  className="bg-slate-700 text-slate-100 w-full px-3 py-2 gap-4 rounded block text-center"
                  download={book?.title}
                >
                  Download
                </a>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default BestBooks;
