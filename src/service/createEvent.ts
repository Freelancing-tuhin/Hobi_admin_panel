import axios from 'axios';
import { API_BASE_URL } from 'src/config';

interface InclusionItem {
  id: string;
  text: string;
}

export interface CreateEventPayload {
  title: string;
  category: string;
  type: string;
  eventDates: string[];  // Array of dates
  startTime: string;
  endTime: string;
  location: {
    address: string;
    latitude: number;
    longitude: number;
  };
  description: string;
  bannerImage: File;
  supportingImages?: string[];  // Array of Cloudinary URLs
  isTicketed: boolean;
  tickets?: any;
  inclusions?: InclusionItem[];  // What's included
  exclusions?: InclusionItem[];  // What's not included
  organizerId: string;
}

export const createEvent = async (eventData: CreateEventPayload): Promise<void> => {
  try {
    const formData = new FormData();

    formData.append('title', eventData.title);
    formData.append('category', eventData.category);
    formData.append('type', eventData.type);
    
    // Send dates as JSON array
    formData.append('eventDates', JSON.stringify(eventData.eventDates));
    
    formData.append('startTime', eventData.startTime);
    formData.append('endTime', eventData.endTime);

    formData.append('location[address]', eventData?.location?.address);
    formData.append('location[latitude]', String(eventData.location.latitude));
    formData.append('location[longitude]', String(eventData.location.longitude));

    formData.append('description', eventData.description);
    formData.append('banner_Image', eventData.bannerImage);
    formData.append('isTicketed', String(eventData.isTicketed));

    if (eventData.isTicketed && eventData.tickets) {
      formData.append('tickets', JSON.stringify(eventData.tickets));
    }

    // Send supporting images as JSON array of URLs
    if (eventData.supportingImages && eventData.supportingImages.length > 0) {
      formData.append('supportingImages', JSON.stringify(eventData.supportingImages));
    }

    // Send inclusions as JSON array
    if (eventData.inclusions && eventData.inclusions.length > 0) {
      formData.append('inclusions', JSON.stringify(eventData.inclusions));
    }

    // Send exclusions as JSON array
    if (eventData.exclusions && eventData.exclusions.length > 0) {
      formData.append('exclusions', JSON.stringify(eventData.exclusions));
    }

    formData.append('organizerId', eventData.organizerId);

    const response = await axios.post(`${API_BASE_URL}/api/v1/events/create-event`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    console.log('Event created successfully:', response.data);
  } catch (error) {
    console.error('Error creating event:', error);
  }
};

