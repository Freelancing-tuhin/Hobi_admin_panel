import { Label } from 'flowbite-react';
import { Icon } from '@iconify/react';
import GooglePlacesAutocomplete, {
  geocodeByPlaceId,
  getLatLng,
} from 'react-google-places-autocomplete';
import CardBox from 'src/components/shared/CardBox';

const LocationDetails = ({ eventData, setEventData }: any) => {
  const handleLocationChange = async (location: any) => {
    if (!location) return;

    try {
      const placeId = location.value.place_id;
      const results = await geocodeByPlaceId(placeId);
      const { lat, lng } = await getLatLng(results[0]);
      const formattedAddress = results[0].formatted_address;

      setEventData({
        ...eventData,
        location: {
          address: formattedAddress,
          latitude: lat,
          longitude: lng,
        },
      });

      console.log('Selected Location:', { formattedAddress, lat, lng });
    } catch (error) {
      console.error('Error fetching location details:', error);
    }
  };

  return (
    <CardBox>
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
          <Icon icon="tabler:map-pin" className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h5 className="text-lg font-semibold text-dark dark:text-white">Location Details</h5>
          <p className="text-xs text-gray-500 dark:text-gray-400">Where will your event take place?</p>
        </div>
      </div>

      {/* Location Search */}
      <div className="mb-6">
        <Label className="font-medium text-sm text-gray-700 dark:text-gray-300 mb-2 block">
          Search Location <span className="text-error">*</span>
        </Label>
        <div className="relative">
          <div className="[&_.css-13cymwt-control]:rounded-xl [&_.css-13cymwt-control]:border-2 [&_.css-13cymwt-control]:border-gray-200 [&_.css-13cymwt-control]:py-1 [&_.css-t3ipsp-control]:rounded-xl [&_.css-t3ipsp-control]:border-2 [&_.css-t3ipsp-control]:border-primary [&_.css-t3ipsp-control]:shadow-none [&_.css-t3ipsp-control]:py-1">
            <GooglePlacesAutocomplete
              selectProps={{
                value: eventData.location?.address ? { label: eventData.location.address, value: eventData.location.address } : null,
                onChange: handleLocationChange,
                placeholder: 'Search for a location...',
                isClearable: true,
                styles: {
                  control: (base: any) => ({
                    ...base,
                    minHeight: '48px',
                    borderRadius: '12px',
                    borderWidth: '2px',
                  }),
                  placeholder: (base: any) => ({
                    ...base,
                    color: '#9ca3af',
                  }),
                },
              }}
            />
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
            Start typing to search for venues, addresses, or landmarks
          </p>
        </div>
      </div>

      {/* Selected Location Display */}
      {eventData.location?.address && (
        <div className="p-4 bg-primary/5 rounded-xl border-2 border-primary/20">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center flex-shrink-0">
              <Icon icon="tabler:map-pin-filled" className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-primary mb-1">Selected Location</p>
              <p className="text-sm font-medium text-gray-900 dark:text-white break-words">
                {eventData.location.address}
              </p>
              {eventData.location.latitude && eventData.location.longitude && (
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 flex items-center gap-1">
                  <Icon icon="tabler:current-location" className="w-3 h-3" />
                  {eventData.location.latitude.toFixed(4)}, {eventData.location.longitude.toFixed(4)}
                </p>
              )}
            </div>
            <button
              type="button"
              onClick={() => setEventData({ ...eventData, location: { address: '', latitude: 0, longitude: 0 } })}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <Icon icon="tabler:x" className="w-4 h-4 text-gray-400" />
            </button>
          </div>
        </div>
      )}

      {/* Empty State */}
      {!eventData.location?.address && (
        <div className="p-6 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-xl text-center">
          <div className="w-12 h-12 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center mx-auto mb-3">
            <Icon icon="tabler:map-search" className="w-6 h-6 text-gray-400" />
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            No location selected yet
          </p>
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
            Use the search above to find your venue
          </p>
        </div>
      )}
    </CardBox>
  );
};

export default LocationDetails;
