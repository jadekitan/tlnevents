import React, { useEffect } from "react";
import { Helmet } from "react-helmet-async";
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
  AspectRatio,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  AvatarGroup,
  Avatar,
  Drawer,
  DrawerHeader,
  DrawerBody,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  useDisclosure,
} from "@chakra-ui/react";
import { eventsData } from "../../server/eventsData";
import { format, parseISO } from "date-fns";
import { BsGlobe2 } from "react-icons/bs";
import { FaInstagram } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { FaFacebookF } from "react-icons/fa6";
import { FaTiktok } from "react-icons/fa6";
import { IoLogoLinkedin } from "react-icons/io5";
import { ChevronDownIcon, HamburgerIcon } from "@chakra-ui/icons";
import { FcGoogle } from "react-icons/fc";
import Outlook from "../../src/assets/icons/outlook.svg";
import Download from "../../src/assets/icons/download.svg";
import { Link, useParams } from "react-router-dom";

const EventDetails = () => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [placement, setPlacement] = React.useState('right')

  const { eventId } = useParams(); // Get the event ID from the URL
  const event = eventsData[eventId]; // Lookup event from local data

  useEffect(() => {
    setTimeout(() => {
      document.title = `${event?.name} | The Lemonade Network`;
      // Set or update description meta tag
      let descriptionMeta = document.querySelector('meta[name="description"]');
      if (!descriptionMeta) {
        descriptionMeta = document.createElement("meta");
        descriptionMeta.name = "description";
        document.head.appendChild(descriptionMeta);
      }
      descriptionMeta.content =
        event.about?.description || "Default description";

      // Set or update Open Graph meta tags
      const ogTags = [
        { property: "og:title", content: event.name },
        {
          property: "og:description",
          content: event.about?.description || "Default description",
        },
        { property: "og:image", content: event.image },
        { property: "og:url", content: `https://tlnevents.com/${event.id}` },
      ];

      ogTags.forEach(({ property, content }) => {
        let metaTag = document.querySelector(`meta[property="${property}"]`);
        if (!metaTag) {
          metaTag = document.createElement("meta");
          metaTag.setAttribute("property", property);
          document.head.appendChild(metaTag);
        }
        metaTag.content = content;
      });
    }, 100);
  }, []);

  // Corrected ISO string
  const isoString = event.date.iso;

  // Add hyphens and colons to match ISO 8601 format
  const formattedIsoString = isoString.replace(
    /(\d{4})(\d{2})(\d{2})T(\d{2})(\d{2})(\d{2})Z/g,
    "$1-$2-$3T$4:$5:$6Z"
  );

  // Split the ISO string into start and end times
  const [startIso, endIso] = formattedIsoString
    ? formattedIsoString.split("/")
    : [null, null];

  // Parse the start and end times into Date objects using parseISO
  const startDate = parseISO(startIso);
  const endDate = parseISO(endIso);

  // Manually format times using UTC hours and minutes to avoid timezone shifts
  const startTimeWithMeridiem = `${String(
    startDate.getUTCHours() % 12 || 12
  ).padStart(2, "0")}:${String(startDate.getUTCMinutes()).padStart(2, "0")} ${startDate.getUTCHours() >= 12 ? "PM" : "AM"
    }`;
  const endTimeWithMeridiem = `${String(
    endDate.getUTCHours() % 12 || 12
  ).padStart(2, "0")}:${String(endDate.getUTCMinutes()).padStart(2, "0")} ${endDate.getUTCHours() >= 12 ? "PM" : "AM"
    }`;

  // 3. Format in (Wed, August 21st 7:00 PM) with meridiem, UTC-based
  const startFormattedDate = `${format(startDate, "EEE")}, ${format(
    startDate,
    "MMMM do"
  )} ${startTimeWithMeridiem}`;
  const endFormattedDate = `${format(endDate, "EEE")}, ${format(
    endDate,
    "MMMM do"
  )} ${endTimeWithMeridiem}`;

  // 4. Format in (Wednesday, 21st August, 2024), UTC-based
  const startFullFormattedDate = format(startDate, "EEEE, do MMMM, yyyy");
  const endFullFormattedDate = format(endDate, "EEEE, do MMMM, yyyy");

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
  const date = event.date.iso; // ISO format: YYYYMMDDTHHMMSSZ
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

    // Use correct query parameter names expected by Outlook Calendar
    url.searchParams.append("path", "/calendar/action/compose");
    url.searchParams.append("rru", "addevent"); // Required for adding an event
    url.searchParams.append("startdt", startDate); // Start date in ISO format
    url.searchParams.append("enddt", endDate); // End date in ISO format
    url.searchParams.append("subject", title); // Event title
    url.searchParams.append("body", description); // Event description
    url.searchParams.append("location", location); // Event location

    return url.toString();
  };

  // Usage
  const outlookCalendarUrl = addToOutlookCalendar(
    event.name,
    event.date.outlookStartDate, // Example ISO date format for start date
    event.date.outlookEndDate, // Example ISO date format for end date
    event.about.description,
    `${event.venue.name}, ${event.venue.city}, ${event.venue.state}`
  );

  const generateICS = (title, startDate, endDate, description, location) => {
    // Helper function to convert dates to proper ICS format (UTC time)
    const formatDateToICS = (date) => {
      const formattedDate =
        new Date(date).toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
      return formattedDate; // YYYYMMDDTHHMMSSZ
    };

    const icsContent = `
BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//The Lemonade Network Events//NONSGML v1.0//EN
BEGIN:VEVENT
UID:${new Date().getTime()}@tlnevents.com
DTSTAMP:${formatDateToICS(new Date().toISOString())}
DTSTART:${formatDateToICS(startDate)}
DTEND:${formatDateToICS(endDate)}
SUMMARY:${title}
DESCRIPTION:${description}
LOCATION:${location}
END:VEVENT
END:VCALENDAR
    `.trim();

    const blob = new Blob([icsContent], { type: "text/calendar" });
    const url = URL.createObjectURL(blob);

    return url;
  };

  // Usage Example
  const icsUrl = generateICS(
    event.name,
    event.date.outlookStartDate, // Start date in ISO format
    event.date.outlookEndDate, // End date in ISO format
    event.about.description,
    `${event.venue.name}, ${event.venue.city}, ${event.venue.state}`
  );

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
          <Button display={["block", "block", "block", "none"]} bg="transparent" p="0" _hover={{ bg: "transparent" }} onClick={onOpen}><HamburgerIcon fontSize="20px" color="dark" /></Button>
          <Drawer placement={placement} onClose={onClose} isOpen={isOpen} size={"full"}>
            <DrawerOverlay />
            <DrawerContent bg="rgba(0,0,0,0.8)">
              <DrawerCloseButton color="white" fontSize="20px" />
              <DrawerHeader ><Flex justify="center" align="center">
                <Link to="/">
                  <Image
                    w={["120px", "150px"]}
                    src="https://tlnevents.com/logo-white.png"
                    alt="The Lemonade Logo"
                    className={`duration-1000 ease-in-out `}
                  />
                </Link>
              </Flex></DrawerHeader>
              <DrawerBody>

                <VStack h="80vh" justify="center" align="center" spacing="30px">

                  <Link to={`/${event.url}/checkout`} target="_blank"><Text color="white" fontSize="30px" fontWeight="bold">Tickets</Text></Link>
                  <Link to={`/${event.url}/merch`} target="_blank"><Text color="white" fontSize="30px" fontWeight="bold">Merch</Text></Link>
                  <Link to={`/${event.url}`} target="_blank"><Text color="white" fontSize="30px" fontWeight="bold">Event</Text></Link>
                  <Link as="button" onClick={() => { scrollToSection("experiences"); onClose() }}><Text color="white" fontSize="30px" fontWeight="bold">Experience</Text></Link>
                  <Link as="button" onClick={() => { scrollToSection("about"); onClose() }}><Text color="white" fontSize="30px" fontWeight="bold">About</Text></Link>
                </VStack>
              </DrawerBody>
            </DrawerContent>
          </Drawer>
        </Flex>
        <VStack w="100%" h="100%" align="flex-start" spacing="20px">
          <Breadcrumb fontWeight="500" color="Dark">
            <BreadcrumbItem>
              <BreadcrumbLink href="/">
                <Text color="neutral.500" fontSize={["14px", "16px", "16px"]}>
                  Home
                </Text>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbItem isCurrentPage>
              <BreadcrumbLink href="/discover">
                <Text color="dark" fontSize={["14px", "16px", "16px"]}>
                  {event.name}
                </Text>
              </BreadcrumbLink>
            </BreadcrumbItem>
          </Breadcrumb>
          <Stack
            w="100%"
            h="100%"
            position="relative"
            flexDir={["column", "column", "column", "column", "row"]}
            justify="flex-start"
            align="flex-start"
            spacing="40px"
          >
            <VStack
              display={["none", "none", "none", "none", "flex"]}
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
                  alt={`${event.name} Banner`}
                />
              </Box>
              <Flex w="100%" justify="space-between" align="center">
                <VStack w="100%" align="flex-start" gap="10px">
                  <Heading color="dark" fontSize={["22px"]} lineHeight="28px">
                    Organized By
                  </Heading>

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
              display={["block", "block", "block", "block", "none"]}
              w={["100%", "100%", "100%", "70%", "100%"]}
              h={["425px", "384px", "775px", "600px", "384px"]}
            >
              <Image
                src={event.image}
                alt={`${event.name} Banner`}
                width="100%"
                height="100%"
                rounded="8px"
                alignSelf="stretch"
              />
            </Box>
            <VStack
              w={["100%", "100%", "100%", "100%", "65%"]}
              h="100%"
              align="flex-start"
              spacing="50px"
              pb="80px"
            >
              <VStack w="100%" align="flex-start" spacing={["10px", "20px"]}>
                <Heading color="dark" fontSize={["28px", "32px", "36px", "32px"]}>
                  {event.name}
                </Heading>
                <Text color="primary.500" fontSize={["14px", "16px", "20px", "16px"]}>
                  {startFormattedDate}
                </Text>
                <Text color="dark" fontSize={["18px", "20px", "24px", "20px"]} fontWeight="600">
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
              {/* {event.merch && (
                <Flex w="100%" justify="space-between" align="center" key={category}>
                  <VStack
                    w="100%"
                    justify="flex-start"
                    align="flex-start"
                    spacing={["18px", "20px"]}
                  >

                    <Heading color="neutral.500" fontSize={["24px", "28px"]}>
                      Merch
                    </Heading>
                    {Object.keys(event.merch.tees).map((category) => {
                      // Validate the category exists
                      if (!event.merch[category]) {
                        console.warn(`Category "${category}" is invalid or undefined.`);
                        return null;
                      }

                      // Get all items in the current category
                      const items = Object.values(event.merch[category]);

                      // Skip rendering if no items exist
                      if (!items.length) {
                        console.warn(`No items found in category "${category}".`);
                        return null;
                      }

                      // Pick a random item
                      const randomItem = items[Math.floor(Math.random() * items.length)];

                      // Ensure randomItem exists
                      if (!randomItem) {
                        console.warn(`Random item is undefined for category "${category}".`);
                        return null;
                      }

                      return (
                        <Stack
                          key={category}
                          w="100%"
                          flexDir={["column", "row"]}
                          overflow="hidden"
                          align={["flex-start", "center"]}
                          gap="20px"
                        >
                          <Avatar
                            size="md"
                            border="none"
                            src={randomItem.image || "fallback-image.jpg"}
                            alt={randomItem.name || "Unnamed Item"}
                          />
                          <Heading
                            color="white"
                            fontFamily="outfit"
                            fontSize="16px"
                            whiteSpace="nowrap"
                            overflow="hidden"
                            textOverflow="ellipsis"
                          >
                            {randomItem.name || "Unnamed Item"}
                          </Heading>
                        </Stack>
                      );
                    })}





                    <Link to={`/${event.id}/merch/${category}/${randomItem.id}`}>
                      <Button
                        bg="primary-color900"
                        color="white"
                        _hover={{ bg: "primary-color500" }}
                        rounded="8px"
                      >
                        <Text
                          fontFamily="outfit"
                          fontSize="14px"
                          fontWeight="600"
                          lineHeight="20px"
                        >
                          View Details
                        </Text>
                      </Button>
                    </Link>


                  </VStack>
                </Flex>)} */}


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
                    {event.date.timeZone}
                  </Text>
                  <Menu>
                    <MenuButton
                      as={Button}
                      rightIcon={<ChevronDownIcon />}
                      size="md"
                      bg="primary.500"
                      _hover={{ bg: "primary.400", color: "dark" }}
                      _active={{ bg: "primary.400", color: "dark" }}
                      _focus={{ bg: "primary.400", color: "dark" }}
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
                        <MenuItem icon={<FcGoogle />}>Google Calendar</MenuItem>
                      </a>
                      <a
                        href={outlookCalendarUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <MenuItem
                          icon={
                            <Image
                              w="20px"
                              h="20px"
                              src={Outlook}
                              alt="Outlook"
                            />
                          }
                        >
                          Outlook
                        </MenuItem>
                      </a>

                      <a href={icsUrl} download={`${event.id}.ics`}>
                        <MenuItem
                          icon={
                            <Image
                              w="20px"
                              h="20px"
                              src={Download}
                              alt="Download"
                            />
                          }
                        >
                          Event ICS
                        </MenuItem>
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
              <Box
                display={["block", "none", "none", "none"]}
                w="100%"
                h="1px"
                bg="primary.500"
              ></Box>
              <Flex
                display={["block", "none", "none", "none"]}
                w="100%"
                justify="space-between"
                align="center"
              >
                <VStack w="100%" align="flex-start" gap="10px">
                  <Heading
                    color="dark"
                    fontSize={["18px", "20px"]}
                    lineHeight="28px"
                  >
                    Organized By
                  </Heading>

                  <VStack w="100%" justify="flex-start" align="flex-start">
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
                  </VStack>
                </VStack>
              </Flex>
            </VStack>
          </Stack>

          <Box
            display={["block", "block", "block", "block", "none"]}
            position="fixed"
            bottom="0"
            left="0"
            bg="#fff"
            boxShadow="xs"
            w="100%"
            p={["10px", "20px", "40px"]}
          >
            <Link to={`/${event.id}/checkout`}>
              <Button w="100%" h={["45px", "50px"]} bg="primary.500" rounded="8px">
                <Text fontSize={["18px", "20px", "22px"]}>Get Ticket</Text>
              </Button>
            </Link>
          </Box>

        </VStack>
      </VStack >
    </VStack >
  );
};

export default EventDetails;
