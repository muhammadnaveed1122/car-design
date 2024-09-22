import path from "path";
import Cors from 'cors';
const vinUrl = "https://api.api-ninjas.com/v1/vinlookup";
const vinApiKey = "XPlI63a44I7sziBZPCijaQ==Jdwv5j8W58z9qAGH";
const chars = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
const cors = Cors({
  methods: ['GET', 'POST', 'HEAD'],
  origin: '*', 
});
export function allowCors(req, res){
  return new Promise((resolve, reject) => {
    cors(req, res, (result) => {
      if (result instanceof Error) {
        return reject(result);
      }
      return resolve(result);
    });
  });
}
export function withCors(handler) {
  return async (req, res) => {
    // Apply CORS
    await allowCors(req, res);
    
    // Call the actual API handler
    return handler(req, res);
  };
}
export function getThumbnailFilePath(originalFilePath) {
  const fileName = path.basename(originalFilePath);
  const filePath = path.dirname(originalFilePath);
  return path.resolve(filePath, fileName);
}

export const addressToString = (address) => {
  try {
    const addr = typeof address === "string" ? JSON.parse(address) : address;
    if (!addr) return "No Address";
    return `${addr.streetLine}, ${addr.city}, ${addr.state} ${addr.zipcode}`;
  } catch (e) {
    return "No Address";
  }
};


export const generateString = (len = 10) => {
  let result = "";
  for (let i = len; i > 0; --i)
    result += chars[Math.floor(Math.random() * chars.length)];
  return result;
};

export const replaceBaseUrl = (imageUrl) => {
  const oldBaseUrl = "https://estepautodealer.nyc3.cdn.digitaloceanspaces.com";
  const newBaseUrl = "https://spaces1234.nyc3.cdn.digitaloceanspaces.com";
  return imageUrl?.startsWith(oldBaseUrl)
    ? imageUrl?.replace(oldBaseUrl, newBaseUrl)
    : imageUrl;
};

export const validateVINNumber = async (vinNumber) => {
  try {
    const myHeaders = new Headers()

    myHeaders.append("X-Api-Key", vinApiKey);
    const requestOptions = {
      method: "GET",
      headers: myHeaders,
    };
    const res = await fetch(`${vinUrl}?vin=${vinNumber}`, requestOptions)
    const data = await res.json()
    return data
  } catch (error) {
    console.log(error)
    return false
  }
}
