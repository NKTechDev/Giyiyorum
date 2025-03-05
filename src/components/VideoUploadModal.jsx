import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Modal, Box, Typography, Button, TextField, CircularProgress, FormControlLabel, Checkbox, Autocomplete } from '@mui/material';
import axios from 'axios';
import { useAuth0 } from '@auth0/auth0-react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import BASE_URL from '../constant';

const VideoUploadModal = ({ open, handleClose }) => {
  const [videoFile, setVideoFile] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [category, setCategory] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [videoPreviewURL, setVideoPreviewURL] = useState(null);
  const { user } = useAuth0();
  const videoInputRef = useRef(null);

  const [categories, setCategories] = useState([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);

  // Fetch categories only when the modal is opened
  useEffect(() => {
    if (open) {
      fetchCategories();
    }
  }, [open]);

  const fetchCategories = useCallback(async () => {
    try {
      const response = await axios.get(`${BASE_URL}/api/v1/category`);
      setCategories(response.data.categories);
      setCategoriesLoading(false);
    } catch (err) {
      console.error('Error fetching categories:', err);
      setCategoriesLoading(false);
    }
  }, []);

  // Handle the file change
  const handleFileChange = useCallback((event) => {
    const file = event.target.files[0];
    if (!file) return;

    const validTypes = ['video/mp4'];
    if (!validTypes.includes(file.type)) {
      setErrorMessage('Invalid file type. Please select a valid video file.');
      setVideoFile(null);
      setVideoPreviewURL(null);
    } else if (file.size > 25 * 1024 * 1024) {
      setErrorMessage('File size exceeds 25 MB. Please select a smaller file.');
      setVideoFile(null);
      setVideoPreviewURL(null);
    } else {
      setErrorMessage('');
      setVideoFile(file);

      // Revoke previous preview URL
      if (videoPreviewURL) {
        URL.revokeObjectURL(videoPreviewURL);
      }

      // Set new preview URL
      const videoURL = URL.createObjectURL(file);
      setVideoPreviewURL(videoURL);
    }
  }, [videoPreviewURL]);

  const handleCategoryChange = (event, newCategory) => {
    setCategory(newCategory);
  };

  const handleUpload = async () => {
    if (!category || !videoFile || !title) {
      toast.error('Please fill in all required fields: Title, Category, and Video.');
      return;
    }

    toast.dismiss();
    setIsUploading(true);

    const formData = new FormData();
    formData.append('video', videoFile);
    formData.append('category', category.name);
    formData.append('title', title);
    formData.append('description', description);
    formData.append('sub', user.sub);

    try {
      const response = await axios.post(`${BASE_URL}/api/v1/video/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      console.log('Video uploaded successfully:', response);

      toast.success('Video uploaded successfully!');
      resetForm();
    } catch (error) {
      console.error('Error uploading video:', error);

      // Handle error in network request
      if (error.response) {
        toast.error(`Error: ${error.response?.data?.message || 'Something went wrong.'}`);
      } else {
        toast.error('Network Error: No response received from the server.');
      }
    } finally {
      setIsUploading(false);
    }
  };

  const resetForm = () => {
    setVideoFile(null);
    setTitle('');
    setCategory(null);
    setDescription('');
    setVideoPreviewURL(null);
  };

  const handleRemoveVideo = () => {
    if (videoPreviewURL) {
      URL.revokeObjectURL(videoPreviewURL);
    }
    setVideoPreviewURL(null);
    setVideoFile(null);
    if (videoInputRef.current) {
      videoInputRef.current.value = ''; // Clear file input field
    }
  };

  return (
    <>
      <ToastContainer position="top-center" autoClose={3000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />

      <Modal open={open} onClose={handleClose}>
        <Box sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          backgroundColor: 'white',
          padding: 4,
          borderRadius: 2,
          boxShadow: 24,
          minWidth: 400,
          maxWidth: 600,
          maxHeight: '100vh',
          overflowY: 'auto',
          width: '90%',
        }}>
          <Typography variant="h6" gutterBottom align="center">Video Yükle</Typography>

          <TextField
            label="Başlık"
            fullWidth
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            sx={{ marginBottom: 2 }}
          />


          <Box sx={{ marginBottom: 2 }}>
            <Typography variant="body2" color="textSecondary" align="center">
              Lütfen bir video dosyası seçin (Maks. boyut: 25 MB, Maks. süre: 1 dakika)
            </Typography>

            <input
              ref={videoInputRef}
              type="file"
              accept="video/*"
              onChange={handleFileChange}
              style={{ marginBottom: '16px', width: '100%' }}
            />
          </Box>

          {errorMessage && (
            <Typography variant="body2" color="error" align="center" sx={{ marginBottom: 2 }}>
              {errorMessage}
            </Typography>
          )}

          {videoPreviewURL && (
            <Box sx={{ marginBottom: 2 }}>
              <video width="100%" height="auto" style={{ maxHeight: '300px', objectFit: 'cover' }} controls>
                <source src={videoPreviewURL} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
              <Button variant="outlined" color="error" onClick={handleRemoveVideo} fullWidth sx={{ marginTop: 2 }}>
                Videoyu Kaldır
              </Button>

            </Box>
          )}

          <Autocomplete
            value={category}
            onChange={handleCategoryChange}
            options={categories}
            getOptionLabel={(option) => option.name}
            isOptionEqualToValue={(option, value) => option._id === value._id}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Category"
                fullWidth
                variant="outlined"
                sx={{ marginBottom: 2 }}
              />
            )}
          />

          <TextField
            label="Açıklama (Opsiyonel)"
            fullWidth
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            sx={{ marginBottom: 2 }}
            multiline
            rows={4}
          />


           {/* Checkbox for accepting privacy policy */}
      <FormControlLabel
        control={
          <Checkbox
           
            name="acceptPrivacyPolicy"
            color="primary"
          />
        }
        label={
          <Typography variant="body2" color="textSecondary">
            Gizlilik ve kullanım şartlarını kabul ediyorum
          </Typography>
        }
      />


          <Box sx={{ marginTop: 2, textAlign: 'center' }}>
            {isUploading ? (
              <CircularProgress />
            ) : (
              <Button variant="contained" onClick={handleUpload} color="primary" fullWidth>
                Video Yükle
              </Button>

            )}
          </Box>
        </Box>
      </Modal>
    </>
  );
};

export default VideoUploadModal; 