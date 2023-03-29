import { useState } from "react";
import { IoMail, IoLocationSharp } from "react-icons/io5";
import { BsGenderAmbiguous, BsFillTelephoneFill } from "react-icons/bs";
import { useQuery } from "react-query";

import UserBooks from "../../components/books/UserBooks";
import UpdateProfileModal from "../../components/modals/UpdateProfileModal";

import { API } from "../../config/api";
import { CartType, UserProfileType } from "../../utils/types";
import noProfile from "../../assets/noavatar.png";

const Profile = () => {
  const [showUpdateProfile, setShowUpdateProfile] = useState(false);

  const getProfile = async () => {
    const res: { data: { data: UserProfileType } } = await API.get(
      "/user-info"
    );
    return res.data.data;
  };

  let { data: user } = useQuery("userProfile", getProfile);

  const getCartList = async () => {
      const res: { data: { data: CartType } } = await API.get("/cart-user");
      return res.data.data;
  };
  let { data: cartList, refetch } = useQuery("cartList", getCartList);

  return (
    <div>
      <div className="px-5 md:px-20">
        <h2 className="font-bold mt-4 text-xl">Profile</h2>
        <div className="bg-white px-3 md:px-16 py-4 mt-4 flex flex-col-reverse md:flex-row justify-between border-2 rounded shadow-md">
          <div className="flex flex-col gap-4 justify-start mt-4 md:mt-0">
            <div className="flex gap-3 items-center">
              <IoMail size={"1.8em"} />
              <div>
                <p className="font-semibold">{user?.email}</p>
                <p className="text-slate-400">Email</p>
              </div>
            </div>
            <div className="flex gap-3 items-center">
              <BsGenderAmbiguous size={"1.8em"} />
              <div>
                <p className="font-semibold">
                  {user?.profile.gender ? user.profile.gender : "-"}
                </p>
                <p className="text-slate-400">Gender</p>
              </div>
            </div>
            <div className="flex gap-3 items-center">
              <BsFillTelephoneFill size={"1.8em"} />
              <div>
                <p className="font-semibold">
                  {user?.profile.phone ? user.profile.phone : "-"}
                </p>
                <p className="text-slate-400">Mobile Phone</p>
              </div>
            </div>
            <div className="flex gap-3 items-center">
              <IoLocationSharp size={"1.8em"} />
              <div>
                <p className="font-semibold">
                  {user?.profile.address ? user.profile.address : "-"}
                </p>
                <p className="text-slate-400">Address</p>
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-3 justify-center items-center">
            <img
              src={user?.profile.photo === "" ? noProfile : user?.profile.photo}
              alt="profile"
              className="w-40"
            />
            <button
              className="bg-slate-700 text-slate-100 px-3 py-2 gap-4 w-full rounded"
              onClick={() => setShowUpdateProfile(true)}
            >
              Edit Profile
            </button>
          </div>
        </div>
      </div>

      <UserBooks />
      <div className="h-[500px] hidden">
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
      </div>

      <UpdateProfileModal
        show={showUpdateProfile}
        onClose={() => setShowUpdateProfile(false)}
      />
    </div>
  );
};

export default Profile;
