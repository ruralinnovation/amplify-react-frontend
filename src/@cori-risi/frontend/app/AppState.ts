import coriRisiAppState from "../../app/initialState.json";
import frontendAppState from "./initialState.json";

const initialState = {
    ...coriRisiAppState,
    ...frontendAppState
}

type AppState = typeof initialState; // ... can (should?) alternatively define AppState in it's own type file

export default AppState;
export { initialState };
