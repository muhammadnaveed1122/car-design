const SmartySDK = require("smartystreets-javascript-sdk");
const SmartyCore = SmartySDK.core;
const Lookup = SmartySDK.usAutocompletePro.Lookup;

// for Server-to-server requests, use this code:
const authId = process.env.SMARTY_AUTH_ID;
const authToken = process.env.SMARTY_AUTH_TOKEN;
const credentials = new SmartyCore.StaticCredentials(authId, authToken);

const clientBuilder = new SmartyCore.ClientBuilder(credentials).withLicenses(["us-autocomplete-pro-cloud"]);
const client = clientBuilder.buildUsAutocompleteProClient();

export async function findAddress(lkup) {
  try {
    const lookup = new Lookup(lkup)
    lookup.source = "all";
    lookup.maxResults = 10;
		const addresses = await client.send(lookup);
    return addresses;
    
	} catch(err) {
		console.log(err)
	}
}