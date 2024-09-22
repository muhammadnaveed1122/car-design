import { db } from './db';

export const verifiesRepo = {
    send,
    verify,
    checkEmailExsist,
};
async function checkEmailExsist(email){
    return await db.User.findOne({where:{email:email}})
   
}
const generateCodes = (digitCount) => {
    const digits = '0123456789';
    const digitsLength = digits.length;

    let result = '';
    for (let i = 0; i < digitCount; ++i) {
        result += digits.charAt(Math.floor(Math.random() * digitsLength));
    }
    return result;
}

async function send(params) {

    const { verifyWith } = params;
    let verification = await db.Verification.findOne({ where: { verifyWith } });
    if (!verification) {
        verification = new db.Verification({ verifyWith });
    }
    Object.assign(verification, { code: generateCodes(4) });

    // save verification
    await verification.save();

    return verification.get('code');
}

async function verify(params) {

    const { verifyWith, code } = params;

    const verification = await db.Verification.findOne({ where: { verifyWith, code } });

    if (!!verification) {
        Object.assign(verification, {status: "VERIFIED"});
        await verification.save();

        return true;
    }

    return false;
}
