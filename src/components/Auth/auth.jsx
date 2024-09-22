import { useRouter, usePathname } from 'next/navigation'
import { userService } from "@/services";
import { useEffect } from "react";

export default function isAuth(Component) {

    return function IsAuth(props) {
        const auth = userService.userValue;
        const currentPath = usePathname();

        const router = useRouter()

        useEffect(() => {
            if (window.location.hash) {
                const hash = window.location.hash; // Exclude the '#'
                return router.push(hash);
            }

            if (!auth) {
                return router.push("/");
            }
            else if (auth?.inPurchase && currentPath !== "/progress") {
                return router.push("/progress");
            }
        }, []);

        if (!auth && currentPath !== "/") {
            return <div style={{ height: "100vh" }}></div>;
        }
        if (auth?.inPurchase && currentPath !== "/progress") {
            router.push("/progress");
            return <div style={{ height: "100vh" }}></div>;
        }

        return <Component {...props} />;
    };
}
