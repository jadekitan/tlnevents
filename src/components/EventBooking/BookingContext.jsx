import React, { useState, useEffect } from "react";
import { eventsData } from "../../../server/eventsData";
import { Icon } from "@chakra-ui/react";
import { useParams } from "react-router-dom";

export const multiBookingContext = React.createContext();
const BookingContext = ({ children }) => {
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

  const { eventId } = useParams(); // Get the event ID from the URL
  const event = eventsData[eventId]; // Lookup event from local data

  const [ticketType, setTicketType] = useState(event ? event.tickets : []);

  // Initialize ticket counts from localStorage if available
  const [ticketCounts, setTicketCounts] = useState(() => {
    const storedCounts = JSON.parse(localStorage.getItem("ticketCounts"));
    return (
      storedCounts ||
      ticketType.reduce((acc, ticket) => ({ ...acc, [ticket.id]: 0 }), {})
    );
  });

  // Fee percentage based on the event creator's subscription plan
  const [feePercentage, setFeePercentage] = useState(5); // Default fee percentage is 5%

  const [countryCode, setCountryCode] = useState("+234"); // Default country code (Nigeria)

  const [assignMultiple, setAssignMultiple] = useState(false);

  // Initialize contactData from localStorage or set default values
  const [contactData, setContactData] = useState(() => {
    const storedContactData = localStorage.getItem("contactData");
    return storedContactData
      ? JSON.parse(storedContactData)
      : {
          firstName: "",
          lastName: "",
          email: "",
          phone: "",
          countryCode: "+234", // Set your default country code here
          attendeeAddresses: ticketType.reduce((acc, ticket) => {
            const count = ticketCounts[ticket.id] || 0; // Get the count of tickets or default to 0
            acc[ticket.id] = Array.from({ length: count }).map(() => ({
              firstName: "",
              lastName: "",
              email: "",
            }));
            return acc;
          }, {}),
        };
  });

  // Save contactData to localStorage whenever it updates
  useEffect(() => {
    localStorage.setItem("contactData", JSON.stringify(contactData));
  }, [contactData]);

  // Example function to update contactData
  const handleContactDataChange = (newData) => {
    setContactData((prevData) => ({
      ...prevData,
      ...newData,
    }));
  };

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDisable, setIsDisable] = useState(false);

  return (
    <>
      <multiBookingContext.Provider
        value={{
          currentStep,
          setStep,
          ticketType,
          setTicketType,
          ticketCounts,
          setTicketCounts,
          feePercentage,
          setFeePercentage,
          LeftArrow,
          countryCode,
          setCountryCode,
          contactData,
          setContactData: handleContactDataChange,
          assignMultiple,
          setAssignMultiple,
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
