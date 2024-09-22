import { publicRoutes } from "@/constants/data";
import { expressjwt } from 'express-jwt';
import getConfig from 'next/config';
import util from 'util';

const { serverRuntimeConfig } = getConfig();

export { jwtMiddleware };

function jwtMiddleware(req, res) {
    const middleware = expressjwt({
        secret: serverRuntimeConfig.secret,
        algorithms: ['HS256']
    }).unless({
        path: publicRoutes
    });

    return util.promisify(middleware)(req, res);
}