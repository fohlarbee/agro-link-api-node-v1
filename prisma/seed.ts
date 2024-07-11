import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const userData = [
  {
    name: 'John Doe',
    email: 'johndoe@example.com',
    "password":"Sammyola246@1"
    
  },
  {
    name: 'Jane Doe',
    email: 'janedoe@example.com',
    "password":"Sammyola246@1"

  },
];

const businessData =  [
  {
      "name": "John's Restaurant",
      "cacNumber": "RC123456",
      "phoneNumber": "08012345678",
    //   "type": "restaurant",
      "email": "johnsrestaurant@example.com",
      "creatorId":2
    },
    {
      "name": "The Bar",
      "cacNumber": "RC789012",
      "phoneNumber": "07098765432",
    //   "type": "bar",
      "email": "thebar@example.com",
      "creatorId":2

    },
    {
      "name": "Jane's Cafe",
      "cacNumber": "RC345678",
      "phoneNumber": "08123456789",
    //   "type": "restaurant",
      "email": "janescafe@example.com",
      "creatorId":2

    },
    {
      "name": "The Pub",
      "cacNumber": "RC901234",
      "phoneNumber": "07012345678",
    //   "type": "bar",
      "email": "thepub@example.com",
      "creatorId":1
,

    },
    {
      "name": "Bobby's Bistro",
      "cacNumber": "RC567890",
      "phoneNumber": "08098765432",
    //   "type": "restaurant",
      "email": "bobbysbistro@example.com",
      "creatorId":1

    },
    {
        "name": "Tasty Tacos",
        "cacNumber": "RC654321",
        "phoneNumber": "08111111111",
        // "type": "restaurant",
        "email": "tastytacos@example.com",
        "creatorId": 2
      },
      {
        "name": "The Coffee Spot",
        "cacNumber": "RC333333",
        "phoneNumber": "07022222222",
        // "type": "bar",
        "email": "thecoffeespot@example.com",
        "creatorId": 2
      },
      {
        "name": "Burger Barn",
        "cacNumber": "RC999999",
        "phoneNumber": "08033333333",
        // "type": "restaurant",
        "email": "burgerbarn@example.com",
        "creatorId": 1
      },
      {
        "name": "Sushi Palace",
        "cacNumber": "RC888888",
        "phoneNumber": "08144444444",
        // "type": "restaurant",
        "email": "sushipalace@example.com",
        "creatorId": 2
      },
      {
        "name": "The Pizza Place",
        "cacNumber": "RC777777",
        "phoneNumber": "07055555555",
        // "type": "restaurant",
        "email": "thepizzaplace@example.com",
        "creatorId": 1
      },
      {
        "name": "The Grill House",
        "cacNumber": "RC666666",
        "phoneNumber": "08066666666",
        // "type": "restaurant",
        "email": "thegrillhouse@example.com",
        "creatorId": 2
      },
      {
        "name": "The Sandwich Shop",
        "cacNumber": "RC555555",
        "phoneNumber": "08177777777",
        // "type": "restaurant",
        "email": "thesandwichshop@example.com",
        "creatorId": 1
      },
      {
        "name": "The Ice Cream Parlor",
        "cacNumber": "RC444444",
        "phoneNumber": "07088888888",
        // "type": "bar",
        "email": "theicecreamparlor@example.com",
        "creatorId": 2
      },
      {
        "name": "The Donut Shop",
        "cacNumber": "RC333333",
        "phoneNumber": "08099999999",
        // "type": "restaurant",
        "email": "thedonutshop@example.com",
        "creatorId": 1
      },
      {
        "name": "The Candy Store",
        "cacNumber": "RC222222",
        "phoneNumber": "08100000000",
        // "type": "bar",
        "email": "thecandystore@example.com",
        "creatorId": 1
      }
  ]

  const menuData = [
    
        {
          "id": 1,
          "name": "All",
          "businessId": 1
        },
        {
          "id": 2,
          "name": "Restaurant",
          "businessId": 5
        },
        {
          "id": 3,
          "name": "Bar",
          "businessId": 3
        },
        {
          "id": 4,
          "name": "Coffee Shop",
          "businessId": 2
        },
        {
          "id": 5,
          "name": "Hotel",
          "businessId": 8
        },
        {
          "id": 6,
          "name": "Retail Store",
          "businessId": 4
        },
        {
          "id": 7,
          "name": "Food Truck",
          "businessId": 1
        },
        {
          "id": 8,
          "name": "Event Space",
          "businessId": 9
        },
        {
          "id": 9,
          "name": "Spa",
          "businessId": 6
        },
        {
          "id": 10,
          "name": "Gym",
          "businessId": 7
        },
        {
          "id": 11,
          "name": "Yoga Studio",
          "businessId": 3
        },
        {
          "id": 12,
          "name": "Art Gallery",
          "businessId": 5
        },
        {
          "id": 13,
          "name": "Music Venue",
          "businessId": 2
        },
        {
          "id": 14,
          "name": "Theater",
          "businessId": 1
        },
        {
          "id": 15,
          "name": "Museum",
          "businessId": 9
        },
        {
          "id": 16,
          "name": "Park",
          "businessId": 4
        },
        {
          "id": 17,
          "name": "Library",
          "businessId": 6
        },
        {
          "id": 18,
          "name": "School",
          "businessId": 8
        },
        {
          "id": 19,
          "name": "Hospital",
          "businessId": 7
        },
        {
          "id": 20,
          "name": "Office Building",
          "businessId": 5
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
           "businessId": 14
        } ]

    const roleData =[
        {
          "name": "admin",
          "businessId": 1
        },
        {
          "name": "owner",
          "businessId": 2
        },
        {
          "name": "vendor",
          "businessId": 3
        },
        {
          "name": "admin",
          "businessId": 4
        },
        {
          "name": "owner",
          "businessId": 5
        },
        {
          "name": "vendor",
          "businessId": 6
        },
        {
          "name": "admin",
          "businessId": 7
        },
        {
          "name": "owner",
          "businessId": 8
        },
        {
          "name": "vendor",
          "businessId": 9
        },
        {
          "name": "admin",
          "businessId": 10
        },
        {
          "name": "owner",
          "businessId": 11
        },
        {
          "name": "vendor",
          "businessId": 12
        },
        {
          "name": "admin",
          "businessId": 13
        },
        {
          "name": "owner",
          "businessId": 14
        },
        {
          "name": "vendor",
          "businessId": 15
        },
        {
          "name": "admin",
          "businessId": 15
        },
        {
          "name": "owner",
          "businessId": 1
        },
        {
          "name": "vendor",
          "businessId": 5
        },
        {
          "name": "admin",
          "businessId": 5
        },
        {
          "name": "owner",
          "businessId":6
        },
        {
          "name": "vendor",
          "businessId": 6
        },
        {
          "name": "admin",
          "businessId": 6
        },
        {
          "name": "owner",
          "businessId": 2
        },
        {
          "name": "vendor",
          "businessId": 5
        },
        {
          "name": "admin",
          "businessId": 6
        },
        {
          "name": "owner",
          "businessId": 5
        },
        {
          "name": "vendor",
          "businessId": 2
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
          "name": "vendor",
          "businessId":6
        },
        {
          "name": "admin",
          "businessId":12
        },
        {
          "name": "owner",
          "businessId": 13
        },
        {
          "name": "vendor",
          "businessId": 12
        },
        {
          "name": "admin",
          "businessId": 11
        },
        {
          "name": "owner",
          "businessId": 10
        },
        {
          "name": "vendor",
          "businessId": 11
        },
        {
          "name": "admin",
          "businessId": 12
        },
        {
          "name": "owner",
          "businessId": 8
        },
        {
          "name": "vendor",
          "businessId": 9
        },
        {
          "name": "admin",
          "businessId": 7
        }
      ]


    const staffData = [
        {
          "userId": 1,
          "businessId": 1,
          "roleId": 1
        },
        {
          "userId": 2,
          "businessId": 2,
          "roleId": 2
        },
        {
          "userId": 3,
          "businessId": 3,
          "roleId": 3
        },
        {
          "userId": 1,
          "businessId": 4,
          "roleId": 4
        },
        {
          "userId": 2,
          "businessId": 5,
          "roleId": 5
        },
        {
          "userId": 3,
          "businessId": 6,
          "roleId": 6
        },
        {
          "userId": 1,
          "businessId": 7,
          "roleId": 7
        },
        {
          "userId": 2,
          "businessId": 8,
          "roleId": 8
        },
        {
          "userId": 3,
          "businessId": 9,
          "roleId": 9
        },
        {
          "userId": 1,
          "businessId": 10,
          "roleId": 10
        },
        {
          "userId": 2,
          "businessId": 11,
          "roleId": 11
        },
        {
          "userId": 3,
          "businessId": 12,
          "roleId": 12
        },
        {
          "userId": 1,
          "businessId": 13,
          "roleId": 13
        },
        {
          "userId": 2,
          "businessId": 14,
          "roleId": 14
        },
        {
          "userId": 3,
          "businessId": 15,
          "roleId": 15
        },
        {
          "userId": 1,
          "businessId": 16,
          "roleId": 16
        },
        {
          "userId": 2,
          "businessId": 17,
          "roleId": 17
        },
        {
          "userId": 3,
          "businessId": 18,
          "roleId": 18
        },
        {
          "userId": 1,
          "businessId": 19,
          "roleId": 19
        },
        {
          "userId": 2,
          "businessId": 20,
          "roleId": 20
        },
        {
          "userId": 1,
          "businessId": 1,
          "roleId": 1
        },
        {
          "userId": 2,
          "businessId": 2,
          "roleId": 2
        },
        {
          "userId": 3,
          "businessId": 3,
          "roleId": 3
        },
        {
          "userId": 1,
          "businessId": 4,
          "roleId": 4
        },
        {
          "userId": 2,
          "businessId": 5,
          "roleId": 5
        },
        {
          "userId": 3,
          "businessId": 6,
          "roleId": 6
        },
        {
          "userId": 1,
          "businessId": 7,
          "roleId": 7
        },
        {
          "userId": 2,
          "businessId": 8,
          "roleId": 8
        },
        {
          "userId": 3,
          "businessId": 9,
          "roleId": 9
        },
        {
          "userId": 1,
          "businessId": 10,
          "roleId": 10
        },
        {
          "userId": 2,
          "businessId": 11,
          "roleId": 11
        },
        {
          "userId": 3,
          "businessId": 12,
          "roleId": 12
        },
        {
          "userId": 1,
          "businessId": 13,
          "roleId": 13
        },
        {
          "userId": 2,
          "businessId": 14,
          "roleId": 14
        },
        {
          "userId": 3,
          "businessId": 15,
          "roleId": 15
        },
        {
          "userId": 1,
          "businessId": 16,
          "roleId": 16
        },
        {
          "userId": 2,
          "businessId": 17,
          "roleId": 17
        },
        {
          "userId": 3,
          "businessId": 18,
          "roleId": 18
        },
        {
          "userId": 1,
          "businessId": 19,
          "roleId":5
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