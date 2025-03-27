import axios from 'axios';
import { API_BASE_URL } from 'src/config';

const API_BASE_URL1 = `${API_BASE_URL}/api/v1/organizer`;

export const uploadProfilePicture = async (organizerId: string, file: File) => {
  try {
    const formData = new FormData();
    formData.append('profile_pic', file);
    console.log([...formData.entries()]); // Debug: Check form data before sending

    const response = await axios.patch(
      `${API_BASE_URL1}/update_profile_pic?organizerId=${organizerId}`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      },
    );

    console.log('Upload Response:', response.data); // Debug: Log response
    return response.data;
  } catch (error: any) {
    console.error('API Upload Error:', error.response?.data || error.message);
    throw error;
  }
};
