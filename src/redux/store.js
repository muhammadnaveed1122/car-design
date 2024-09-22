import { configureStore } from "@reduxjs/toolkit";
import carsSliceReducer from "./carsSlice";
import userCarsSliceReducer from "./userCarsSlice"
import marketplaceCarsSlice from "./marketplaceSlice"
const store = configureStore({
  reducer: {
    cars: carsSliceReducer,
    userCars: userCarsSliceReducer,
    marketplaceCars: marketplaceCarsSlice,
  }
})

export default store;