import React, { Component, useState } from "react";
import { redirect } from "react-router-dom";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";

export default function Home() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [headingText, setHeadingText] = useState("Login");
  const [isNewUser, setIsNewUser] = useState(false);
  const serverUrl = process.env.REACT_APP_SERVER_URL;

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
            render: "Signup scuccessful please login",
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
          console.log(res);
          toast.update(id, {
            render: "Login succesful redirecting to dashboard",
            type: "success",
            isLoading: false,
          });
          redirect("/dashboard");
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
      <div className="row justify-content-center align-content-center h-100">
        <div className="col-md-6 mb-5">
          <form onSubmit={handleSignUpAndLogin}>
            <h5>{headingText}</h5>
            <div class="mb-3">
              <label for="exampleInputEmail1" class="form-label">
                Email address
              </label>
              <input
                type="email"
                class="form-control"
                id="exampleInputEmail1"
                aria-describedby="emailHelp"
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div class="mb-3">
              <label for="exampleInputPassword1" class="form-label">
                Password
              </label>
              <input
                type="password"
                class="form-control"
                id="exampleInputPassword1"
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <button type="submit" class="btn btn-primary">
              Submit
            </button>
            <div class="form-text mt-3">
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
