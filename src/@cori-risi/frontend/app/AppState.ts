import initialState from "./initialState.json";

type AppState = typeof initialState; // ... can (should?) alternatively define AppState in it's own type file

export default AppState;
export { initialState };
