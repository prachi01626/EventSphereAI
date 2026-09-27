import React, { createContext, useContext, useState, useEffect } from 'react';
import { eventService } from '../services/eventService';

const EventContext = createContext(null);

export const EventProvider = ({ children }) => {
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [activeTab, setActiveTab] = useState('discovery');
  const [loadingEvents, setLoadingEvents] = useState(false);

  // Modal triggers
  const [isCopilotOpen, setIsCopilotOpen] = useState(false);
  const [isVolunteerModalOpen, setIsVolunteerModalOpen] = useState(false);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [isSentimentModalOpen, setIsSentimentModalOpen] = useState(false);
  const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);
  const [selectedEventForModal, setSelectedEventForModal] = useState(null);

  const fetchEvents = async () => {
    setLoadingEvents(true);
    try {
      const data = await eventService.getEvents();
      setEvents(data);
      if (data.length > 0 && !selectedEvent) {
        setSelectedEvent(data[0]);
      }
    } catch (err) {
      console.error('Failed to load events:', err);
    } finally {
      setLoadingEvents(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const openRegisterModal = (event) => {
    setSelectedEventForModal(event);
    setIsRegisterModalOpen(true);
  };

  const openFeedbackModal = (event) => {
    setSelectedEventForModal(event);
    setIsFeedbackModalOpen(true);
  };

  return (
    <EventContext.Provider
      value={{
        events,
        selectedEvent,
        setSelectedEvent,
        activeTab,
        setActiveTab,
        loadingEvents,
        fetchEvents,
        // Modal states
        isCopilotOpen,
        setIsCopilotOpen,
        isVolunteerModalOpen,
        setIsVolunteerModalOpen,
        isRegisterModalOpen,
        setIsRegisterModalOpen,
        isSentimentModalOpen,
        setIsSentimentModalOpen,
        isFeedbackModalOpen,
        setIsFeedbackModalOpen,
        selectedEventForModal,
        openRegisterModal,
        openFeedbackModal,
      }}
    >
      {children}
    </EventContext.Provider>
  );
};

export const useEvents = () => {
  const context = useContext(EventContext);
  if (!context) {
    throw new Error('useEvents must be used within an EventProvider');
  }
  return context;
};
