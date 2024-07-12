import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const userData = [
  {
    "name": "John Doe",
    "email": 'johndoe@example.com',
    "password":"Sammyola246@1"
    
  },
  {
    "name": 'Jane Doe',
    "email": 'janedoe@example.com',
    "password":"Sammyola246@1"

  },
  {
    "name": "Jane Smith",
    "email": 'janesmith@example.com',
    "password": "Password123!"
    },
    {
    "name": "Michael Brown",
    "email": 'michaelbrown@example.com',
    "password": "MB123456!"
    },
    {
    "name": "Emily Davis",
    "email": 'emilydavis@example.com',
    "password": "ED123456!"
    },
    {
    "name": "Christopher Lee",
    "email": 'christopherlee@example.com',
    "password": "CL123456!"
    },
    {
    "name": "Jessica White",
    "email": 'jessicawhite@example.com',
    "password": "JW123456!"
    },
    {
    "name": "Matthew Martin",
    "email": 'matthewmartin@example.com',
    "password": "MM123456!"
    },
    {
    "name": "Amanda Johnson",
    "email": 'amandajohnson@example.com',
    "password": "AJ123456!"
    },
    {
    "name": "Daniel Williams",
    "email": 'danielwilliams@example.com',
    "password": "DW123456!"
    },
    {
    "name": "Elizabeth Thompson",
    "email": 'elizabeththompson@example.com',
    "password": "ET123456!"
    },
    {
    "name": "Joseph Lewis",
    "email": 'josephlewis@example.com',
    "password": "JL123456!"
    },
    {
    "name": "Laura Harris",
    "email": 'lauraharris@example.com',
    "password": "LH123456!"
    },
    {
    "name": "Thomas Hall",
    "email": 'thomashall@example.com',
    "password": "TH123456!"
    },
    {
    "name": "Sophia Jackson",
    "email": 'sophiajackson@example.com',
    "password": "SJ123456!"
    },
    {
      "name": "Emily Chen",
      "email": 'emilychen@example.com',
      "password": "EC123456!"
      },
      {
      "name": "Michael Kim",
      "email": 'michaelkim@example.com',
      "password": "MK123456!"
      },
      {
      "name": "Sarah Taylor",
      "email": 'sarahtaylor@example.com',
      "password": "ST123456!"
      },
      {
      "name": "David Lee",
      "email": 'davidlee@example.com',
      "password": "DL123456!"
      },
      {
      "name": "Olivia Brown",
      "email": 'oliviabrown@example.com',
      "password": "OB123456!"
      },
      {
      "name": "Kevin White",
      "email": 'kevinwhite@example.com',
      "password": "KW123456"
      }
    
    
];

const businessData =  [
  {
      "name": "John's Restaurant",
      "cacNumber": "RC123456",
      "phoneNumber": "08012345678",
      "email": "johnsrestaurant@example.com",
      "creatorId":2
    },
    {
      "name": "The Bar",
      "cacNumber": "RC789012",
      "phoneNumber": "07098765432",
      "email": "thebar@example.com",
      "creatorId":2

    },
    {
      "name": "Jane's Cafe",
      "cacNumber": "RC345678",
      "phoneNumber": "08123456789",
      "email": "janescafe@example.com",
      "creatorId":2

    },
    {
      "name": "The Pub",
      "cacNumber": "RC901234",
      "phoneNumber": "07012345678",
      "email": "thepub@example.com",
      "creatorId":1
    },
    {
      "name": "Bobby's Bistro",
      "cacNumber": "RC567890",
      "phoneNumber": "08098765432",
      "email": "bobbysbistro@example.com",
      "creatorId":1

    },
    {
        "name": "Tasty Tacos",
        "cacNumber": "RC654321",
        "phoneNumber": "08111111111",
        "email": "tastytacos@example.com",
        "creatorId": 4
      },
      {
        "name": "The Coffee Spot",
        "cacNumber": "RC333333",
        "phoneNumber": "07022222222",
        "email": "thecoffeespot@example.com",
        "creatorId": 5
      },
      {
        "name": "Burger Barn",
        "cacNumber": "RC999999",
        "phoneNumber": "08033333333",
        "email": "burgerbarn@example.com",
        "creatorId": 6
      },
      {
        "name": "Sushi Palace",
        "cacNumber": "RC888888",
        "phoneNumber": "08144444444",
        "email": "sushipalace@example.com",
        "creatorId": 7
      },
      {
        "name": "The Pizza Place",
        "cacNumber": "RC777777",
        "phoneNumber": "07055555555",
        "email": "thepizzaplace@example.com",
        "creatorId": 8
      },
      {
        "name": "The Grill House",
        "cacNumber": "RC666666",
        "phoneNumber": "08066666666",
        "email": "thegrillhouse@example.com",
        "creatorId": 9
      },
      {
        "name": "The Sandwich Shop",
        "cacNumber": "RC555555",
        "phoneNumber": "08177777777",
        "email": "thesandwichshop@example.com",
        "creatorId": 10
      },
      {
        "name": "The Ice Cream Parlor",
        "cacNumber": "RC444444",
        "phoneNumber": "07088888888",
        "email": "theicecreamparlor@example.com",
        "creatorId": 11
      },
      {
        "name": "The Donut Shop",
        "cacNumber": "RC333333",
        "phoneNumber": "08099999999",
        "email": "thedonutshop@example.com",
        "creatorId": 12
      },
      {
        "name": "The Candy Store",
        "cacNumber": "RC222222",
        "phoneNumber": "08100000000",
        "email": "thecandystore@example.com",
        "creatorId": 1
      }
  ]

  const menuData = [
    
        {
          "businessId": 1
        },
        {
          "name": "Relieve Plate",
          "businessId": 5
        },
        {
          "name": "Menu pot",
          "businessId": 3
        },
        {
          "name": "Coffee Shop",
          "businessId": 2
        },
        {
          "name": "Hotel",
          "businessId": 8
        },
        {
          "name": "Retail Store",
          "businessId": 4
        },
        {
          "name": "Food Truck",
          "businessId": 6
        },
        {
          "name": "Event Space",
          "businessId": 7
        },
        {
          "name": "Spa",
          "businessId": 9
        },
        {
          "name": "Gym",
          "businessId": 10
        },
        {
          "name": "Yoga Studio",
          "businessId": 11
        },
        {
          "name": "Art Gallery",
          "businessId": 12
        },
        {
          "name": "Music Venue",
          "businessId": 13
        },
        {
          "name": "Theater",
          "businessId": 14
        },
        {
          "name": "Museum",
          "businessId": 15
        },
        {
          "name": "Park",
          "businessId": 16
        },
        {
          "name": "Library",
          "businessId": 17
        },
        {
          "name": "School",
          "businessId": 18
        },
        {
          "name": "Hospital",
          "businessId": 19
        },
        {
          "name": "Office Building",
          "businessId": 20
        }
  ]
  const optionsData = 
    [
        {
          "name": "Product 1",
          "price": 10.99,
          "image": "image1.jpg",
          "businessId": 1
        },
        {
          "name": "Product 2",
          "price": 9.99,
          "image": "image2.jpg",
          "businessId": 2
        },
        {
          "name": "Product 3",
          "price": 12.99,
          "image": "image3.jpg",
          "businessId": 3
        },
        {
          "name": "Product 4",
          "price": 11.99,
          "image": "image4.jpg",
          "businessId": 4
        },
        {
          "name": "Product 5",
          "price": 10.99,
          "image": "image5.jpg",
          "businessId": 5
        },
        {
          "name": "Product 6",
          "price": 9.99,
          "image": "image6.jpg",
          "businessId": 6
        },
        {
          "name": "Product 7",
          "price": 12.99,
          "image": "image7.jpg",
          "businessId": 7
        },
        {
          "name": "Product 8",
          "price": 11.99,
          "image": "image8.jpg",
          "businessId": 8
        },
        {
          "name": "Product 9",
          "price": 10.99,
          "image": "image9.jpg",
          "businessId": 9
        },
        {
          "name": "Product 10",
          "price": 9.99,
          "image": "image10.jpg",
          "businessId": 10
        },
        {
          "name": "Product 11",
          "price": 12.99,
          "image": "image11.jpg",
          "businessId": 11
        },
        {
          "name": "Product 12",
          "price": 11.99,
          "image": "image12.jpg",
          "businessId": 12
        },
        {
          "name": "Product 13",
          "price": 10.99,
          "image": "image13.jpg",
          "businessId": 13
        },
        {
          "name": "Product 14",
          "price": 9.99,
          "image": "image14.jpg",
          "businessId": 14
        },
        {
          "name": "Product 15",
          "price": 12.99,
          "image": "image15.jpg",
          "businessId": 15
        },
        {
          "name": "Product 16",
          "price": 11.99,
          "image": "image16.jpg",
          "businessId": 1
        },
        {
          "name": "Product 17",
          "price": 10.99,
          "image": "image17.jpg",
          "businessId": 1
        },
        {
          "name": "Product 18",
          "price": 9.99,
          "image": "image18.jpg",
          "businessId": 4
        },
        {
          "name": "Product 19",
          "price": 12.99,
          "image": "image19.jpg",
           "businessId": 5
        },
        {
          "name": "Product 20",
          "price": 12.99,
          "image": "image20.jpg",
           "businessId": 6
        }  
      ]

    const roleData = [
        {
          "name": "admin",
          "businessId": 1
        },
        {
          "name": "owner",
          "businessId": 1
        },

        {
          "name": "admin",
          "businessId": 2
        },
        {
          "name": "owner",
          "businessId": 2
        },
        {
          "name": "admin",
          "businessId": 3
        },
        {
          "name": "owner",
          "businessId": 3
        },
        {
          "name": "admin",
          "businessId": 4
        },
        {
          "name": "owner",
          "businessId": 4
        },
        {
          "name": "admin",
          "businessId": 5
        },
        {
          "name": "owner",
          "businessId": 5
        },
        {
          "name": "admin",
          "businessId": 6
        },
        {
          "name": "owner",
          "businessId": 6
        },
        {
          "name": "admin",
          "businessId": 7
        },
        {
          "name": "owner",
          "businessId": 7
        },
        {
          "name": "admin",
          "businessId": 8
        },
        {
          "name": "owner",
          "businessId": 8
        },
        {
          "name": "admin",
          "businessId": 9
        },
        {
          "name": "owner",
          "businessId":9
        },
        {
          "name": "admin",
          "businessId": 10
        },
        {
          "name": "owner",
          "businessId": 10
        },
        {
          "name": "admin",
          "businessId": 11
        },
        {
          "name": "owner",
          "businessId": 11
        },
        {
          "name": "admin",
          "businessId": 12
        },
        {
          "name": "owner",
          "businessId": 12
        },
        {
          "name": "admin",
          "businessId": 13
        },
        {
          "name": "owner",
          "businessId": 13
        },
        {
          "name": "admin",
          "businessId": 14
        },
        {
          "name": "owner",
          "businessId":14
        },
        {
          "name": "admin",
          "businessId":15
        },
        {
          "name": "owner",
          "businessId": 15
        },
        {
          "name": "admin",
          "businessId": 16
        },
        {
          "name": "owner",
          "businessId": 16
        },
        {
          "name": "admin",
          "businessId": 17
        },
        {
          "name": "owner",
          "businessId": 17
        },
        {
          "name": "admin",
          "businessId": 18
        },
        {
          "name": "owner",
          "businessId": 18
        },
        {
          "name": "admin",
          "businessId": 19
        },
        {
          "name": "owner",
          "businessId": 19
        }
      ]


      const staffData = [
        {
          "userId": 1,
          "businessId": 1,
          "roleId": 1,
          "email": "staff1@example.com"
        },
        {
          "userId": 2,
          "businessId": 2,
          "roleId": 2,
          "email": "staff2@example.com"
        },
        {
          "userId": 3,
          "businessId": 3,
          "roleId": 1,
          "email": "staff3@example.com"
        },
        {
          "userId": 4,
          "businessId": 4,
          "roleId": 2,
          "email": "staff4@example.com"
        },
        {
          "userId": 5,
          "businessId": 5,
          "roleId": 1,
          "email": "staff5@example.com"
        },
        {
          "userId": 6,
          "businessId": 6,
          "roleId": 2,
          "email": "staff6@example.com"
        },
        {
          "userId": 7,
          "businessId": 7,
          "roleId": 1,
          "email": "staff7@example.com"
        },
        {
          "userId": 8,
          "businessId": 8,
          "roleId": 2,
          "email": "staff8@example.com"
        },
        {
          "userId": 9,
          "businessId": 9,
          "roleId": 1,
          "email": "staff9@example.com"
        },
        {
          "userId": 10,
          "businessId": 10,
          "roleId": 2,
          "email": "staff10@example.com"
        },
        {
          "userId": 11,
          "businessId": 11,
          "roleId": 1,
          "email": "staff11@example.com"
        },
        {
          "userId": 12,
          "businessId": 12,
          "roleId": 2,
          "email": "staff12@example.com"
        },
        {
          "userId": 13,
          "businessId": 13,
          "roleId": 1,
          "email": "staff13@example.com"
        },
        {
          "userId": 14,
          "businessId": 14,
          "roleId": 2,
          "email": "staff14@example.com"
        },
        {
          "userId": 15,
          "businessId": 15,
          "roleId": 1,
          "email": "staff15@example.com"
        },
        {
          "userId": 16,
          "businessId": 16,
          "roleId": 2,
          "email": "staff16@example.com"
        },
        {
          "userId": 17,
          "businessId": 17,
          "roleId": 1,
          "email": "staff17@example.com"
        },
        {
          "userId": 18,
          "businessId": 18,
          "roleId": 2,
          "email": "staff18@example.com"
        },
        {
          "userId": 19,
          "businessId": 19,
          "roleId": 1,
          "email": "staff19@example.com"
        },
        {
          "userId": 20,
          "businessId": 20,
          "roleId": 2,
          "email": "staff20@example.com"
        }
      ]


async function main() {
  await prisma.user.createMany({ data: userData });
  await prisma.business.createMany({ data: businessData });
  await prisma.menu.createMany({ data: menuData });
  await prisma.option.createMany({ data: optionsData });
  await prisma.role.createMany({ data: roleData });
  await prisma.staff.createMany({ data: staffData });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });