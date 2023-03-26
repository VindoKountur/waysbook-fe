import { Alert, Spinner, Label, Modal, TextInput } from "flowbite-react";
import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation } from "react-query";
import { useForm, SubmitHandler } from "react-hook-form";
import Swal from "sweetalert2";

import { UserContext, UserActionType } from "../../context/userContext";
import { API, setAuthToken } from "../../config/api";
import { FormRegister, UserType } from "../../utils/types";

const Register = ({
  show,
  onClose,
  handleToLogin,
}: {
  show: boolean;
  onClose: () => void;
  handleToLogin: () => void;
}) => {
  const { register, handleSubmit } = useForm<FormRegister>();
  const navigate = useNavigate();
  const { dispatch } = useContext(UserContext);
  const [message, setMessage] = useState<boolean | JSX.Element>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleRegister: SubmitHandler<FormRegister> = (data) => {
    mutateRegister.mutate(data);
  };

  const mutateRegister = useMutation(async (data: FormRegister) => {
    try {
      setIsLoading(true);
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };

      const res: { data: { data: UserType } } = await API.post(
        "/register",
        data,
        config
      );

      dispatch({
        type: UserActionType.USER_SUCCESS,
        payload: res.data.data,
      });

      setAuthToken(res.data.data.token);
      Swal.fire({
        icon: "success",
        text: "Register Success",
        timer: 1500,
      }).then(() => {
        onClose();
        if (res.data.data.role === "admin") {
          navigate("/admin/");
        } else {
          navigate("/");
        }
      });
    } catch (error : any) {
      const alert = (
        <Alert
          color="failure"
          role={"button"}
          onClick={() => setMessage(false)}
        >
          {error.response.data.message}
          {/* <span>Ada yang salah sih</span> */}
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
          onSubmit={handleSubmit(handleRegister)}
          className="space-y-3 px-6 pb-4 sm:pb-6 lg:px-8 xl:pb-8"
        >
          <h3 className="text-xl font-medium text-gray-900 dark:text-white">
            Register
          </h3>
          <div>
            <div className="mb-1 block">
              <Label htmlFor="nameregister" value="Fullname" />
            </div>
            <TextInput
              {...register("name")}
              placeholder=""
              name="name"
              key={"nameregister"}
              required={true}
              autoFocus
            />
          </div>
          <div>
            <div className="mb-1 block">
              <Label htmlFor="emailregister" value="Your email" />
            </div>
            <TextInput
              {...register("email")}
              type={"email"}
              placeholder="example@mail.com"
              required={true}
              key="emailregister"
              name="email"
            />
          </div>
          <div>
            <div className="mb-1 block">
              <Label htmlFor="passwordregister" value="Your password" />
            </div>
            <TextInput
              {...register("password")}
              key={"passwordregister"}
              type="password"
              name="password"
              required={true}
            />
          </div>
          <div className="w-full">
            <button
              className="bg-slate-700 text-slate-100 px-3 flex py-2 gap-4 rounded"
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? (
                <Spinner aria-label="Medium sized spinner example" size="md" />
              ) : (
                "Register"
              )}
            </button>
          </div>
          <div className="text-sm font-medium text-gray-500 dark:text-gray-300">
            Already registered?
            <button
              onClick={handleToLogin}
              className="text-blue-700 hover:underline dark:text-blue-500"
            >
              Login to your account
            </button>
          </div>
        </form>
      </Modal.Body>
    </Modal>
  );
};

export default Register;
