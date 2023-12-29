import collectionReducer, {
    selectCollection
} from "./collection/collectionSlice";

import counterReducer, {
    decrement,
    increment,
    incrementByAmount,
    incrementByAmountAsync,
    selectCount
} from "./counter/counterSlice";

export {
    collectionReducer,
    selectCollection,
    counterReducer,
    decrement,
    increment,
    incrementByAmount,
    incrementByAmountAsync,
    selectCount
};
