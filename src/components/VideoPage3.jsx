import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Grid, Card, CardContent, Typography, SvgIcon, CircularProgress, TextField, Box, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, Avatar, Modal, Button } from '@mui/material';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';
import CommentIcon from '@mui/icons-material/Comment';
import FavoriteIcon from '@mui/icons-material/Favorite';
import AddIcon from '@mui/icons-material/Add';
import Header from './Header';
import { useParams } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import ChatBubbleIcon from '@mui/icons-material/ChatBubble';
import ShareIcon from '@mui/icons-material/Share';
import { useNavigate } from 'react-router-dom';  // Import useNavigate from react-router-dom
import EmojiPicker from 'emoji-picker-react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; // Import default styles
import BASE_URL from '../constant';




const VideoPage3 = () => {
    const { sub } = useParams();
    const { user, isAuthenticated, isLoading, error } = useAuth0();
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);

    const [videosLoading, setVideosLoading] = useState(true);
    const [backendError, setBackendError] = useState(null);
    const [users, setUsers] = useState({});
    const videoRefs = useRef([]);

    // Modal state for Like/Dislike feedback
    const [likeModalOpen, setLikeModalOpen] = useState(false);
    const [dislikeModalOpen, setDislikeModalOpen] = useState(false);
    const [modalPosition, setModalPosition] = useState({ top: 0, left: 0 });
    const [videoId, setVideoId] = useState(null);
    const [userLikeColor, setUserLikeColor] = useState(null); // State to track the user's like color
    const [userDislikeColor, setUserDislikeColor] = useState(null); // State to track the user's dislike color
    const [currentUser, setCurrentUser] = useState(null);
    const [userFollowing, setUserFollowing] = useState([]);
    const [isFollowing, setIsFollowing] = useState(false); // Track follow status of the current user
    const [followUpdated, setFollowUpdated] = useState(false); // New state for triggering useEffect
    const [openCommentModal, setOpenCommentModal] = useState(false);
    const [currentVideoId, setCurrentVideoId] = useState(null); // To keep track of the current video ID
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');
    const [loading, setLoading] = useState(false);
    const [videos, setVideos] = useState([])





    // Function to handle opening the comment modal and fetching comments for the current video
    const handleOpenCommentModal = async (videoId) => {

        console.log("comment video id", videoId)
        setCurrentVideoId(videoId); // Set the current video ID
        setOpenCommentModal(true);

        // Fetch comments from API using the current video ID
        try {
            setLoading(true);
            const response = await axios.get(`${BASE_URL}/api/v1/video/comment/${videoId}`); // Replace with your actual API endpoint
            console.log(response.data.comments)
            setComments(response.data.comments); // Assuming the response contains an array of comments
        } catch (error) {
            console.error('Error fetching comments:', error);
        } finally {
            setLoading(false);
        }
    };

    const TikTokIcon = (props) => {
        return (
            <SvgIcon {...props} viewBox="0 0 24 24">
                <path d="M12 2V22M12 2C9.2 2 7 4.2 7 7.8C7 9.6 8.4 11.2 10.2 11.6C8.7 12.4 8 13.6 8 15C8 16.4 8.7 17.6 10.2 18.4C8.4 18.8 7 20.4 7 22C7 22.6 7.3 23 7.8 23C8.5 23 9 22.7 9.4 22.3C9.8 21.8 11 20.2 11 19.2V14.8C11 13.8 11.8 13 12.8 13H13.2C14.2 13 15 13.8 15 14.8V19.2C15 20.2 16.2 21.8 16.6 22.3C17 22.7 17.5 23 18.2 23C18.7 23 19 22.6 19 22C19 20.4 17.6 18.8 15.8 18.4C17.2 17.6 18 16.4 18 15C18 13.6 17.2 12.4 15.8 11.6C17.6 11.2 19 9.6 19 7.8C19 4.2 16.8 2 14 2H12Z" />
            </SvgIcon>
        );
    };



    // Handle emoji click and insert the emoji into the comment input
    const handleEmojiClick = (emojiObject, event) => {
        console.log('Selected Emoji:', emojiObject);  // Log the emoji object to inspect its structure
        if (emojiObject && emojiObject.emoji) {
            setNewComment(prevComment => prevComment + emojiObject.emoji); // Append emoji to the comment text
            setShowEmojiPicker(false); // Close the emoji picker after selection
        } else {
            console.error('Emoji not found:', emojiObject);
        }
    };


    // Function to handle closing the comment modal
    const handleCloseCommentModal = () => {
        setOpenCommentModal(false);
        setNewComment(''); // Clear new comment field
    };

    // Function to handle submitting a new comment
    const handleSubmitComment = async () => {
        if (!newComment.trim()) return; // Don't submit empty comment

        try {
            await axios.post(`${BASE_URL}/api/v1/video/comment`, {
                videoId: currentVideoId, // Use the current video ID
                sub: user.sub,
                comment: newComment.trim(),
            });
            setNewComment('');
            setOpenCommentModal(false);
            // Optionally, refetch comments after submitting
            handleOpenCommentModal(currentVideoId);
        } catch (error) {
            console.error('Error submitting comment:', error);
        }
    };



    const likeColors = [
        { color: '#FF5733', label: 'Like' },
        { color: '#FFD700', label: 'Like Color' },
        { color: '#33FF57', label: 'Like Design' },
        { color: '#808080', label: 'Like Material' },
        { color: '#FF33A1', label: 'Seems Casual' },
        { color: '#FF6347', label: 'Seems Fit' },
        { color: '#585', label: 'Seems Modern' },
        { color: '#0000FF', label: 'Seems Fit' },
    ];

    const dislikeColors = [
        { color: '#ADD8E6', label: 'Unlike' },
        { color: '#FFD700', label: 'I Unlike Color' },
        { color: '#33FF57', label: 'I Unlike Design' },
        { color: '#808080', label: 'I Unlike Material' },
        { color: '#FF0000', label: 'Seems Too Tall' },
        { color: '#006400', label: 'Seems Too Short' },
        { color: '#644', label: 'Seems Too Big' },
        { color: '#F0F8', label: 'Seems Too Small' },
    ];

    // Functions to show modals for like and dislike colors
    const showLikeModal = (event, videoId) => {
        const { clientX, clientY } = event;
        setModalPosition({ top: clientY, left: clientX });
        setVideoId(videoId);
        setLikeModalOpen(true);
    };

    const showDislikeModal = (event, videoId) => {
        const { clientX, clientY } = event;
        setModalPosition({ top: clientY, left: clientX });
        setVideoId(videoId);
        setDislikeModalOpen(true);
    };

    const handleCloseModal = () => {
        setLikeModalOpen(false);
        setDislikeModalOpen(false);
        setVideoId(null);
    };

    // Handle the like color selection
    const handleLikeColorSelect = async (colorOption) => {
        if (!user) {
            alert('You need to be logged in to like a video.');
            return;
        }

        try {
            await axios.post(`${BASE_URL}/api/v1/video/like`, {
                videoId: videoId,
                userSub: user.sub,
                color: colorOption.color,
            });

            // Update the like color state
            setUserLikeColor(colorOption.color);

            setLikeModalOpen(false);
        } catch (error) {
            console.error('Error selecting like color:', error);
        }
    };

    // Handle the dislike color selection
    const handleDislikeColorSelect = async (colorOption) => {
        if (!user) {
            alert('You need to be logged in to dislike a video.');
            return;
        }

        try {
            await axios.post(`${BASE_URL}/api/v1/video/dislike`, {
                videoId: videoId,
                userSub: user.sub,
                color: colorOption.color,
            });

            // Update the dislike color state
            setUserDislikeColor(colorOption.color);

            setDislikeModalOpen(false);


        } catch (error) {
            console.error('Error selecting dislike color:', error);
        }
    };

    useEffect(() => {
        const fetchVideos = async () => {
            try {
                const response = await axios.get(`${BASE_URL}/api/v1/video/${sub}`);
                console.log(response)
                if (response.data && response.data.length > 0) {
                    setVideos(response.data);
                    const subs = response.data.map((video) => video.sub);
                    fetchUserDetails(subs);

                } else {
                    setBackendError('No videos found in this category.');
                }
                setVideosLoading(false);
            } catch (err) {
                setBackendError(err.response ? err.response.data.error : 'Failed to load videos');
                setVideosLoading(false);
            }
        };

        const fetchUserDetails = async (subs) => {
            try {
                const userPromises = subs.map((sub) => axios.get(`${BASE_URL}/api/v1/user/${sub}`));
                const userResponses = await Promise.all(userPromises);
                const userDetails = {};
                userResponses.forEach((response) => {
                    userDetails[response.data.sub] = response.data;
                });
                setUsers(userDetails);
            } catch (err) {
                console.error('Error fetching user details:', err);
            }
        };



        if (sub) {
            fetchVideos();
        }
    }, [sub, userLikeColor, userDislikeColor, comments]);

    

    // Increment views in the backend API
    const incrementViews = async (Id) => {
        try {
            const response = await axios.post(`${BASE_URL}/api/v1/video/${Id}/increment-views`, { sub: user.sub });
            if (response.status === 200) {
                // Update the video view count locally
                setVideos((prevVideos) =>
                    prevVideos.map((video) =>
                        video._id === videoId ? { ...video, views: response.data.views } : video
                    )
                );
            }
        } catch (error) {
            console.error('Error incrementing views:', error);
        }
    };

    // Handle video play event
    const handleVideoPlay = (index) => {
        console.log('Video clicked, index:', index);  // Check if the function is triggered
        const video = videoRefs.current[index];
        const videoData = videos[index];  // Get video data

        if (video) {
            video.play();

        }
    };

    // Function to handle when video is played
    const handleVideoPlay2 = (videoData) => {
        console.log("Video ID:", videoData._id); // Log video ID when it plays
        console.log("Video Title:", videoData.title); // Log video Title when it plays
        incrementViews(videoData._id); // Increment views for this video
    };



    // Scrolling behavior
    const handleVideoScroll = () => {
        videoRefs.current.forEach((video, index) => {
            if (video) {
                const rect = video.getBoundingClientRect();
                if (rect.top >= 0 && rect.bottom <= window.innerHeight) {
                    video.play();
                } else {
                    video.pause();
                }
            }
        });
    };

    useEffect(() => {
        // Listen to scroll events to auto-play videos
        window.addEventListener('scroll', handleVideoScroll);
        return () => {
            window.removeEventListener('scroll', handleVideoScroll);
        };
    }, []);


    // Follow a user
    const handleFollow = async (followeeSub) => {
        if (!user) {
            alert('You need to be logged in to follow a user.');
            return;
        }

        console.log("Followee Sub:", followeeSub);

        try {
            const response = await axios.post('/api/v1/user/follow', {
                followerSub: user.sub,
                followeeSub: followeeSub,
            });

            // Check if response status is 200
            if (response.status === 200) {
                setFollowUpdated(true);
                toast.success("You have successfully followed the user!", {
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "colored", // Optional, use if you want colored theme
                    style: {
                        backgroundColor: 'black', // Background color black
                        color: 'white', // Text color white
                        borderRadius: '8px',
                        padding: '10px',
                        fontSize: '16px',
                    },
                });
                console.log("Follow successful!");
            } else {
                console.error("Failed to follow user. Status:", response.status);
            }
        } catch (error) {
            console.error('Error following user:', error);
        }
    };



    useEffect(() => {


        const fetchCurrentUser = async () => {
            try {
                const sub = user?.sub; // Extract 'sub' (user's unique ID) from Auth0 user data

                // Make the API call to fetch current user details using the sub
                const response = await axios.get(`${BASE_URL}/api/v1/user/current/${sub}`);

                console.log(response.data.following)
                setCurrentUser(response.data); // Set the current user data
                setUserFollowing(response.data.following); // Set the 'following' list
            } catch (error) {
                console.error('Error fetching current user:', error);
            }
        };

        fetchCurrentUser();
        setFollowUpdated(false); // Reset followUpdated state after fetching

    }, [isAuthenticated, user?.sub, followUpdated]); // Dependency on isAuthenticated and user.sub to re-fetch when login state changes



    const toggleFav = async (videoId) => {
        try {
            const response = await axios.post(`${BASE_URL}/api/v1/video/${videoId}/favourite`, {
                sub: user.sub, // Replace with the current user's sub from session or context
            });

            if (response.status === 200) {
                toast.success("Video Add To Favourites!", {
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "colored", // Optional, use if you want colored theme
                    style: {
                        backgroundColor: 'black', // Background color black
                        color: 'white', // Text color white
                        borderRadius: '8px',
                        padding: '10px',
                        fontSize: '16px',
                    },
                });
            }

        } catch (error) {
            console.error("Error adding video to favourites:", error);
        }
    };


    const handleShare = async (video) => {
        // Extract the video URL from the video object
        const { videoUrl } = video;

        if (navigator.share) {
            try {
                await navigator.share({
                    title: 'Check out this video!',
                    url: videoUrl,  // Use the videoUrl passed with the video object
                });
                console.log('Video URL shared successfully');
            } catch (error) {
                console.error('Error sharing the video:', error);
            }
        } else {
            // Fallback if Web Share API is not supported
            alert('Your browser does not support sharing via the Web Share API.');
        }
    };
    // Function to format the createdAt date in Pakistan Standard Time (PST)
    const formatDate = (date) => {
        const options = {
            weekday: 'short', // Day of the week (e.g. Mon, Tue, etc.)
            year: 'numeric',
            month: 'short',  // Month abbreviation (e.g. Jan, Feb, etc.)
            day: 'numeric',  // Day of the month (e.g. 21)
            hour: '2-digit',
            minute: '2-digit',
            hour12: true, // 12-hour format
        };

        // Create a new Date object and convert it to Pakistan timezone
        const newDate = new Date(date);
        return newDate.toLocaleString('en-PK', { timeZone: 'Asia/Karachi', ...options });
    };


    const navigate = useNavigate();  // useNavigate hook to navigate programmatically

    const handleAvatarClick = (sub) => {
        // Navigate to user profile with the user's sub as a parameter
        navigate(`/user-profile/${sub}`);
    };
    if (videosLoading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
                <CircularProgress color="inherit" />
            </Box>
        );
    }

    if (backendError) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
                <Typography variant="h6" color="white" align="center">{backendError}</Typography>
            </Box>
        );
    }

    return (
        <>
            <Header />


            <Box sx={{ background: 'linear-gradient(135deg, rgba(0, 0, 0, 1), rgba(34, 34, 34, 1))' }}>

                <Grid container direction="column" spacing={2} justifyContent="center">


                    {videos.length > 0 ? (
                        videos.map((video, index) => {
                            const isFollowing = userFollowing.includes(video.sub); // Check if the current user is following this creator

                            // Calculate total likes and dislikes
                            const totalLikes = video.likeColors.reduce((sum, likeColor) => sum + likeColor.count, 0);
                            const totalDislikes = video.dislikeColors.reduce((sum, dislikeColor) => sum + dislikeColor.count, 0);

                            return (
                                <Grid item xs={12} key={video._id} sx={{ display: 'flex', justifyContent: 'center' }}>
                                    <Card sx={{
                                        backgroundColor: 'black',
                                        borderRadius: '8px',
                                        width: '100%',
                                        maxWidth: '800px',
                                        height: '100vh',
                                        marginBottom: { xs: '10px', md: '20px' }, // Smaller margin on mobile
                                        display: 'flex',
                                        flexDirection: { xs: 'row', md: 'row' }, // Always row, even on mobile
                                        alignItems: 'center', // Align items vertically
                                        padding: { xs: '5px', md: '10px' }, // Smaller padding on mobile
                                        border: '2px solid rgba(255, 255, 255, 0.1)', // Add border
                                        boxShadow: '0 0 10px rgba(255, 255, 255, 0.3), 0 0 20px rgba(255, 255, 255, 0.2)', // Add glow effect
                                    }}>
                                        {/* Like and Dislike Section (Left Side) */}
                                      

                                        {/* Video Section (Center) */}
                                        <Box sx={{
                                            display: 'flex',
                                            flexDirection: 'column',
                                            justifyContent: 'center',
                                            flex: 1,
                                            padding: { xs: '5px', md: '10px' } // Smaller padding on mobile
                                        }}>
                                            <Box sx={{
                                                position: 'relative',
                                                width: '100%',
                                                height: { xs: '70vh', md: '70vh' }, // Adjust height for TikTok-like format
                                                aspectRatio: '1/16', // TikTok-like aspect ratio (portrait)
                                                overflow: 'hidden', // Ensure video fits within the container
                                                borderRadius: 3
                                            }}>
                                                <video
                                                    ref={(el) => videoRefs.current[index] = el}
                                                    width="100%"
                                                    height="100%"
                                                    controls
                                                    src={video.videoUrl}
                                                    muted
                                                    onPlay={() => handleVideoPlay2(video)} // Trigger when video is played
                                                    onClick={() => handleVideoPlay(index)}
                                                    style={{ objectFit: 'cover' }} // Ensure video fills the container
                                                />
                                            </Box>
                                            <CardContent sx={{
                                                background: 'linear-gradient(180deg, rgba(0, 0, 0, 0.8), rgba(34, 34, 34, 0.8))',
                                                borderRadius: '0 0 8px 8px',
                                                padding: { xs: '8px', md: '16px' } // Smaller padding on mobile
                                            }}>
                                                <Box sx={{
                                                    display: 'flex',
                                                    flexDirection: { xs: 'column', md: 'row' },
                                                    justifyContent: 'space-between',
                                                    alignItems: 'center',
                                                    width: '100%'
                                                }}>
                                                    <Typography variant="h6" color="white" sx={{ fontWeight: 'bold', marginBottom: { xs: 0.5, md: 0 }, fontSize: { xs: '14px', md: '18px' } }}> {/* Smaller font size on mobile */}
                                                        {video.title}
                                                    </Typography>
                                                    <Typography variant="body2" color="white" sx={{ marginBottom: { xs: 0.5, md: 0 }, fontSize: { xs: '10px', md: '14px' } }}> {/* Smaller font size on mobile */}
                                                        {video.description}
                                                    </Typography>
                                                    <Typography variant="body2" color="white" sx={{ fontSize: { xs: '10px', md: '14px' } }}> {/* Smaller font size on mobile */}
                                                        {new Date(video.createdAt).toLocaleString()}
                                                    </Typography>
                                                </Box>
                                            </CardContent>
                                        </Box>

                                        {/* User Section (Right Side) */}
                                        <Box sx={{
                                            display: 'flex',
                                            flexDirection: 'column',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            padding: { xs: '2px', md: '2px' }, // Smaller padding on mobile
                                            width: { xs: '20px', md: '48px' }, // Smaller width on mobile
                                        }}>
                                            {users[video.sub] && (
                                                <>
                                                    <Box sx={{ position: 'relative', display: 'inline-block' }}>
                                                        {/* Avatar */}
                                                        <Avatar
                                                            alt="User Picture"
                                                            src={users[video.sub].picture}


                                                            onClick={() => handleAvatarClick(video.sub)}
                                                            sx={{
                                                                width: { xs: 30, md: 40 },
                                                                height: { xs: 30, md: 40 },
                                                                marginBottom: 0,
                                                                cursor: 'pointer'
                                                            }}
                                                        />
                                                        {!isFollowing && (

                                                            <IconButton
                                                                sx={{
                                                                    position: 'absolute',
                                                                    bottom: 0, // Position at the bottom of the avatar
                                                                    left: 0, // Position at the right of the avatar
                                                                    backgroundColor: '#FF5733',
                                                                    borderRadius: '50%',
                                                                    padding: { xs: '2px', md: '1px' },
                                                                    transform: 'translate(25%, 25%)', // Adjust to center the icon on the edge
                                                                    '&:hover': {
                                                                        backgroundColor: '#FF5733', // Keep the same color on hover
                                                                    },
                                                                }}
                                                            >
                                                                <AddIcon
                                                                    onClick={() => handleFollow(users[video.sub].sub)}
                                                                    sx={{
                                                                        color: 'white',
                                                                        fontSize: { xs: '0.8rem', md: '0.9rem' },
                                                                    }}
                                                                />
                                                            </IconButton>
                                                        )}

                                                    </Box>
                                                </>
                                            )}
                                            <IconButton
                                                color="primary"
                                                onClick={(event) => showLikeModal(event, video._id)}
                                                sx={{ marginTop: { xs: 0.5, md: 2, display: 'flex', flexDirection: 'column' } }}
                                            >
                                                <ThumbUpIcon sx={{ color: 'white', fontSize: { xs: '0.8rem', md: '1rem' } }} />
                                                <Typography variant="caption" color="white" sx={{ fontSize: { xs: '10px', md: '12px' } }}>
                                                    {totalLikes}
                                                </Typography>
                                            </IconButton>

                                            <IconButton
                                                color="secondary"
                                                onClick={(event) => showDislikeModal(event, video._id)}
                                                sx={{ marginBottom: { xs: 0.5, md: 1, display: 'flex', flexDirection: 'column' } }}
                                            >
                                                <ThumbDownIcon sx={{ color: 'white', fontSize: { xs: '0.8rem', md: '1rem' } }} />
                                                <Typography variant="caption" color="white" sx={{ fontSize: { xs: '10px', md: '12px' } }}>
                                                    {totalDislikes}
                                                </Typography>
                                            </IconButton>

                                            {/* Comment Button */}
                                            <IconButton
                                                color="primary"
                                                onClick={() => handleOpenCommentModal(video._id)} // Pass video._id to fetch comments for the current video
                                                sx={{ marginTop: { xs: 0.5, md: 0, display: 'flex', flexDirection: 'column' } }}
                                            >
                                                <ChatBubbleIcon sx={{ color: 'white', fontSize: { xs: '0.8rem', md: '1rem' } }} />
                                                <Typography variant="caption" color="white" sx={{ fontSize: { xs: '10px', md: '12px' } }}>
                                                    {video.comments.length}
                                                </Typography>
                                            </IconButton>

                                            {/* Favorite Button */}
                                            <IconButton
                                                color="primary"
                                                sx={{ marginTop: { xs: 0.5, md: 2 }, display: 'flex', flexDirection: 'column' }}
                                                onClick={() => toggleFav(video._id)} // Pass video._id to fetch comments for the current video

                                            >
                                                <FavoriteIcon sx={{ color: 'white', fontSize: '1rem' }} />
                                                <Typography variant="caption" color="white" sx={{ fontSize: { xs: '10px', md: '12px' } }}>
                                                    {video.favourites.length}
                                                </Typography>
                                            </IconButton>
                                            {/* Share Button */}
                                            <IconButton
                                                color="primary"
                                                sx={{ marginTop: { xs: 0.5, md: 2, display: 'flex', flexDirection: 'column' } }}
                                                onClick={() => handleShare(video)} // Pass the whole video object

                                            >
                                                <ShareIcon sx={{ color: 'white', fontSize: { xs: '0.8rem', md: '1rem' } }} />
                                                <Typography variant="caption" color="white" sx={{ fontSize: { xs: '10px', md: '12px' } }}>
                                                </Typography>
                                            </IconButton>

                                        </Box>
                                    </Card>
                                </Grid>
                            );
                        })
                    ) : (
                        <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
                            <Typography variant="h6" color="white" align="center" sx={{ fontSize: { xs: '14px', md: '18px' } }}>
                                No videos found in this category.
                            </Typography>
                        </Box>
                    )}
                </Grid>

                {/* Like and Dislike Modals */}
                <Modal open={likeModalOpen} onClose={handleCloseModal} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <Box sx={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: { xs: '5px', md: '10px' }, boxShadow: 3, maxHeight: '80vh', width: { xs: '250px', md: '300px' }, overflowY: 'auto', justifyContent: 'center', textAlign: 'center' }}>
                        {likeColors.map((colorOption) => (
                            <Button key={colorOption.color} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start', backgroundColor: 'transparent', color: colorOption.color, marginBottom: '5px', borderRadius: '4px', width: '80%', '&:hover': { backgroundColor: colorOption.color, color: 'white' } }} onClick={() => handleLikeColorSelect(colorOption)}>
                                <Box sx={{ width: { xs: '15px', md: '20px' }, height: { xs: '15px', md: '20px' }, backgroundColor: colorOption.color, borderRadius: '50%', marginRight: '10px' }} /> {/* Smaller circle on mobile */}
                                <Typography sx={{ fontSize: { xs: '12px', md: '16px' } }}>{colorOption.label}</Typography> {/* Smaller font size on mobile */}
                            </Button>
                        ))}
                    </Box>
                </Modal>

                {/* Dislike Modal */}
                <Modal open={dislikeModalOpen} onClose={handleCloseModal} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <Box sx={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: { xs: '5px', md: '10px' }, boxShadow: 3, maxHeight: '80vh', width: { xs: '250px', md: '300px' }, overflowY: 'auto' }}>
                        {dislikeColors.map((colorOption) => (
                            <Button key={colorOption.color} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start', backgroundColor: 'transparent', color: colorOption.color, marginBottom: '5px', borderRadius: '4px', width: '80%', '&:hover': { backgroundColor: colorOption.color, color: 'white' } }} onClick={() => handleDislikeColorSelect(colorOption)}>
                                <Box sx={{ width: { xs: '15px', md: '20px' }, height: { xs: '15px', md: '20px' }, backgroundColor: colorOption.color, borderRadius: '50%', marginRight: '10px' }} /> {/* Smaller circle on mobile */}
                                <Typography sx={{ fontSize: { xs: '12px', md: '16px' } }}>{colorOption.label}</Typography> {/* Smaller font size on mobile */}
                            </Button>
                        ))}
                    </Box>
                </Modal>

                <Dialog open={openCommentModal} onClose={handleCloseCommentModal} fullWidth maxWidth="sm">
                                  <DialogTitle>Comments</DialogTitle>
                                  <DialogContent sx={{ display: 'flex', flexDirection: 'column', height: '400px' }}>
                                      {/* Scrollable comment list */}
                                      <Box sx={{ overflowY: 'auto', flex: 1, paddingBottom: '60px' }}>
                                          {loading ? (
                                              <Box sx={{ display: 'flex', justifyContent: 'center', paddingTop: 3 }}>
                                                  <CircularProgress />
                                              </Box>
                                          ) : (
                                              <div>
                                                  {comments.length > 0 ? (
                                                      comments.map((comment, index) => (
                                                          <Box key={index} sx={{ display: 'flex', alignItems: 'center', marginBottom: 2 }}>
                                                              {/* Avatar for user */}
                                                              <Avatar
                                                                  alt={comment.user.name}
                                                                  src={comment.user.picture}
                                                                  onClick={() => handleAvatarClick(comment.user.sub)} // Add onClick handler
                                                                  sx={{
                                                                      width: 40, height: 40, marginRight: 2, cursor: 'pointer'  // Add cursor pointer for hover effect
                                                                  }}
                                                              />
              
                                                              {/* Comment text and timestamp */}
                                                              <Box>
                                                                  <Typography variant="body2" color="textPrimary">
                                                                      {comment.user.name}
                                                                  </Typography>
                                                                  <Typography variant="body2" color="textPrimary">
                                                                      {comment.comment}
                                                                  </Typography>
                                                                  <Typography variant="caption" color="textSecondary">
                                                                      {formatDate(comment.date)} {/* Convert to PST and display */}
                                                                  </Typography>
                                                              </Box>
                                                          </Box>
                                                      ))
                                                  ) : (
                                                      <Typography>No comments yet.</Typography>
                                                  )}
                                              </div>
                                          )}
                                      </Box>
              
                                      {/* Comment input area */}
                                      <div style={{ position: 'sticky', bottom: 0, backgroundColor: 'white', padding: '0px' }}>
                                          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                              {/* User Profile Picture */}
                                              <img
                                                  src={user?.picture}
                                                  alt={user?.name}
                                                  style={{ width: '40px', height: '40px', borderRadius: '50%', cursor: 'pointer' }}
                                                  onClick={() => handleAvatarClick(user.sub)}
                                              />
              
                                              {/* Modern Input Field */}
                                              <input
                                                  type="text"
                                                  placeholder="Write your comment..."
                                                  value={newComment}
                                                  onChange={(e) => setNewComment(e.target.value)}
                                                  style={{
                                                      flex: 1,
                                                      padding: '8px 12px',
                                                      borderRadius: '20px',
                                                      border: '1px solid #ddd',
                                                      fontSize: '14px',
                                                      outline: 'none',
                                                      width:'10px',
                                                      transition: 'border-color 0.3s',
                                                      fontFamily: 'Arial, sans-serif',
                                                  }}
                                                  onFocus={(e) => (e.target.style.borderColor = '#ff4081')}
                                                  onBlur={(e) => (e.target.style.borderColor = '#ddd')}
                                              />
              
                                              {/* Emoji Picker Button */}
                                              <button
                                                  onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                                                  style={{
                                                      width: '40px',
                                                      height: '40px',
                                                      borderRadius: '50%',
                                                      border: '1px solid #ddd',
                                                      backgroundColor: 'transparent',
                                                      cursor: 'pointer',
                                                      display: 'flex',
                                                      alignItems: 'center',
                                                      justifyContent: 'center',
                                                      fontSize: '16px',
                                                  }}
                                              >
                                                  😊
                                              </button>
              
                                              {/* Submit Button */}
                                              <button
                                                  onClick={handleSubmitComment}
                                                  style={{
                                                      width: '40px',
                                                      height: '40px',
                                                      borderRadius: '50%',
                                                      backgroundColor: '#ff4081',
                                                      border: 'none',
                                                      color: 'white',
                                                      cursor: 'pointer',
                                                      display: 'flex',
                                                      alignItems: 'center',
                                                      justifyContent: 'center',
                                                      fontSize: '14px',
                                                      transition: 'background-color 0.3s',
                                                  }}
                                                  onMouseOver={(e) => (e.target.style.backgroundColor = '#e91e63')}
                                                  onMouseOut={(e) => (e.target.style.backgroundColor = '#ff4081')}
                                              >
                                                  ✓
                                              </button>
                                          </div>
                                      </div>
              
                                      {/* Emoji Picker Popup */}
                                      {showEmojiPicker && (
                                          <Box sx={{ position: 'absolute', bottom: '60px', left: '50%', transform: 'translateX(-50%)' }}>
                                              <EmojiPicker onEmojiClick={handleEmojiClick} />
                                          </Box>
                                      )}
                                  </DialogContent>
                              </Dialog>
            </Box>
        </>
    );
};

export default VideoPage3;
