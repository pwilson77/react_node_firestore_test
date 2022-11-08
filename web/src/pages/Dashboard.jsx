import React, { Component, useState } from "react";
import axios from "axios";
import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import "../styles/dashboard.css";
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
    <React.Fragment>
      <ToastContainer autoClose={2000} />
      <header className="py-3 mb-4 border-bottom shadow">
        <div className="container-fluid align-items-center d-flex">
          <div className="flex-shrink-1">
            <a
              href="#"
              className="d-flex align-items-center col-lg-4 mb-2 mb-lg-0 link-dark text-decoration-none"
            >
              <i className="bi bi-bootstrap fs-2 text-dark"></i>
            </a>
          </div>
          <div className="flex-grow-1 d-flex align-items-center">
            <form className="w-100 me-3"></form>
            <div className="flex-shrink-0 dropdown">
              <a
                href="#"
                className="d-block link-dark text-decoration-none dropdown-toggle"
                id="dropdownUser2"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                <img
                  src="https://via.placeholder.com/28?text=!"
                  alt="user"
                  width="32"
                  height="32"
                  className="rounded-circle"
                />
              </a>
              <ul
                className="dropdown-menu dropdown-menu-end shadow"
                aria-labelledby="dropdownUser2"
              >
                <li>
                  <a className="dropdown-item" href="#" onClick={deleteUser}>
                    Delete Account
                  </a>
                </li>
                <li>
                  <hr className="dropdown-divider" />
                </li>
                <li>
                  <a className="dropdown-item" href="#" onClick={handleSignOut}>
                    Sign out
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </header>
      <div className="container-fluid pb-3 flex-grow-1 d-flex flex-column flex-sm-row overflow-auto">
        <div className="row flex-grow-sm-1 flex-grow-0 w-100">
          <aside className="col-sm-3 flex-grow-sm-1 flex-shrink-1 flex-grow-0 sticky-top pb-sm-0 pb-3">
            <div className="bg-light border rounded-3 p-1 h-100 sticky-top">
              <ul className="nav nav-pills flex-sm-column flex-row mb-auto justify-content-between text-truncate">
                <li className="nav-item">
                  <a href="#" className="nav-link px-2 text-truncate">
                    <i className="bi bi-house fs-5"></i>
                    <span className="d-none d-sm-inline">Products</span>
                  </a>
                </li>
              </ul>
            </div>
          </aside>
          <main className="col-9 overflow-auto h-100">
            <div className="bg-light border rounded-3 p-3 w-100">
              <h4 className="text-start">All Products</h4>
              <button
                className="btn btn-sm btn-primary float-right"
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
            {/* <div className="bg-light border rounded-3 p-3">
             
             
            </div> */}
          </main>
        </div>
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
                    onChange={(e) => setEditProductDescription(e.target.value)}
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
    </React.Fragment>
  );
}
