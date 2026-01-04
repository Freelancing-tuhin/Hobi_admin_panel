import { Label, Radio } from 'flowbite-react';
import { Icon } from '@iconify/react';
import CardBox from 'src/components/shared/CardBox';
import { useState } from 'react';

// Custom Calendar Component with Multi-Select Support
const CustomCalendar = ({
  selectedDates,
  onDateSelect,
  multiSelect = false
}: {
  selectedDates: string[];
  onDateSelect: (dates: string[]) => void;
  multiSelect?: boolean;
}) => {
  const [currentMonth, setCurrentMonth] = useState(
    selectedDates.length > 0 ? new Date(selectedDates[0]) : new Date()
  );

  const daysInMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1).getDay();

  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const prevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };

  const handleDateClick = (day: number) => {
    const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    const formattedDate = date.toISOString().split('T')[0];

    if (multiSelect) {
      // Toggle date selection for recurring activities
      if (selectedDates.includes(formattedDate)) {
        onDateSelect(selectedDates.filter(d => d !== formattedDate));
      } else {
        onDateSelect([...selectedDates, formattedDate].sort());
      }
    } else {
      // Single selection for single activities
      onDateSelect([formattedDate]);
    }
  };

  const isSelected = (day: number) => {
    const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    const formattedDate = date.toISOString().split('T')[0];
    return selectedDates.includes(formattedDate);
  };

  const isToday = (day: number) => {
    const today = new Date();
    return (
      day === today.getDate() &&
      currentMonth.getMonth() === today.getMonth() &&
      currentMonth.getFullYear() === today.getFullYear()
    );
  };

  const isPast = (day: number) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    return date < today;
  };

  const days = [];
  for (let i = 0; i < firstDayOfMonth; i++) {
    days.push(<div key={`empty-${i}`} className="h-10" />);
  }
  for (let day = 1; day <= daysInMonth; day++) {
    const past = isPast(day);
    days.push(
      <button
        key={day}
        type="button"
        onClick={() => !past && handleDateClick(day)}
        disabled={past}
        className={`h-10 w-10 rounded-full flex items-center justify-center text-sm font-medium transition-all duration-200
          ${isSelected(day)
            ? 'bg-primary text-white'
            : isToday(day)
              ? 'bg-primary/10 text-primary'
              : past
                ? 'text-gray-300 dark:text-gray-600 cursor-not-allowed'
                : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'
          }`}
      >
        {day}
      </button>
    );
  }

  return (
    <div className="p-4">
      {/* Multi-select hint */}
      {multiSelect && (
        <div className="mb-4 p-3 bg-primary/5 border border-primary/20 rounded-xl">
          <div className="flex items-center gap-2 text-sm text-primary">
            <Icon icon="tabler:info-circle" className="w-4 h-4" />
            <span>Tap on multiple dates to select them</span>
          </div>
        </div>
      )}

      {/* Month Navigation */}
      <div className="flex items-center justify-between mb-4">
        <button
          type="button"
          onClick={prevMonth}
          className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
        >
          <Icon icon="tabler:chevron-left" className="w-5 h-5 text-gray-600 dark:text-gray-400" />
        </button>
        <h3 className="font-semibold text-gray-900 dark:text-white">
          {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
        </h3>
        <button
          type="button"
          onClick={nextMonth}
          className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
        >
          <Icon icon="tabler:chevron-right" className="w-5 h-5 text-gray-600 dark:text-gray-400" />
        </button>
      </div>

      {/* Day Names */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {dayNames.map((day) => (
          <div key={day} className="h-10 flex items-center justify-center text-xs font-medium text-gray-500 dark:text-gray-400">
            {day}
          </div>
        ))}
      </div>

      {/* Days Grid */}
      <div className="grid grid-cols-7 gap-1">{days}</div>

      {/* Selected Dates Display for Multi-Select */}
      {multiSelect && selectedDates.length > 0 && (
        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
          <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Selected Dates ({selectedDates.length})
          </p>
          <div className="flex flex-wrap gap-2">
            {selectedDates.map((date) => (
              <span
                key={date}
                className="inline-flex items-center gap-1 px-2 py-1 bg-primary/10 text-primary rounded-lg text-xs font-medium"
              >
                {new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                <button
                  type="button"
                  onClick={() => onDateSelect(selectedDates.filter(d => d !== date))}
                  className="hover:text-red-500 transition-colors"
                >
                  <Icon icon="tabler:x" className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// Time Picker Component
const TimePicker = ({ label, value, onChange, icon }: { label: string; value: string; onChange: (time: string) => void; icon: string }) => {
  const hours = Array.from({ length: 12 }, (_, i) => (i + 1).toString().padStart(2, '0'));
  const minutes = ['00', '15', '30', '45'];

  const parseTime = (timeStr: string) => {
    if (!timeStr) return { hour: '12', minute: '00', period: 'AM' };
    const [h, m] = timeStr.split(':');
    const hour24 = parseInt(h);
    const period = hour24 >= 12 ? 'PM' : 'AM';
    const hour12 = hour24 === 0 ? 12 : hour24 > 12 ? hour24 - 12 : hour24;
    return { hour: hour12.toString().padStart(2, '0'), minute: m, period };
  };

  const { hour, minute, period } = parseTime(value);

  const handleChange = (newHour: string, newMinute: string, newPeriod: string) => {
    let hour24 = parseInt(newHour);
    if (newPeriod === 'PM' && hour24 !== 12) hour24 += 12;
    if (newPeriod === 'AM' && hour24 === 12) hour24 = 0;
    const timeStr = `${hour24.toString().padStart(2, '0')}:${newMinute}`;
    onChange(timeStr);
  };

  return (
    <div className="p-4">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
          <Icon icon={icon} className="w-4 h-4 text-primary" />
        </div>
        <span className="font-semibold text-gray-900 dark:text-white">{label}</span>
      </div>

      <div className="flex items-center gap-2">
        {/* Hour */}
        <div className="flex-1">
          <select
            value={hour}
            onChange={(e) => handleChange(e.target.value, minute, period)}
            className="w-full p-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-center font-semibold text-lg focus:border-primary focus:ring-1 focus:ring-primary"
          >
            {hours.map((h) => (
              <option key={h} value={h}>{h}</option>
            ))}
          </select>
        </div>

        <span className="text-2xl font-bold text-gray-300">:</span>

        {/* Minute */}
        <div className="flex-1">
          <select
            value={minute}
            onChange={(e) => handleChange(hour, e.target.value, period)}
            className="w-full p-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-center font-semibold text-lg focus:border-primary focus:ring-1 focus:ring-primary"
          >
            {minutes.map((m) => (
              <option key={m} value={m}>{m}</option>
            ))}
          </select>
        </div>

        {/* AM/PM */}
        <div className="flex rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700">
          <button
            type="button"
            onClick={() => handleChange(hour, minute, 'AM')}
            className={`px-4 py-3 text-sm font-semibold transition-colors ${period === 'AM'
              ? 'bg-primary text-white'
              : 'bg-white dark:bg-gray-800 text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-700'
              }`}
          >
            AM
          </button>
          <button
            type="button"
            onClick={() => handleChange(hour, minute, 'PM')}
            className={`px-4 py-3 text-sm font-semibold transition-colors ${period === 'PM'
              ? 'bg-primary text-white'
              : 'bg-white dark:bg-gray-800 text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-700'
              }`}
          >
            PM
          </button>
        </div>
      </div>
    </div>
  );
};

const ActivityDetails = ({ eventData, setEventData }: any) => {
  const [drawerMode, setDrawerMode] = useState<'calendar' | 'time' | null>(null);

  const handleRadioChange = (event: { target: { value: string } }) => {
    const newType = event.target.value;
    setEventData({
      ...eventData,
      type: newType,
      // Reset dates when switching type
      eventDates: []
    });
  };

  const handleDateSelect = (dates: string[]) => {
    setEventData({ ...eventData, eventDates: dates });
  };

  const handleStartTimeChange = (time: string) => {
    setEventData({ ...eventData, startTime: time });
  };

  const handleEndTimeChange = (time: string) => {
    setEventData({ ...eventData, endTime: time });
  };

  const formatDisplayDate = (dates: string[]) => {
    if (!dates || dates.length === 0) return 'Select date';
    if (dates.length === 1) {
      const date = new Date(dates[0]);
      return date.toLocaleDateString('en-US', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' });
    }
    return `${dates.length} dates selected`;
  };

  const formatDisplayTime = (timeStr: string) => {
    if (!timeStr) return '--:--';
    const [h, m] = timeStr.split(':');
    const hour24 = parseInt(h);
    const period = hour24 >= 12 ? 'PM' : 'AM';
    const hour12 = hour24 === 0 ? 12 : hour24 > 12 ? hour24 - 12 : hour24;
    return `${hour12}:${m} ${period}`;
  };

  const closeDrawer = () => setDrawerMode(null);

  const isRecurring = eventData.type === 'Recurring';

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Card - Activity Type */}
        <CardBox>
          <div className="flex items-center gap-3 -mt-5 mb-6">
            <div className="w-12 h-12 rounded-2xl bg-[#f8e8ec] flex items-center justify-center">
              <Icon icon="tabler:category" className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h5 className="text-lg font-semibold text-dark dark:text-white">Activity Type</h5>
              <p className="text-xs text-gray-500 dark:text-gray-400">Choose event frequency</p>
            </div>
          </div>

          <div className="space-y-3">
            <label
              htmlFor="single-activity"
              className={`relative flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 ${eventData.type === 'Single'
                ? 'border-primary bg-primary/5 shadow-sm'
                : 'border-gray-200 dark:border-gray-700 hover:border-primary/50 hover:bg-gray-50 dark:hover:bg-gray-800'
                }`}
            >
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${eventData.type === 'Single' ? 'bg-primary text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-500'}`}>
                <Icon icon="tabler:calendar" className="w-6 h-6" />
              </div>
              <div className="flex-1">
                <span className="font-semibold text-dark dark:text-white">Single Activity</span>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">One-time event</p>
              </div>
              <Radio id="single-activity" name="type" value="Single" checked={eventData.type === 'Single'} onChange={handleRadioChange} className="sr-only" />
            </label>

            <label
              htmlFor="recurring-activity"
              className={`relative flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 ${eventData.type === 'Recurring'
                ? 'border-primary bg-primary/5 shadow-sm'
                : 'border-gray-200 dark:border-gray-700 hover:border-primary/50 hover:bg-gray-50 dark:hover:bg-gray-800'
                }`}
            >
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${eventData.type === 'Recurring' ? 'bg-primary text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-500'}`}>
                <Icon icon="tabler:repeat" className="w-6 h-6" />
              </div>
              <div className="flex-1">
                <span className="font-semibold text-dark dark:text-white">Recurring Activity</span>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Select multiple dates</p>
              </div>
              <Radio id="recurring-activity" name="type" value="Recurring" checked={eventData.type === 'Recurring'} onChange={handleRadioChange} className="sr-only" />
            </label>
          </div>
        </CardBox>

        {/* Right Card - Date & Time */}
        <CardBox>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-2xl bg-[#f8e8ec] flex items-center justify-center">
              <Icon icon="tabler:calendar-event" className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h5 className="text-lg font-semibold text-dark dark:text-white">Event Schedule</h5>
              <p className="text-xs text-gray-500 dark:text-gray-400">Set date and time</p>
            </div>
          </div>

          {/* Date - Opens Calendar Drawer */}
          <div className="mb-5">
            <Label className="font-medium text-sm text-gray-700 dark:text-gray-300 mb-2 block">
              {isRecurring ? 'Event Dates' : 'Event Date'} <span className="text-error">*</span>
            </Label>
            <button
              type="button"
              onClick={() => setDrawerMode('calendar')}
              className="w-full flex items-center justify-between p-4 rounded-xl border-2 border-gray-200 dark:border-gray-700 hover:border-primary transition-all bg-white dark:bg-gray-800"
            >
              <div className="flex items-center gap-3">
                <Icon icon={isRecurring ? "tabler:calendar-plus" : "tabler:calendar"} className="w-5 h-5 text-primary" />
                <span className={eventData.eventDates?.length > 0 ? 'text-gray-900 dark:text-white font-medium' : 'text-gray-400'}>
                  {formatDisplayDate(eventData.eventDates || [])}
                </span>
              </div>
              <div className="flex items-center gap-2">
                {isRecurring && eventData.eventDates?.length > 0 && (
                  <span className="px-2 py-1 bg-primary/10 text-primary text-xs font-medium rounded-full">
                    {eventData.eventDates.length}
                  </span>
                )}
                <Icon icon="tabler:chevron-right" className="w-5 h-5 text-gray-400" />
              </div>
            </button>

            {/* Show selected dates chips for recurring */}
            {isRecurring && eventData.eventDates?.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-2">
                {eventData.eventDates.slice(0, 3).map((date: string) => (
                  <span
                    key={date}
                    className="inline-flex items-center gap-1 px-2 py-1 bg-primary/10 text-primary rounded-lg text-xs font-medium"
                  >
                    {new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </span>
                ))}
                {eventData.eventDates.length > 3 && (
                  <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-lg text-xs font-medium">
                    +{eventData.eventDates.length - 3} more
                  </span>
                )}
              </div>
            )}
          </div>

          {/* Times - Opens Time Drawer */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="font-medium text-sm text-gray-700 dark:text-gray-300 mb-2 block">
                Start Time <span className="text-error">*</span>
              </Label>
              <button
                type="button"
                onClick={() => setDrawerMode('time')}
                className="w-full flex items-center gap-3 p-4 rounded-xl border-2 border-gray-200 dark:border-gray-700 hover:border-primary transition-all bg-white dark:bg-gray-800"
              >
                <Icon icon="tabler:clock" className="w-5 h-5 text-primary" />
                <span className={eventData.startTime ? 'text-gray-900 dark:text-white font-medium' : 'text-gray-400'}>
                  {formatDisplayTime(eventData.startTime)}
                </span>
              </button>
            </div>
            <div>
              <Label className="font-medium text-sm text-gray-700 dark:text-gray-300 mb-2 block">
                End Time <span className="text-error">*</span>
              </Label>
              <button
                type="button"
                onClick={() => setDrawerMode('time')}
                className="w-full flex items-center gap-3 p-4 rounded-xl border-2 border-gray-200 dark:border-gray-700 hover:border-primary transition-all bg-white dark:bg-gray-800"
              >
                <Icon icon="tabler:clock-off" className="w-5 h-5 text-primary" />
                <span className={eventData.endTime ? 'text-gray-900 dark:text-white font-medium' : 'text-gray-400'}>
                  {formatDisplayTime(eventData.endTime)}
                </span>
              </button>
            </div>
          </div>

        </CardBox>
      </div>

      {/* Drawer */}
      {drawerMode && (
        <>
          <div className="fixed inset-0 bg-black/50 z-50" onClick={closeDrawer} />
          <div className="fixed top-0 right-0 h-full w-full max-w-md bg-white dark:bg-darkgray z-50 shadow-2xl overflow-y-auto">
            {/* Header */}
            <div className="sticky top-0 bg-white dark:bg-darkgray border-b border-gray-200 dark:border-gray-700 p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-[#f8e8ec] flex items-center justify-center">
                  <Icon icon={drawerMode === 'calendar' ? 'tabler:calendar' : 'tabler:clock'} className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">
                    {drawerMode === 'calendar'
                      ? isRecurring ? 'Select Dates' : 'Select Date'
                      : 'Set Time'}
                  </h3>
                  <p className="text-xs text-gray-500">
                    {drawerMode === 'calendar'
                      ? isRecurring ? 'Tap to select multiple dates' : 'Choose event date'
                      : 'Set start and end time'}
                  </p>
                </div>
              </div>
              <button type="button" onClick={closeDrawer} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">
                <Icon icon="tabler:x" className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            {/* Content */}
            {drawerMode === 'calendar' ? (
              <CustomCalendar
                selectedDates={eventData.eventDates || []}
                onDateSelect={handleDateSelect}
                multiSelect={isRecurring}
              />
            ) : (
              <div className="divide-y divide-gray-200 dark:divide-gray-700">
                <TimePicker label="Start Time" value={eventData.startTime} onChange={handleStartTimeChange} icon="tabler:clock" />
                <TimePicker label="End Time" value={eventData.endTime} onChange={handleEndTimeChange} icon="tabler:clock-off" />
              </div>
            )}

            {/* Footer */}
            <div className="sticky bottom-0 bg-white dark:bg-darkgray border-t border-gray-200 dark:border-gray-700 p-4">
              <button
                type="button"
                onClick={closeDrawer}
                className="w-full py-3 bg-primary text-white font-medium rounded-xl hover:bg-primary/90 transition-colors flex items-center justify-center gap-2"
              >
                <Icon icon="tabler:check" className="w-5 h-5" />
                Done
              </button>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default ActivityDetails;
