import axios from 'axios';

export const fetchVideosFromPlaylist = async (playlistId) => {
    let allVideos = [];
    let nextPageToken = null;
    try {
        do {
            const params = {
                part: 'snippet',
                maxResults: 50, 
                playlistId,
                key: process.env.YOUTUBE_API_KEY,
            };

            if (nextPageToken) {
                params.pageToken = nextPageToken;
            } 

            const response = await axios.get(`${process.env.YOUTUBE_API_BASE_URL}/playlistItems`, {
                params: params, 
            });

            const items = response.data?.items || [];

            const videosFromPage = items.map((item) => {
                if (item.snippet && item.snippet.resourceId && item.snippet.resourceId.videoId) {
                    return {
                        title: item.snippet.title,
                        videoId: item.snippet.resourceId.videoId,
                        url: `https://www.youtube.com/watch?v=${item.snippet.resourceId.videoId}`,
                    };
                }

                return null; 
            }).filter(video => video !== null); 

            allVideos = allVideos.concat(videosFromPage);

            
            nextPageToken = response.data.nextPageToken;

        } while (nextPageToken); 

        return allVideos;

    } catch (error) {

        const errorMessage = error.response?.data?.error?.message || error.message;
        console.error(`Error fetching videos from YouTube playlist ${playlistId}: ${errorMessage}`, error.stack);

        throw new Error(`Failed to fetch all videos from YouTube playlist ${playlistId}`);
    }
};
