import { useEffect, useState } from "react";
import { useQuery, useMutation } from "react-query";
import { IoTrashOutline } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

import { API } from "../../config/api";
import { BookType, CartType } from "../../utils/types";
import { formatRp } from "../../utils/func";
import { Spinner } from "flowbite-react";

const getCartList = async () => {
  const res: { data: { data: CartType } } = await API.get("/cart-user");
  return res.data.data;
};

const Cart = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  let { data: cartList, isFetched } = useQuery("cartList", getCartList);

  const handlePayment = useMutation(async () => {
    try {
      setIsLoading(true);
      const { value } = await Swal.fire({
        icon: "question",
        text: "Confirm your order?",
        showCancelButton: true,
      });
      if (value) {
        const res = await API.post("/transaction");
        console.log(res);

        const token = res.data.data.token;

        // @ts-expect-error
        window.snap.pay(token, {
          onSuccess: function (result: any) {
            /* You may add your own implementation here */
            console.log(result);
            navigate("/user/profile");
          },
          onPending: function (result: any) {
            /* You may add your own implementation here */
            console.log(result);
            navigate("/user/profile");
          },
          onError: function (result: any) {
            /* You may add your own implementation here */
            console.log(result);
            navigate("/user/profile");
          },
          onClose: function () {
            /* You may add your own implementation here */
            alert("you closed the popup without finishing the payment");
          },
        });
      }
    } catch (error: any) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  });

  useEffect(() => {
    //change this to the script source you want to load, for example this is snap.js sandbox env
    const midtransScriptUrl = "https://app.sandbox.midtrans.com/snap/snap.js";
    //change this according to your client-key
    const myMidtransClientKey = import.meta.env.VITE_MIDTRANS_CLIENT_KEY;

    let scriptTag = document.createElement("script");
    scriptTag.src = midtransScriptUrl;
    // optional if you want to set script attribute
    // for example snap.js have data-client-key attribute
    scriptTag.setAttribute("data-client-key", myMidtransClientKey);

    document.body.appendChild(scriptTag);
    return () => {
      document.body.removeChild(scriptTag);
    };
  }, []);

  return (
    <div className="px-5 md:px-20">
      <h1 className="mt-4 font-bold text-xl">My Cart</h1>
      <p className="mt-2">Review Your Product</p>
      <div className="mt-3 flex flex-col md:flex-row gap-6">
        {isFetched && (
          <div className="border-y-2 py-2 flex flex-col gap-3 md:w-3/5">
            {cartList?.cart.length === 0 && <div>No Books In Cart</div>}
            {cartList?.cart.map((bookId, idx) => (
              <BookCart bookId={bookId} key={idx} />
            ))}
          </div>
        )}
        <div className="border-t-2 py-2 md:w-2/5">
          <div className="flex justify-between py-2">
            <p>Subtotal</p>
            <p>{formatRp(cartList?.total_price!)}</p>
          </div>
          <div className="flex justify-between py-2 ">
            <p>Qty</p>
            <p>{cartList?.cart.length}</p>
          </div>
          <div className="flex justify-between py-2 border-t-2">
            <p>Subtotal</p>
            <p>{formatRp(cartList?.total_price!)}</p>
          </div>
          <button
            className="p-2 rounded bg-[#393939] text-white w-full mt-3"
            onClick={() => handlePayment.mutate()}
            disabled={isLoading}
          >
            {isLoading ? (
              <Spinner aria-label="Medium sized spinner example" size="md" />
            ) : (
              "Pay"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

const BookCart = ({ bookId }: { bookId: number }) => {
  const [book, setBook] = useState<BookType>();
  const getBook = async () => {
    const res: { data: { data: BookType } } = await API.get("/book/" + bookId);
    setBook(res.data.data);
  };

  let { refetch } = useQuery("cartList", getCartList);

  useEffect(() => {
    getBook();
  }, []);

  const handleDelete = useMutation(async () => {
    try {
      const { value } = await Swal.fire({
        icon: "warning",
        text: "Remove book from cart?",
        showCancelButton: true,
      });
      if (value) {
        const res = await API.delete("/cart/" + bookId);
        console.log("response delete cart = ", res);
        refetch();
      }
    } catch (error: any) {
      console.log(error);
    } finally {
      refetch();
    }
  });

  return (
    <div className="flex gap-2">
      <img src={book?.thumbnail} alt={book?.title} className="w-24" />
      <div className="flex-1">
        <p className="font-bold">{book?.title}</p>
        <p className="mt-2">By {book?.author}</p>
        {book?.price && <p className="mt-4">{formatRp(book?.price)}</p>}
      </div>
      <div>
        <IoTrashOutline
          role="button"
          title="Remove from cart"
          onClick={() => handleDelete.mutate()}
        />
      </div>
    </div>
  );
};

export default Cart;
