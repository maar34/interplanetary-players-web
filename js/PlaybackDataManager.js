class PlaybackDataManager {
  constructor() {
    this.savePlaybackDataUrl = 'https://faas-fra1-afec6ce7.doserverless.co/api/v1/web/fn-fdf17816-4a02-4998-9a74-01d1796ef981/cloud/savePlaybackData';
    this.getPlaybackDataUrl = 'https://faas-fra1-afec6ce7.doserverless.co/api/v1/web/fn-fdf17816-4a02-4998-9a74-01d1796ef981/cloud/getPlaybackData';
  }

  async savePlaybackData(userId, playerId, songName, artistName, playCount, playDuration, system_rightascension, system_declination) {
    try {
      const response = await fetch(this.savePlaybackDataUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ userId, playerId, songName, artistName, playCount, playDuration, system_rightascension, system_declination })
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Failed to save playback data: ${errorData.message}`);
      }
      console.log("Data   successfully");
    } catch (error) {
      console.error("Error saving playback data:", error);
    }
  }
  
  async getPlaybackData(playerId) {
    try {
      const response = await fetch(`${this.getPlaybackDataUrl}?playerId=${playerId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });
  
      const responseText = await response.text(); // Read the response body as text
      console.log("Response text:", responseText); // Log the response text
  
      if (!responseText) {
        console.warn('Empty response from server'); // Log a warning for empty response
        return []; // Return an empty array
      }
  
      if (!response.ok) {
        const errorData = JSON.parse(responseText); // Parse the response text to JSON
        throw new Error(`Failed to retrieve playback data: ${errorData.message}`);
      }
  
      const data = JSON.parse(responseText); // Parse the response text to JSON
      console.log("Retrieved data:", data);
      return data;
    } catch (error) {
      console.error("Error retrieving playback data:", error);
      return [];
    }
  }
  
  
}
