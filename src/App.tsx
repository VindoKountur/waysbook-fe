import { useState, useContext, useEffect } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";

import Navbar from "./components/Navbar";
import { AdminRoute, UserRoute } from "./components/PrivateRoutes";
import Home from "./pages/Home";
import Transaction from "./pages/Admin/Transaction";
import ListBooks from "./pages/Admin/ListBooks";
import AddBook from "./pages/Admin/AddBook";
import UpdateBook from "./pages/Admin/UpdateBook";
import DetailBook from "./pages/User/DetailBook";
import Cart from "./pages/User/Cart";
import Profile from "./pages/User/Profile";

import { UserContext, UserActionType } from "./context/userContext";
import { API, setAuthToken } from "./config/api";

function App() {
  const navigate = useNavigate();
  const [cookies] = useCookies(["token"]);
  const { state, dispatch } = useContext(UserContext);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    // Redirect Auth but just when isLoading is false
    if (!isLoading) {
      if (state.isLogin === false) {
        navigate("/");
      }
    }
  }, [isLoading]);

  useEffect(() => {
    if (cookies.token) {
      setAuthToken(cookies.token);
      checkUser();
    } else {
      setIsLoading(false);
    }
  }, []);

  const checkUser = async () => {
    try {
      const {
        data: { data },
      } = await API.get("/check-auth");
      let payload = data;
      payload.token = cookies.token;
      // Send data to useContext
      dispatch({
        type: UserActionType.USER_SUCCESS,
        payload,
      });
      setIsLoading(false);
    } catch (error) {
      dispatch({
        type: UserActionType.AUTH_ERROR,
        payload: {
          email: "",
          role: "",
          token: "",
          photo: "",
        },
      });
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-[url('/src/assets/bg.png')]">
      {isLoading ? null : (
        <>
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />

            {/* ADMIN */}
            <Route path="/" element={<AdminRoute />}>
              <Route path="/admin/" element={<Transaction />} />
              <Route path="/admin/books" element={<ListBooks />} />
              <Route path="/admin/book/add" element={<AddBook />} />
              <Route path="/admin/book/update/:id" element={<UpdateBook />} />
            </Route>

            {/* USER */}
            <Route path="/" element={<UserRoute />}>
              <Route path="/book/:id" element={<DetailBook />} />
              <Route path="/user/profile" element={<Profile />} />
              <Route path="/user/cart" element={<Cart />} />
            </Route>
          </Routes>
        </>
      )}
    </div>
  );
}

export default App;
