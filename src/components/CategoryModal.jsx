import React, { useState, useEffect } from 'react';
import { Dialog, DialogActions, DialogContent, DialogTitle, Box, Typography, Button, TextField, Slider } from '@mui/material';
import ReactCropper from 'react-easy-crop';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import BASE_URL from '../constant';

const CategoryModal = ({ open, handleClose }) => {
    const [imageFile, setImageFile] = useState(null);
    const [category, setCategory] = useState('');
    const [subcategory, setSubcategory] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [isUploading, setIsUploading] = useState(false);
    const [imageUrl, setImageUrl] = useState(null);
    const [croppedImage, setCroppedImage] = useState(null);
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [croppedArea, setCroppedArea] = useState(null);
    const [imageDimensions, setImageDimensions] = useState({ width: 300, height: 300 });

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            if (!file.type.startsWith('image/')) {
                setErrorMessage('Please select a valid image file.');
                setImageFile(null);
                toast.error('Please select a valid image file.');
            } else {
                setErrorMessage('');
                setImageFile(file);
                setImageUrl(URL.createObjectURL(file));
            }
        }
    };

    const handleCategoryChange = (e) => setCategory(e.target.value);
    const handleSubcategoryChange = (e) => setSubcategory(e.target.value);

    const handleDimensionChange = (e, newValue) => {
        const { name } = e.target;
        setImageDimensions((prev) => {
            const newDimensions = { ...prev, [name]: newValue };
            const newCropArea = {
                x: crop.x,
                y: crop.y,
                width: newDimensions.width,
                height: newDimensions.height,
            };
            setCroppedArea(newCropArea);
            return newDimensions;
        });
    };

    const getCroppedImage = async () => {
        if (!croppedArea || !imageUrl) return;

        const image = new Image();
        image.src = imageUrl;

        image.onload = () => {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            const scaleX = image.naturalWidth / image.width;
            const scaleY = image.naturalHeight / image.height;

            const cropX = croppedArea.x * scaleX;
            const cropY = croppedArea.y * scaleY;
            const cropWidth = croppedArea.width * scaleX;
            const cropHeight = croppedArea.height * scaleY;

            canvas.width = cropWidth;
            canvas.height = cropHeight;

            ctx.drawImage(image, cropX, cropY, cropWidth, cropHeight, 0, 0, cropWidth, cropHeight);

            const croppedImageUrl = canvas.toDataURL('image/png');
            const base64Data = croppedImageUrl.split(',')[1];
            const binaryData = atob(base64Data);
            const arrayBuffer = new ArrayBuffer(binaryData.length);
            const uint8Array = new Uint8Array(arrayBuffer);

            for (let i = 0; i < binaryData.length; i++) {
                uint8Array[i] = binaryData.charCodeAt(i);
            }

            const blob = new Blob([uint8Array], { type: 'image/png' });
            const file = new File([blob], 'cropped-image.png', { type: 'image/png' });

            setCroppedImage(file);
        };
    };

    const handleSave = () => {
        if (!category || !subcategory || !croppedImage) {
            toast.error('Please select an image, crop it, provide a category name, and a subcategory.');
            return;
        }

        getCroppedImage();
        toast.success('Cropped image saved successfully!');
    };

    const handleCreate = async () => {
        if (!category || !subcategory || !croppedImage) {
            toast.error('Please select an image, crop it, and provide both category and subcategory.');
            return;
        }

        setIsUploading(true);
        setErrorMessage('');

        const formData = new FormData();
        formData.append('category', category);
        formData.append('subcategory', subcategory);
        formData.append('image', croppedImage);

        try {
            const response = await axios.post(`${BASE_URL}/api/v1/category/create`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            setIsUploading(false);

            if (response.data && response.data.message) {
                toast.success(response.data.message);
            } else {
                toast.success('Category created successfully!');
            }

            setCroppedImage(null);
            setCategory('');
            setSubcategory('');
            setImageFile(null);

        } catch (error) {
            setIsUploading(false);

            if (error.response && error.response.data && error.response.data.message) {
                toast.error(error.response.data.message);
            } else {
                toast.error('Error creating the category. Please try again.');
            }
        }
    };

    useEffect(() => {
        if (imageUrl && croppedArea) {
            getCroppedImage();
        }
    }, [croppedArea, imageUrl]);

    return (
        <>
            <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
                <DialogTitle align="center">Kategori Oluştur</DialogTitle>
                <DialogContent sx={{ paddingBottom: 2 }}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                        <Box>
                            <Typography variant="h6" align="center">Resim Yükle</Typography>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleFileChange}
                                style={{ display: 'block', margin: '0 auto' }}
                            />
                            {imageUrl && (
                                <Box sx={{ marginTop: 2 }}>
                                    <img
                                        src={imageUrl}
                                        alt="Original"
                                        style={{
                                            width: '100%',
                                            maxHeight: '300px',
                                            objectFit: 'contain',
                                            marginBottom: '16px',
                                        }}
                                    />
                                </Box>
                            )}
                        </Box>

                        {imageUrl && (
                            <Box sx={{ position: 'relative', width: '100%', height: 300 }}>
                                <ReactCropper
                                    image={imageUrl}
                                    crop={crop}
                                    zoom={zoom}
                                    minZoom={1}
                                    maxZoom={3}
                                    aspect={1}
                                    onCropChange={setCrop}
                                    onZoomChange={setZoom}
                                    onCropComplete={(croppedArea, croppedAreaPixels) => {
                                        setCroppedArea(croppedAreaPixels);
                                    }}
                                />
                            </Box>
                        )}

                        {croppedImage && (
                            <Box sx={{ textAlign: 'center' }}>
                                <Typography variant="body2" color="textSecondary" gutterBottom>
                                    Kırpılmış Resim Önizlemesi
                                </Typography>
                                <img
                                    src={URL.createObjectURL(croppedImage)}
                                    alt="Kırpılmış Önizleme"
                                    style={{
                                        width: '100%',
                                        maxHeight: '200px',
                                        objectFit: 'contain',
                                        border: '1px solid #ccc',
                                        marginBottom: '16px',
                                    }}
                                />
                            </Box>
                        )}

                        <TextField
                            label="Kategori Adı"
                            fullWidth
                            value={category}
                            onChange={handleCategoryChange}
                            sx={{ marginBottom: 2 }}
                        />
                        <TextField
                            label="Alt Kategori Adları"
                            fullWidth
                            value={subcategory}
                            onChange={handleSubcategoryChange}
                            sx={{ marginBottom: 2 }}
                        />

                        <Box>
                            <Typography variant="body2" align="center" sx={{ marginBottom: 1 }}>
                                Resim Boyutlarını Ayarla
                            </Typography>
                            <Slider
                                value={imageDimensions.width}
                                onChange={handleDimensionChange}
                                valueLabelDisplay="auto"
                                valueLabelFormat={(value) => `Genişlik: ${value}`}
                                name="width"
                                min={100}
                                max={800}
                                step={10}
                                sx={{ marginBottom: 2 }}
                            />
                            <Slider
                                value={imageDimensions.height}
                                onChange={handleDimensionChange}
                                valueLabelDisplay="auto"
                                valueLabelFormat={(value) => `Yükseklik: ${value}`}
                                name="height"
                                min={100}
                                max={800}
                                step={10}
                            />
                        </Box>

                        {errorMessage && (
                            <Typography variant="body2" color="error" align="center" sx={{ marginBottom: 2 }}>
                                {errorMessage}
                            </Typography>
                        )}
                    </Box>
                </DialogContent>
                <DialogActions sx={{ padding: '8px 24px' }}>
                    <Button variant="contained" onClick={handleSave} color="secondary" fullWidth>
                        Kaydet
                    </Button>
                    <Button
                        variant="contained"
                        onClick={handleCreate}
                        color="primary"
                        fullWidth
                        disabled={isUploading}
                    >
                        {isUploading ? 'Oluşturuluyor...' : 'Kategori Oluştur'}
                    </Button>
                </DialogActions>
            </Dialog>

        </>
    );
};

export default CategoryModal;
