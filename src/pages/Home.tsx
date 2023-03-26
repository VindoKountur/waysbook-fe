import React from "react";

import PromotionBooks from "../components/books/PromotionBooks";
import ListBookHome from "../components/books/ListBookHome";

const Home = () => {
  return (
    <div>
      <div className="text-center text-3xl p-16">
        With us, you can shop online & help <br /> save your high street at the
        same time
      </div>
      <PromotionBooks />
      <ListBookHome />
      {/* <div className="h-[500px]">
        <object
          data="https://res.cloudinary.com/dfinrbg1i/image/upload/v1679722601/waysbooks/books/ua4ljumn72she2svedce.pdf"
          type="application/pdf"
          width="100%"
          height="100%"
        >
          <p>
            Alternative text - include a link{" "}
            <a href="https://res.cloudinary.com/dfinrbg1i/image/upload/v1679722601/waysbooks/books/ua4ljumn72she2svedce.pdf">
              to the PDF!
            </a>
          </p>
        </object>
      </div> */}
    </div>
  );
};

export default Home;
