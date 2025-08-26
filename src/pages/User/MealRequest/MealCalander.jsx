import React, { useState, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import '../../css/MealCalendar.css';
import Popup from '../../../components/Calendar/popup';
import DeletePopup from '../../../components/Calendar/DeletePopup';
import axios from 'axios';
import UserLayout from '../../../layouts/User/UserLayout';
import { BASE_URLS } from '../../../services/api/config';
import { getAuthHeader } from '../../../utils/authHeader';
import { toast } from 'react-toastify';
import { useUser } from '../../../contexts/UserContext';
import { decodeToken } from '../../../contexts/UserContext';

function MealCalendar() {
  // State variables
  const [popupOpen, setPopupOpen] = useState(false);
  const [deletePopupOpen, setDeletePopupOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [eventData, setEventData] = useState([]);

  const today = new Date().toISOString().split('T')[0]; // Current date in YYYY-MM-DD

  useEffect(() => {
    fetchEvents(); // Fetch existing meal events on mount
  }, []);

  // Get user id from context
  const { userData } = useUser();
  // Fallback: decode token directly if userData.id is undefined
  let userId = userData.id;
  if (!userId) {
    const decoded = decodeToken();
    userId = decoded?.id;
    console.log('MealCalander fallback decoded userId:', userId);
  } else {
    console.log('MealCalander userId:', userId);
  }

  // Fetch meal events from backend
  const fetchEvents = async () => {
    try {
      if (!userId) return;
      const response = await axios.get(
        `${BASE_URLS.calendar}/mealevents/${userId}`,
        { headers: { ...getAuthHeader() } },
      );
      const formattedEvents = response.data.map((event) => ({
        id: event.requestedmeal_id,
        title: `${event.mealtime_name} - ${event.mealtype_name}`,
        start: event.meal_request_date,
        end: event.meal_request_date,
        meal_time_id: event.mealtime_id,
        meal_type_id: event.mealtype_id,
        meal_time_name: event.mealtime_name,
        meal_type_name: event.mealtype_name,
      }));
      setEventData(formattedEvents);
    } catch (error) {
      console.error('Error fetching events:', error);
      toast.error('Error fetching events');
    }
  };

  // Check if a date is in the past (disables clicks)
  const isPastDate = (date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date <= today;
  };

  // When a user clicks on a calendar day
  const dayClickAction = (info) => {
    if (!isPastDate(info.date)) {
      setSelectedDate(info.dateStr);
      setPopupOpen(true);
    }
  };

  // Add new meal event
  const handleAddEvent = async (
    mealTimeId,
    mealTypeId,
    mealTimeName,
    mealTypeName,
  ) => {
    try {
      if (!userId) throw new Error('User ID not found');

      // Check if the user already has a meal event for this date and meal time
      const duplicate = eventData.some(
        (event) =>
          event.start === selectedDate && event.meal_time_id === mealTimeId,
      );
      if (duplicate) {
        toast.error(
          'You already have a meal event for this meal time on the selected date.',
        );
        return;
      }

      const response = await axios.post(
        `${BASE_URLS.calendar}/mealevents/add`,
        {
          mealtime_id: mealTimeId,
          mealtype_id: mealTypeId,
          user_id: parseInt(userId),
          submitted_date: today,
          meal_request_date: selectedDate,
        },
        { headers: { ...getAuthHeader() } },
      );

      if (response.status !== 200 && response.status !== 201) {
        throw new Error(`Failed to add event: ${response.status}`);
      }

      // Add new event to calendar
      const newEvent = {
        id: response.data.id,
        title: `${mealTimeName} - ${mealTypeName}`,
        start: selectedDate,
        end: selectedDate,
        meal_time_id: mealTimeId,
        meal_type_id: mealTypeId,
        meal_time_name: mealTimeName,
        meal_type_name: mealTypeName,
      };

      setEventData((prevEvents) => [...prevEvents, newEvent]);
      setPopupOpen(false);
      await fetchEvents(); // Refresh calendar after adding
      toast.success('Event added successfully!');
    } catch (error) {
      console.error('Error adding event:', error);
      toast.error(`Error: ${error.message}`);
    }
  };

  // Delete selected meal event
  const handleDeleteEvent = async (eventId) => {
    if (!eventId) {
      toast.error('Invalid event ID. Cannot delete event.');
      console.error('Attempted to delete event with undefined ID.');
      return;
    }
    try {
      await axios.delete(`${BASE_URLS.calendar}/mealevents/${eventId}`, {
        headers: { ...getAuthHeader() },
      });
      setDeletePopupOpen(false);
      await fetchEvents(); // Refresh calendar after deletion
      toast.success('Event deleted successfully!');
    } catch (error) {
      console.error('Error deleting event:', error);
      toast.error('Error deleting event');
    }
  };

  // When a user clicks an event in the calendar
  const handleEventClick = (info) => {
    if (!isPastDate(info.event.start)) {
      setSelectedEvent(info.event);
      setDeletePopupOpen(true);
    }
  };

  // Check if a specific meal time is already selected for the selected date
  const isMealSelected = (mealTimeId) => {
    return eventData.some(
      (event) =>
        event.start === selectedDate && event.meal_time_id === mealTimeId,
    );
  };

  return (
    <UserLayout>
      <div className="min-h-screen space-y-3 p-2">
        <h1 className="text-2xl font-semibold">Meal Calendar</h1>

        {/* FullCalendar setup */}
        <FullCalendar
          plugins={[dayGridPlugin, interactionPlugin]}
          height="80vh"
          headerToolbar={{
            left: 'prev,next',
            center: 'title',
            right: 'today',
          }}
          dateClick={dayClickAction}
          events={eventData}
          eventClick={handleEventClick}
          dayCellClassNames={(arg) =>
            isPastDate(arg.date) ? 'fc-day-disabled' : ''
          }
        />

        {/* Popup to add event */}
        <Popup
          open={popupOpen}
          handleClose={() => setPopupOpen(false)}
          selectedDate={selectedDate}
          onAddEvent={handleAddEvent}
          isMealSelected={isMealSelected}
        />

        {/* Popup to delete event */}
        <DeletePopup
          open={deletePopupOpen}
          handleClose={() => setDeletePopupOpen(false)}
          onDelete={() => selectedEvent && handleDeleteEvent(selectedEvent.id)}
          eventTitle={selectedEvent ? selectedEvent.title : ''}
        />
      </div>
    </UserLayout>
  );
}

export default MealCalendar;
