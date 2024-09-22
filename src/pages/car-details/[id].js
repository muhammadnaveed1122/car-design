import NotFoundPage from "@/components/CarManage/CarNotFound";
import CarCardBid from "@/components/CarManage/CarCardBid";
import classes from "@/styles/LittleComponent.module.css";
import MetaDecorator from "@/components/Meta/metaDecor";
import { carService, userService, identityService } from "@/services";
import { replaceBaseUrl } from "@/helpers";
import { LoadingOverlay } from "@mantine/core";
import React, { useEffect } from "react";
import { useRouter } from "next/router";
import { toastShow } from "@/helpers";
import CarDetails from "@/components/Marketplace/carDetails";

function Details({ carInfo, loader }) {
    const router = useRouter();
    useEffect(() => {
        if (userService.userValue?.inPurchase) {
            router.replace("/progress");
        } else if (userService?.userValue?.role === "ADMIN") {
            router.replace("/admin/users");
        }
    }, [userService.userValue]);
    if (!carInfo) {
        return <NotFoundPage />;
    }
    if (!userService?.userValue?.id && carInfo?.referal) {
        typeof window !== "undefined" &&
            localStorage.setItem("referral", carInfo?.referal);
    } else {
        typeof window !== "undefined" && localStorage.removeItem("referral");
    }
    return (
        <div style={{ padding: "20px 0px" }}>
            <MetaDecorator
                title={`Trade Dept | ${carInfo?.make} ${carInfo?.model} ${carInfo?.year}`}
                description={removeHtmlTags(carInfo?.specs)}
                imageUrl={
                    carInfo?.images
                        ? replaceBaseUrl(JSON.parse(carInfo?.images)[0])
                        : "https://placehold.co/640x480?text=NoImage"
                }
            />
            <CarCardBid carId={router.query.id} carInfo={carInfo} />
            {/* <CarDetails carId={router.query.id} carInfo={carInfo} /> */}
            <LoadingOverlay
                visible={loader}
                className={classes.loadingOverlay}
                zIndex={2000}
                overlayProps={{ radius: "sm", blur: 2 }}
            />
        </div>
    );
}

function removeHtmlTags(str) {
    if (typeof str !== "string") {
        return "";
    }
    return str.replace(/<[^>]*>?/gm, " ");
}
export async function getServerSideProps({ query, res }) {
    const id = query.id;
    let carInfo = null;
    let loader = true;

    try {
        const car = await carService.getBySlug(id);

        if (car.status == "LIVE") {
            carInfo = car;
        }

        loader = false;
    } catch (err) {
        carInfo = null;
        loader = false;

        toastShow(err, "error");
    }

    return {
        props: {
            carInfo,
            loader,
        },
    };
}

export default Details;
