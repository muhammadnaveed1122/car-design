import { useLoadingContext } from '@/providers/LoadingProvider'
import CarsListing from '@/components/Pending/CarsListing'
import { carService, userService } from '@/services'
import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { Helmet } from 'react-helmet'
import { Box } from '@mantine/core'

function pending() {
    const [cars, setCars] = useState([]);
    const [currentPage, setCurrentPage] = useState(1)
    const [totalPages, setTotalPages] = useState(1)
    const loadingContext = useLoadingContext();
    const router = useRouter()

    const refreshCars = async () => {
        try {
            loadingContext.setIsLoading(true);
            const res = await carService.getAllPendingCars(currentPage);

            if (res.cars.length === 0 && currentPage > 1) {
                setCurrentPage(currentPage - 1);
            } else {
                setCars(res.cars);
                setCurrentPage(Number(res.currentPage));
                setTotalPages(res.totalPages);
            }

        } catch (error) {
            console.error("Error fetching cars:", error);
        } finally {
            loadingContext.setIsLoading(false);
        }
    };

    useEffect(() => {
        if (currentPage > 0) {
            refreshCars()
        }
    }, [currentPage]);
    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('user'))
        if (user) {
            userService.getById(user?.id).then(() => {
                if (userService.userValue?.role === "ADMIN") {
                    router.push("/admin/cars/pending");
                } else {
                    router.push("/");
                }
            })
        } else {
            router.push("/");
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])
    return (
        <>
            <Box mih={700}>
                <Helmet title="Trade Dept | Pending Cars" />
                <CarsListing
                    cList={cars} totalPages={totalPages}
                    currentPage={currentPage} setCurrentPage={setCurrentPage}
                    refreshCars={refreshCars}
                />
            </Box>
        </>)
}

export default pending