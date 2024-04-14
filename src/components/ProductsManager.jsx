import React, { useState, useEffect, useContext } from "react";
import BusinessContext from "../contexts/BusinessContext";
import { fetchToken } from "../util/auth";
import RawMaterialsList from "./RawMaterialsList.jsx";

function ProductsManager() {
  const { currentBusiness } = useContext(BusinessContext);
  const [products, setProducts] = useState([]);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState(null);

  // Add Product form
  const [showAddModal, setShowAddModal] = useState(false);

  const [productName, setProductName] = useState("");
  const [productNameError, setProductNameError] = useState("");
  const [Description, setDescription] = useState("");
  const [productPrice, setProductPrice] = useState("");
  const [productPriceError, setProductPriceError] = useState("");
  const [productDescription, setProductDescription] = useState("");

  // Edit Product form
  const [isEditMode, setIsEditMode] = useState(false);
  const [editableProduct, setEditableProduct] = useState(null);

  // Raw material popup
  const [rawMaterialsModalOpen, setRawMaterialsModalOpen] = useState(false);
  const [selectedProductForRawMaterials, setSelectedProductForRawMaterials] =
    useState(null);

  // Server error message
  const [serverErrorMessage, setServerErrorMessage] = useState("");

  const fetchBusinessNameFromLocalStorage = () => {
    const businessInfo = localStorage.getItem("businessInfo");
    return businessInfo ? JSON.parse(businessInfo).name : "Business";
  };
  const businessName = fetchBusinessNameFromLocalStorage();

const fetchBusinessIdFromLocalStorage = () => {
    const businessInfo = localStorage.getItem("businessInfo");
    return businessInfo ? JSON.parse(businessInfo).id : "ID";
    };
    const businessId = fetchBusinessIdFromLocalStorage();

  async function fetchProducts() {
    try {
      if (!businessId) {
        throw new Error("currentBusiness or its id is null or undefined");
      }
      const response = await fetch(
        `http://localhost:8000/products/${businessId}`,
      );
      const data = await response.json();
      console.log(data);
      if (!response.ok) {
        throw new Error("Failed to fetch products.");
      }
      setProducts(data);
    } catch (error) {
      console.error("Error fetching products:", error.message);
    }
  }

  useEffect(() => {
    fetchProducts();
  }, []);

  function deleteProductFromState(productId) {
    const newProducts = products.filter((product) => product.id !== productId);
    setProducts(newProducts);
  }

  async function deleteProduct(productId) {
    try {
      const response = await fetch(
        `http://localhost:8000/product/${productId}`,
        {
          method: "DELETE",
        },
      );
      // Check for error response
      if (!response.ok) {
        //get error message from body or default to response status
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      deleteProductFromState(productId);
    } catch (error) {
      console.log(error);
    } finally {
      setDeleteModalOpen(false);
    }
  }

  function validateForm() {
    let isValid = true;
    // Reset any previous error messages
    setProductNameError("");
    setProductPriceError("");

    // Validate product name
    if (!productName.trim()) {
      setProductNameError("Product name is required");
      isValid = false;
    }

    // Validate product price
    if (productPrice <= 0) {
      setProductPriceError("Price must be greater than 0");
      isValid = false;
    }

    return isValid;
  }

  const handleEditClick = (product) => {
    setIsEditMode(true);
    setEditableProduct(product);
    setShowAddModal(true);
    setProductName(product.name);
    setProductDescription(product.description);
    setProductPrice(product.price);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const token = fetchToken();
    if (!validateForm()) {
      return;
    }

    setServerErrorMessage("");

    const productData = JSON.stringify({
      name: productName,
      description: productDescription,
      price: parseFloat(productPrice),
      business_id: businessId,
    });

    const url = isEditMode
      ? `http://localhost:8000/product/${editableProduct.id}`
      : `http://localhost:8000/business/${businessId}/product`;

    const method = isEditMode ? "PUT" : "POST";

    try {
      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: productData,
      });

      if (!response.ok) {
        const data2 = await response.json();
        console.log(data2);
        setServerErrorMessage(data2.detail || "Failed to add product");
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      if (response.status === 402) {
        setServerErrorMessage("Failed to add product");
      }

      // Handle success
      setShowAddModal(false);
      setIsEditMode(false);
      setEditableProduct(null);
      setProductName("");
      setProductDescription("");
      setProductPrice("");
      fetchProducts();
    } catch (error) {
      console.error("Failed to add product:", error);
      setServerErrorMessage(error.message || "Failed to add product");
    }
  };

  const handleRawMaterialsClick = (product) => {
    setSelectedProductForRawMaterials(product.id);
    setRawMaterialsModalOpen(true);
  };

  return (
    <div className="max-w-7xl h-screen">
      <div className="max-h-[500px] my-8 bg-white border shadow-md">
        {/* Delete modal start */}
        {deleteModalOpen && (
          <div className="fixed inset-0 z-50 flex overflow-auto bg-gray-800 bg-opacity-50">
            <div className="relative flex flex-col w-full max-w-md p-8 m-auto bg-white rounded-lg shadow-lg">
              <h2 className="text-xl font-semibold">Confirm Delete</h2>
              <p className="my-4">
                Are you sure you want to delete this product?
              </p>
              <div className="flex justify-end space-x-4">
                <button
                  onClick={() => setDeleteModalOpen(false)}
                  className="px-4 py-2 text-black bg-gray-200 rounded"
                >
                  Cancel
                </button>
                <button
                  onClick={() => deleteProduct(selectedProductId)}
                  className="px-4 py-2 text-white bg-red-600 rounded"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
        {/* Delete modal end */}
        {/* Add product start */}
        {showAddModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center overflow-auto bg-gray-500 bg-opacity-50">
            <div className="bg-white shadow-sm ring-1 ring-gray-900/5 sm:rounded-xl md:w-1/2">
              <form
                className="px-4 py-6 sm:p-8"
                onSubmit={handleFormSubmit}
                noValidate
              >
                <div className="grid max-w-2xl grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                  {/* Product Name */}
                  <div className="sm:col-span-6">
                    <label
                      htmlFor="product-name"
                      className="block text-sm font-medium leading-6 text-gray-900"
                    >
                      Product Name
                    </label>
                    <div className="mt-2">
                      <input
                        value={productName}
                        onChange={(e) => setProductName(e.target.value)}
                        type="text"
                        name="product-name"
                        id="product-name"
                        className="block w-full rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                      />
                    </div>
                    {productNameError && (
                      <div className="text-red-600">
                        You must enter a product name
                      </div>
                    )}
                  </div>
                  {/* Product Description */}
                  <div className="sm:col-span-6">
                    <label
                      htmlFor="product-description"
                      className="block text-sm font-medium leading-6 text-gray-900"
                    >
                      Description
                    </label>
                    <div className="mt-2">
                      <textarea
                        value={productDescription}
                        onChange={(e) => setProductDescription(e.target.value)}
                        name="product-description"
                        id="product-description"
                        className="block w-full rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                      ></textarea>
                    </div>
                  </div>
                  {/* Product Price */}
                  <div className="sm:col-span-6">
                    <label
                      htmlFor="product-price"
                      className="block text-sm font-medium leading-6 text-gray-900"
                    >
                      Price
                    </label>
                    <div className="mt-2">
                      <input
                        value={productPrice}
                        onChange={(e) => setProductPrice(e.target.value)}
                        type="number"
                        name="product-price"
                        id="product-price"
                        min="0"
                        className="block w-full rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                      />
                    </div>
                    {productPriceError && <div className="text-red-600">{productPriceError}</div>}
                  </div>
                </div>
                {/* Action Buttons */}
                {serverErrorMessage && (
                  <div className="text-red-600">{serverErrorMessage}</div>
                )}

                <div className="flex items-center justify-end px-4 py-4 gap-x-6 border-gray-900/10 sm:px-8">
                  <button
                    type="button"
                    className="px-2 py-1.5 text-sm font-semibold leading-6 text-white bg-gray-500 rounded-md hover:bg-black"
                    onClick={() => setShowAddModal(false)}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-3 py-2 text-sm font-semibold text-white bg-amber-500 rounded-md shadow-sm hover:bg-green-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                  >
                    {isEditMode ? "Update" : "Add"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
        {/* Add product end */}
        {/* Raw material start */}
        {rawMaterialsModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center overflow-auto bg-gray-500 bg-opacity-70">
            <div className="bg-white p-4 rounded-lg shadow-lg w-1/2">
              <RawMaterialsList productId={selectedProductForRawMaterials} />
              <button
                onClick={() => setRawMaterialsModalOpen(false)}
                className="mt-4 bg-red-500 text-white p-2 rounded hover:bg-red-700"
              >
                Close
              </button>
            </div>
          </div>
        )}
        {/* Raw material end */}

        <div className="p-6">
          <div className="sm:flex sm:items-center">
            <div className="sm:flex-auto">
              <p className="mt-2 text-sm text-gray-700">
                List of products for {businessName }
              </p>
            </div>
            <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
              <button
                onClick={() => {
                  setEditableProduct;
                  setIsEditMode(false);
                  setShowAddModal(true);
                }}
                type="button"
                className="block px-3 py-2 text-sm font-semibold text-center text-white bg-amber-500 rounded-md shadow-sm hover:hover:bg-green-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                Add Product
              </button>
            </div>
          </div>
          <div className="flow-root mt-8 h-[400px] overflow-y-auto overflow-x-hidden">
            <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
              <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                <table className="min-w-full divide-y divide-gray-300">
                  <thead>
                    <tr>
                      <th
                        scope="col"
                        className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-0"
                      >
                        Product Name
                      </th>
                      <th
                        scope="col"
                        className="py-3.5 pr-3 text-left text-sm font-semibold text-gray-900"
                      >
                        Description
                      </th>
                      <th
                        scope="col"
                        className="py-3.5 pr-3 text-left text-sm font-semibold text-gray-900"
                      >
                        Price
                      </th>
                      <th
                        scope="col"
                        className="py-3.5 pr-3 text-left text-sm font-semibold text-gray-900"
                      >
                        <span className="sr-only">Change</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-300">
                    {products.map((product) => (
                      <tr key={product.id}>
                        <td className="py-4 pl-4 pr-3 text-sm font-medium text-gray-900 whitespace-nowrap sm:pl-0">
                          {product.name}
                        </td>
                        <td className="px-3 py-4 text-sm text-gray-500 whitespace-nowrap">
                          {product.description}
                        </td>
                        <td className="px-3 py-4 text-sm text-gray-500 whitespace-nowrap">
                          {product.price}
                        </td>
                        <td className="relative py-4 pl-3 pr-4 text-sm font-medium text-right whitespace-nowrap sm:pr-0">
                          <button
                            onClick={() => handleRawMaterialsClick(product)}
                            className="text-black hover:text-indigo-900"
                          >
                            Raw Material
                            <span className="sr-only">
                              {" "}
                              for {products.name}
                            </span>
                          </button>
                        </td>
                        <td className="relative py-4 pl-3 pr-4 text-sm font-medium text-right whitespace-nowrap sm:pr-0">
                          <button
                            onClick={() => handleEditClick(product)}
                            className="text-black hover:text-indigo-900"
                          >
                            Edit
                            <span className="sr-only"></span>
                          </button>
                        </td>
                        <td className="relative py-4 pl-3 pr-4 text-sm font-medium text-right whitespace-nowrap sm:pr-0">
                          <button
                            onClick={() => {
                              setDeleteModalOpen(true);
                              setSelectedProductId(product.id);
                            }}
                            className="ml-8 text-red-700 hover:text-red-900 mr-6"
                          >
                            Delete
                            <span className="sr-only"></span>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductsManager;
