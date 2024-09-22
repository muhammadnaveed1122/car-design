import { db } from './db';

export const supportRepo = {
   create
};

async function create(params) {

    const support = new db.Support(params);

    // save support
    await support.save();

    return support.get('id');
}