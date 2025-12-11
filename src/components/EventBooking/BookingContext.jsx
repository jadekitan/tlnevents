import React, { useState, useEffect, useCallback } from "react";
import { eventsData } from "../../../server/eventsData";
import { Icon } from "@chakra-ui/react";
import { useParams } from "react-router-dom";
import { debounce } from "lodash";

export const multiBookingContext = React.createContext();
const BookingContext = ({ children }) => {
  const [currentStep, setStep] = useState(() => {
    const storedStep = localStorage.getItem("currentStep");
    return storedStep ? parseInt(1, 10) : 1;
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
    setPurchaseType(null); // Reset the state to null
  };

  const { eventId } = useParams(); // Get the event ID from the URL
  const event = eventsData[eventId]; // Lookup event from local data

  const [ticketType, setTicketType] = useState(event ? event.tickets : []);

  useEffect(() => {
    if (event) {
      setTicketType(event.tickets);
    } else {
      setTicketType([]); // Clear tickets if no event or purchaseType
    }
  }, [event]);

  // Initialize ticket counts from localStorage if available
  const [ticketCounts, setTicketCounts] = useState(() => {
    const storedCounts = JSON.parse(localStorage.getItem("ticketCounts"));
    return (
      storedCounts ||
      ticketType.reduce((acc, ticket) => ({ ...acc, [ticket.id]: 0 }), {})
    );
  });

  const clearTicketCounts = () => {
    setTicketCounts(
      ticketType.reduce((acc, ticket) => ({ ...acc, [ticket.id]: 0 }), {})
    );
    localStorage.removeItem("ticketCounts");
  };

  // Fee percentage based on the event creator's subscription plan
  const [feePercentage, setFeePercentage] = useState(event.percentCharge); // Default fee percentage is 5%

  const [countryCode, setCountryCode] = useState("+234"); // Default country code (Nigeria)

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

  // Context state for contact data
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
          attendeeAddresses: ticketType.reduce((acc, ticket) => {
            const count = ticketCounts[ticket.id] || 0;
            acc[ticket.id] = Array.from({ length: count }).map(() => ({
              firstName: "",
              lastName: "",
              email: "",
            }));
            return acc;
          }, {}),
        };
  });

  // Debounced localStorage save
  const saveToLocalStorage = useCallback(
    debounce((data) => {
      localStorage.setItem("contactData", JSON.stringify(data));
    }, 300),
    []
  );

  // General contact data change handler
  const handleContactDataChange = useCallback(
    (newData) => {
      setContactData((prevData) => {
        const updatedData = { ...prevData, ...newData };
        requestAnimationFrame(() => {
          saveToLocalStorage(updatedData);
        });
        return updatedData;
      });
    },
    [saveToLocalStorage]
  );

  // Call save on form blur
  const handleBlur = useCallback(() => {
    saveToLocalStorage(contactData);
  }, [contactData, saveToLocalStorage]);

  // Cleanup effect
  useEffect(() => {
    return () => {
      saveToLocalStorage.cancel();
    };
  }, [saveToLocalStorage]);

  const clearContactData = () => {
    setContactData({
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      countryCode: "+234",
      attendeeAddresses: ticketType.reduce((acc, ticket) => {
        const count = ticketCounts[ticket.id] || 0;
        acc[ticket.id] = Array.from({ length: count }).map(() => ({
          firstName: "",
          lastName: "",
          email: "",
        }));
        return acc;
      }, {}),
    });
    localStorage.removeItem("contactData");
  };

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDisable, setIsDisable] = useState(false);

  return (
    <>
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
    </>
  );
};

export default BookingContext;
