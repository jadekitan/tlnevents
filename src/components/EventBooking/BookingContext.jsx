import React, { useState, useEffect, useCallback } from "react";
import { eventsData } from "../../../server/eventsData";
import { Icon, useToast } from "@chakra-ui/react";
import { useParams } from "react-router-dom";
import { debounce } from "lodash";

export const multiBookingContext = React.createContext();

const BookingContext = ({ children }) => {
  const { eventId } = useParams();
  const event = eventsData[eventId]; 
  const toast = useToast();

  const [currentStep, setStep] = useState(() => {
    const storedStep = localStorage.getItem("currentStep");
    return storedStep ? parseInt(storedStep, 10) : 1;
  });

  useEffect(() => {
    localStorage.setItem("currentStep", currentStep);
  }, [currentStep]);

  const LeftArrow = (props) => (
    <Icon
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
    >
      <path
        d="M4 11.9998H20"
        stroke="white"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M8.99948 17C8.99948 17 3.99953 13.3176 3.99951 12C3.9995 10.6824 8.99951 7 8.99951 7"
        stroke="white"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Icon>
  );

  const [purchaseType, setPurchaseType] = useState(() => {
    const storedValue = localStorage.getItem("purchaseType");
    return storedValue ? JSON.parse(storedValue) : null;
  });

  useEffect(() => {
    if (purchaseType !== null) {
      localStorage.setItem("purchaseType", JSON.stringify(purchaseType));
    }
  }, [purchaseType]);

  const clearPurchaseType = () => {
    localStorage.removeItem("purchaseType");
    setPurchaseType(null);
  };

  const [ticketType, setTicketType] = useState(event ? event.tickets : []);

  // Initialize counts from local storage or default to 0
  const [ticketCounts, setTicketCounts] = useState(() => {
    const storedCounts = JSON.parse(localStorage.getItem("ticketCounts"));
    return storedCounts || {};
  });

  // --- CRITICAL FIX: Validate Stock vs LocalStorage ---
  // This ensures that if a user has 5 tickets in localStorage, but only 2 are left
  // in the database (eventsData), it clamps the value down to 2.
  useEffect(() => {
    if (event) {
      setTicketType(event.tickets);

      setTicketCounts((prevCounts) => {
        const newCounts = { ...prevCounts };
        let hasChanged = false;

        event.tickets.forEach((ticket) => {
          const currentCount = newCounts[ticket.id] || 0;
          
          // Calculate max available based on stock steps
          const stockAvailable = Math.floor((ticket.quantity || 0) / ticket.step) * ticket.step;
          // The effective limit is the lower of specific maxQuantity OR available stock
          const effectiveMax = Math.min(ticket.maxQuantity * ticket.step, stockAvailable);

          // If current selection exceeds available stock, clamp it
          if (currentCount > effectiveMax) {
            newCounts[ticket.id] = effectiveMax;
            hasChanged = true;
          }
          
          // Ensure we don't have counts for tickets that don't exist
          if (currentCount > 0 && effectiveMax <= 0) {
             newCounts[ticket.id] = 0;
             hasChanged = true;
          }
        });

        if (hasChanged) {
           // Optional: Notify user their cart changed due to stock
           // toast({ title: "Cart Updated", description: "Some items were adjusted due to availability.", status: "info" });
           localStorage.setItem("ticketCounts", JSON.stringify(newCounts));
           return newCounts;
        }
        return prevCounts;
      });
    } else {
      setTicketType([]);
    }
  }, [event]); // Removed 'toast' from deps to avoid loop

  const clearTicketCounts = () => {
    setTicketCounts({});
    localStorage.removeItem("ticketCounts");
  };

  const [feePercentage, setFeePercentage] = useState(event?.percentCharge || 0);

  const [countryCode, setCountryCode] = useState("+234");

  const [assignMultiple, setAssignMultiple] = useState(
    () => JSON.parse(localStorage.getItem("assignMultiple")) || false
  );

  const clearAssignMultiple = () => {
    setAssignMultiple(false);
    localStorage.removeItem("assignMultiple");
  };

  useEffect(() => {
    localStorage.setItem("assignMultiple", JSON.stringify(assignMultiple));
  }, [assignMultiple]);

  const [contactData, setContactData] = useState(() => {
    const storedContactData = localStorage.getItem("contactData");
    return storedContactData
      ? JSON.parse(storedContactData)
      : {
          firstName: "",
          lastName: "",
          email: "",
          phone: "",
          countryCode: "+234",
          attendeeAddresses: {}, // Initialize empty, populate dynamically
        };
  });

  // Debounced Save
  const saveToLocalStorage = useCallback(
    debounce((data) => {
      localStorage.setItem("contactData", JSON.stringify(data));
    }, 300),
    []
  );

  const handleContactDataChange = useCallback(
    (newData) => {
      setContactData((prevData) => {
        const updatedData = { ...prevData, ...newData };
        saveToLocalStorage(updatedData);
        return updatedData;
      });
    },
    [saveToLocalStorage]
  );

  const handleBlur = useCallback(() => {
    saveToLocalStorage(contactData);
  }, [contactData, saveToLocalStorage]);

  useEffect(() => {
    return () => {
      saveToLocalStorage.cancel();
    };
  }, [saveToLocalStorage]);

  const clearContactData = () => {
    const resetData = {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      countryCode: "+234",
      attendeeAddresses: {},
    };
    setContactData(resetData);
    localStorage.removeItem("contactData");
  };

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDisable, setIsDisable] = useState(false);

  return (
    <multiBookingContext.Provider
      value={{
        currentStep,
        setStep,
        purchaseType,
        setPurchaseType,
        ticketType,
        setTicketType,
        ticketCounts,
        setTicketCounts,
        clearTicketCounts,
        feePercentage,
        setFeePercentage,
        LeftArrow,
        countryCode,
        setCountryCode,
        contactData,
        setContactData,
        handleContactDataChange,
        saveToLocalStorage,
        handleBlur,
        clearPurchaseType,
        clearContactData,
        assignMultiple,
        setAssignMultiple,
        clearAssignMultiple,
        isSubmitting,
        setIsSubmitting,
        isDisable,
        setIsDisable,
      }}
    >
      {children}
    </multiBookingContext.Provider>
  );
};

export default BookingContext;