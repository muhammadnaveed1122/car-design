import { initialPriceRange, userCarStatus } from "@/constants/data";
import { toastShow } from "@/helpers";
import { userCarService, userService } from "@/services";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { useDispatch, useSelector } from "react-redux";

export const fetchUserCarsAsync = createAsyncThunk("userCars/fetchCars", async () => {

    let data = await userCarService.getAll();

    return { data };
});
export const updateStatusCarAsync = createAsyncThunk("userCars/status", async ({ status, id }) => {
    return await userCarService.updateStatus({ status, id });

})
export const createUserCarAsync = createAsyncThunk("userCars/createCar", async ({ formData }) => {
    return await userCarService.create(formData);
});

export const updateUserCarAsync = createAsyncThunk("userCars/updateCar", async ({ id, formData }) => {
    return await userCarService.update(id, formData);
});
export const deleteUserCarsAsync = createAsyncThunk(
    'cars/deleteUserCars',
    async (removeIndexes, { rejectWithValue }) => {
      try {
        for (const id of removeIndexes) {
          await userCarService.delete(id);
          toastShow("Car deleted successfully");
        }
        return removeIndexes;
      } catch (error) {
        return rejectWithValue(error);
      }
    }
  );
const filterMyCars = (data, id) => {
    return data && data.filter((car) => id == car.creator)
}

const applyFilter = (data, filter) => {

    const searchBuffer = (car, search) => {
        let findedAll = true
        const searchWords = search.toLowerCase().split(' ');
        const carInfo = `${car.make} ${car.model} ${car.year}`.toLowerCase();
        searchWords.some(word => {
            if (!carInfo.includes(word)) {
                findedAll = false
                return
            }
        }
        );
        return findedAll
    }
    const filtered = data && data.filter((car) => {
        if (car.year < parseInt(filter.yearFrom) || car.year > parseInt(filter.yearTo)) {
            return false;
        }

        if (car.price < (filter.priceFrom) || car.price > (filter.priceTo)) {
            return false;
        }

        if (filter.makes.length > 0 && filter.makes.includes(car.make) === false) {
            return false;
        }
        if (filter.status.toLowerCase() !== car.status.toLowerCase()) {
            return false;
        }

        const searchResult = searchBuffer(car, filter?.search);

        return searchResult;
    });

    if (filter.orderBy == null) {
        return filtered;
    }

    return filtered;
}


const intFields = ["id", "year", "price", "mileage"];

const normalizeValues = (val) => {
    let res = {}
    for (const key in val) {
        if (intFields.includes(key))
            res[key] = parseInt(val[key]);
        else
            res[key] = val[key];
    }
    return res;
}

const initialFilters = {
    search: '',
    makes: [],
    yearFrom: '',
    yearTo: '',
    priceFrom: initialPriceRange[0],
    priceTo: initialPriceRange[1],
    orderBy: 'id',
    increment: true,
    status: userCarStatus[0],
};

const userCarsSlice = createSlice({
    name: "userCars",
    initialState: {
        data: [],
        filtered: [],
        loading: true,
        myCars: [],
        myfilteredCars: [],

        // filter: initialFilters,
        userfiltered: initialFilters
    },
    reducers: {
        updateUserCarFilter: (state, action) => {
            const payload = action.payload;
            if (typeof payload === "string") {
                state.userfiltered = { ...initialFilters };
            } else {
                state.userfiltered = { ...state.userfiltered, ...payload };
            }
            state.myfilteredCars = applyFilter(state.myCars, state.userfiltered);

            state.loading = false;
        },
        updateUserCar: (state, action) => {
            const res = normalizeValues(action.payload);
            const car = state.data.find((car) => car.id === res.id);
            Object.assign(car, res);
            state.filtered = applyFilter(state.data, state.userfiltered);
        },
        // deleteUserCar: (state, action) => {
        //     const removeIndexes = action.payload;
        //     removeIndexes.forEach(async (id) => {
        //         await userCarService.delete(id)
        //         toastShow("Car deleted successfully")
        //         console.log(state.myCars)
        //         const index = state.myCars.findIndex((car) => car.id === id);
        //         if (index !== -1) {
        //         state.myCars.splice(index, 1);
        //         }

        //     });
        //     state.myCars = applyFilter(state.myCars, state.userfiltered);
        //     state.myfilteredCars = applyFilter(state.myCars, state.userfiltered);
        // },
        resetUserCars: (state, action) => {
            state.data = []
            state.userfiltered = initialFilters
            state.filtered = []
            state.myCars = []
            state.myfilteredCars = []
            state.loading = false
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchUserCarsAsync.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchUserCarsAsync.fulfilled, (state, action) => {
                state.loading = false;
                state.data = action.payload.data;
                state.filtered = applyFilter(state.data, state.userfiltered);
                state.myCars = filterMyCars(state.data, userService?.userValue?.id)
                state.myfilteredCars = applyFilter(state.myCars, state.userfiltered);
            })
            .addCase(fetchUserCarsAsync.rejected, (state, action) => {
                state.loading = false;
                state.data = [];
                state.filtered = [];
                // toastShow("Failed to get data. Please refresh page", "error");
            })
            .addCase(createUserCarAsync.fulfilled, (state, action) => {
                const res = normalizeValues(action.payload);
                state.data.push(res);
                state.myCars = applyFilter(state.data, state.userfiltered);
                state.myfilteredCars = applyFilter(state.data, state.userfiltered);

                toastShow("Created Successfully");
            })
            .addCase(deleteUserCarsAsync.fulfilled, (state, action) => {
              const removeIndexes = action.payload;
              removeIndexes.forEach((id) => {
                const index = state.myCars.findIndex((car) => car.id === id);
                if (index !== -1) {
                  state.myCars.splice(index, 1);
                }
              });
              state.myCars = applyFilter(state.myCars, state.userfiltered);
              state.myfilteredCars = applyFilter(state.myCars, state.userfiltered);
            })
            .addCase(deleteUserCarsAsync.rejected, (state, action) => {
              console.error("Failed to delete cars: ", action.payload);
            });
    }
});

export const {
    updateUserCar,
    updateUserCarFilter,
    resetUserCars,
    deleteUserCar,
    updateUserFilter,
} = userCarsSlice.actions;

const useUserCarDispatch = useDispatch
const useUserCarSelector = () => useSelector((state) => state.userCars);

export { useUserCarDispatch, useUserCarSelector };
export default userCarsSlice.reducer