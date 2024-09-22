import { loadStripe } from '@stripe/stripe-js';

let stripePromise;

const getStripe = () => {
  if (!stripePromise) {
    stripePromise = loadStripe('pk_test_51P6SCuJTWQgDBaTpolFsGDPWMRoNsXz5aBH2LPCK4YSGjnjdbQQoP6neOavrcaX0wTjsWdsjnJsEoDvLRyaGUqma00S4MSfgf9');
  }
  return stripePromise;
};

export default getStripe;
