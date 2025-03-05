import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Button, Box, Typography, Avatar, Dialog, DialogActions, DialogContent, DialogTitle, List, ListItem, ListItemAvatar, ListItemText, Grid, Tabs, Tab, TextField } from '@mui/material';
import axios from 'axios';
import { useAuth0 } from '@auth0/auth0-react';
import PeopleIcon from '@mui/icons-material/People';
import FavoriteIcon from '@mui/icons-material/Favorite';
import { useNavigate } from 'react-router-dom';
import Header from './Header';
import PvideoList from './PvideoList';
import VideoFavoriteList from './VideoFavouritList';
import { toast, ToastContainer } from 'react-toastify';
import ConversationList from './ConvesationList';
import BASE_URL from '../constant';


const UserProfile = () => {
    const { sub } = useParams();
    const [Currentuser, setcurentUser] = useState(null);
    const [followersDetails, setFollowersDetails] = useState([]);
    const [followingDetails, setFollowingDetails] = useState([]);
    const [openFollowersModal, setOpenFollowersModal] = useState(false);
    const [openFollowingModal, setOpenFollowingModal] = useState(false);
    const [openEditProfileModal, setOpenEditProfileModal] = useState(false);
    const [searchFollower, setSearchFollower] = useState('');
    const [searchFollowing, setSearchFollowing] = useState('');
    const [tabValue, setTabValue] = useState(0); // State to track which tab is selected
    const [avatarPreview, setAvatarPreview] = useState(null); // Preview new avatar
    const { user, isAuthenticated, isLoading, error } = useAuth0();
    const [avatarFile, setAvatarFile] = useState(null); // To hold the original avatar file
    const [followUpdated, setFollowUpdated] = useState(false); // To hold
    const [followUpdated2, setFollowUpdated2] = useState(false); // To hold

    const [openModal, setOpenModal] = useState(false);  // State to manage modal visibility



    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                const response = await axios.get(`${BASE_URL}/api/v1/user/current/${sub}`);
                setcurentUser(response.data);
            } catch (error) {
                console.error('Error fetching user profile:', error);
            }
        };
        fetchUserProfile();
    }, [sub, followUpdated, followUpdated2]);

    const fetchFollowersDetails = async () => {
        try {
            const response = await axios.get(`${BASE_URL}/api/v1/user/${sub}/followers`);
            setFollowersDetails(response.data.followingUsers);
        } catch (error) {
            console.error('Error fetching followers details:', error);
        }
    };

    const fetchFollowingDetails = async () => {
        try {
            const response = await axios.get(`${BASE_URL}/api/v1/user/${sub}/following`);
            setFollowingDetails(response.data.followingUsers);
        } catch (error) {
            console.error('Error fetching following details:', error);
        }
    };

    useEffect(() => {
        fetchFollowersDetails()
        fetchFollowingDetails();
    }, [sub, followUpdated]);


    const handleOpenFollowersModal = () => {
        fetchFollowersDetails();
        setOpenFollowersModal(true);
    };

    const handleCloseFollowersModal = () => {
        setOpenFollowersModal(false);
    };

    const handleOpenFollowingModal = () => {
        fetchFollowingDetails();
        setOpenFollowingModal(true);
    };

    const handleCloseFollowingModal = () => {
        setOpenFollowingModal(false);
    };

    const handleOpenEditProfileModal = () => {
        setOpenEditProfileModal(true);
    };

    const handleCloseEditProfileModal = () => {
        setOpenEditProfileModal(false);
    };

    const handleTabChange = (event, newValue) => {
        setTabValue(newValue);
    };

    const handleSearchFollowerChange = (e) => {
        setSearchFollower(e.target.value);
    };

    const handleSearchFollowingChange = (e) => {
        setSearchFollowing(e.target.value);
    };

    const navigate = useNavigate();

    const handleAvatarClick = (sub) => {
        navigate(`/user-profile/${sub}`);
        setOpenFollowingModal(false);
        setOpenFollowersModal(false);
    };

    const handleEditProfileSubmit = async () => {
        try {
            const formData = new FormData();
            formData.append('name', Currentuser.name);

            // Append the original avatar file if it exists
            if (avatarFile) {
                formData.append('avatar', avatarFile);
            }

            // Make the API call to update the profile with FormData
            const response = await axios.put(`${BASE_URL}/api/v1/user/update/${sub}`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });

            // Update the user data with the response from the backend
            setcurentUser(response.data);
            handleCloseEditProfileModal(); // Close the modal after updating

        } catch (error) {
            console.error('Error updating profile:', error);
        }
    };

    const handleAvatarChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            setAvatarPreview(URL.createObjectURL(file)); // Show preview of the avatar
            setAvatarFile(file); // Set the actual file to be sent to the backend

        }
    };

    const handleShareProfile = () => {
        // Generate the URL of the user's profile, assuming the URL structure is something like this
        const profileUrl = `${BASE_URL}/user-profile/${sub}`;

        if (navigator.share) {
            navigator.share({
                title: `${Currentuser.name}'s Profile`,
                url: profileUrl, // Share the generated profile URL
            })
                .then(() => console.log('Profile shared successfully'))
                .catch((error) => console.log('Error sharing profile:', error));
        } else {
            // Fallback if the browser doesn't support `navigator.share`
            alert('Sharing is not supported in your browser.');
        }
    };

    // Open and close modal
    const handleOpenModal = () => setOpenModal(true);
    const handleCloseModal = () => setOpenModal(false);



    // Follow a user
    const handleFollow = async (followeeSub) => {
        if (!user) {
            alert('You need to be logged in to follow a user.');
            return;
        }

        console.log("Followee Sub:", followeeSub);

        try {
            const response = await axios.post(`${BASE_URL}/api/v1/user/follow`, {
                followerSub: user.sub,
                followeeSub: followeeSub,
            });

            // Check if response status is 200
            if (response.status === 200) {
                setFollowUpdated(prev => !prev); // Similarly, toggle followUpdated2 based on its previous state

                console.log("Follow successful!");
            } else {
                console.error("Failed to follow user. Status:", response.status);
            }
        } catch (error) {
            console.error('Error following user:', error);
        }
    };


    // Follow a user
    const handleunFollow = async (followeeSub) => {
        if (!user) {
            alert('You need to be logged in to follow a user.');
            return;
        }

        console.log("Followee Sub:", followeeSub);

        try {
            const response = await axios.post(`${BASE_URL}/api/v1/user/unfollow`, {
                followerSub: user.sub,
                followeeSub: followeeSub,
            });
            console.log(response)
            // Check if response status is 200
            if (response.status === 200) {
                setFollowUpdated2(prev => !prev); // Similarly, toggle followUpdated2 based on its previous state

                console.log("Follow successful!");
            } else {
                console.error("Failed to follow user. Status:", response.status);
            }
        } catch (error) {
            console.error('Error following user:', error);
        }
    };

    if (!Currentuser) return <Typography>Loading...</Typography>;

    const isCurrentUserProfile = user?.sub === Currentuser.sub;
    const isFollowing = Currentuser.followers.includes(user?.sub);
    console.log(isFollowing)

    return (
        <>
            <Header />
            <ToastContainer />
            <Grid container spacing={3} sx={{ padding: 3, backgroundColor: 'white', color: 'black', minHeight: '100vh' }}>
                {/* Profile Section */}
                <Grid item xs={12} sm={4} sx={{ position: 'sticky', top: 0, zIndex: 1000, backgroundColor: 'white' }}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
                        {/* Profile Avatar and Name */}
                        <Avatar alt={Currentuser.name} src={Currentuser.picture} sx={{ width: 120, height: 120, marginBottom: 2, border: '3px solid #FF0080' }} />
                        <Typography variant="h6" sx={{ marginBottom: 1, fontWeight: 'bold' }}>{Currentuser.name}</Typography>

                        {/* Stats Section: Followers, Following, Likes */}
                        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 4, marginBottom: 1 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }} onClick={handleOpenFollowersModal}>
                                <Typography>
                                    <PeopleIcon sx={{ verticalAlign: 'middle', marginRight: 1 }} />
                                    Takipçiler
                                </Typography>

                                <Typography variant="body1" sx={{ fontWeight: 'bold', marginLeft: 1 }}>
                                    {Currentuser.followers.length}
                                </Typography>
                            </Box>
                            <Box sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer', borderLeft: '2px solidrgb(27, 1, 1)', paddingLeft: 2 }} onClick={handleOpenFollowingModal}>
                                <Typography>
                                    <PeopleIcon sx={{ verticalAlign: 'middle', marginRight: 1 }} />
                                    Takip Edilenler
                                </Typography>

                                <Typography variant="body1" sx={{ fontWeight: 'bold', marginLeft: 1 }}>
                                    {Currentuser.following.length}
                                </Typography>
                            </Box>
                            <Box sx={{ display: 'flex', alignItems: 'center', borderLeft: '2px solidrgb(164, 5, 39)', paddingLeft: 2 }}>
                                <Typography>
                                    <FavoriteIcon sx={{ verticalAlign: 'middle', marginRight: 1 }} />
                                    Beğeniler
                                </Typography>

                                <Typography variant="body1" sx={{ fontWeight: 'bold', marginLeft: 1 }}>
                                    {Currentuser.likeColors.length}
                                </Typography>
                            </Box>
                        </Box>

                        {/* Conditionally Render Buttons */}
                        {isCurrentUserProfile ? (
                            <>
                                <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-start', marginTop: 1 }}>
                                    {/* Edit Profile Button */}
                                    <Button
                                        variant="contained"
                                        onClick={handleOpenEditProfileModal}
                                        sx={{
                                            backgroundColor: '#FF0080',
                                            color: '#FFFFFF',
                                            fontWeight: 'bold',
                                            '&:hover': { backgroundColor: '#E00070' },
                                            flexGrow: 1 // This ensures the button takes up available space if needed
                                        }}
                                    >
                                        Profili Düzenle
                                    </Button>

                                    {/* Share Profile Button */}
                                    <Button
                                        variant="contained"
                                        onClick={handleShareProfile}
                                        sx={{
                                            backgroundColor: '#FF0080',
                                            color: '#FFFFFF',
                                            fontWeight: 'bold',
                                            '&:hover': { backgroundColor: '#E00070' },
                                            flexGrow: 1
                                        }}
                                    >
                                        Profili Paylaş
                                    </Button>
                                </Box>

                            </>

                        ) : (
                            <Box sx={{ marginTop: 1, display: 'flex', gap: 2 }}>
                                {isFollowing ? (
                                    <Button variant="contained" onClick={() => handleunFollow(Currentuser?.sub)}
                                        sx={{ backgroundColor: '#FF0080', color: '#FFFFFF', '&:hover': { backgroundColor: '#E00070' } }}>  Takipten Çık
                                    </Button>
                                ) : (
                                    <Button variant="contained" onClick={() => handleFollow(Currentuser?.sub)}
                                        sx={{ backgroundColor: '#FF0080', color: '#FFFFFF', '&:hover': { backgroundColor: '#E00070' } }}>  Takip Et
                                    </Button>
                                )}

                                <Button
                                    variant="contained"
                                    sx={{
                                        backgroundColor: '#25F4EE',
                                        color: '#000000',
                                        '&:hover': { backgroundColor: '#1ED4D0' }
                                    }}
                                    onClick={handleOpenModal}  // Open modal on button click
                                >
                                    Mesaj
                                </Button>
                            </Box>
                        )}
                    </Box>
                </Grid>

                {/* Tabs and Content Section */}
                <Grid item xs={12} sm={8}>
                    {/* Tabs */}
                    <Tabs value={tabValue} onChange={handleTabChange} centered sx={{ borderBottom: 1, borderColor: 'divider', marginBottom: 2 }}>
                        <Tab label="Videolar" sx={{ color: 'black' }} />
                        {isCurrentUserProfile && <Tab label="Favoriler" sx={{ color: 'black' }} />}
                    </Tabs>


                    {/* Tab Content */}
                    <Box sx={{ padding: 2 }}>
                        {tabValue === 0 && <PvideoList Currentuser={Currentuser} />}
                        {tabValue === 1 && <VideoFavoriteList Currentuser={Currentuser} />}
                    </Box>
                </Grid>
            </Grid>

            {/* Edit Profile Modal */}
            <Dialog open={openEditProfileModal} onClose={handleCloseEditProfileModal}>
                <DialogTitle>Profili Düzenle</DialogTitle>
                <DialogContent>
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <Avatar alt={Currentuser.name} src={avatarPreview || Currentuser.picture} sx={{ width: 120, height: 120, marginBottom: 2 }} />
                        <input type="file" accept="image/*" onChange={handleAvatarChange} />

                        <TextField
                            label="Name"
                            value={Currentuser.name}
                            onChange={(e) => setcurentUser({ ...Currentuser, name: e.target.value })}
                            fullWidth
                            margin="normal"
                        />
                        {/* File Input for Avatar */}
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseEditProfileModal} color="primary">
                        İptal
                    </Button>
                    <Button onClick={handleEditProfileSubmit} color="primary">
                        Güncelle
                    </Button>

                </DialogActions>
            </Dialog>

            {/* Followers Modal */}
            <Dialog open={openFollowersModal} onClose={handleCloseFollowersModal}>
                <DialogTitle>Takipçiler</DialogTitle>
                <DialogContent>
                    <TextField
                        label="Takipçileri Ara"
                        value={searchFollower}
                        onChange={handleSearchFollowerChange}
                        fullWidth
                        margin="normal"
                    />
                    <List>
                        {followersDetails
                            .filter((follower) => follower.name.toLowerCase().includes(searchFollower.toLowerCase()))
                            .map((follower) => (
                                <ListItem key={follower._id}>
                                    <ListItemAvatar>
                                        <Avatar alt={follower.name} sx={{ cursor: 'pointer' }} onClick={() => handleAvatarClick(follower.sub)} src={follower.picture} />
                                    </ListItemAvatar>
                                    <ListItemText primary={follower.name} />
                                    {/* Conditionally render Follow/Unfollow button */}
                                </ListItem>
                            ))}
                    </List>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseFollowersModal} color="primary">
                        Kapat
                    </Button>
                </DialogActions>
            </Dialog>



            {/* Following Modal */}
            <Dialog open={openFollowingModal} onClose={handleCloseFollowingModal}>
                <DialogTitle>Takip Edilenler</DialogTitle>
                <DialogContent>
                    <TextField
                        label="Takip Edilenleri Ara"
                        value={searchFollowing}
                        onChange={handleSearchFollowingChange}
                        fullWidth
                        margin="normal"
                    />
                    <List>
                        {followingDetails
                            .filter((following) => following.name.toLowerCase().includes(searchFollowing.toLowerCase()))
                            .map((following) => (
                                <ListItem key={following._id}>
                                    <ListItemAvatar>
                                        <Avatar alt={following.name} onClick={() => handleAvatarClick(following.sub)} sx={{ cursor: 'pointer' }} src={following.picture} />
                                    </ListItemAvatar>
                                    <ListItemText primary={following.name} />
                                    {/* Conditionally render Follow/Unfollow button */}
                                </ListItem>
                            ))}
                    </List>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseFollowingModal} color="primary">
                        Kapat
                    </Button>
                </DialogActions>
            </Dialog>


            {/* message modal */}

            <Dialog open={openModal} sx={{ borderRadius: 5 }} onClose={handleCloseModal}>
                <DialogTitle sx={{ backgroundColor: 'black', color: 'white' }}>
                    {Currentuser?.name} ile Mesaj Gönder
                </DialogTitle>
                <DialogContent sx={{ backgroundColor: 'black' }}>
                    <ConversationList senderId={user?.sub} recId={Currentuser?.sub} />
                </DialogContent>
                <DialogActions sx={{ backgroundColor: 'black' }}>
                    <Button onClick={handleCloseModal} color="primary">
                        İptal
                    </Button>
                </DialogActions>
            </Dialog>


        </>
    );
};

export default UserProfile;
