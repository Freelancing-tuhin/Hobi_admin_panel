import axios from 'axios';
import { API_BASE_URL } from 'src/config';

export const getOtp = async (phone: string) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/api/v1/auth/get-otp`, {
      phone,
    });

    return response.data;
  } catch (error: any) {
    console.error('Login error:', error.response?.data || error.message);
    throw new Error(error.response?.data?.message || 'Login failed');
  }
};

export const loginOrganizer = async (phone: string) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/api/v1/auth/organizer-login`, {
      phone,
    });

    return response.data;
  } catch (error: any) {
    console.error('Login error:', error.response?.data || error.message);
    throw new Error(error.response?.data?.message || 'Login failed');
  }
};

const API_BASE_URL1 = `${API_BASE_URL}/api/v1/auth`;

export interface OrganizerSignupData {
  full_name: string;
  age: number;
  phone: string;
  email: string;
  gender: string;
  address: string;
  password: string;
  profile_pic: string;
  service_category: string;
}

export const organizerSignup = async (data: OrganizerSignupData) => {
  try {
    const response = await axios.post(`${API_BASE_URL1}/organizer-signup`, data);
    return response.data; // Returns the API response data
  } catch (error: any) {
    throw error.response?.data || 'Signup failed'; // Throws error if signup fails
  }
};

export const updateOrganizerProfile = async (organizerId: string, profileData: any) => {
  try {
    const response = await axios.patch(
      `${API_BASE_URL}/api/v1/organizer/update_profile`,
      profileData,
      {
        params: { organizerId },
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );

    return response.data;
  } catch (error) {
    console.error('Error updating organizer profile:', error);
    throw error;
  }
};
