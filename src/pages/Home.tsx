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
    </div>
  );
};

export default Home;
