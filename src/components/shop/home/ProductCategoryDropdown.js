import React, { Fragment, useContext, useState, useEffect, useRef } from "react";
import { useHistory } from "react-router-dom";
import { HomeContext } from "./index";
import { getAllCategory } from "../../admin/categories/FetchApi";
import { getAllProduct, productByPrice } from "../../admin/products/FetchApi";
import "./style.css";

const apiURL = process.env.REACT_APP_API_URL;

const CategoryList = () => {
  const history = useHistory();
  const { data } = useContext(HomeContext);
  const [categories, setCategories] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      let responseData = await getAllCategory();
      if (responseData && responseData.Categories) {
        setCategories(responseData.Categories);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className={`${data.categoryListDropdown ? "" : "hidden"} my-4`}>
      <hr />
      <div className="py-1 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {categories && categories.length > 0 ? (
          categories.map((item, index) => {
            return (
              <Fragment key={index}>
                <div
                  onClick={(e) =>
                    history.push(`/products/category/${item._id}`)
                  }
                  className="col-span-1 m-2 flex flex-col items-center justify-center space-y-2 cursor-pointer"
                >
                  <img
                    src={`${apiURL}/uploads/categories/${item.cImage}`}
                    alt="pic"
                  />
                  <div className="font-medium">{item.cName}</div>
                </div>
              </Fragment>
            );
          })
        ) : (
          <div className="text-xl text-center my-4">No Category</div>
        )}
      </div>
    </div>
  );
};

const FilterList = () => {
  const { data, dispatch } = useContext(HomeContext);
  const [range, setRange] = useState(0);

  const rangeHandle = (e) => {
    setRange(e.target.value);
    fetchData(e.target.value);
  };

  const fetchData = async (price) => {
    if (price === "all") {
      try {
        let responseData = await getAllProduct();
        if (responseData && responseData.Products) {
          dispatch({ type: "setProducts", payload: responseData.Products });
        }
      } catch (error) {
        console.log(error);
      }
    } else {
      dispatch({ type: "loading", payload: true });
      try {
        setTimeout(async () => {
          let responseData = await productByPrice(price);
          if (responseData && responseData.Products) {
            console.log(responseData.Products);
            dispatch({ type: "setProducts", payload: responseData.Products });
            dispatch({ type: "loading", payload: false });
          }
        }, 700);
      } catch (error) {
        console.log(error);
      }
    }
  };

  const closeFilterBar = () => {
    fetchData("all");
    dispatch({ type: "filterListDropdown", payload: !data.filterListDropdown });
    setRange(0);
  };

  return (
    <div className={`${data.filterListDropdown ? "" : "hidden"} my-4`}>
      <hr />
      <div className="w-full flex flex-col">
        <div className="font-medium py-2">Filter by price</div>
        <div className="flex justify-between items-center">
          <div className="flex flex-col space-y-2  w-2/3 lg:w-2/4">
            <label htmlFor="points" className="text-sm">
              Price (between 0 and 10$):{" "}
              <span className="font-semibold text-yellow-700">{range}.00$</span>{" "}
            </label>
            <input
              value={range}
              className="slider"
              type="range"
              id="points"
              min="0"
              max="1000"
              step="10"
              onChange={(e) => rangeHandle(e)}
            />
          </div>
          <div onClick={(e) => closeFilterBar()} className="cursor-pointer">
            <svg
              className="w-8 h-8 text-gray-700 hover:bg-gray-200 rounded-full p-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
};

const Search = () => {
  const { data, dispatch } = useContext(HomeContext);
  const [search, setSearch] = useState("");
  const [productArray, setPa] = useState(null);

  const searchHandle = (e) => {
    setSearch(e.target.value);
    fetchData();
    dispatch({
      type: "searchHandleInReducer",
      payload: e.target.value,
      productArray: productArray,
    });
  };

  const fetchData = async () => {
    dispatch({ type: "loading", payload: true });
    try {
      setTimeout(async () => {
        let responseData = await getAllProduct();
        if (responseData && responseData.Products) {
          setPa(responseData.Products);
          dispatch({ type: "loading", payload: false });
        }
      }, 700);
    } catch (error) {
      console.log(error);
    }
  };

  const closeSearchBar = () => {
    dispatch({ type: "searchDropdown", payload: !data.searchDropdown });
    fetchData();
    dispatch({ type: "setProducts", payload: productArray });
    setSearch("");
  };

  return (
    <div
      className={`${
        data.searchDropdown ? "" : "hidden"
      } my-4 flex items-center justify-between`}
    >
      <input
        value={search}
        onChange={(e) => searchHandle(e)}
        className="px-4 text-xl py-4 focus:outline-none"
        type="text"
        placeholder="Search products..."
      />
      <div onClick={(e) => closeSearchBar()} className="cursor-pointer">
        <svg
          className="w-8 h-8 text-gray-700 hover:bg-gray-200 rounded-full p-1"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </div>
    </div>
  );
};

const FilterSearch = () => {
  const { data, dispatch } = useContext(HomeContext);
  const [titleSearch, setTitleSearch] = useState("");
  const [categorySearch, setCategorySearch] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [productArray, setPa] = useState(null);
  const debounceTimerRef = useRef(null);
  const titleSearchRef = useRef("");
  const categorySearchRef = useRef("");
  const minPriceRef = useRef("");
  const maxPriceRef = useRef("");

  useEffect(() => {
    fetchAllProducts();
  }, []);

  const fetchAllProducts = async () => {
    dispatch({ type: "loading", payload: true });
    try {
      let responseData = await getAllProduct();
      if (responseData && responseData.Products) {
        setPa(responseData.Products);
        dispatch({ type: "loading", payload: false });
      }
    } catch (error) {
      console.log(error);
      dispatch({ type: "loading", payload: false });
    }
  };

  const handleSearch = (title = titleSearch, category = categorySearch, min = minPrice, max = maxPrice) => {
    if (!productArray) {
      fetchAllProducts();
      return;
    }

    // Apply search filters
    let filteredProducts = productArray.filter((item) => {
      const titleMatch = !title ||
        item.pName.toUpperCase().indexOf(title.toUpperCase()) !== -1;
      const categoryMatch = !category ||
        (item.pCategory && item.pCategory.cName &&
         item.pCategory.cName.toUpperCase().indexOf(category.toUpperCase()) !== -1);
      return titleMatch && categoryMatch;
    });

    // Apply price filters
    if (min || max) {
      filteredProducts = filteredProducts.filter((item) => {
        const price = parseFloat(item.pPrice);
        const minVal = min ? parseFloat(min) : 0;
        const maxVal = max ? parseFloat(max) : Infinity;
        return price >= minVal && price <= maxVal;
      });
    }

    dispatch({ type: "setProducts", payload: filteredProducts });
  };

  const handlePriceFilter = async (title = titleSearch, category = categorySearch, min = minPrice, max = maxPrice) => {
    dispatch({ type: "loading", payload: true });
    try {
      setTimeout(async () => {
        let responseData = await productByPrice(null, min || null, max || null);
        if (responseData && responseData.Products) {
          let filteredProducts = responseData.Products;

          // Apply search filters on price-filtered results
          if (title || category) {
            filteredProducts = filteredProducts.filter((item) => {
              const titleMatch = !title ||
                item.pName.toUpperCase().indexOf(title.toUpperCase()) !== -1;
              const categoryMatch = !category ||
                (item.pCategory && item.pCategory.cName &&
                 item.pCategory.cName.toUpperCase().indexOf(category.toUpperCase()) !== -1);
              return titleMatch && categoryMatch;
            });
          }

          dispatch({ type: "setProducts", payload: filteredProducts });
          dispatch({ type: "loading", payload: false });
        }
      }, 700);
    } catch (error) {
      console.log(error);
      dispatch({ type: "loading", payload: false });
    }
  };

  const debounceFilter = (callback, delay = 300) => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }
    debounceTimerRef.current = setTimeout(callback, delay);
  };

  // Update refs when state changes
  useEffect(() => {
    titleSearchRef.current = titleSearch;
  }, [titleSearch]);

  useEffect(() => {
    categorySearchRef.current = categorySearch;
  }, [categorySearch]);

  useEffect(() => {
    minPriceRef.current = minPrice;
  }, [minPrice]);

  useEffect(() => {
    maxPriceRef.current = maxPrice;
  }, [maxPrice]);

  const applyFilters = () => {
    const title = titleSearchRef.current;
    const category = categorySearchRef.current;
    const min = minPriceRef.current;
    const max = maxPriceRef.current;

    if (min || max) {
      handlePriceFilter(title, category, min, max);
    } else {
      handleSearch(title, category, min, max);
    }
  };

  const handleTitleSearchChange = (e) => {
    const value = e.target.value;
    setTitleSearch(value);
    debounceFilter(applyFilters);
  };

  const handleCategorySearchChange = (e) => {
    const value = e.target.value;
    setCategorySearch(value);
    debounceFilter(applyFilters);
  };

  const handleMinPriceChange = (e) => {
    const value = e.target.value;
    setMinPrice(value);
    debounceFilter(applyFilters);
  };

  const handleMaxPriceChange = (e) => {
    const value = e.target.value;
    setMaxPrice(value);
    debounceFilter(applyFilters);
  };

  const closeFilterSearchBar = async () => {
    // Clear debounce timer
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    // Reset state and refs
    setTitleSearch("");
    setCategorySearch("");
    setMinPrice("");
    setMaxPrice("");
    titleSearchRef.current = "";
    categorySearchRef.current = "";
    minPriceRef.current = "";
    maxPriceRef.current = "";

    dispatch({ type: "filterSearchDropdown", payload: !data.filterSearchDropdown });

    // Reset to all products
    if (productArray) {
      dispatch({ type: "setProducts", payload: productArray });
    } else {
      // Fetch all products and set them
      dispatch({ type: "loading", payload: true });
      try {
        let responseData = await getAllProduct();
        if (responseData && responseData.Products) {
          setPa(responseData.Products);
          dispatch({ type: "setProducts", payload: responseData.Products });
          dispatch({ type: "loading", payload: false });
        }
      } catch (error) {
        console.log(error);
        dispatch({ type: "loading", payload: false });
      }
    }
  };

  return (
    <div className={`${data.filterSearchDropdown ? "" : "hidden"} my-4`}>
      <hr />
      <div className="w-full flex flex-col space-y-4 py-4">
        {/* Search Section */}
        <div className="w-full">
          <div className="font-medium py-2 mb-2">Search Products</div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col">
              <label htmlFor="titleSearch" className="text-sm mb-1">
                Search by Title
              </label>
              <input
                id="titleSearch"
                value={titleSearch}
                onChange={handleTitleSearchChange}
                className="px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-yellow-500"
                type="text"
                placeholder="Enter product title..."
              />
            </div>
            <div className="flex flex-col">
              <label htmlFor="categorySearch" className="text-sm mb-1">
                Search by Category
              </label>
              <input
                id="categorySearch"
                value={categorySearch}
                onChange={handleCategorySearchChange}
                className="px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-yellow-500"
                type="text"
                placeholder="Enter category name..."
              />
            </div>
          </div>
        </div>

        {/* Price Filter Section */}
        <div className="w-full">
          <div className="font-medium py-2 mb-2">Filter by Price</div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col">
              <label htmlFor="minPrice" className="text-sm mb-1">
                Minimum Price ($)
              </label>
              <input
                id="minPrice"
                value={minPrice}
                onChange={handleMinPriceChange}
                className="px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-yellow-500"
                type="number"
                min="0"
                step="0.01"
                placeholder="0.00"
              />
            </div>
            <div className="flex flex-col">
              <label htmlFor="maxPrice" className="text-sm mb-1">
                Maximum Price ($)
              </label>
              <input
                id="maxPrice"
                value={maxPrice}
                onChange={handleMaxPriceChange}
                className="px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-yellow-500"
                type="number"
                min="0"
                step="0.01"
                placeholder="1000.00"
              />
            </div>
          </div>
        </div>

        {/* Close Button */}
        <div className="flex justify-end">
          <div onClick={closeFilterSearchBar} className="cursor-pointer">
            <svg
              className="w-8 h-8 text-gray-700 hover:bg-gray-200 rounded-full p-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
};

const ProductCategoryDropdown = (props) => {
  return (
    <Fragment>
      <CategoryList />
      <FilterList />
      <Search />
      <FilterSearch />
    </Fragment>
  );
};

export default ProductCategoryDropdown;
