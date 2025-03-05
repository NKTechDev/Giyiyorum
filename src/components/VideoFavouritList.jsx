import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { Grid, Typography } from '@mui/material';
import BASE_URL from '../constant';

const VideoFavoriteList = ({Currentuser}) => {
  const { sub } = useParams(); // Getting the sub parameter from the URL
  const [videos, setVideos] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFavoriteVideos = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/api/v1/video/favourites/${sub}`);
        setVideos(response.data);
      } catch (error) {
        console.error('Failed to fetch favorite videos:', error);
      }
    };

    fetchFavoriteVideos(); // Fetching the favorite videos when the component mounts
  }, [sub,Currentuser]);

  const handleVideoClick = () => {
    navigate(`/videoPage2/${sub}`);
  };

  return (
    <Grid container spacing={2} padding={2}>
      {videos.map((video) => (
        <Grid item xs={6} sm={6} md={4} lg={3} key={video._id}>
          <div onClick={() => handleVideoClick(video)} style={styles.videoContainer}>
            <div style={styles.videoWrapper}>
              <video src={video.videoUrl} style={styles.video} />
            </div>
            <div style={styles.videoInfo}>
              <Typography variant="body2" sx={{ color: 'white' }}>
                {video.views} views
              </Typography>
              <Typography variant="body2" sx={{ color: 'white' }}>
                {video.user?.username}
              </Typography>
            </div>
          </div>
        </Grid>
      ))}
    </Grid>
  );
};

export default VideoFavoriteList;

// CSS Styles (matching PvideoList)
const styles = {
  videoContainer: {
    cursor: 'pointer',
    borderRadius: '10px',
    overflow: 'hidden',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    aspectRatio: '1 / 1.5', // Fixed aspect ratio (width:height = 1:1.5)
    position: 'relative', // To allow absolute positioning for the info section
  },
  videoWrapper: {
    width: '100%',
    height: '100%',
    overflow: 'hidden',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  video: {
    width: '100%',
    height: '100%',
    objectFit: 'cover', // Ensures the video covers the entire container
    borderRadius: '10px',
  },
  videoInfo: {
    position: 'absolute', // Absolute positioning to overlay on top of the video
    bottom: '0', // Position it at the bottom of the video container
    width: '100%',
    padding: '8px',
    backgroundColor: 'rgba(0, 0, 0, 0.6)', // Semi-transparent background for visibility
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center', // Center the text horizontally
  },
};
