export async function sendRequest(url, method = 'GET', body = null) {
    try {
      const options = {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: body ? JSON.stringify(body) : null,
      };
  
      const response = await fetch(url, options);
      const data = await response.json();
  
      if (!response.ok) {
        throw new Error(data.message || 'Request failed');
      }
  
      return data;
    } catch (error) {
      throw error;
    }
  }
  