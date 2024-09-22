const axios = require('axios');

// ClickSend API credentials
const username = "estepsautodealer@outlook.com"
const apiKey = 'B2778425-E893-2B63-6C07-0C612792D7A1';

// ClickSend SMS endpoint
const smsEndpoint = 'https://rest.clicksend.com/v3/sms/send';

export async function sendSms(recipient, message) {
  const from = +18554567796
  // SMS data
  const smsData = {
    messages: [
      {
        source: 'sdk',
        body: message,
        to: recipient, // Replace with the recipient's phone number
        from: from, // Replace with your sender ID
      },
    ],
  };
  const auth = 'Basic ' + Buffer.from(username + ':' + apiKey).toString('base64');
  // Set up headers with API key
  const headers = {
    'Content-Type': 'application/json',
    Authorization: auth,
  };
  try {
    // Make the API request
    const response = await axios.post(smsEndpoint, smsData, { headers });
    return response.data;
  } catch (error) {
    console.error('Error sending SMS:', error.response ? error.response.data : error.message);
    return error.message;
  }
}
