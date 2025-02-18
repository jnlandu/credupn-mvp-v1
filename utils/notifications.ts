export async function sendNotification(data: any) {
    const baseUrl = window.location.origin;
    
    try {
      const response = await fetch(`${baseUrl}/api/author/notify`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(data)
      });

      console.log('Notification request Data :', data);

      console.log('Notification send response:', response);
  
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      return await response.json();
    } catch (error) {
      console.error('Notification send error:', error);
      throw error;
    }
  }