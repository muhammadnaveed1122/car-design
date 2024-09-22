import { apiHandler, identityRepo } from "@/helpers/api";
import { uploadFilesToAWS } from "@/helpers/api";
import formidable from "formidable";

export const config = {
  api: {
    bodyParser: false,
  },
};

export default apiHandler({
  post: create,
});

async function create(req, res) {
  const form = formidable({ multiples: true });
  form.parse(req, async (err, fields, files) => {
    if (err) {
      console.error("Error parsing form:", err);
      res.status(500).json({ message: "Error parsing form." });
      return;
    }
    const jsonFields = {};
    for (const key in fields) {
      if (fields.hasOwnProperty(key)) {
        jsonFields[key] = fields[key][0];
      }
    }

    for (const key in files) {
      const uploaded = await uploadFilesToAWS(files[key], "identities");
      jsonFields[key] = uploaded[0];
    }

    await identityRepo.create(jsonFields);

    return res
      .status(200)
      .json({ message: "Your verification data successfully submitted." });
  });
}
