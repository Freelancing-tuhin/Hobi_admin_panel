import axios from 'axios';
import { API_BASE_URL } from 'src/config';

export const updateReviewStatusToAdmin = async (id: string): Promise<void> => {
  try {
    const { data } = await axios.patch(`${API_BASE_URL}/api/v1/reviews/report_review`, null, {
      params: { id },
    });

    console.log('Review status updated:', data.result);
  } catch (error) {
    console.error('Error updating review status:', error);
  }
};
