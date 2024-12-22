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
};
