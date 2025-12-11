export const eventsData = {
  lpe: {
    id: "lpe",
    url: "lpe",
    image: "https://tlnevents.com/assets/events-banner/lpe.webp",
    name: "Lemonade Playground Experience",
    venue: {
      name: "Muri Okuola Park",
      address: "Adeyemo Alakija St, Eti-Osa, Lagos 106104, Lagos",
      city: "Victoria Island",
      state: "Lagos",
      country: "Nigeria",
      zip: "12345",
      latitude: "37.7749",
      longitude: "-122.4194",
      iframe: "",
    },
    date: {
      iso: "20241222T120000Z/20241223T060000Z",
      startDate: "20241222T120000Z",
      endDate: "20241223T060000Z",
      outlookStartDate: "2024-12-22T12:00:00Z",
      outlookEndDate: "2024-12-23T06:00:00Z",
      timeZone: "WAT",
    },

    categories: "Party",
    price: 5000,
    percentCharge: 5,
    tickets: [
      {
        id: 1,
        name: "Playground Adult Early Bird Pass",
        price: 10000,
        quantity: 500,
        maxQuantity: 5,
        step: 1,
        description: {
          info: "This Entry Ticket grants you full access to the entire experience, designed to keep you entertained, engaged, and immersed in the lively atmosphere!",
          perks: ["Regular Entry"],
        },
      },
      {
        id: 2,
        name: "Playground Children Premium Pass",
        price: 15000,
        quantity: 100,
        maxQuantity: 5,
        step: 1,
        description: {
          info: "Elevate your little ones' adventure with the Playground Children Premium Pass! Make their day extraordinary with premium goodies and expanded activities tailored for a memorable experience.",
          perks: [
            "Priority Entry",
            "Free Popcorn & Candy Floss,",
            "All-Access Games & Activities",
            "A Special Gift from Santa",
          ],
        },
      },
      {
        id: 3,
        name: "Playground Children Regular Pass",
        price: 5000,
        quantity: 100,
        maxQuantity: 5,
        step: 1,
        description: {
          info: "Give your little ones an unforgettable experience filled with excitement and joy! With the Playground Children Early Bird Pass, they'll enjoy access to exclusive goodies and activities tailored just for them",
          perks: [
            "Regular Entry",
            "Free Popcorn & Candy Floss",
            "Access to Select Games & Activities",
          ],
        },
      },
    ],
    merch: {
      tees: {
        "lemonade-tee": {
          id: "lemonade-tee",
          name: "Lemonade Tee",
          price: 35000,
          description: {
            head: "A must-have for fans of the Lemonade Playground Experience, these classic tees radiate simplicity and charm.",
            color:
              "Available in Black, White, and Pink, perfect for versatile styling.",
            size: "M, L, XL, XXL, ensuring a comfortable fit for everyone.",
            footer:
              "These t-shirts are crafted from premium materials, designed to keep you cool and comfortable while making a bold statement.",
          },
          sizes: ["M", "L", "XL", "XXL"],
          colors: ["Black", "White", "Pink"],
          image:
            "https://tlnevents.com/assets/merch/tees/lemonade-tee(black-back).jpg",
          hasFrontView: true,
          hasBackView: true,
        },

        "playground-vibes-tee": {
          id: "playground-vibes-tee",
          name: "Playground Vibes Tee",
          price: 35000,
          description: {
            head: "A must-have for fans of the Lemonade Playground Experience, these classic tees radiate simplicity and charm.",
            color:
              "Available in Black, White, and Pink, perfect for versatile styling.",
            size: "M, L, XL, XXL, ensuring a comfortable fit for everyone.",
            footer:
              "These t-shirts are crafted from premium materials, designed to keep you cool and comfortable while making a bold statement.",
          },
          sizes: ["M", "L", "XL", "XXL"],
          colors: ["Black", "White", "Pink"],
          image:
            "https://tlnevents.com/assets/merch/tees/playground-vibes-tee(pink-back).jpg",
          hasFrontView: true,
          hasBackView: true,
        },
        "rewind-repeat-tee": {
          id: "rewind-repeat-tee",
          name: "Rewind Repeat Tee",
          price: 35000,
          description: {
            head: "A must-have for fans of the Lemonade Playground Experience, these classic tees radiate simplicity and charm.",
            color:
              "Available in Black, White, and Pink, perfect for versatile styling.",
            size: "M, L, XL, XXL, ensuring a comfortable fit for everyone.",
            footer:
              "These t-shirts are crafted from premium materials, designed to keep you cool and comfortable while making a bold statement.",
          },
          sizes: ["M", "L", "XL", "XXL"],
          colors: ["Black", "White", "Pink"],
          image:
            "https://tlnevents.com/assets/merch/tees/rewind-repeat-tee(white-back).jpg",
          hasBackView: true,
          hasFrontView: false,
        },
      },
      "crop-tops": {
        "wrangler-crop-top": {
          id: "wrangler-crop-top",
          name: "Wrangler Crop Top",
          price: 25000,
          description: {
            head: "Bold and striking, this crop top is ideal for making a statement at the event or beyond.",
            color: "Iconic combinations of Black and White and Red and White.",
            size: " S, M, L, XL, XXL.",
            footer:
              "With a Wrangler-inspired edge, this piece brings an effortlessly cool vibe.",
          },
          sizes: ["S", "M", "L", "XL", "XXL"],
          colors: ["Black", "Red"],
          image:
            "https://tlnevents.com/assets/merch/crop-tops/wrangler-crop-top(black-front).jpg",
          hasFrontView: true,
          hasBackView: false,
        },
        "washed-crop-top": {
          id: "washed-crop-top",
          name: "Washed Crop Top",
          price: 25000,
          description: {
            head: "Effortlessly chic with a touch of vintage, the washed crop top is the perfect balance of comfort and style.",
            color: "Subtle tones like White, Black, and Pink.",
            size: " S, M, L, XL, XXL.",
            footer:
              "Its washed aesthetic offers a laid-back, retro charm suitable for all-day wear.",
          },
          sizes: ["S", "M", "L", "XL", "XXL"],
          colors: ["White", "Black"],
          image:
            "https://tlnevents.com/assets/merch/crop-tops/washed-crop-top(black-front).jpg",
          hasFrontView: true,
          hasBackView: false,
        },
        "ringer-baby-crop-top": {
          id: "ringer-baby-crop-top",
          name: "Ringer Baby Crop Top",
          price: 25000,
          description: {
            head: "Cute and sporty, the ringer baby crop top is made to elevate your casual style.",
            color:
              "Fresh combos like Cream and Blue, Black and White, and Pink and Cream.",
            size: " S, M, L, XL.",
            footer:
              "With ringer-style edges and soft fabric, it’s a playful choice for any Lemonade Playground enthusiast.",
          },
          sizes: ["S", "M", "L", "XL"],
          colors: ["Cream & Blue", "Cream & Green"],
          image:
            "https://tlnevents.com/assets/merch/crop-tops/ringer-baby-crop-top(cream & green-front).jpg",
          hasFrontView: true,
          hasBackView: false,
        },
      },
    },
    about: {
      description:
        "Step into Lemonade Playground Experience – Play all day, Party all night! By day, kids and adults dive into a world of playful adventures, laughter, and joy. As the night rolls in, adults take the spotlight with electrifying vibes, music, and memories waiting to be made. It’s not just a party; it’s a day-to-night celebration like no other. Sip on the sweetness of fun by day and dance through the night. The Lemonade Playground Experience – party all day, groove all night!",
      rating: 18,
      policy:
        "You can get a refund if:It’s within 24 hours of buying ticket This event is rescheduled or cancelled",
    },
    lineup: {
      images: [
        "https://bit.ly/ryan-florence",
        "https://bit.ly/sage-adebayo",
        "https://bit.ly/kent-c-dodds",
        "https://bit.ly/kent-c-dodds",
        "https://bit.ly/kent-c-dodds",
      ],
      names: ["speed darlington", "odumodu"],
    },
    vendors: {
      images: [
        "https://bit.ly/ryan-florence",
        "https://bit.ly/sage-adebayo",
        "https://bit.ly/kent-c-dodds",
        "https://bit.ly/kent-c-dodds",
        "https://bit.ly/kent-c-dodds",
      ],
      brands: ["celeb foods", "tise spag", "Korede"],
    },
    organizers: {
      name: "The Lemonade Network",
      username: "dagbana-boys",
      email: "info@thelemonadenetwork.ng",
      phone: "+234 123 456 789",

      socials: {
        url: "",
        instagram: "https://instagram.com/lemonade.africa ",
        facebook: "",
        x: "https://twitter.com/lemonade_africa",
        tiktok: "https://tiktok.com/@lemonade.africa",
        linkedin: "",
      },
    },
  },
  "silent-disco": {
    id: "silent-disco",
    url: "silent-disco",
    image: "https://tlnevents.com/assets/events-banner/silent-disco-3.webp",
    name: "Jay's Silent Disco",

    venue: {
      name: "Lemonade Studios",
      address: "65 Queen St, Alagomeji-Yaba, Lagos 100001, Lagos",
      city: "Alagomeji-Yaba",
      state: "Lagos",
      country: "Nigeria",
      zip: "100001",
      latitude: "6.5149",
      longitude: "3.3785",
      iframe:
        "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3964.152150741183!2d3.378674140517502!3d6.502415094889078!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x103b8c601fb92825%3A0x79aeab96370cd448!2s65%20Queen%20St%2C%20Alagomeji-Yaba%2C%20Lagos%20100001%2C%20Lagos!5e0!3m2!1sen!2sng!4v1755554574183!5m2!1sen!2sng",
    },

    date: {
      iso: "2025-12-28T16:00:00Z/2025-12-28T22:00:00Z",
      startDate: "2025-12-28T16:00:00Z",
      endDate: "2025-12-28T22:00:00Z",
      outlookStartDate: "2025-10-28T16:00:00Z",
      outlookEndDate: "2025-10-28T22:00:00Z",
      timeZone: "WAT",
    },

    categories: ["Party"],
    price: 10000,
    percentCharge: 5,

    tickets: [
      {
        id: 1,
        name: "General Admission",
        price: 5000,
        quantity: 500,
        maxQuantity: 5,
        step: 1,
        description: {
          info: "Access to The Full House Experience — a silent disco and games-filled entertainment event featuring multiple DJs, side attractions, food, and drinks.",
          perks: [
            "Silent Disco Experience",
            "Access to Side Attractions",
            "Live DJs: DJ Skit, DJ Princz, DJ Moore",
            "Free shots (as stated)",
            "Games + Food + Drinks (paid or free depending on stand)",
          ],
        },
      },
    ],

    merch: {},

    about: {
      description:
        "The Full House Experience is an exciting blend of nightlife, silent disco, games, and social energy. Hosted in the heart of Yaba, the event brings together music lovers, gamers, and thrill-seekers for a vibrant evening. With free shots, PS5 competitions, snooker, board games, and three energetic DJs, the experience promises unforgettable fun, community vibes, and nonstop entertainment.",
      rating: 18,
      policy:
        "Tickets admit one attendee. Game access is subject to availability. Food and drinks may be purchased separately unless otherwise stated. All activities are subject to venue capacity and real-time safety conditions.",
    },
    lineup: {
      images: [
        "https://bit.ly/ryan-florence",
        "https://bit.ly/sage-adebayo",
        "https://bit.ly/kent-c-dodds",
      ],
      names: ["Speed Darlington", "Odumodu"],
    },

    vendors: {
      images: [
        "https://bit.ly/ryan-florence",
        "https://bit.ly/sage-adebayo",
        "https://bit.ly/kent-c-dodds",
      ],
      brands: ["Celeb Foods", "Tise Spag", "Korede"],
    },

    organizers: {
      name: "Mr Adekitan",
      username: "mr_adekitan",
      email: "adekitan.babajide@gmail.com",
      phone: "+234 803 427 0313",
      socials: {
        website: "",
        instagram: "https://instagram.com/mr_adekitan",
        facebook: "",
        x: "https://x.com/Mr_Adekitan",
        tiktok: "https://tiktok.com/@mr_adekitan",
        linkedin: "https://linkedin.com/in/adekitan-babajide",
      },
    },
  },
  "splash-fest": {
    id: "splash-fest",
    url: "splash-fest",
    image: "https://tlnevents.com/assets/events-banner/splash-fest.webp",
    name: "Splash Fest",

    venue: {
      name: "Comprehensive High School",
      address: "100 Ajibola Crescent, Alapere, Lagos",
      city: "Alapere",
      state: "Lagos",
      country: "Nigeria",
      zip: "101242",
      latitude: "6.5149",
      longitude: "3.3785",
      iframe:
        "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3963.5122079857247!2d3.400911374630852!3d6.583067593410484!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x103b92bea6ca4c5d%3A0xdf5d20cad41ef55c!2sH9H9%2B48V%2C%20100%20Ajibola%20Crescent%2C%20Alapere%2C%20Lagos%20101242%2C%20Lagos!5e0!3m2!1sen!2sng!4v1757417465127!5m2!1sen!2sng",
    },

    date: {
      iso: "2025-10-04T19:00:00Z/2025-10-05T00:00:00Z",
      startDate: "2025-10-04T19:00:00Z",
      endDate: "2025-10-05T00:00:00Z",
      outlookStartDate: "2025-10-04T19:00:00Z",
      outlookEndDate: "2025-10-05T00:00:00Z",
      timeZone: "WAT",
    },

    categories: ["Festival", "Party", "Entertainment"],
    price: 8000,
    percentCharge: 5,

    tickets: [
      {
        id: 1,
        name: "General",
        price: 8000,
        quantity: 200,
        maxQuantity: 5,
        step: 1,
        description: {
          info: "This ticket grants you full access to Splash Fest, including all games, music, and entertainment for the night.",
          perks: [
            "General Entry",
            "Games & Side Attractions",
            "Live Music & Performances",
          ],
        },
      },
    ],

    merch: {
      tees: {
        "lemonade-tee": {
          id: "lemonade-tee",
          name: "Lemonade Tee",
          price: 35000,
          description: {
            head: "A must-have for fans of the Lemonade Playground Experience, these classic tees radiate simplicity and charm.",
            color:
              "Available in Black, White, and Pink, perfect for versatile styling.",
            size: "M, L, XL, XXL, ensuring a comfortable fit for everyone.",
            footer:
              "These t-shirts are crafted from premium materials, designed to keep you cool and comfortable while making a bold statement.",
          },
          sizes: ["M", "L", "XL", "XXL"],
          colors: ["Black", "White", "Pink"],
          image:
            "https://tlnevents.com/assets/merch/tees/lemonade-tee(black-back).jpg",
          hasFrontView: true,
          hasBackView: true,
        },

        "playground-vibes-tee": {
          id: "playground-vibes-tee",
          name: "Playground Vibes Tee",
          price: 35000,
          description: {
            head: "A must-have for fans of the Lemonade Playground Experience, these classic tees radiate simplicity and charm.",
            color:
              "Available in Black, White, and Pink, perfect for versatile styling.",
            size: "M, L, XL, XXL, ensuring a comfortable fit for everyone.",
            footer:
              "These t-shirts are crafted from premium materials, designed to keep you cool and comfortable while making a bold statement.",
          },
          sizes: ["M", "L", "XL", "XXL"],
          colors: ["Black", "White", "Pink"],
          image:
            "https://tlnevents.com/assets/merch/tees/playground-vibes-tee(pink-back).jpg",
          hasFrontView: true,
          hasBackView: true,
        },

        "rewind-repeat-tee": {
          id: "rewind-repeat-tee",
          name: "Rewind Repeat Tee",
          price: 35000,
          description: {
            head: "A must-have for fans of the Lemonade Playground Experience, these classic tees radiate simplicity and charm.",
            color:
              "Available in Black, White, and Pink, perfect for versatile styling.",
            size: "M, L, XL, XXL, ensuring a comfortable fit for everyone.",
            footer:
              "These t-shirts are crafted from premium materials, designed to keep you cool and comfortable while making a bold statement.",
          },
          sizes: ["M", "L", "XL", "XXL"],
          colors: ["Black", "White", "Pink"],
          image:
            "https://tlnevents.com/assets/merch/tees/rewind-repeat-tee(white-back).jpg",
          hasFrontView: false,
          hasBackView: true,
        },
      },

      "crop-tops": {
        "wrangler-crop-top": {
          id: "wrangler-crop-top",
          name: "Wrangler Crop Top",
          price: 25000,
          description: {
            head: "Bold and striking, this crop top is ideal for making a statement at the event or beyond.",
            color: "Iconic combinations of Black and White and Red and White.",
            size: "S, M, L, XL, XXL.",
            footer:
              "With a Wrangler-inspired edge, this piece brings an effortlessly cool vibe.",
          },
          sizes: ["S", "M", "L", "XL", "XXL"],
          colors: ["Black", "Red"],
          image:
            "https://tlnevents.com/assets/merch/crop-tops/wrangler-crop-top(black-front).jpg",
          hasFrontView: true,
          hasBackView: false,
        },

        "washed-crop-top": {
          id: "washed-crop-top",
          name: "Washed Crop Top",
          price: 25000,
          description: {
            head: "Effortlessly chic with a touch of vintage, the washed crop top is the perfect balance of comfort and style.",
            color: "Subtle tones like White, Black, and Pink.",
            size: "S, M, L, XL, XXL.",
            footer:
              "Its washed aesthetic offers a laid-back, retro charm suitable for all-day wear.",
          },
          sizes: ["S", "M", "L", "XL", "XXL"],
          colors: ["White", "Black"],
          image:
            "https://tlnevents.com/assets/merch/crop-tops/washed-crop-top(black-front).jpg",
          hasFrontView: true,
          hasBackView: false,
        },

        "ringer-baby-crop-top": {
          id: "ringer-baby-crop-top",
          name: "Ringer Baby Crop Top",
          price: 25000,
          description: {
            head: "Cute and sporty, the ringer baby crop top is made to elevate your casual style.",
            color:
              "Fresh combos like Cream and Blue, Black and White, and Pink and Cream.",
            size: "S, M, L, XL.",
            footer:
              "With ringer-style edges and soft fabric, it’s a playful choice for any Lemonade Playground enthusiast.",
          },
          sizes: ["S", "M", "L", "XL"],
          colors: ["Cream & Blue", "Cream & Green"],
          image:
            "https://tlnevents.com/assets/merch/crop-tops/ringer-baby-crop-top(cream&green-front).jpg",
          hasFrontView: true,
          hasBackView: false,
        },
      },
    },

    about: {
      description:
        "Splash Fest is the ultimate water-themed festival bringing fun, games, and music to Alapere! Get ready for water battles, exciting side attractions, and live performances all in one unforgettable evening. It’s more than an event – it’s an experience filled with laughter, energy, and real vibes in Lagos.",
      rating: 18,
      policy:
        "Tickets are non-refundable except in cases of event cancellation or rescheduling.",
    },
    lineup: {
      images: [
        "https://bit.ly/ryan-florence",
        "https://bit.ly/sage-adebayo",
        "https://bit.ly/kent-c-dodds",
      ],
      names: ["Speed Darlington", "Odumodu"],
    },

    vendors: {
      images: [
        "https://bit.ly/ryan-florence",
        "https://bit.ly/sage-adebayo",
        "https://bit.ly/kent-c-dodds",
      ],
      brands: ["Celeb Foods", "Tise Spag", "Korede"],
    },

    organizers: {
      name: "Supreme Moore Nation x The Lemonade Network",
      username: "sumpreme-moore-nation",
      email: "",
      phone: "08025107102",
      socials: {
        website: "",
        instagram: "",
        facebook: "",
        x: "",
        tiktok: "",
        linkedin: "",
      },
    },
  },
  "ikoyi-block-party": {
    id: "ikoyi-block-party",
    url: "ikoyi-block-party",
    image: "https://tlnevents.com/assets/events-banner/ikoyi-block-party.webp",
    name: "Ikoyi Block Party",

    venue: {
      name: "Federal Civil Service Club",
      address: "16, Awolowo Rd, Ikoyi, Lagos",
      city: "Ikoyi",
      state: "Lagos",
      country: "Nigeria",
      zip: "106104",
      latitude: "6.5149",
      longitude: "3.3785",
      iframe:
        "https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d31716.90078624938!2d3.3703679108398434!3d6.4437628000000045!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x103b8b26830760f3%3A0x7f0bed56ce95b1ec!2sFederal%20Civil%20Service%20Club%20Ikoyi!5e0!3m2!1sen!2sng!4v1759860637704!5m2!1sen!2sng",
    },

    date: {
      iso: "2025-12-13T19:00:00Z/2025-12-14T04:00:00Z",
      startDate: "2025-12-13T19:00:00Z",
      endDate: "2025-12-14T04:00:00Z",
      outlookStartDate: "2025-12-13T19:00:00Z",
      outlookEndDate: "2025-12-14T04:00:00Z",
      timeZone: "WAT",
    },

    categories: ["Festival", "Party", "Entertainment"],
    price: 3000,
    percentCharge: 5,

    tickets: [
      {
        id: 1,
        name: "Regular",
        price: 3000,
        quantity: 1000,
        maxQuantity: 5,
        step: 1,
        description: {
          info: "Grants you regular entry access to the biggest Afrobeats rave — Ikoyi Block Party. Enjoy good music, vibes, and crowd energy all night long.",
          perks: [
            "General Entry",
            "Access to Party Grounds",
            "Live Performances",
            "Games & Side Attractions",
          ],
        },
      },
      {
        id: 2,
        name: "Stage Access",
        price: 15000,
        quantity: 300,
        maxQuantity: 2,
        step: 1,
        description: {
          info: "Experience the event closer to the action with premium access to the stage area and exclusive crowd interaction zones.",
          perks: [
            "Stage Area Access",
            "Exclusive Crowd Zone",
            "Live Performances",
            "Backstage Vibe",
          ],
        },
      },
      {
        id: 3,
        name: "Tables (VIP)",
        price: 100000,
        quantity: 20,
        maxQuantity: 1,
        step: 1,
        description: {
          info: "VIP Table experience for you and your squad. Includes bottle service, premium seating, and personalized assistance.",
          perks: [
            "VIP Entry & Seating",
            "Bottle Service",
            "Exclusive Lounge Access",
            "Host & Waiter Support",
          ],
        },
      },
    ],

    merch: {
      tees: {
        "lemonade-tee": {
          id: "lemonade-tee",
          name: "Lemonade Tee",
          price: 35000,
          description: {
            head: "A must-have for fans of the Lemonade Playground Experience, these classic tees radiate simplicity and charm.",
            color:
              "Available in Black, White, and Pink, perfect for versatile styling.",
            size: "M, L, XL, XXL, ensuring a comfortable fit for everyone.",
            footer:
              "These t-shirts are crafted from premium materials, designed to keep you cool and comfortable while making a bold statement.",
          },
          sizes: ["M", "L", "XL", "XXL"],
          colors: ["Black", "White", "Pink"],
          image:
            "https://tlnevents.com/assets/merch/tees/lemonade-tee(black-back).jpg",
          hasFrontView: true,
          hasBackView: true,
        },

        "playground-vibes-tee": {
          id: "playground-vibes-tee",
          name: "Playground Vibes Tee",
          price: 35000,
          description: {
            head: "A must-have for fans of the Lemonade Playground Experience, these classic tees radiate simplicity and charm.",
            color:
              "Available in Black, White, and Pink, perfect for versatile styling.",
            size: "M, L, XL, XXL, ensuring a comfortable fit for everyone.",
            footer:
              "These t-shirts are crafted from premium materials, designed to keep you cool and comfortable while making a bold statement.",
          },
          sizes: ["M", "L", "XL", "XXL"],
          colors: ["Black", "White", "Pink"],
          image:
            "https://tlnevents.com/assets/merch/tees/playground-vibes-tee(pink-back).jpg",
          hasFrontView: true,
          hasBackView: true,
        },

        "rewind-repeat-tee": {
          id: "rewind-repeat-tee",
          name: "Rewind Repeat Tee",
          price: 35000,
          description: {
            head: "A must-have for fans of the Lemonade Playground Experience, these classic tees radiate simplicity and charm.",
            color:
              "Available in Black, White, and Pink, perfect for versatile styling.",
            size: "M, L, XL, XXL, ensuring a comfortable fit for everyone.",
            footer:
              "These t-shirts are crafted from premium materials, designed to keep you cool and comfortable while making a bold statement.",
          },
          sizes: ["M", "L", "XL", "XXL"],
          colors: ["Black", "White", "Pink"],
          image:
            "https://tlnevents.com/assets/merch/tees/rewind-repeat-tee(white-back).jpg",
          hasFrontView: false,
          hasBackView: true,
        },
      },

      "crop-tops": {
        "wrangler-crop-top": {
          id: "wrangler-crop-top",
          name: "Wrangler Crop Top",
          price: 25000,
          description: {
            head: "Bold and striking, this crop top is ideal for making a statement at the event or beyond.",
            color: "Iconic combinations of Black and White and Red and White.",
            size: "S, M, L, XL, XXL.",
            footer:
              "With a Wrangler-inspired edge, this piece brings an effortlessly cool vibe.",
          },
          sizes: ["S", "M", "L", "XL", "XXL"],
          colors: ["Black", "Red"],
          image:
            "https://tlnevents.com/assets/merch/crop-tops/wrangler-crop-top(black-front).jpg",
          hasFrontView: true,
          hasBackView: false,
        },

        "washed-crop-top": {
          id: "washed-crop-top",
          name: "Washed Crop Top",
          price: 25000,
          description: {
            head: "Effortlessly chic with a touch of vintage, the washed crop top is the perfect balance of comfort and style.",
            color: "Subtle tones like White, Black, and Pink.",
            size: "S, M, L, XL, XXL.",
            footer:
              "Its washed aesthetic offers a laid-back, retro charm suitable for all-day wear.",
          },
          sizes: ["S", "M", "L", "XL", "XXL"],
          colors: ["White", "Black"],
          image:
            "https://tlnevents.com/assets/merch/crop-tops/washed-crop-top(black-front).jpg",
          hasFrontView: true,
          hasBackView: false,
        },

        "ringer-baby-crop-top": {
          id: "ringer-baby-crop-top",
          name: "Ringer Baby Crop Top",
          price: 25000,
          description: {
            head: "Cute and sporty, the ringer baby crop top is made to elevate your casual style.",
            color:
              "Fresh combos like Cream and Blue, Black and White, and Pink and Cream.",
            size: "S, M, L, XL.",
            footer:
              "With ringer-style edges and soft fabric, it’s a playful choice for any Lemonade Playground enthusiast.",
          },
          sizes: ["S", "M", "L", "XL"],
          colors: ["Cream & Blue", "Cream & Green"],
          image:
            "https://tlnevents.com/assets/merch/crop-tops/ringer-baby-crop-top(cream&green-front).jpg",
          hasFrontView: true,
          hasBackView: false,
        },
      },
    },

    about: {
      description:
        "The Ikoyi Block Party, hosted by DJ Princz Ent, is set to be the biggest Afrobeats rave in Lagos! Bringing together top DJs, performers, and vibrant Lagos energy, this outdoor experience at Federal Civil Services Club promises unforgettable vibes, great music, and the best crowd in the city.",
      rating: 18,
      policy:
        "Tickets are non-refundable except in cases of event cancellation or rescheduling.",
    },
    lineup: {
      images: [
        "https://bit.ly/ryan-florence",
        "https://bit.ly/sage-adebayo",
        "https://bit.ly/kent-c-dodds",
      ],
      names: ["Speed Darlington", "Odumodu"],
    },

    vendors: {
      images: [
        "https://bit.ly/ryan-florence",
        "https://bit.ly/sage-adebayo",
        "https://bit.ly/kent-c-dodds",
      ],
      brands: ["Celeb Foods", "Tise Spag", "Korede"],
    },

    organizers: {
      name: "DJ Princz Ent",
      username: "dj-princz-ent",
      phone: "08101504456, 08122821178",
      socials: {
        website: "",
        instagram: "",
        facebook: "",
        x: "",
        tiktok: "",
        linkedin: "",
      },
    },
  },
  "art-attack": {
    id: "art-attack",
    url: "art-attack",
    image: "https://tlnevents.com/assets/events-banner/art-attack.webp",
    name: "Art Attack",

    venue: {
      name: "Lemonade Studios",
      address: "65 Queen Street, Alagomeji-Yaba, Lagos 100001, Lagos",
      city: "Alagomeji-Yaba",
      state: "Lagos",
      country: "Nigeria",
      zip: "100001",
      latitude: "6.5149",
      longitude: "3.3785",
      iframe:
        "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3964.152150741183!2d3.378674140517502!3d6.502415094889078!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x103b8c601fb92825%3A0x79aeab96370cd448!2s65%20Queen%20St%2C%20Alagomeji-Yaba%2C%20Lagos%20100001%2C%20Lagos!5e0!3m2!1sen!2sng!4v1755554574183!5m2!1sen!2sng",
    },

    date: {
      iso: "2025-11-29T12:00:00Z/2025-11-29T22:00:00Z",
      startDate: "2025-11-29T12:00:00Z",
      endDate: "2025-11-29T22:00:00Z",
      outlookStartDate: "2025-11-29T12:00:00Z",
      outlookEndDate: "2025-11-29T22:00:00Z",
      timeZone: "WAT",
    },

    categories: ["Art", "Culture", "Festival", "Street Experience"],
    price: 0,
    percentCharge: 5,

    tickets: [
      {
        id: 1,
        name: "General Admission",
        price: 0,
        quantity: 1000,
        maxQuantity: 1,
        step: 1,
        description: {
          info: "Free entry to Art Attack — The Street Canvas Experience. Immerse yourself in live graffiti, body art, exhibitions, and creative street energy.",
          perks: [
            "Access to all exhibitions and activities",
            "Live graffiti and art performances",
            "Face painting and tattoo artistry",
            "Sip & Paint sessions",
            "Merch access and networking opportunities",
          ],
        },
      },
    ],

    formLink:
      "https://docs.google.com/forms/d/e/1FAIpQLSebMxhNbW4qIdpgvg2uMaQeexsHUVw4R146F5NKdnmAJ7QpGw/viewform?usp=dialog",

    merch: {},

    about: {
      description:
        "Art Attack: The Street Canvas Experience is a creative outdoor festival celebrating street culture and visual expression. Powered by the Impossible Bandit Crew in collaboration with The Lemonade Network, the event features live graffiti walls, body art, exhibitions, tattoo artistry, and merch showcases. It's all about unleashing positive chaos — an immersive blend of art, creativity, and Lagos street energy.",
      rating: 13,
      policy:
        "Entry is free. Participation in some activities or merchandise purchases may require on-site payment. All event activities are subject to change based on availability or weather conditions.",
    },

    lineup: {
      images: [],
      names: [],
    },

    vendors: {
      images: [],
      brands: [],
    },

    organizers: {
      name: "Impossible Bandit Crew",
      username: "imb",
      phone: "08101504456",
      socials: {
        website: "",
        instagram: "https://instagram.com/impossiblebandits",
        facebook: "",
        x: "",
        tiktok: "",
        linkedin: "",
      },
    },
  },
  karaoke: {
    id: "karaoke",
    url: "karaoke",
    image: "https://tlnevents.com/assets/events-banner/karaoke.webp",
    name: "Karaoke/ Movie Night",

    venue: {
      name: "Lemonade Studios",
      address: "65 Queen Street, Alagomeji-Yaba, Lagos 100001, Lagos",
      city: "Alagomeji-Yaba",
      state: "Lagos",
      country: "Nigeria",
      zip: "100001",
      latitude: "6.5149",
      longitude: "3.3785",
      iframe:
        "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3964.152150741183!2d3.378674140517502!3d6.502415094889078!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x103b8c601fb92825%3A0x79aeab96370cd448!2s65%20Queen%20St%2C%20Alagomeji-Yaba%2C%20Lagos%20100001%2C%20Lagos!5e0!3m2!1sen!2sng!4v1755554574183!5m2!1sen!2sng",
    },

    date: {
      iso: "2025-12-06T16:00:00Z/2025-12-06T22:00:00Z",
      startDate: "2025-12-06T16:00:00Z",
      endDate: "2025-12-06T22:00:00Z",
      outlookStartDate: "2025-12-06T16:00:00Z",
      outlookEndDate: "2025-12-06T22:00:00Z",
      timeZone: "WAT",
    },

    categories: ["Entertainment", "Chill", "Fun Night"],
    price: 0,
    percentCharge: 5,

    tickets: [
      {
        id: 1,
        name: "General Admission",
        price: 0,
        quantity: 1000,
        maxQuantity: 1,
        step: 1,
        description: {
          info: "Enjoy a relaxed multi-experience evening with karaoke, movies, games and light refreshments.",
          perks: [
            "General Access",
            "Game & Movie Participation",
            "Suya",
            "Popcorn",
          ],
        },
      },
    ],

    merch: {},

    about: {
      description:
        "An intimate entertainment night featuring karaoke, interactive movie sessions, games, and light refreshments. Perfect for hangouts and networking.",
      rating: 18,
      policy: "Free entry — seating based on availability.",
    },

    lineup: {
      images: [],
      names: [],
    },

    vendors: {
      images: [],
      brands: [],
    },

    organizers: {
      name: "The Lemonade Network",
      username: "lemonade.africa",
      phone: "08101504456",
      socials: {
        website: "",
        instagram: "https://instagram.com/lemonade.africa",
        facebook: "",
        x: "",
        tiktok: "",
        linkedin: "",
      },
    },
  },
  fuji: {
    id: "fuji",
    url: "fuji",
    image: "https://tlnevents.com/assets/events-banner/fuji.webp",
    name: "Detty Fuji Groove",

    venue: {
      name: "Delakes Mall",
      address: "Block 26 Plot 8 Admiralty Way, Lekki Phase 1, Eti-Osa, Lagos",
      city: "Lekki",
      state: "Lagos",
      country: "Nigeria",
      zip: "100001",
      latitude: "6.5149",
      longitude: "3.3785",
      iframe:
        "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3964.576457254178!2d3.4766085749922984!3d6.448385693543009!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x103bf56803189701%3A0xf579eecc957e0aa9!2sDELAKES%20MALL!5e0!3m2!1sen!2sng!4v1763657008352!5m2!1sen!2sng",
    },

    date: {
      iso: "2025-12-20T16:00:00Z/2025-12-21T02:00:00Z",
      startDate: "2025-12-20T16:00:00Z",
      endDate: "2025-12-21T102:00:00Z",
      outlookStartDate: "2025-12-20T16:00:00Z",
      outlookEndDate: "2025-12-21T02:00:00Z",
      timeZone: "WAT",
    },

    categories: ["Music", "Cultural Experience", "Party"],
    price: 10000,
    percentCharge: 0,

    tickets: [
      {
        id: 1,
        name: "Regular",
        price: 10000,
        quantity: 1000,
        maxQuantity: 5,
        step: 1,
        description: {
          info: "General access to Detty Fuji Groove with food and drinks included.",
          perks: ["Food Included", "Drinks Included", "General Entry"],
        },
      },
      {
        id: 2,
        name: "VIP",
        price: 20000,
        quantity: 100,
        maxQuantity: 5,
        step: 1,
        description: {
          info: "VIP access with finger foods, drinks, and cocktail service.",
          perks: [
            "VIP Access",
            "Finger Foods",
            "Drinks Included",
            "Cocktail Service",
          ],
        },
      },
      {
        id: 3,
        name: "Ijoye (Table of 10)",
        price: 300000,
        quantity: 100,
        maxQuantity: 1,
        step: 10,
        description: {
          info: "Ijoye hospitality table for 10 guests with top service, food, drinks, and premium comfort.",
          perks: [
            "Table for 10 Guests",
            "Top Service",
            "Food Included",
            "Drinks Included",
            "Premium Comfort Seating",
          ],
        },
      },
      {
        id: 4,
        name: "Oba (Table of 10)",
        price: 500000,
        quantity: 100,
        maxQuantity: 1,
        step: 10,
        description: {
          info: "Oba royal experience table for 10 guests, including front row seating, hype session, and exclusive royal treatments.",
          perks: [
            "Table for 10 Guests",
            "Front Row Seating",
            "Hype Session Access",
            "Royal Treatments",
          ],
        },
      },
    ],

    merch: {},

    about: {
      description:
        "Detty Fuji Groove is a unique cultural-party fusion inspired by Yoruba fuji music, African rhythms, and nightlife dance energy. Prepare for drums, chants, DJ remixes, and modern fuji vibes.",
      rating: 18,
      policy:
        "Entry is free. Participation in some activities or merchandise purchases may require on-site payment. All event activities are subject to change based on availability or weather conditions.",
    },

    lineup: {
      images: [],
      names: [],
    },

    vendors: {
      images: [],
      brands: [],
    },

    organizers: {
      name: "The Lemonade Network",
      username: "tlnevents",
      phone: "08101504456",
      socials: {
        website: "",
        instagram: "https://instagram.com/lemonade.africa",
        facebook: "",
        x: "",
        tiktok: "",
        linkedin: "",
      },
    },
  },
  rcc: {
    id: "rcc",
    url: "rcc",
    image: "https://tlnevents.com/assets/events-banner/placeholder.webp",
    name: "Red Cup Christmas",

    venue: {
      name: "Lemonade Studios",
      address: "65 Queen Street, Alagomeji-Yaba, Lagos 100001, Lagos",
      city: "Alagomeji-Yaba",
      state: "Lagos",
      country: "Nigeria",
      zip: "100001",
      latitude: "6.5149",
      longitude: "3.3785",
      iframe:
        "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3964.152150741183!2d3.378674140517502!3d6.502415094889078!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x103b8c601fb92825%3A0x79aeab96370cd448!2s65%20Queen%20St%2C%20Alagomeji-Yaba%2C%20Lagos%20100001%2C%20Lagos!5e0!3m2!1sen!2sng!4v1755554574183!5m2!1sen!2sng",
    },

    date: {
      iso: "2025-12-24T16:00:00Z/2025-12-24T22:00:00Z",
      startDate: "2025-12-24T16:00:00Z",
      endDate: "2025-12-24T122:00:00Z",
      outlookStartDate: "2025-12-24T16:00:00Z",
      outlookEndDate: "2025-12-24T22:00:00Z",
      timeZone: "WAT",
    },

    categories: ["Art", "Culture", "Festival", "Street Experience"],
    price: 10000,
    percentCharge: 5,

    tickets: [
      {
        id: 1,
        name: "General Admission",
        price: 5000,
        quantity: 1000,
        maxQuantity: 1,
        step: 1,
        description: {
          info: "Free entry to Art Attack — The Street Canvas Experience. Immerse yourself in live graffiti, body art, exhibitions, and creative street energy.",
          perks: [
            "Access to all exhibitions and activities",
            "Live graffiti and art performances",
            "Face painting and tattoo artistry",
            "Sip & Paint sessions",
            "Merch access and networking opportunities",
          ],
        },
      },
    ],

    merch: {},

    about: {
      description:
        "Art Attack: The Street Canvas Experience is a creative outdoor festival celebrating street culture and visual expression. Powered by the Impossible Bandit Crew in collaboration with The Lemonade Network, the event features live graffiti walls, body art, exhibitions, tattoo artistry, and merch showcases. It's all about unleashing positive chaos — an immersive blend of art, creativity, and Lagos street energy.",
      rating: 18,
      policy:
        "Entry is free. Participation in some activities or merchandise purchases may require on-site payment. All event activities are subject to change based on availability or weather conditions.",
    },

    lineup: {
      images: [],
      names: [],
    },

    vendors: {
      images: [],
      brands: [],
    },

    organizers: {
      name: "The Lemonade Network",
      username: "tlnevents",
      phone: "08101504456",
      socials: {
        website: "",
        instagram: "https://instagram.com/lemonade.africa",
        facebook: "",
        x: "",
        tiktok: "",
        linkedin: "",
      },
    },
  },
  "sounds-of-music": {
    id: "sounds-of-music",
    url: "sounds-of-music",
    image: "https://tlnevents.com/assets/events-banner/sounds-of-music.webp",
    name: "Sounds of Music",

    venue: {
      name: "Alliance Française de Lagos / Mike Adenuga Centre",
      address: "9 Osborne Rd, Ikoyi, Lagos 106104, Lagos",
      city: "Ikoyi",
      state: "Lagos",
      country: "Nigeria",
      zip: "106104",
      latitude: "6.46013",
      longitude: "3.42985",
      iframe:
        "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3964.484506576953!2d3.4298478749923955!3d6.460132493531451!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x103b8c62047310d9%3A0x57d99c5ac7b36931!2sAlliance%20Fran%C3%A7aise%20de%20Lagos%20%2F%20Mike%20Adenuga%20Centre!5e0!3m2!1sen!2sng!4v1763862774784!5m2!1sen!2sng",
    },

    date: {
      iso: "2025-12-12T17:00:00Z/2025-12-12T20:30:00Z",
      startDate: "2025-12-12T17:00:00Z",
      endDate: "2025-12-12T20:30:00Z",
      outlookStartDate: "2025-12-12T17:00:00Z",
      outlookEndDate: "2025-12-12T20:30:00Z",
      timeZone: "WAT",
    },

    categories: ["Music", "Art", "Culture", "Live Performance", "Orchestra"],
    price: 40000,
    percentCharge: 0,

    tickets: [
      {
        id: 1,
        name: "Adult",
        price: 40000,
        quantity: 50,
        maxQuantity: 10,
        step: 1,
        description: {
          info: "Access to Sounds of Music — an orchestral and fusion performance evening featuring live ensembles, special musical collaborations, and artistic showcases.",
          perks: [
            "Entry into the full orchestral and fusion performance",
            "Access to all musical features and live showcases",
            "Enjoy performances from top instrumentalists and dance groups",
            "Networking with performers, creators, and attendees",
          ],
        },
      },
      {
        id: 2,
        name: "Children",
        price: 35000,
        quantity: 50,
        maxQuantity: 10,
        step: 1,
        description: {
          info: "Access to Sounds of Music — an orchestral and fusion performance evening featuring live ensembles, special musical collaborations, and artistic showcases.",
          perks: [
            "Entry into the full orchestral and fusion performance",
            "Access to all musical features and live showcases",
            "Enjoy performances from top instrumentalists and dance groups",
            "Networking with performers, creators, and attendees",
          ],
        },
      },
    ],

    merch: {},

    about: {
      description:
        "Sounds of Music is a refined orchestral and fusion showcase designed to highlight classical excellence, instrumental brilliance, and artistic performance culture in Lagos. The evening features chamber ensembles, saxophone artistry, violin fusion, contemporary dance, and collaborative musical expressions. Hosted by Diana Egwuatu, the event promises a rich blend of soundscapes, creativity, and cultural depth.",
      rating: 13,
      policy:
        "Tickets admit one attendee. All sales are final unless otherwise stated. Guests are expected to arrive on time to ensure a seamless classical performance experience. Activities and performers are subject to updates by the organizers.",
    },
    lineup: {
      images: [],
      names: [],
    },

    vendors: {
      images: [],
      brands: [],
    },

    organizers: {
      name: "Sounds of Music Organizing Committee",
      username: "soundsofmusic",
      phone: "",
      socials: {
        website: "",
        instagram: "",
        facebook: "",
        x: "",
        tiktok: "",
        linkedin: "",
      },
    },
  },
};
