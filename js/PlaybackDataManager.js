class PlaybackDataManager {
    constructor(proxyServerUrl) {
      this.proxyServerUrl = proxyServerUrl;
    }
  
    async savePlaybackData(userId, playerId, songName, artistName, playCount, playDuration, system_rightascension, system_declination) {
      try {
        const response = await fetch(`${this.proxyServerUrl}/savePlaybackData`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ userId, playerId, songName, artistName, playCount, playDuration, system_rightascension, system_declination })
        });
        if (!response.ok) {
          throw new Error('Failed to save playback data');
        }
        console.log("Data saved successfully");
      } catch (error) {
        console.error("Error saving playback data:", error);
      }
    }
  
    async getPlaybackData(playerId) {
      try {
        const response = await fetch(`${this.proxyServerUrl}/getPlaybackData?playerId=${playerId}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          }
        });
        if (!response.ok) {
          throw new Error('Failed to retrieve playback data');
        }
        const data = await response.json();
        console.log("Retrieved data:", data);
        return data;
      } catch (error) {
        console.error("Error retrieving playback data:", error);
        return [];
      }
    }
  }
  