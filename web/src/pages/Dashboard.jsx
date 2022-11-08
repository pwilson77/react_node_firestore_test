import React, { Component } from "react";
import axios from "axios";
import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { signOut } from "../app/userSlice";
import { toast, ToastContainer } from "react-toastify";

export default function Dashboard() {
  const [productTitle, setProductTitle] = useState("");
  const [productImageUrl, setProductImageUrl] = useState("");
  const [productDescription, setProductDescription] = useState("");

  const [editProductTitle, setEditProductTitle] = useState("");
  const [editProductImageUrl, setEditProductImageUrl] = useState("");
  const [editProductDescription, setEditProductDescription] = useState("");

  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState({});
  const serverUrl = process.env.REACT_APP_SERVER_URL;
  const user = useSelector((state) => state.user);
  console.log(user);
  const dispatch = useDispatch();

  const addProduct = (e) => {
    e.preventDefault();
    const id = toast.loading("Please wait...");

    axios
      .post(`${serverUrl}/products`, {
        productTitle,
        productImageUrl,
        productDescription,
      })
      .then((res) => {
        setProductTitle("");
        setProductDescription("");
        setProductImageUrl("");
        getProducts();
        toast.update(id, {
          render: "Product addition succesful",
          type: "success",
          isLoading: false,
          autoClose: 1500,
        });
      })
      .catch((err) => {
        toast.update(id, {
          render: "Something went wrong",
          type: "error",
          isLoading: false,
          autoClose: 1500,
        });
        console.log(err);
      });
  };

  const editProduct = (e) => {
    e.preventDefault();
    const id = toast.loading("Please wait...");

    const productId = selectedProduct.id;
    axios
      .put(`${serverUrl}/products/${productId}`, {
        productTitle: editProductTitle,
        productImageUrl: editProductImageUrl,
        productDescription: editProductDescription,
      })
      .then((res) => {
        setEditProductTitle("");
        setEditProductDescription("");
        setEditProductImageUrl("");
        getProducts();
        toast.update(id, {
          render: "Product edit succesful",
          type: "success",
          isLoading: false,
          autoClose: 1500,
        });
      })
      .catch((err) => {
        toast.update(id, {
          render: "Something went wrong",
          type: "error",
          isLoading: false,
          autoClose: 1500,
        });
        console.log(err);
      });
  };

  const getProducts = () => {
    const id = toast.loading("Please wait...");

    axios
      .get(`${serverUrl}/products`)
      .then((res) => {
        const { data } = res.data;
        setProducts(data);
        toast.update(id, {
          render: "Finished loading products",
          type: "success",
          isLoading: false,
          autoClose: 1500,
        });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const setEditProductDetails = (e, product) => {
    setSelectedProduct(product);
    setEditProductTitle(product.productTitle);
    setEditProductImageUrl(product.productImageUrl);
    setEditProductDescription(product.productDescription);
  };

  const deleteProduct = (e, productId) => {
    const id = toast.loading("Please wait...");

    axios
      .delete(`${serverUrl}/products/${productId}`)
      .then((res) => {
        console.log(res);
        getProducts();
        toast.update(id, {
          render: "Product deletion successful",
          type: "success",
          isLoading: false,
          autoClose: 1500,
        });
      })
      .catch((err) => {
        toast.update(id, {
          render: "Product deletion failed",
          type: "error",
          isLoading: false,
          autoClose: 1500,
        });
        console.log(err);
      });
  };

  const handleSignOut = () => {
    dispatch(signOut());
  };

  const deleteUser = () => {
    const id = toast.loading("Please wait...");

    axios
      .delete(`${serverUrl}/users/${user.data.uid}`)
      .then((res) => {
        console.log(res.data);
        toast.update(id, {
          render: "User account deltion successful",
          type: "success",
          isLoading: false,
          autoClose: 1500,
        });
      })
      .catch((e) => {
        console.log(e);
        toast.update(id, {
          render: "Something went wrong",
          type: "error",
          isLoading: false,
          autoClose: 1500,
        });
      });
    handleSignOut();
  };

  useEffect(() => {
    getProducts();
  }, []);

  return (
    <div class="container-fluid">
      <div class="row flex-nowrap">
        <div class="col-auto col-md-3 col-xl-2 px-sm-2 px-0 bg-dark">
          <div class="d-flex flex-column align-items-center align-items-sm-start px-3 pt-2 text-white min-vh-100">
            <a
              href="/"
              class="d-flex align-items-center pb-3 mb-md-0 me-md-auto text-white text-decoration-none"
            >
              <span class="fs-5 d-none d-sm-inline">Menu</span>
            </a>
            <ul
              class="nav nav-pills flex-column mb-sm-auto mb-0 align-items-center align-items-sm-start"
              id="menu"
            >
              <li class="nav-item">
                <a href="#" class="nav-link align-middle px-0">
                  <i class="fs-4 bi-house"></i>{" "}
                  <span class="ms-1 d-none d-sm-inline">Dashboard</span>
                </a>
              </li>
            </ul>
            <hr />
            <div class="dropdown pb-4">
              <a
                href="#"
                class="d-flex align-items-center text-white text-decoration-none dropdown-toggle"
                id="dropdownUser1"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                <img
                  src="https://github.com/mdo.png"
                  alt="hugenerd"
                  width="30"
                  height="30"
                  class="rounded-circle"
                />
                <span class="d-none d-sm-inline mx-1">{user.data.email}</span>
              </a>
              <ul
                class="dropdown-menu dropdown-menu-dark text-small shadow"
                aria-labelledby="dropdownUser1"
              >
                <li>
                  <a class="dropdown-item" href="#" onClick={deleteUser}>
                    Delete Account
                  </a>
                </li>
                <li>
                  <hr class="dropdown-divider" />
                </li>
                <li>
                  <a class="dropdown-item" href="#" onClick={handleSignOut}>
                    Sign out
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div class="col py-3">
          <h4 className="text-start">All Products</h4>
          <button
            className="btn btn-sm btn-primary float-end"
            data-bs-toggle="modal"
            data-bs-target="#addProduct"
          >
            Add Product
          </button>

          <table className="table table-striped tabl-hover">
            <thead>
              <tr>
                <th scope="col">#</th>
                <th scope="col">Product Title</th>
                <th scope="col">Product Image Url</th>
                <th scope="col">Product Description</th>
                <th scope="col"> Actions </th>
              </tr>
            </thead>
            <tbody>
              {products.map((product, i) => (
                <tr key={i}>
                  <th scope="row">{i + 1}</th>
                  <td>{product.productTitle}</td>
                  <td>{product.productImageUrl}</td>
                  <td>{`$${product.productDescription}`}</td>
                  <td>
                    <button
                      className="btn btn-sm btn-primary me-2"
                      data-bs-toggle="modal"
                      data-bs-target="#editProduct"
                      onClick={(e) => setEditProductDetails(e, product)}
                    >
                      Edit Product{" "}
                    </button>
                    <button
                      className="btn btn-sm btn-danger"
                      onClick={(e) => deleteProduct(e, product.id)}
                    >
                      Delete Product{" "}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div
          className="modal fade"
          id="addProduct"
          tabindex="-1"
          aria-labelledby="exampleModalLabel"
          aria-hidden="true"
        >
          <form onSubmit={addProduct}>
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Product Modal</h5>
                  <button
                    type="button"
                    className="btn-close"
                    data-bs-dismiss="modal"
                    aria-label="Close"
                  ></button>
                </div>
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label">Product Title</label>
                    <input
                      type="text"
                      className="form-control"
                      required
                      onChange={(e) => setProductTitle(e.target.value)}
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Product Image Url</label>
                    <input
                      type="text"
                      className="form-control"
                      required
                      onChange={(e) => setProductImageUrl(e.target.value)}
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Product Price</label>
                    <input
                      type="number"
                      className="form-control"
                      required
                      onChange={(e) => setProductDescription(e.target.value)}
                    />
                  </div>
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    data-bs-dismiss="modal"
                  >
                    Close
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary"
                    data-bs-dismiss="modal"
                  >
                    Save changes
                  </button>
                </div>
              </div>
            </div>
          </form>
        </div>
        <div
          className="modal fade"
          id="editProduct"
          tabindex="-2"
          aria-labelledby="exampleModalLabel"
          aria-hidden="true"
        >
          <form onSubmit={editProduct}>
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Edit Product</h5>
                  <button
                    type="button"
                    className="btn-close"
                    data-bs-dismiss="modal"
                    aria-label="Close"
                  ></button>
                </div>
                <div className="modal-body">
                  <label className="form-label">Product Name</label>
                  <input
                    type="text"
                    className="form-control"
                    aria-describedby="emailHelp"
                    defaultValue={selectedProduct?.productTitle}
                    onChange={(e) => setEditProductTitle(e.target.value)}
                  />
                  <div className="mb-3">
                    <label className="form-label">Product Image Url</label>
                    <input
                      type="text"
                      className="form-control"
                      defaultValue={selectedProduct?.productImageUrl}
                      onChange={(e) => setEditProductImageUrl(e.target.value)}
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Product Price</label>
                    <input
                      type="number"
                      className="form-control"
                      defaultValue={selectedProduct?.productDescription}
                      onChange={(e) =>
                        setEditProductDescription(e.target.value)
                      }
                    />
                  </div>
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    data-bs-dismiss="modal"
                  >
                    Close
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary"
                    data-bs-dismiss="modal"
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
