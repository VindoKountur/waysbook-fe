import { useState, useContext } from "react";
import { Avatar, Dropdown, Navbar, Button, Badge } from "flowbite-react";
import { IoLogOut, IoPerson, IoBook, IoDocumentText } from "react-icons/io5";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";
import { useQuery } from "react-query";

import Register from "./modals/Register";
import Login from "./modals/Login";

import { UserContext } from "../context/userContext";
import noavatar from "../assets/noavatar.png";
import LogoImg from "../assets/logo.png";
import addBookIcon from "../assets/addBook.png";
import cartIcon from "../assets/cart.png";
import { API } from "../config/api";
import { CartType, UserProfileType } from "../utils/types";

const MyNavbar = () => {
  const [showRegister, setShowRegister] = useState<boolean>(false);
  const [showLogin, setShowLogin] = useState<boolean>(false);
  const [_, __, removeCookies] = useCookies(["token"]);
  const { state } = useContext(UserContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    removeCookies("token", { path: "/" });
    navigate("/");
    window.location.reload();
  };

  const fetchUser = async () => {
    if (state.user.role === "user") {
      const res: { data: { data: UserProfileType } } = await API.get(
        "/user-info"
      );
      return res.data.data;
    }
  };

  let { data: user } = useQuery("userProfile", fetchUser);

  const getCartList = async () => {
    if (state.user.role === "user") {
      const res: { data: { data: CartType } } = await API.get("/cart-user");
      return res.data.data;
    }
  };
  let { data: cartList } = useQuery("cartList", getCartList);

  let totalInCart = cartList?.cart.length ?? 0;
  return (
    <div className="px-6 lg:16 py-4">
      <Navbar rounded={true} className="!bg-transparent">
        <Navbar.Brand href="/">
          <img
            src={LogoImg}
            className="mr-3 h-9 sm:h-12"
            alt="Waysbooks Logo"
          />
        </Navbar.Brand>

        {!state.isLogin ? (
          <div className="flex gap-4">
            <button
              className="w-full bg-slate-500 px-5 text-white py-1 rounded"
              onClick={() => setShowLogin(true)}
            >
              Login
            </button>
            <button
              className="w-full bg-white px-5 text-slate-500 py-1 rounded border-slate-500 border-2"
              onClick={() => setShowRegister(true)}
            >
              Register
            </button>
          </div>
        ) : (
          <div className="flex md:order-2 gap-4 items-center">
            {state.user.role === "user" && (
              <div className="relative" onClick={() => navigate("/user/cart")}>
                {totalInCart !== 0 && (
                  <Badge
                    color="failure"
                    size="xs"
                    className="absolute -top-2 -right-2"
                    role={"button"}
                  >
                    {totalInCart}
                  </Badge>
                )}
                <img src={cartIcon} alt="Cart Icon" height={28} role="button" />
              </div>
            )}
            <Dropdown
              arrowIcon={false}
              inline={true}
              label={
                <Avatar
                  alt="User settings"
                  img={
                    user?.profile.photo === "" ? noavatar : user?.profile.photo
                  }
                  rounded={true}
                />
              }
            >
              {state.user.role === "admin" ? (
                <>
                  <Dropdown.Item
                    className="flex items-center gap-2"
                    onClick={() => navigate("/admin/book/add")}
                  >
                    <img src={addBookIcon} height={20} width={20} />{" "}
                    <span>Add Book</span>
                  </Dropdown.Item>
                  <Dropdown.Divider />
                  <Dropdown.Item
                    className="flex items-center gap-2"
                    onClick={() => navigate("/admin/books")}
                  >
                    <IoBook size={"1.6em"} /> <span>List Book</span>
                  </Dropdown.Item>
                  <Dropdown.Divider />
                  <Dropdown.Item
                    className="flex items-center gap-2"
                    onClick={() => navigate("/admin/")}
                  >
                    <IoDocumentText size={"1.6em"} /> <span>Transaction</span>
                  </Dropdown.Item>
                  <Dropdown.Divider />
                  <Dropdown.Item
                    onClick={handleLogout}
                    className="flex items-center gap-2"
                  >
                    <IoLogOut size={"1.6em"} /> <span>Logout</span>
                  </Dropdown.Item>
                </>
              ) : (
                <>
                  <Dropdown.Item
                    onClick={() => navigate("/user/profile")}
                    className="flex items-center gap-2"
                  >
                    <IoPerson /> <span>Profile</span>
                  </Dropdown.Item>
                  <Dropdown.Divider />
                  <Dropdown.Item
                    onClick={handleLogout}
                    className="flex items-center gap-2"
                  >
                    <IoLogOut /> <span>Logout</span>
                  </Dropdown.Item>
                </>
              )}
            </Dropdown>
          </div>
        )}
        <Register
          show={showRegister}
          onClose={() => setShowRegister(false)}
          handleToLogin={() => {
            setShowRegister(false);
            setShowLogin(true);
          }}
        />
        <Login
          show={showLogin}
          onClose={() => setShowLogin(false)}
          handleToRegister={() => {
            setShowLogin(false);
            setShowRegister(true);
          }}
        />
      </Navbar>
    </div>
  );
};

export default MyNavbar;
