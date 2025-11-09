import axios from 'src/utils/axios';
import { API_BASE_URL } from 'src/config';

/**
 * Fetch organizer details using a bearer token.
 * @param token JWT token string (without 'Bearer ')
 */
export const getOrganizerDetails = async (token: string) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/api/v1/organizer/details`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    // The API is expected to return organizer object without password field
    return response.data;
  } catch (err: any) {
    console.error('Error fetching organizer details:', err?.response?.data || err.message);
    throw err?.response?.data || err;
  }
};

export default getOrganizerDetails;
