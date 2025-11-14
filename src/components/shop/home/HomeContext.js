export const homeState = {
  categoryListDropdown: false,
  filterListDropdown: false,
  searchDropdown: false,
  filterSearchDropdown: false,
  products: null,
  loading: false,
  sliderImages: [],
};

export const homeReducer = (state, action) => {
  switch (action.type) {
    case "categoryListDropdown":
      return {
        ...state,
        categoryListDropdown: action.payload,
        filterListDropdown: false,
        searchDropdown: false,
        filterSearchDropdown: false,
      };
    case "filterListDropdown":
      return {
        ...state,
        categoryListDropdown: false,
        filterListDropdown: action.payload,
        searchDropdown: false,
        filterSearchDropdown: false,
      };
    case "searchDropdown":
      return {
        ...state,
        categoryListDropdown: false,
        filterListDropdown: false,
        searchDropdown: action.payload,
        filterSearchDropdown: false,
      };
    case "filterSearchDropdown":
      return {
        ...state,
        categoryListDropdown: false,
        filterListDropdown: false,
        searchDropdown: false,
        filterSearchDropdown: action.payload,
      };
    case "setProducts":
      return {
        ...state,
        products: action.payload,
      };
    case "searchHandleInReducer":
      return {
        ...state,
        products:
          action.productArray &&
          action.productArray.filter((item) => {
            const titleMatch = !action.title ||
              item.pName.toUpperCase().indexOf(action.title.toUpperCase()) !== -1;
            const categoryMatch = !action.category ||
              (item.pCategory && item.pCategory.cName &&
               item.pCategory.cName.toUpperCase().indexOf(action.category.toUpperCase()) !== -1);
            if (titleMatch && categoryMatch) {
              return item;
            }
            return null;
          }),
      };
    case "loading":
      return {
        ...state,
        loading: action.payload,
      };
    case "sliderImages":
      return {
        ...state,
        sliderImages: action.payload,
      };
    default:
      return state;
  }
};
