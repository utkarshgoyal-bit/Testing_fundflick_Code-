const sendSMS = async (mobileNumber: [string], message: string) => {
  try {
    const url = process.env.SMS_API_ROUTE;
    const apiKey = process.env.SMS_API_KEY;
    if (!url || !apiKey) {
      throw new Error('SMS configuration is missing.');
    }
    const response = await fetch(`${url}?number=${mobileNumber.join(',')}&text=${message}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    const data: any = await response.json();
    if (!data || !data.status || data.status !== 'success') {
      throw new Error('An error occurred sending SMS.');
    }
  } catch (error: any) {
    throw new Error(error.message || 'An error occurred sending SMS.');
  }
};

export default sendSMS;
