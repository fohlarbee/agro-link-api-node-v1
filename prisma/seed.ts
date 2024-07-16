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
      
      ]


      const staffData = [
        {
          "userId": 1,
          "businessId": 1,
          "roleId": 1,
        },
        {
          "userId": 2,
          "businessId": 2,
          "roleId": 2,
        },
        {
          "userId": 3,
          "businessId": 3,
          "roleId": 1,
        },
        {
          "userId": 4,
          "businessId": 4,
          "roleId": 2,
        },
        {
          "userId": 5,
          "businessId": 5,
          "roleId": 1,
        },
        {
          "userId": 6,
          "businessId": 6,
          "roleId": 2,
        },
        {
          "userId": 7,
          "businessId": 7,
          "roleId": 1,
        },
        {
          "userId": 8,
          "businessId": 8,
          "roleId": 2,
        },
        {
          "userId": 9,
          "businessId": 9,
          "roleId": 1,
        },
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