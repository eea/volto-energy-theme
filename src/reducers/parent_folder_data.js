import { GET_PARENT_FOLDER_DATA } from '~/constants/ActionTypes';

const initialState = {
  error: null,
  items: [],
  loaded: false,
  loading: false,
};

export default function parent_folder_data(state = initialState, action = {}) {
  if (action.type === 'GET_PARENT_FOLDER_DATA_SUCCESS') {
  }
  switch (action.type) {
    case `${GET_PARENT_FOLDER_DATA}_PENDING`:
      return {
        ...state,
        error: null,
        loaded: false,
        loading: true,
      };
    case `${GET_PARENT_FOLDER_DATA}_SUCCESS`:
      return {
        ...state,
        error: null,
        items: action.result || [],
        loaded: true,
        loading: false,
      };
    case `${GET_PARENT_FOLDER_DATA}_FAIL`:
      return {
        ...state,
        error: action.error,
        items: [],
        loaded: false,
        loading: false,
      };
    default:
      return state;
  }
}
