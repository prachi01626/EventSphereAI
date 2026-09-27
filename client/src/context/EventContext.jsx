import React, { createContext, useContext, useState, useEffect } from 'react';
import { eventService } from '../services/eventService';

const EventContext = createContext(null);

const tabToPath = {
  discovery: '/',
  organizer: '/dashboard/organizer',
  participant: '/dashboard/participant',
  volunteer: '/dashboard/volunteer',
};

const pathToTab = {
  '/': 'discovery',
  '/dashboard/organizer': 'organizer',
  '/dashboard/participant': 'participant',
  '/dashboard/volunteer': 'volunteer',
};

export const EventProvider = ({ children }) => {
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [activeTab, setActiveTabState] = useState('discovery');
  const [loadingEvents, setLoadingEvents] = useState(false);

  // Modal triggers
  const [isCopilotOpen, setIsCopilotOpen] = useState(false);
  const [isVolunteerModalOpen, setIsVolunteerModalOpen] = useState(false);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [isSentimentModalOpen, setIsSentimentModalOpen] = useState(false);
  const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);
  const [selectedEventForModal, setSelectedEventForModal] = useState(null);

  // Sync activeTab with window history & URL
  const setActiveTab = (tab, updateHistory = true) => {
    setActiveTabState(tab);
    if (updateHistory && typeof window !== 'undefined') {
      const targetPath = tabToPath[tab] || '/';
      if (window.location.pathname !== targetPath) {
        window.history.pushState(null, '', targetPath);
      }
    }
  };

  // Navigate to designated portal based on user.role
  const navigateToPortal = (role) => {
    if (role === 'Organizer') {
      setActiveTab('organizer');
    } else if (role === 'Volunteer') {
      setActiveTab('volunteer');
    } else if (role === 'Participant') {
      setActiveTab('participant');
    } else {
      setActiveTab('discovery');
    }
  };

  // Sync initial URL path and popstate events
  useEffect(() => {
    const handlePopState = () => {
      const tab = pathToTab[window.location.pathname] || 'discovery';
      setActiveTabState(tab);
    };

    const currentTab = pathToTab[window.location.pathname] || 'discovery';
    setActiveTabState(currentTab);

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const fetchEvents = async () => {
    setLoadingEvents(true);
    try {
      const data = await eventService.getEvents();
      setEvents(data);
      if (data.length > 0 && !selectedEvent) {
        setSelectedEvent(data[0]);
      }
    } catch (err) {
      console.error('Failed to load events from MongoDB:', err);
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
        navigateToPortal,
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
