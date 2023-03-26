import {
  Alert,
  Label,
  Modal,
  Textarea,
  TextInput,
} from "flowbite-react";
import { useState  } from "react";
import { useMutation, useQuery } from "react-query";
import { useForm, SubmitHandler } from "react-hook-form";

import { API } from "../../config/api";
import { UserProfileType } from "../../utils/types";
import noAvatar from "../../assets/noavatar.png";

type FormUpdateProfile = {
  name: string;
  email: string;
  gender: string;
  phone: string;
  address: string;
  photo: string | FileList;
};

const UpdateProfileModal = ({
  show,
  onClose,
}: {
  show: boolean;
  onClose: () => void;
}) => {
  const fetchProfile = async () => {
    const res: { data: { data: UserProfileType } } = await API.get(
      "/user-info"
    );
    return res.data.data;
  };
  const getProfileDefaultValue = async () => {
    const userData = await fetchProfile();
    let defaultFormData: FormUpdateProfile = {
      name: userData.name,
      email: userData.email,
      gender: userData.profile.gender,
      phone: userData.profile.phone,
      address: userData.profile.address,
      photo: userData.profile.photo,
    };
    setPreviewImage(defaultFormData.photo)
    return defaultFormData;
  };

  let { refetch: refetchProfile } = useQuery("userProfile", fetchProfile);

  const { register, handleSubmit, reset, setValue } = useForm<FormUpdateProfile>({
    defaultValues: getProfileDefaultValue,
  });

  const handleCloseModal = () => {
    onClose();
    reset();
  };

  const handleChangeImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPreviewImage(URL.createObjectURL(e.target.files![0]));
    setValue("photo", e.target.files!)

  };

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [previewImage, setPreviewImage] = useState<string | FileList>("");
  const [message, setMessage] = useState<boolean | JSX.Element>(false);

  const submitHandler: SubmitHandler<FormUpdateProfile> = (data) => {
    handlerLogin.mutate(data);
  };

  const handlerLogin = useMutation(async (form: FormUpdateProfile) => {
    setIsLoading(true);
    try {
      const config = {
        headers: {
          "Content-type": "multipart/form-data",
        },
      };

      const formDataProfile = new FormData();
      formDataProfile.set("photo", form.photo[0]);
      formDataProfile.set("phone", form.phone);
      formDataProfile.set("gender", form.gender);
      formDataProfile.set("address", form.address);

      await API.patch("/profile", formDataProfile, config);

      const formDataUser = new FormData();
      formDataUser.set("email", form.email);
      formDataUser.set("name", form.name);

      await API.patch("/user", formDataUser, config);
      refetchProfile();
      handleCloseModal();
    } catch (error: any) {
      const alert = (
        <Alert
          color="failure"
          role={"button"}
          onClick={() => setMessage(false)}
        >
          {/* {error.response.data.message} */}
          Failed to update profile
        </Alert>
      );
      setMessage(alert);
    } finally {
      setIsLoading(false);
    }
  });
  return (
    <Modal show={show} size="md" popup={true} onClose={onClose}>
      <Modal.Header />
      <Modal.Body>
        <div>{message && message}</div>
        <form
          onSubmit={handleSubmit(submitHandler)}
          className="px-6 pb-4 sm:pb-6 lg:px-8 xl:pb-8"
        >
          <div>
            <label className="flex items-center justify-center" role={"button"}>
              <input type="file" hidden onChange={handleChangeImage} />
              <img
                src={previewImage === "" ? noAvatar : previewImage as string}
                width={120}
                alt="Photo Profile"
              />
            </label>
          </div>
          <div>
            <div className="block">
              <Label htmlFor="name" value="Name" />
            </div>
            <TextInput {...register("name")} id="name" type={"text"} />
          </div>
          <div>
            <div className="block">
              <Label htmlFor="emaillogin" value="Your email" />
            </div>
            <TextInput {...register("email")} id="emaillogin" type={"email"} />
          </div>
          <div>
            <div className="block">
              <Label htmlFor="gender" value="Gender" />
            </div>
            <TextInput {...register("gender")} id="gender" type={"text"} />
          </div>
          <div>
            <div className="block">
              <Label htmlFor="phone" value="Phone" />
            </div>
            <TextInput {...register("phone")} id="phone" type={"text"} />
          </div>
          <div>
            <div className="block">
              <Label htmlFor="address" value="Address" />
            </div>
            <Textarea {...register("address")} id="address" rows={4} />
          </div>
          <div className="w-full mt-4 flex gap-4 justify-between">
            <button
              className="w-full bg-slate-500 text-white py-2 rounded"
              type="submit"
            >
              Update Profile
            </button>
            <button
              onClick={() => handleCloseModal()}
              className="w-full bg-white text-slate-500 py-2 rounded border-slate-500 border-2"
              type="button"
            >
              Cancel
            </button>
          </div>
        </form>
      </Modal.Body>
    </Modal>
  );
};

export default UpdateProfileModal;
