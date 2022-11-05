import React, { Component, useState } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import { useSelector, useDispatch } from "react-redux";
import { signIn } from "../app/userSlice";
import { Navigate, useNavigate } from "react-router-dom";

export default function Home() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [headingText, setHeadingText] = useState("Login");
  const [isNewUser, setIsNewUser] = useState(false);
  const serverUrl = process.env.REACT_APP_SERVER_URL;
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSignUpAndLogin = (e) => {
    e.preventDefault();
    const id = toast.loading("Please wait...");

    if (isNewUser) {
      axios
        .post(`${serverUrl}/users`, {
          email,
          password,
        })
        .then((res) => {
          console.log(res);
          toast.update(id, {
            render: "Signup successful please login",
            type: "success",
            isLoading: false,
          });
          toggleHeadingText();
        })
        .catch((e) => {
          toast.update(id, {
            render: "Something went wrong",
            type: "error",
            isLoading: false,
          });
          console.log(e);
        });
    } else {
      axios
        .post(`${serverUrl}/login`, {
          email,
          password,
        })
        .then((res) => {
          console.log(res.data);
          dispatch(signIn(res.data));
          toast.update(id, {
            render: "Login successful redirecting to dashboard",
            type: "success",
            isLoading: false,
          });
          navigate("/dashboard");
        })
        .catch((e) => {
          console.log(e);
          toast.update(id, {
            render: "Something went wrong",
            type: "error",
            isLoading: false,
          });
        });
    }
  };

  const toggleHeadingText = () => {
    setIsNewUser(!isNewUser);
    if (isNewUser) {
      setHeadingText("User Signup");
    } else {
      setHeadingText("Login");
    }
  };

  return (
    <div className="container">
      <ToastContainer autoClose={5000} />
      <div className="row justify-content-center align-content-center h-100">
        <div className="col-md-6 mb-5 px-2">
          <form onSubmit={handleSignUpAndLogin}>
            <h5>{headingText}</h5>
            <div className="mb-3">
              <label className="form-label">Email address</label>
              <input
                type="email"
                className="form-control"
                id="exampleInputEmail1"
                aria-describedby="emailHelp"
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Password</label>
              <input
                type="password"
                className="form-control"
                id="exampleInputPassword1"
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <button type="submit" className="btn btn-primary">
              Submit
            </button>
            <div className="form-text mt-3">
              {isNewUser
                ? "Already have an account, "
                : "Don't have an account, "}

              <a href="#" onClick={toggleHeadingText}>
                Click Here
              </a>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
