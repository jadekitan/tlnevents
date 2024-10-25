import React, { useEffect } from "react";
import {
  VStack,
  Flex,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  Text,
  Stack,
  Box,
  Image,
  Button,
  Heading,
  useToast,
  AspectRatio,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
} from "@chakra-ui/react";
import { eventsData } from "../../server/eventsData";
import { format, parseISO } from "date-fns";
import LPE from "../assets/event-banners/lpe.png";
import { BsGlobe2 } from "react-icons/bs";
import { FaInstagram } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { FaFacebookF } from "react-icons/fa6";
import { FaTiktok } from "react-icons/fa6";
import { IoLogoLinkedin } from "react-icons/io5";
import { ChevronDownIcon } from "@chakra-ui/icons";

import { Link, useParams, useLocation } from "react-router-dom";

const EventDetails = () => {
  const { eventId } = useParams(); // Get the event ID from the URL
  const event = eventsData[eventId]; // Lookup event from local data

  useEffect(() => {
    document.title = `${event?.name} | The Lemonade Network`;
  }, []);

  const toast = useToast();
  const urlLocation = useLocation(); // to access query parameters

  // Function to get query parameters
  const getQueryParams = () => {
    const params = new URLSearchParams(urlLocation.search);
    return params;
  };

  useEffect(() => {
    const params = getQueryParams();
    const msg = params.get("msg");

    if (msg === "paysuccess") {
      toast({
        title: "Payment Successful",
        description: "Check Your Email",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
    } else if (msg === "payfail") {
      toast({
        title: "Payment Not Successful",
        description: "If You Were Debited, Please Contact Us",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  }, [urlLocation, toast]);

  // Sample ISO 8601 string for a time range
  const isoString = event.date;

  // Split the ISO string into start and end times
  const [startIso, endIso] = isoString ? isoString.split("/") : [null, null];

  // Parse the start and end times into Date objects
  const startDate = new Date(startIso);
  const endDate = new Date(endIso);

  // 1. Format start and end times with meridiem (12-hour format)
  const startTimeWithMeridiem = format(startDate, "h:mm a"); // 12-hour format with meridiem
  const endTimeWithMeridiem = format(endDate, "h:mm a"); // 12-hour format with meridiem

  const timeZoneMap = {
    "+00:00": "GMT", // Greenwich Mean Time
    "+01:00": "WAT", // West Africa Time
    "+02:00": "CAT", // Central Africa Time
    "+03:00": "EAT", // East Africa Time
    "+04:00": "GST", // Gulf Standard Time
    "+05:00": "PKT", // Pakistan Standard Time
    "+06:00": "BST", // Bangladesh Standard Time
    "+07:00": "WIB", // Western Indonesia Time
    "+08:00": "CST", // China Standard Time
    "+09:00": "JST", // Japan Standard Time
    "+10:00": "AEST", // Australian Eastern Standard Time
    "+11:00": "SBT", // Solomon Islands Time
    "+12:00": "NZST", // New Zealand Standard Time
    "-01:00": "AZOT", // Azores Time
    "-02:00": "BRST", // Brasilia Summer Time
    "-03:00": "BRT", // Brasilia Time
    "-04:00": "AST", // Atlantic Standard Time
    "-05:00": "EST", // Eastern Standard Time
    "-06:00": "CST", // Central Standard Time
    "-07:00": "MST", // Mountain Standard Time
    "-08:00": "PST", // Pacific Standard Time
    "-09:00": "AKST", // Alaska Standard Time
    "-10:00": "HST", // Hawaii-Aleutian Standard Time
    // Add more time zones as needed
  };

  const getTimeZoneAbbreviation = () => {
    const now = new Date();
    const offsetMinutes = now.getTimezoneOffset();
    const offsetHours = Math.floor(Math.abs(offsetMinutes) / 60);
    const offsetMinutesRemaining = Math.abs(offsetMinutes) % 60;
    const offsetSign = offsetMinutes > 0 ? "-" : "+";
    const formattedOffset = `${offsetSign}${String(offsetHours).padStart(
      2,
      "0"
    )}:${String(offsetMinutesRemaining).padStart(2, "0")}`;

    return timeZoneMap[formattedOffset] || "Unknown Time Zone";
  };

  // 2. Extract Time Zone (Assuming same for both times)
  const timezoneOffset = -startDate.getTimezoneOffset() / 60;
  const timezoneOffsetFormatted = `GMT${
    timezoneOffset >= 0 ? "+" : ""
  }${timezoneOffset}`;

  // 3. Format in (Wed, August 21st 7:00 PM) with meridiem
  const startDayOfWeek = format(startDate, "EEE");
  const startMonth = format(startDate, "MMMM");
  const startDay = format(startDate, "do");
  const startTime = format(startDate, "h:mm a"); // 12-hour format with meridiem

  const endDayOfWeek = format(endDate, "EEE");
  const endMonth = format(endDate, "MMMM");
  const endDay = format(endDate, "do");
  const endTime = format(endDate, "h:mm a");

  const startFormattedDate = `${startDayOfWeek}, ${startMonth} ${startDay} ${startTime}`;
  const endFormattedDate = `${endDayOfWeek}, ${endMonth} ${endDay} ${endTime}`;

  // 4. Format in (Wednesday, 21st August, 2024)
  const startFullDayOfWeek = format(startDate, "EEEE");
  const startFullDayOfMonth = format(startDate, "do");
  const startFullMonth = format(startDate, "MMMM");
  const startFullYear = format(startDate, "yyyy");

  const endFullDayOfWeek = format(endDate, "EEEE");
  const endFullDayOfMonth = format(endDate, "do");
  const endFullMonth = format(endDate, "MMMM");
  const endFullYear = format(endDate, "yyyy");

  const startFullFormattedDate = `${startFullDayOfWeek}, ${startFullDayOfMonth} ${startFullMonth}, ${startFullYear}`;
  const endFullFormattedDate = `${endFullDayOfWeek}, ${endFullDayOfMonth} ${endFullMonth}, ${endFullYear}`;

  const addToGoogleCalendar = (title, date, description, location) => {
    const baseUrl = "https://calendar.google.com/calendar/render";
    const url = new URL(baseUrl);

    url.searchParams.append("action", "TEMPLATE");
    url.searchParams.append("text", title);
    url.searchParams.append("dates", date);
    url.searchParams.append("details", description);
    url.searchParams.append("location", location);

    return url.toString();
  };

  // Usage
  const title = event.name;
  const date = event.iso; // ISO format: YYYYMMDDTHHMMSSZ
  const description = event.about.description;
  const location = `${event.venue.name}, ${event.venue.city}, ${event.venue.state}`;

  const googleCalendarUrl = addToGoogleCalendar(
    title,
    date,
    description,
    location
  );

  const addToOutlookCalendar = (
    title,
    startDate,
    endDate,
    description,
    location
  ) => {
    const baseUrl = "https://outlook.live.com/calendar/0/deeplink/compose";
    const url = new URL(baseUrl);

    url.searchParams.append(event.name, title);
    url.searchParams.append(event.startDate, startDate);
    url.searchParams.append(event.endDate, endDate);
    url.searchParams.append(event.about.description, description);
    url.searchParams.append(
      `${event.venue.name}, ${event.venue.city}, ${event.venue.state}`,
      location
    );

    return url.toString();
  };

  // Usage
  const outlookCalendarUrl = addToOutlookCalendar(
    title,
    startDate,
    endDate,
    description,
    location
  );

  const generateICS = (title, startDate, endDate, description, location) => {
    const icsContent = `
  BEGIN:VCALENDAR
  VERSION:2.0
  PRODID:-//The Lemonade Network Events//NONSGML v1.0//EN
  BEGIN:VEVENT
  UID:${new Date().getTime()}@tlnevents.com
  DTSTAMP:${event.startDate
    .replace(/-/g, "")
    .replace(/T/, "")
    .replace(/:/g, "")}
  DTSTART:${event.startDate
    .replace(/-/g, "")
    .replace(/T/, "")
    .replace(/:/g, "")}
  DTEND:${event.endDate.replace(/-/g, "").replace(/T/, "").replace(/:/g, "")}
  SUMMARY:${event.name}
  DESCRIPTION:${event.about.description}
  LOCATION:${`${event.venue.name}, ${event.venue.city}, ${event.venue.state}`}
  END:VEVENT
  END:VCALENDAR
    `.trim();

    const blob = new Blob([icsContent], { type: "text/calendar" });
    const url = URL.createObjectURL(blob);

    return url;
  };

  // Usage
  const icsUrl = generateICS(title, startDate, endDate, description, location);

  return (
    <VStack
      w="100%"
      h="100%"
      justify="center"
      align="center"
      spacing={["50px", "60px", "70px", "75px", "30px"]}
    >
      <VStack
        w="100%"
        h="100%"
        justify="center"
        align="center"
        spacing={["25px", "60px", "70px", "75px", "30px"]}
        px={["20px", "50px", "75px", "100px"]}
      >
        <Flex w="100%" justify="space-between" align="center" py="20px">
          <Link to="/">
            <Image
              w={["120px", "150px"]}
              src="/logo.webp"
              alt="The Lemonade Logo"
            ></Image>
          </Link>
        </Flex>
        <VStack w="100%" h="100%" align="flex-start" spacing="20px">
          <Breadcrumb fontWeight="500" color="Dark">
            <BreadcrumbItem>
              <BreadcrumbLink href="/">
                <Text color="neutral.500" fontSize={["14px", "16px"]}>
                  Home
                </Text>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbItem isCurrentPage>
              <BreadcrumbLink href="/discover">
                <Text color="dark" fontSize={["14px", "16px"]}>
                  Lemonade Playground Experience
                </Text>
              </BreadcrumbLink>
            </BreadcrumbItem>
          </Breadcrumb>
          <Stack
            w="100%"
            h="100%"
            position="relative"
            flexDir={["column", "column", "column", "row"]}
            justify="flex-start"
            align="flex-start"
            spacing="40px"
          >
            <VStack
              display={["none", "none", "none", "flex"]}
              position="sticky"
              top="20px"
              w="35%"
              justify="center"
              align="center"
              spacing="20px"
            >
              <Box w="100%" h={["70vh", "70vh", "70vh", "30vh", "70vh"]}>
                <Image
                  w="100%"
                  h="100%"
                  rounded="8px"
                  src={event.image}
                  alt="Event banner"
                />
              </Box>
              <Flex w="100%" justify="space-between" align="center">
                <VStack w="100%" align="flex-start" gap="10px">
                  <Link to={event.organizers.url}>
                    <Heading color="dark" fontSize={["22px"]} lineHeight="28px">
                      Organized By
                    </Heading>
                  </Link>

                  <Flex w="100%" justify="space-between" align="center">
                    <Text color="primary.500" fontSize="16px" lineHeight="24px">
                      {event.organizers.name}
                    </Text>
                    <Flex align="center" gap="20px">
                      {event.organizers.socials.url && (
                        <Link to={event.organizers.socials.url} target="_blank">
                          <BsGlobe2 color="dark" />
                        </Link>
                      )}
                      {event.organizers.socials.instagram && (
                        <Link
                          to={event.organizers.socials.instagram}
                          target="_blank"
                        >
                          <FaInstagram color="dark" />
                        </Link>
                      )}
                      {event.organizers.socials.facebook && (
                        <Link
                          to={event.organizers.socials.facebook}
                          target="_blank"
                        >
                          <FaFacebookF color="dark" />
                        </Link>
                      )}
                      {event.organizers.socials.x && (
                        <Link to={event.organizers.socials.x} target="_blank">
                          <FaXTwitter color="dark" />
                        </Link>
                      )}
                      {event.organizers.socials.tiktok && (
                        <Link
                          to={event.organizers.socials.tiktok}
                          target="_blank"
                        >
                          <FaTiktok color="dark" />
                        </Link>
                      )}
                      {event.organizers.socials.linkedin && (
                        <Link
                          to={event.organizers.socials.linkedin}
                          target="_blank"
                        >
                          <IoLogoLinkedin color="dark" />
                        </Link>
                      )}
                    </Flex>
                  </Flex>
                </VStack>
              </Flex>
              <Box bg="primary.500" w="100%" h="0.5px"></Box>

              <Box display={["none", "none", "none", "block"]} w="100%">
                <Link to={`/${event.id}/checkout`}>
                  <Button
                    w="100%"
                    bg="primary.400"
                    _hover={{ bg: "primary.500" }}
                  >
                    <Text>Get Tickets</Text>
                  </Button>
                </Link>
              </Box>
            </VStack>
            <Box
              display={["block", "block", "block", "none"]}
              w="100%"
              h="384px"
            >
              <Image
                src={event.image}
                alt={event.id}
                width="100%"
                height="100%"
                rounded="8px"
                alignSelf="stretch"
              />
            </Box>
            <VStack
              w={["100%", "100%", "100%", "65%"]}
              h="100%"
              align="flex-start"
              spacing="50px"
              pb={["50px", "100px"]}
            >
              <VStack w="100%" align="flex-start" spacing={["10px", "20px"]}>
                <Heading color="dark" fontSize={["28px", "32px"]}>
                  {event.name}
                </Heading>
                <Text color="primary.500" fontSize={["14px", "16px"]}>
                  {startFormattedDate}
                </Text>
                <Text color="dark" fontSize={["18px", "20px"]} fontWeight="600">
                  {event.venue.name}, {event.venue.state}, {event.venue.country}
                </Text>
              </VStack>

              <VStack w="100%" align="flex-start" spacing="20px">
                <Heading color="neutral.500" fontSize={["24px", "28px"]}>
                  About
                </Heading>
                <Text color="dark" fontSize="16px">
                  {event.about.description}
                </Text>
              </VStack>
              <Box w="100%" h="1px" bg="primary.500"></Box>
              <VStack w="100%" align="flex-start" spacing="20px">
                <Heading color="neutral.500" fontSize={["24px", "28px"]}>
                  Date & Time
                </Heading>
                <VStack align="flex-start" spacing={["10px", "5px"]}>
                  <Text color="dark" fontSize="16px">
                    {startFullFormattedDate}
                  </Text>
                  <Text color="neutral.500" fontSize="16px">
                    {startTimeWithMeridiem} - {endTimeWithMeridiem}{" "}
                    {getTimeZoneAbbreviation()}
                  </Text>
                  <Menu>
                    <MenuButton
                      as={Button}
                      rightIcon={<ChevronDownIcon />}
                      size="md"
                      bg="primary.500"
                      _hover={{ bg: "primary.400", color: "dark" }}
                      color="white"
                    >
                      Add To Calendar
                    </MenuButton>

                    <MenuList>
                      <a
                        href={googleCalendarUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <MenuItem> Add to Google Calendar</MenuItem>
                      </a>
                      <a
                        href={outlookCalendarUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <MenuItem>Outlook</MenuItem>
                      </a>

                      <a href={icsUrl} download={`${event.id}.ics`}>
                        <MenuItem>Download ICS</MenuItem>
                      </a>
                    </MenuList>
                  </Menu>
                </VStack>
              </VStack>
              <Box w="100%" h="1px" bg="primary.500"></Box>
              <VStack w="100%" h="100%" align="flex-start" spacing="20px">
                <Heading color="neutral.500" fontSize={["24px", "28px"]}>
                  Location
                </Heading>
                <VStack w="100%" align="flex-start" spacing={["10px", "5px"]}>
                  <Text
                    color="dark"
                    fontSize={["18px", "20px"]}
                    fontWeight="600"
                  >
                    {event.venue.name}
                  </Text>
                  <Text color="neutral.500" fontSize={["14px", "16px"]}>
                    {event.venue.address}
                  </Text>
                  <Box w="100%" h="100%" bg="gary.500">
                    <AspectRatio bg="gary.500" ratio={16 / 9}>
                      <iframe
                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3964.6583901574636!2d3.4225135739922647!3d6.437900693553329!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x103bf536b15c7885%3A0xbcaea69ba1f12984!2sMuri%20Okunola%20Park!5e0!3m2!1sen!2sng!4v1729628140373!5m2!1sen!2sng"
                        allowFullScreen=""
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                      ></iframe>
                    </AspectRatio>
                  </Box>
                  {/* <Button
                    size="md"
                    bg="primary.500"
                    _hover={{ bg: "primary.400", color: "dark" }}
                    color="white"
                  >
                    View on Map
                  </Button> */}
                </VStack>
              </VStack>
            </VStack>
          </Stack>
          <Box
            display={["block", "block", "block", "none"]}
            position="fixed"
            bottom="0px"
            left="0"
            w="100%"
            h="75px"
            bg="primary.500"
            borderTopRadius="8px"
            p="20px"
          >
            <VStack w="100%" justify="center" align="center">
              <Link to={`/${event.id}/checkout`}>
                <Button size="lg" bg="secondary.500" color="dark">
                  Get Ticket
                </Button>
              </Link>
            </VStack>
          </Box>
        </VStack>
      </VStack>
    </VStack>
  );
};

export default EventDetails;
