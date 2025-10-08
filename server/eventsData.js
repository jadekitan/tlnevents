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
    image: "https://tlnevents.com/assets/events-banner/silent-disco.webp",
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
      iso: "2025-08-31T16:00:00Z/2025-08-31T22:00:00Z",
      startDate: "2025-08-31T16:00:00Z",
      endDate: "2025-08-31T22:00:00Z",
      outlookStartDate: "2025-08-31T16:00:00Z",
      outlookEndDate: "2025-08-31T22:00:00Z",
      timeZone: "WAT",
    },

    categories: ["Party"],
    price: 5000,

    tickets: [
      {
        id: 1,
        name: "General",
        price: 5000,
        quantity: 100,
        maxQuantity: 5,
        step: 1,
        description: {
          info: "This Entry Ticket grants you full access to the entire experience, designed to keep you entertained, engaged, and immersed in the lively atmosphere!",
          perks: ["Regular Entry"],
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
        "Step into Jay’s Silent Disco – where the beats never stop, but the noise stays personal! Grab your wireless headphones and choose from multiple DJ channels as you dance the night away in Lemonade Studios. It’s not just music, it’s an immersive experience that lets you control your vibe – switch between hip hop, afrobeats, or EDM, and groove with friends under one roof. Whether you’re vibing with the crowd or lost in your own world, Jay’s Silent Disco promises unforgettable energy, laughter, and pure nightlife magic in Lagos.",
      rating: 18,
      policy:
        "Refunds are available if: (1) It’s within 24 hours of purchasing a ticket, or (2) The event is rescheduled or cancelled.",
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
};
