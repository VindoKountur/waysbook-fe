import { Alert, Spinner, Label, Modal, TextInput } from "flowbite-react";
import { useContext, useState } from "react";
import { useMutation } from "react-query";
import { useForm, SubmitHandler } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

import { API, setAuthToken } from "../../config/api";
import { UserContext, UserActionType } from "../../context/userContext";
import { UserType } from "../../utils/types";

type FormLogin = {
  email: string;
  password: string;
};

const initForm: FormLogin = {
  email: "",
  password: "",
};

const Login = ({
  show,
  onClose,
  handleToRegister,
}: {
  show: boolean;
  onClose: () => void;
  handleToRegister: () => void;
}) => {
  const navigate = useNavigate();
  const { register, handleSubmit } = useForm<FormLogin>();
  const { dispatch } = useContext(UserContext);

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<boolean | JSX.Element>(false);

  const submitHandler: SubmitHandler<FormLogin> = (data) => {
    handlerLogin.mutate(data);
  };

  const handlerLogin = useMutation(async (form: FormLogin) => {
    setIsLoading(true);
    try {
      const {
        data: { data },
      }: { data: { data: UserType } } = await API.post("/login", form);

      dispatch({
        type: UserActionType.LOGIN_SUCCESS,
        payload: data,
      });

      setAuthToken(data.token);

      Swal.fire({
        icon: "success",
        title: "Login Successful",
        showConfirmButton: false,
        timer: 1500,
      }).then(() => {
        onClose();
        if (data.role === "admin") {
          navigate("/admin/");
        } else {
          navigate("/");
        }
        window.location.reload();
      });
    } catch (error: any) {
      const alert = (
        <Alert
          color="failure"
          role={"button"}
          onClick={() => setMessage(false)}
        >
          {error.response.data.message}
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
          className="space-y-6 px-6 pb-4 sm:pb-6 lg:px-8 xl:pb-8"
        >
          <h3 className="text-xl font-medium text-gray-900 dark:text-white">
            Login
          </h3>
          <div>
            <div className="mb-2 block">
              <Label htmlFor="emaillogin" value="Your email" />
            </div>
            <TextInput
              {...register("email")}
              id="emaillogin"
              type={"email"}
              placeholder="name@mail.com"
              required={true}
            />
          </div>
          <div>
            <div className="mb-2 block">
              <Label htmlFor="passwordlogin" value="Your password" />
            </div>
            <TextInput
              {...register("password")}
              id="passwordlogin"
              type="password"
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
                "Log in to your account"
              )}
            </button>
          </div>
          <div className="text-sm font-medium text-gray-500 dark:text-gray-300">
            Not registered?
            <button
              onClick={handleToRegister}
              className="text-blue-700 hover:underline dark:text-blue-500"
            >
              Create account
            </button>
          </div>
        </form>
      </Modal.Body>
    </Modal>
  );
};

export default Login;
