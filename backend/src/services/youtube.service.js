import axios, { AxiosError } from 'axios';

export const fetchVideosFromPlaylist = async (playlistId) => {
    try {
        const response = await axios.get(`${process.env.YOUTUBE_API_BASE_URL}/playlistItems`, {
            params: {
                part: 'snippet',
                maxResult: 50,
                playlistId,
                key: process.env.YOUTUBE_API_KEY,
            },
        });

        return response.data.items.map((item) => ({
            title: item.snippet.title,
            videoId: item.snippet.resourceId.videoId,
            url: `https://www.youtube.com/watch?v=${item.snippet.resourceId.videoId}`,
        }));
    } catch (error) {
        console.error("Error fetching videos from YouTube", error.message);
        throw new Error("Failed to fetch videos from YouTube");
    }
}