import { initialPriceRange, userCarStatus } from "@/constants/data";
import { toastShow } from "@/helpers";
import { userCarService } from "@/services";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { useDispatch, useSelector } from "react-redux";

export const fetchMarketplaceCarsAsync = createAsyncThunk("userCars/fetchCars", async () => {

    let data = await userCarService.getAllAuction();
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

const marketplaceCarsSlice = createSlice({
    name: "auctionCars",
    initialState: {
        data: [],
        filtered: [],
        loading: true,
        filter: initialFilters,
    },
    reducers: {
        updateMarketPlaceCarFilter: (state, action) => {
            const payload = action.payload;
            if (typeof payload === "string") {
                state.filter = { ...initialFilters };
            } else {
                state.filter = { ...state.filter, ...payload };
            }
            state.filtered = applyFilter(state.data, state.filter);

            state.loading = false;
        },
        resetUserCars: (state, action) => {
            state.filter = initialFilters
            state.filtered = state.data
            state.loading = false
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchMarketplaceCarsAsync.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchMarketplaceCarsAsync.fulfilled, (state, action) => {
                state.loading = false;
                state.data = action.payload.data;
                state.filtered = applyFilter(state.data, state.filter);
            })
            .addCase(fetchMarketplaceCarsAsync.rejected, (state, action) => {
                state.loading = false;
                state.data = [];
                state.filtered = [];
                // toastShow("Failed to get data. Please refresh page", "error");
            })
    }
});

export const {
    updateUserCarFilter,
    resetUserCars,
    updateMarketPlaceCarFilter,
} = marketplaceCarsSlice.actions;

const useMarketPlaceCarDispatch = useDispatch
const useMarketplaceCarSelector = () => useSelector((state) => state.marketplaceCars);

export { useMarketPlaceCarDispatch, useMarketplaceCarSelector };
export default marketplaceCarsSlice.reducer