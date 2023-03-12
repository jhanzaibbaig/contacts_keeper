import axios from "axios";
import { createContext, useContext, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ToastContext from "./ToastContext";

const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
  const { toast } = useContext(ToastContext);
  const navigate = useNavigate();
  const location = useLocation();

  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    checkUserLoggedIn();
  }, []);

  // check if the user is logged in.
  const checkUserLoggedIn = async () => {
    try {
      const { data } = await axios.get(`http://localhost:8000/api/me`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (!data) {
        navigate("/login", { replace: true });
        return;
      }

      const currentPath = location.pathname;
      if (currentPath === "/login" || currentPath === "/register") {
        setTimeout(() => {
          navigate("/", { replace: true });
        }, 500);
      } else {
        navigate(currentPath || "/");
      }

      setUser(data);
    } catch (err) {
      console.log(err);
    }
  };

  // login request.
  const loginUser = async (userData) => {
    try {
      console.log("userData: ", userData);
      const formData = new FormData();
      formData.append("email", userData.email);
      formData.append("password", userData.password);

      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };

      const res = await axios.post(
        `http://localhost:8000/api/login`,
        formData,
        config
      );

      console.log("res.data", res.data);

      if (!res.data.error) {
        localStorage.setItem("token", res.data.token);
        setUser(res.data.user);
        toast.success(`Logged in ${res.data.user.name}`);

        navigate("/", { replace: true });
      } else {
        toast.error(res.error);
      }
    } catch (err) {
      console.log(err);
    }
  };

  // register request.
  const registerUser = async (userData) => {
    try {
      console.log("userData: ", userData);
      const formData = new FormData();
      formData.append("name", userData.name);
      formData.append("email", userData.email);
      formData.append("password", userData.password);

      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };

      const res = await axios.post(
        "http://localhost:8000/api/register",
        formData,
        config
      );

      if (!res.error) {
        toast.success(
          "User registered successfully! Please login into your account!"
        );
        navigate("/login", { replace: true });
      } else {
        toast.error(res.error);
      }
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <AuthContext.Provider value={{ loginUser, registerUser, user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
