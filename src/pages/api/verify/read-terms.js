
import { apiHandler } from '@/helpers/api';
import fs from 'fs';

export default apiHandler({
  post: readTerms
});


export async function readTerms(req, res) {

  try {
    const fileContent = fs.readFileSync('public/assets/termsAndCond.txt', 'utf8');
    res.status(200).json({ content: fileContent });

    return res.status(200).json(result);

  } catch (error) {
    res.status(500).json({ message: "COULD NOT LOAD TERMS AND CONDITIONS" })
  }
}