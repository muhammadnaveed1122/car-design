import { carService, actionService, userService } from "@/services";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { initialPriceRange, carStatus } from '@/constants/data';
import { useDispatch, useSelector } from "react-redux";
import { toastShow } from "@/helpers";


export const fetchCarsAsync = createAsyncThunk("cars/fetchCars", async ({ id, referal }) => {
    const condition = userService?.userValue?.role === "ADMIN" || userService?.userValue?.role === "SUBADMIN"
    if (referal === "ALL") {
        if (!condition) {
            let data = await carService.getAll();
            let seenVins = new Set();
            let filteredData = [];

            data.forEach(car => {
                if (car.vin === null || !seenVins.has(car.vin)) {
                    filteredData.push(car);
                    if (car.vin !== null) {
                        seenVins.add(car.vin);
                    }
                }
            });
            data = filteredData;

            return { data };
        } else {
            let data = await carService.getAll();
            return { data };

        }
    }
    try {
        let data
        if (condition) {
            data = await carService.getAll({ id, referal });
        } else {
            data = await carService.demoCars({ id, referal });

        }
        let seenVins = new Set();
        let filteredData = [];

        data.forEach(car => {
            if (car.vin === null || !seenVins.has(car.vin)) {
                filteredData.push(car);
                if (car.vin !== null) {
                    seenVins.add(car.vin);
                }
            }
        });

        data = filteredData;
        const runlist = !id ? [] : await actionService.myAuctions({ userId: id, });
        const soldlist = !id ? [] : await carService.sold({ bidderId: id, });
        return { data, runlist, soldlist };
    }

    catch (err) {
        return { error: err.message }
    }
});

export const createCarAsync = createAsyncThunk("cars/createCar", async ({ formData }) => {
    return await carService.create(formData);
});

export const updateCarAsync = createAsyncThunk("cars/updateCar", async ({ formData }) => {
    return await carService.updateInfo(formData);
});
export const duplicateCarAsync = createAsyncThunk("cars/duplicateCar", async ({ formData }) => {
    return await carService.duplicateCar(formData);
});

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

        if ((filter.referal === 'RAN' && car.referal !== null) || (filter.referal === 'TAR' && car.referal === null)) {
            return false;
        }

        if (filter.status.toLowerCase() !== car.status.toLowerCase()) {
            return false;
        }

        const searchResult = searchBuffer(car, filter.search);

        return searchResult;
    });

    if (filter.orderBy == null) {
        return filtered;
    }

    return filtered;
}

const intFields = ["id", "year", "price", "mileage", "bidPrice"];

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
    referal: 'ANY',
    status: carStatus[1],
};

const carsSlice = createSlice({
    name: "cars",
    initialState: {
        data: [],
        filtered: [],
        runlist: [],
        soldlist: [],
        loading: true,
        filter: initialFilters
    },
    reducers: {
        updateFilter: (state, action) => {
            const payload = action.payload;

            if (typeof payload === "string") {
                state.filter = { ...initialFilters };
            } else {
                state.filter = { ...state.filter, ...payload };
            }
            state.filtered = applyFilter(state.data, state.filter);
            state.loading = false;

        },
        updateCar: (state, action) => {
            const res = normalizeValues(action.payload);
            const car = state.data.find((car) => car.id === res.id);
            Object.assign(car, res);
            state.filtered = applyFilter(state.data, state.filter);
        },
        deleteCar: (state, action) => {
            const removeIndexes = action.payload;
            removeIndexes.forEach((id) => {
                carService.delete(id)
                const index = state.data.findIndex((car) => car.id === id);
                state.data.splice(index, 1);
            });
            state.filtered = applyFilter(state.data, state.filter);
        },
        bidCar: (state, action) => {
            const { carId, userId, price, loadingContext, router, referal, getCarDetails } = action.payload;
            actionService.bid({
                carId, userId, price,
            }).then((res) => {
                loadingContext.setIsLoading(false)
                userService.getById(userId)
                fetchCarsAsync({ id: userId, referal: referal })
                if (res.bid) {
                    router.push("/progress")
                }
                toastShow(res.message);
                getCarDetails()


            }).catch((error) => {
                loadingContext.setIsLoading(false)
                toastShow(error, 'error');
            });
            if (state.runlist.filter(car => car.id == carId).length === 0)
                state.runlist.splice(0, 0, state.data.find(car => car.id == carId));
            return
        },
        buyCar: (state, action) => {
            const { carId, userId, router } = action.payload;

            actionService.buy({
                carId, userId,
            }).then((res) => {
                toastShow(res.message);
            }).catch((error) => {
                toastShow(error, 'error');
            });

            if (state.soldlist.filter(car => car.id == carId).length === 0) {
                const soldIndex = state.data.findIndex(car => car.id == carId);
                const soldCar = {
                    ...state.data[soldIndex],
                    User: { id: userId },
                    status: "ENDED"
                };
                state.soldlist.splice(0, 0, soldCar);
                state.runlist.splice(soldIndex, 1);
            }
            router.push("/progress");
        },
        resetCars: (state, action) => {
            state.data = []
            state.filter = initialFilters
            state.filtered = []
            state.runlist = []
            state.loading = false
            state.soldlist = []
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchCarsAsync.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchCarsAsync.fulfilled, (state, action) => {
                state.loading = false;
                state.data = action.payload.data;
                state.filtered = applyFilter(state.data, state.filter);
                if (!!action.payload.runlist)
                    state.runlist = action.payload.runlist.map((val) => val.Car);
                if (!!action.payload.soldlist)
                    state.soldlist = action.payload.soldlist;
            })
            .addCase(fetchCarsAsync.rejected, (state, action) => {
                state.loading = false;
                state.data = [];
                state.filtered = [];
                // toastShow("Failed to get data. Please refresh page");
            })
            .addCase(createCarAsync.fulfilled, (state, action) => {
                const res = normalizeValues(action.payload);
                state.data.push(res);
                state.filtered = applyFilter(state.data, state.filter);
                toastShow("Created Successfully");
            })
            .addCase(updateCarAsync.fulfilled, (state, action) => {
                const res = normalizeValues(action.payload);
                const car = state.data.find((car) => car.id === res.id);
                Object.assign(car, res);
                state.filtered = applyFilter(state.data, state.filter);
                toastShow("Updated Successfully");
            });
    }
});

const useCarDispatch = useDispatch;
const useCarSelector = () => useSelector((state) => state.cars);

export { useCarDispatch, useCarSelector };

export const {
    updateCar,
    resetCars,
    deleteCar,
    updateFilter,
    bidCar,
    buyCar,
} = carsSlice.actions;

export default carsSlice.reducer;
