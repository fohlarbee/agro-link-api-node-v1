// /* eslint-disable @typescript-eslint/no-unused-vars */
// /* eslint-disable prettier/prettier */
// import { GuardRoles, MenuType, OrderStatus, PrismaClient } from '@prisma/client';
// import * as bcrypt from 'bcrypt';
// import { v4 as uuidv4 } from "uuid";


// const prisma = new PrismaClient();

// const users = [
//   {
//     "name": "John Doe",
//     "email": 'johndoe@example.com',
//     "password":"Sammyola246@1",
//     "role":GuardRoles.customer,
//     "deviceUUID":'SSB234NAC3'

    
//   },
//   {
//     "name": 'Jane Doe',
//     "email": 'janedoe@example.com',
//     "password":"Sammyola246@1",
//     "role":GuardRoles.customer,
//     "deviceUUID":'BNM234NAC20'



//   },
//   {
//     "name": "Jane Smith",
//     "email": 'janesmith@example.com',
//     "password": "Password123!",
//     "role":GuardRoles.customer,
//     "deviceUUID":'XCF234NAC4'


//     },
//     {
//     "name": "Michael Brown",
//     "email": 'michaelbrown@example.com',
//     "password": "MB123456!",
//     "role":GuardRoles.customer,
//     "deviceUUID":'RTY234NAC5'


//     },
//     {
//     "name": "Emily Davis",
//     "email": 'emilydavis@example.com',
//     "password": "ED123456!",
//     "role":GuardRoles.customer,
//     "deviceUUID":'FVG234NAC6'


//     },
//     {
//     "name": "Christopher Lee",
//     "email": 'christopherlee@example.com',
//     "password": "CL123456!",
//     "role":GuardRoles.customer,
//     "deviceUUID":'BNM234NAC7'


//     },
//     {
//     "name": "Jessica White",
//     "email": 'jessicawhite@example.com',
//     "password": "JW123456!",
//     "role":GuardRoles.customer,
//     "deviceUUID":'VBN234NAC8'


//     },
//     {
//     "name": "Matthew Martin",
//     "email": 'matthewmartin@example.com',
//     "password": "MM123456!",
//     "role":GuardRoles.customer,
//     "deviceUUID":'MKN234NAC9'


//     },
//     {
//     "name": "Amanda Johnson",
//     "email": 'amandajohnson@example.com',
//     "password": "AJ123456!",
//     "role":GuardRoles.customer,
//     "deviceUUID":'POI234NAC10'

//     },
//     {
//     "name": "Daniel Williams",
//     "email": 'danielwilliams@example.com',
//     "password": "DW123456!",
//     "role":GuardRoles.customer,
//     "deviceUUID":'LKJ234NAC11',


//     },
//     {
//     "name": "Elizabeth Thompson",
//     "email": 'elizabeththompson@example.com',
//     "password": "ET123456!",
//     "role":GuardRoles.customer,
//     "deviceUUID":'ZXCV234NAC12'


//     },
//     {
//     "name": "Joseph Lewis",
//     "email": 'josephlewis@example.com',
//     "password": "JL123456!",
//     "role":GuardRoles.customer,
//     "deviceUUID":'QWERT234NAC13'


//     },
//     {
//     "name": "Laura Harris",
//     "email": 'lauraharris@example.com',
//     "password": "LH123456!",
//     "role": GuardRoles.customer,
//     "deviceUUID":'YUIO234NAC14'

//     },
//     {
//     "name": "Thomas Hall",
//     "email": 'thomashall@example.com',
//     "password": "TH123456!",
//     "role":GuardRoles.customer,
//     "deviceUUID":'TYUI234NAC15'


//     },
//     {
//     "name": "Sophia Jackson",
//     "email": 'sophiajackson@example.com',
//     "password": "SJ123456!",
//     "role":GuardRoles.customer,
//     "deviceUUID":'RFGN234NAC16'

//     },
//     {
//       "name": "Emily Chen",
//       "email": 'emilychen@example.com',
//       "password": "EC123456!",
//       "role":GuardRoles.customer,
//       "deviceUUID":'MNBV234NAC17'


//       },
//       {
//       "name": "Michael Kim",
//       "email": 'michaelkim@example.com',
//       "password": "MK123456!",
//       "role":GuardRoles.customer,
//       "deviceUUID":'CVBN234NAC18'


//       },
//       {
//       "name": "Sarah Taylor",
//       "email": 'sarahtaylor@example.com',
//       "password": "ST123456!",
//       "role":GuardRoles.customer,
//       "deviceUUID":'XZCV234NAC19'


//       },
//       {
//       "name": "David Lee",
//       "email": 'davidlee@example.com',
//       "password": "DL123456!",
//       "role":GuardRoles.customer,
//       "deviceUUID":'BNM234NAC20'


//       },
//       {
//       "name": "Olivia Brown",
//       "email": 'oliviabrown@example.com',
//       "password": "OB123456!",
//       "role":GuardRoles.customer,
//       "deviceUUID":'BNM234NAC21'


//       },
//       {
//       "name": "Kevin White",
//       "email": 'kevinwhite@example.com',
//       "password": "KW123456",
//       "role":GuardRoles.customer,
//       "deviceUUID":'BNM234NAC22'


//       }
    
// ];

// const kitchenUsers = [
//   {
//     "name": "Kunle Edward",
//     "email": 'kunleedward@example.com',
//     "password": "LH123456!",
//     "role": GuardRoles.customer,
//     "deviceUUID":'BNM234NAC23'


//   },
//   {
//     "name": "Kunle Frank",
//     "email": 'kunlefrank@example.com',
//     "password": "LH123456!",
//     "role": GuardRoles.customer,
//     "deviceUUID":'BNM234NAC24'


//   },
//   {
//     "name": "Angelica Tony",
//     "email": 'angelicatony@example.com',
//     "password": "LH123456!",
//     "role": GuardRoles.customer,
//     "deviceUUID":'BNM234NAC25'


//   },
// ]


// const waiterUsers = [
//   {
//     "name": "Dotun Tony",
//     "email": 'dotuntony@example.com',
//     "password": "LH123456!",
//     "role": GuardRoles.customer,
//     "deviceUUID":'BNM234NAC26'


//   },
//   {
//     "name": "Gabriel Frank",
//     "email": 'gabrielfrank@example.com',
//     "password": "LH123456!",
//     "role": GuardRoles.customer,
//     "deviceUUID":'BNM234NAC27'


//   },
//   {
//     "name": "Juliet Isreal",
//     "email": 'julietIsreal@example.com',
//     "password": "LH123456!",
//     "role": GuardRoles.customer,
//     "deviceUUID":'BNM234NAC28'


//   },
// ]

// const businesses =  [
//   {
//       "name": "John's Restaurant",
//       "cacNumber": "RC123456",
//       "phoneNumber": "08012345678",
//       "email": "johnsrestaurant@example.com",
//       "creatorId":2
//     },
//     {
//       "name": "The Bar",
//       "cacNumber": "RC789012",
//       "phoneNumber": "07098765432",
//       "email": "thebar@example.com",
//       "creatorId":2

//     },
//     {
//       "name": "Jane's Cafe",
//       "cacNumber": "RC345678",
//       "phoneNumber": "08123456789",
//       "email": "janescafe@example.com",
//       "creatorId":2

//     },
//     {
//       "name": "The Pub",
//       "cacNumber": "RC901234",
//       "phoneNumber": "07012345678",
//       "email": "thepub@example.com",
//       "creatorId":1
//     },
//     {
//       "name": "Bobby's Bistro",
//       "cacNumber": "RC567890",
//       "phoneNumber": "08098765432",
//       "email": "bobbysbistro@example.com",
//       "creatorId":1

//     },
//     {
//         "name": "Tasty Tacos",
//         "cacNumber": "RC654321",
//         "phoneNumber": "08111111111",
//         "email": "tastytacos@example.com",
//         "creatorId": 4
//       },
//       {
//         "name": "The Coffee Spot",
//         "cacNumber": "RC333333",
//         "phoneNumber": "07022222222",
//         "email": "thecoffeespot@example.com",
//         "creatorId": 5
//       },
//       {
//         "name": "Burger Barn",
//         "cacNumber": "RC999999",
//         "phoneNumber": "08033333333",
//         "email": "burgerbarn@example.com",
//         "creatorId": 6
//       },
//       {
//         "name": "Sushi Palace",
//         "cacNumber": "RC888888",
//         "phoneNumber": "08144444444",
//         "email": "sushipalace@example.com",
//         "creatorId": 7
//       },
//       {
//         "name": "The Pizza Place",
//         "cacNumber": "RC777777",
//         "phoneNumber": "07055555555",
//         "email": "thepizzaplace@example.com",
//         "creatorId": 8
//       },
//       {
//         "name": "The Grill House",
//         "cacNumber": "RC666666",
//         "phoneNumber": "08066666666",
//         "email": "thegrillhouse@example.com",
//         "creatorId": 9
//       },
//       {
//         "name": "The Sandwich Shop",
//         "cacNumber": "RC555555",
//         "phoneNumber": "08177777777",
//         "email": "thesandwichshop@example.com",
//         "creatorId": 10
//       },
//       {
//         "name": "The Ice Cream Parlor",
//         "cacNumber": "RC444444",
//         "phoneNumber": "07088888888",
//         "email": "theicecreamparlor@example.com",
//         "creatorId": 11
//       },
//       {
//         "name": "The Donut Shop",
//         "cacNumber": "RC333333",
//         "phoneNumber": "08099999999",
//         "email": "thedonutshop@example.com",
//         "creatorId": 12
//       },
//       {
//         "name": "The Candy Store",
//         "cacNumber": "RC222222",
//         "phoneNumber": "08100000000",
//         "email": "thecandystore@example.com",
//         "creatorId": 1
//       }
//   ]

//   const menus = [
    
      
//         {
//           "name": "Relieve Plate",
//           "businessId": 1
//         },
//         {
//           "name": "Menu pot",
//           "businessId": 2
//         },
//         {
//           "name": "Coffee Shop",
//           "businessId": 3
//         },
//         {
//           "name": "Hotel",
//           "businessId": 4
//         },
//         {
//           "name": "Retail Store",
//           "businessId": 5
//         },
//         {
//           "name": "Food Truck",
//           "businessId": 6
//         }
       
//   ]
//   const options = 
//     [
//         {
//           "name": "Product 1",
//           "price": 1099,
//           "image": "image1.jpg",
//           "businessId": 1
//         },
//         {
//           "name": "Product 2",
//           "price": 9999,
//           "image": "image2.jpg",
//           "businessId": 2
//         },
//         {
//           "name": "Product 3",
//           "price": 12999,
//           "image": "image3.jpg",
//           "businessId": 3
//         },
//         {
//           "name": "Product 4",
//           "price": 11000,
//           "image": "image4.jpg",
//           "businessId": 4
//         },
//         {
//           "name": "Product 5",
//           "price": 10000,
//           "image": "image5.jpg",
//           "businessId": 5
//         },
//         {
//           "name": "Product 6",
//           "price": 90000,
//           "image": "image6.jpg",
//           "businessId": 6
//         },
//         {
//           "name": "Product 7",
//           "price": 25000,
//           "image": "image7.jpg",
//           "businessId": 7
//         },
//         {
//           "name": "Product 8",
//           "price": 30000,
//           "image": "image8.jpg",
//           "businessId": 8
//         },
//         {
//           "name": "Product 9",
//           "price": 4000,
//           "image": "image9.jpg",
//           "businessId": 9
//         },
//         {
//           "name": "Product 10",
//           "price": 50000,
//           "image": "image10.jpg",
//           "businessId": 10
//         },
//         {
//           "name": "Product 11",
//           "price": 100000,
//           "image": "image11.jpg",
//           "businessId": 11
//         },
//         {
//           "name": "Product 12",
//           "price": 30000,
//           "image": "image12.jpg",
//           "businessId": 12
//         },
        
//       ]

//     const roles = [
//         {
//           "name": "admin",
//           "businessId": 1
//         },
//         {
//           "name": "owner",
//           "businessId": 1
//         },

//         {
//           "name": "admin",
//           "businessId": 2
//         },
//         {
//           "name": "owner",
//           "businessId": 2
//         },
//         {
//           "name": "admin",
//           "businessId": 3
//         },
//         {
//           "name": "owner",
//           "businessId": 3
//         },
//         {
//           "name": "admin",
//           "businessId": 4
//         },
//         {
//           "name": "owner",
//           "businessId": 4
//         },
//         {
//           "name": "admin",
//           "businessId": 5
//         },
//         {
//           "name": "owner",
//           "businessId": 5
//         },
//         {
//           "name": "admin",
//           "businessId": 6
//         },
      
//       ]


//       const staffs = [
//         {
//           "userId": 1,
//           "businessId": 1,
//           "roleId": 1,
//         },
//         {
//           "userId": 2,
//           "businessId": 2,
//           "roleId": 2,
//         },
//         {
//           "userId": 3,
//           "businessId": 3,
//           "roleId": 1,
//         },
//         {
//           "userId": 4,
//           "businessId": 4,
//           "roleId": 2,
//         },
//         {
//           "userId": 5,
//           "businessId": 5,
//           "roleId": 1,
//         },
//         {
//           "userId": 6,
//           "businessId": 6,
//           "roleId": 2,
//         },
//         {
//           "userId": 7,
//           "businessId": 7,
//           "roleId": 1,
//         },
//         {
//           "userId": 8,
//           "businessId": 8,
//           "roleId": 2,
//         },
//         {
//           "userId": 9,
//           "businessId": 9,
//           "roleId": 1,
//         },
//       ]

//   const tables = [
//     {
//       "identifier":"one",
//       outletId:1,
//     },
//     {
//       "identifier":"two",
//       outletId:1,
//     },
//     {
//       "identifier":"three",
//       outletId:1,
//     },
//     {
//       "identifier":"four",
//       outletId:2,
//     },
//     {
//       "identifier":"five",
//       outletId:2,
//     }
//   ]

//   const outlets = [
//     {
//       "address":"Kubwa",
//       "businessId":1
//     },
//     {
//       "address":"Gwarimpa",
//       "businessId":1
//     },
//     {
//       "address":"Dutse",
//       "businessId":1
//     },
//     {
//       "address":"Gwagwalada",
//       "businessId":2
//     },
//     {
//       "address":"Suleja",
//       "businessId":2
//     },

//   ]

//   const optionToMenu = [
//     {
//       "optionIds":[ 1, 2]
//     },
//     {
//       "optionIds":[ 2,3]
//     }
//   ]


//       const hashedUserData = users.map((user) => {
//         return {
//           ...user,
//           password: bcrypt.hashSync(user.password,  bcrypt.genSaltSync()),
//           deviceUUID: bcrypt.hashSync(user.deviceUUID, bcrypt.genSaltSync()),

//         };
//       });

// async function main() {
//   await prisma.user.createMany({ data: hashedUserData });
//   await prisma.business.createMany({ data: businesses });
//   await prisma.menu.createMany({ data: menus });
//   await prisma.option.createMany({ data: options });
//   await prisma.role.createMany({ data: roles });
//   await prisma.staff.createMany({ data: staffs });
//   await prisma.menuOptions.create({data:{menuId:1, optionId:1}});
//   await prisma.menuOptions.create({data:{menuId:1, optionId:2}});
//   await prisma.menuOptions.create({data:{menuId:1, optionId:3}});
//   await prisma.menuOptions.create({data:{menuId:1, optionId:4}});
//   await prisma.menuOptions.create({data:{menuId:1, optionId:5}});
//   await prisma.menuOptions.create({data:{menuId:1, optionId:6}});
//   await prisma.menuOptions.create({data:{menuId:1, optionId:7}});
//   await prisma.menuOptions.create({data:{menuId:1, optionId:8}});
//   await prisma.menuOptions.create({data:{menuId:1, optionId:10}});

//   await prisma.menuOptions.create({data:{menuId:2, optionId:1}});
//   await prisma.menuOptions.create({data:{menuId:2, optionId:2}});
//   await prisma.menuOptions.create({data:{menuId:2, optionId:3}});
//   await prisma.menuOptions.create({data:{menuId:2, optionId:4}});
//   await prisma.menuOptions.create({data:{menuId:2, optionId:5}});
//   await prisma.menuOptions.create({data:{menuId:2, optionId:6}});
//   await prisma.menuOptions.create({data:{menuId:2, optionId:7}});
//   await prisma.menuOptions.create({data:{menuId:2, optionId:8}})
//   await prisma.menuOptions.create({data:{menuId:2, optionId:9}});
//   await prisma.menuOptions.create({data:{menuId:2, optionId:10}});

//   await prisma.menuOptions.create({data:{menuId:3, optionId:1}});
//   await prisma.menuOptions.create({data:{menuId:3, optionId:2}});
//   await prisma.menuOptions.create({data:{menuId:3, optionId:3}});
//   await prisma.menuOptions.create({data:{menuId:3, optionId:4}});
//   await prisma.menuOptions.create({data:{menuId:3, optionId:5}});
//   await prisma.menuOptions.create({data:{menuId:3, optionId:6}});
//   await prisma.menuOptions.create({data:{menuId:3, optionId:7}});
//   await prisma.menuOptions.create({data:{menuId:3, optionId:8}});
//   await prisma.menuOptions.create({data:{menuId:3, optionId:9}});
//   await prisma.menuOptions.create({data:{menuId:3, optionId:10}});

//   await prisma.outlet.createMany({data:outlets});
//   await prisma.table.createMany({data:tables});


//  const user = await prisma.user.create({
//     data:{
//       "name": "Fohlarbee",
//       "email": 'sammyola246@gmail.com',
//       "password": bcrypt.hashSync("Sammyola246@1", bcrypt.genSaltSync()),
//       "role":GuardRoles.admin,
//       deviceUUID: bcrypt.hashSync('FB234678SW', bcrypt.genSaltSync())

//     }
//   });
//   await prisma.wallet.create({
//     data:{userId:user.id, balance: 0.0,pin:bcrypt.hashSync('2020', bcrypt.genSaltSync())}
//   })
//  const business = await prisma.business.create({data:{
//     "name": "Fohlarbee one",
//     "cacNumber": "RC999999",
//     "phoneNumber": "+2348161174630",
//     "email": "sammyola246@gmail.com",
//     "type":"restaurant",
//     creator:{connect:{id:user.id}}
//   }});

//   await prisma.wallet.create({
//     data:{businessId: business.id, balance: 0.0 ,pin:bcrypt.hashSync('2020', bcrypt.genSaltSync()) }
//   })

//   const outlet = await prisma.outlet.create({data:{address:'Fohlar', businessId:business.id}});

//   const businessOptions = [
//     {
//     "name": "option 1",
//     "price": 50000,
//     "image": "https://cdn.pixabay.com/photo/2023/10/05/11/47/sweet-potatoes-8295778_960_720.jpg",
//     "businessId": business.id
//   },
//   {
//     "name": "option 2",
//     "price": 100000,
//     "image": "https://cdn.pixabay.com/photo/2019/07/12/02/19/potatoes-4331742_960_720.jpg",
//     "businessId": business.id
//   },
//   {
//     "name": "option 3",
//     "price": 30000,
//     "image": "https://cdn.pixabay.com/photo/2015/05/04/10/16/vegetables-752153_960_720.jpg",
//     "businessId": business.id
//   }
// ]


//   const option1 = await prisma.option.create({data:businessOptions[0]});
//   const option2 = await prisma.option.create({data:businessOptions[1]});
//   const option3 = await prisma.option.create({data:businessOptions[2]});



//   const menu1 = await prisma.menu.create({data:{name:'munu 1', type: MenuType.starters, businessId:business.id}})
//   const menu2 = await prisma.menu.create({data:{name:'munu 2', type: MenuType.lunch,  businessId:business.id}})
//   const menu3 = await prisma.menu.create({data:{name:'munu 3', type: MenuType.dinner,  businessId:business.id}})
//   const menu4 = await prisma.menu.create({data:{name:'munu 4', type: MenuType.mains,  businessId:business.id}})
//   const menu5 = await prisma.menu.create({data:{name:'munu 5', type: MenuType.breakfast,  businessId:business.id}})



//   const optionMenu1 = await prisma.menuOptions.create({data:{menuId:menu1.id, optionId: option1.id}}) 
//   const optionMenu2 = await prisma.menuOptions.create({data:{menuId:menu2.id, optionId: option2.id}}) 
//   const optionMenu3 = await prisma.menuOptions.create({data:{menuId:menu3.id, optionId: option3.id}}) 

//   const waiterRole = await prisma.role.create({data:{name:'waiter', businessId: business.id}})
//   const kitchenStaffRole = await prisma.role.create({data:{name:'kitchen', businessId: business.id}})

//   const table1 = await prisma.table.create({data:{identifier:"Tablen", outletId: outlet.id}})
//   const table2 = await prisma.table.create({data:{identifier:"Tableb", outletId: outlet.id}});


//   const staff = await prisma.staff.create({
//     data:{businessId:business.id, roleId:waiterRole.id, userId:1}
//   });
//   const adminRole = await prisma.role.create({data:{name:'admin', businessId:business.id}});
//   const adminStaff = await prisma.staff.create({data:{businessId:business.id, roleId:adminRole.id, userId:user.id}})


//   await prisma.user.update({
//     where:{id:1},
//     data:{role:GuardRoles.waiter}
//   })
  
// //   const date = new Date();
// // const time = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
// // console.log(time); // Output: "09:16:03"

  
//   const shift = await prisma.shift.create({
//     data:{
//         // startTime:new Date(),
//         // endTime: new Date(Date.now() + 7200000),
//         userId:1,
//         roleId: waiterRole.id,
//         outletId:outlet.id,
//         businessId:business.id,
        
//     }
    
//   });

//   const period1 = await prisma.period.create({
//     data:{day:"Mon", startTime:"08:00:00", endTime:"21:00:00", shiftId: shift.id}
//   });
//   const period2 = await prisma.period.create({
//     data:{day:"Tue", startTime:"08:00:00", endTime:"21:00:00", shiftId: shift.id}
//   });
//   const period3 = await prisma.period.create({
//     data:{day:"Wed", startTime:"08:00:00", endTime:"21:00:00", shiftId: shift.id}
//   });
//   const period4 = await prisma.period.create({
//     data:{day:"Thur", startTime:"08:00:00", endTime:"21:00:00", shiftId: shift.id}
//   });
//   const period5 = await prisma.period.create({
//     data:{day:"Fri", startTime:"08:00:00", endTime:"21:00:00", shiftId: shift.id}
//   });
//   const period6 = await prisma.period.create({
//     data:{day:"Sat", startTime:"08:00:00", endTime:"21:00:00", shiftId: shift.id}
//   });
//   const period7 = await prisma.period.create({
//     data:{day:"Sun", startTime:"08:00:00", endTime:"21:00:00", shiftId: shift.id}
//   });

//   const assignTablesToShift1 = await prisma.shiftTables.create({
//     data:{
//       shiftId: shift.id,
//       tableId: table1.id
//     }
//   });
//   const assignTablesToShift2 = await prisma.shiftTables.create({
//     data:{
//       shiftId: shift.id,
//       tableId: table2.id
//     }
//   });

//   ////////////////////////////////////////////////////////
//   // kitchensUsers
//   const user1 = await prisma.user.create({
//     data:{name: kitchenUsers[0].name, email: kitchenUsers[0].email, password:  bcrypt.hashSync(kitchenUsers[0].password, bcrypt.genSaltSync()),
//       deviceUUID:bcrypt.hashSync(kitchenUsers[0].deviceUUID, bcrypt.genSaltSync())
//     }
//   });
//   const user2  = await prisma.user.create({
//     data:{name: kitchenUsers[1].name, email: kitchenUsers[1].email, password: bcrypt.hashSync(kitchenUsers[1].password, bcrypt.genSaltSync()),
//       deviceUUID:bcrypt.hashSync(kitchenUsers[1].deviceUUID, bcrypt.genSaltSync())
//     }
//   });
//   const user3 = await prisma.user.create({
//     data:{name: kitchenUsers[2].name, email: kitchenUsers[2].email, password:bcrypt.hashSync(kitchenUsers[2].password, bcrypt.genSaltSync()),
//       deviceUUID:bcrypt.hashSync(kitchenUsers[2].deviceUUID, bcrypt.genSaltSync())
//     }
//   })

//   // waiterUsers
//   const user4 = await prisma.user.create({
//     data:{name: waiterUsers[0].name, email: waiterUsers[0].email, password: bcrypt.hashSync(waiterUsers[0].password, bcrypt.genSaltSync()),
//       deviceUUID:bcrypt.hashSync(waiterUsers[0].deviceUUID, bcrypt.genSaltSync())
//     }
//   });
//   const user5 = await prisma.user.create({
//     data:{name: waiterUsers[1].name, email: waiterUsers[1].email, password: bcrypt.hashSync(waiterUsers[1].password, bcrypt.genSaltSync()),
//       deviceUUID:bcrypt.hashSync(waiterUsers[1].deviceUUID, bcrypt.genSaltSync())
//     }
//   });
//   const user6 = await prisma.user.create({
//     data:{name: waiterUsers[2].name, email: waiterUsers[2].email, password:  bcrypt.hashSync(waiterUsers[2].password, bcrypt.genSaltSync()),
//       deviceUUID:bcrypt.hashSync(waiterUsers[2].deviceUUID, bcrypt.genSaltSync())
//     }
//   });
  


//   const kitchenStaff1 = await prisma.staff.create({
//     data:{businessId:business.id, userId: user1.id, roleId: kitchenStaffRole.id}
//   });
//   const kitchenStaff2 = await prisma.staff.create({
//     data:{businessId:business.id, userId: user2.id, roleId: kitchenStaffRole.id}
//   });
//   const kitchenStaff3 = await prisma.staff.create({
//     data:{businessId:business.id, userId: user3.id, roleId: kitchenStaffRole.id}
//   });

//   const waiterStaff1 = await prisma.staff.create({
//     data:{businessId:business.id, userId: user4.id, roleId: waiterRole.id}
//   });
//   const waiterStaff2 = await prisma.staff.create({
//     data:{businessId:business.id, userId: user5.id, roleId: waiterRole.id}
//   });
//   const waiterStaff3 = await prisma.staff.create({
//     data:{businessId:business.id, userId: user6.id, roleId: waiterRole.id}
//   });

//   await prisma.user.update({
//     where:{id:user1.id},
//     data:{role:GuardRoles.kitchen}
//   });
//   await prisma.user.update({
//     where:{id:user2.id},
//     data:{role:GuardRoles.kitchen}
//   });
//   await prisma.user.update({
//     where:{id:user3.id},
//     data:{role:GuardRoles.kitchen}
//   });


//   await prisma.user.update({
//     where:{id:user4.id},
//     data:{role:GuardRoles.waiter}
//   });
//   await prisma.user.update({
//     where:{id:user5.id},
//     data:{role:GuardRoles.waiter}
//   });
//   await prisma.user.update({
//     where:{id:user6.id},
//     data:{role:GuardRoles.waiter}
//   });


//  const customerUser = await prisma.user.create({data:
//     {
//       name: 'Jubril Hussain',
//       email: 'jubril@example.com',
//       password: bcrypt.hashSync('Sammyola246@1', bcrypt.genSaltSync()),
//       role: GuardRoles.customer,
//       deviceUUID:"FBRYHD34D"
//     }
    
//   })

//   ///////////////////////////////// ORDER 1
//     const order = await prisma.order.create({
//       data: {
//         customer: { connect: { id: customerUser.id } },
//         business: { connect: { id: business.id } },
//         table: { connect: { id: table1.id } },
//         shift: { connect: { id: shift.id } },
//         tip:1000,
//         waiter: {
//           connect: {
//             userId_businessId: { userId: 1, businessId: business.id },
//           },
//         },
//         cancelledBy: 0,
//       },
//       select: { id: true, options:true, tip: true },
//     });

//  await prisma.orderOption.create({
//   data:{quantity:3, optionId:option1.id, orderId:order.id}
//  });
 
//   ///////////////////////////////// ORDER 2


   
//   const order2 = await prisma.order.create({
//     data: {
//       customer: { connect: { id: customerUser.id } },
//       business: { connect: { id: business.id } },
//       table: { connect: { id: table2.id } },
//       shift: { connect: { id: shift.id } },
//       tip:2000,
//       waiter: {
//         connect: {
//           userId_businessId: { userId: waiterStaff1.userId, businessId: business.id },
//         },
//       },
//       cancelledBy: 0,
//     },
//     select: { id: true, options:true, tip: true },
//   });



// await prisma.orderOption.create({
// data:{quantity:4, optionId:option2.id, orderId:order2.id}
// });

// const totalPrice = order.options.reduce((acc, option) => {
//   return acc + option.quantity * option1.price + order.tip;
// }, 0);
// const newPayment = await prisma.payment.create({
//   data:{
//     amount: 10200,
//     provider:"PAYSTACK",
//     reference:`CHP_${ Date.now()}`,
//    type:"ORDER_PAYMENT",
//     user:{
//       connect:{id:customerUser.id}
//     },
//     providerId: `QQ|${user.id}|${user.id}|${Date.now()}`,
//     orders:{connect:{id: order2.id}}

    
//   }
// })

// await prisma.order.update({
//   where:{id: order2.id, businessId: business.id},
//   data:{status:OrderStatus.paid, paidAt:new Date(), completedAt:new Date(),paymentId: newPayment.id }
// });

//  ///////////////////////////////// ORDER 3


   
//  const order3 = await prisma.order.create({
//   data: {
//     customer: { connect: { id: customerUser.id } },
//     business: { connect: { id: business.id } },
//     table: { connect: { id: table1.id } },
//     shift: { connect: { id: shift.id } },
//     tip:3000,
//     waiter: {
//       connect: {
//         userId_businessId: { userId: waiterStaff2.userId, businessId: business.id },
//       },
//     },
//     cancelledBy: 0,
//   },
//   select: { id: true, options:true, tip: true },
// });



// await prisma.orderOption.create({
// data:{quantity:5, optionId:option3.id, orderId:order3.id}
// });

// const newPayment2 = await prisma.payment.create({
// data:{
//   amount: 12200,
//   provider:"PAYSTACK",
//   reference:`CHP_${ Date.now()}`,
//  type:"ORDER_PAYMENT",
//   user:{
//     connect:{id:customerUser.id}
//   },
//   providerId: `QQ|${user.id}|${user.id}|${Date.now()}`,
//   orders:{connect:{id: order3.id}}

  
// }
// })

// await prisma.order.update({
// where:{id: order3.id, businessId: business.id},
// data:{status:OrderStatus.preparing, paidAt:new Date(), completedAt:new Date(),paymentId: newPayment2.id }
// });



//  ///////////////////////////////// ORDER 4


   
//  const order4 = await prisma.order.create({
//   data: {
//     customer: { connect: { id: customerUser.id } },
//     business: { connect: { id: business.id } },
//     table: { connect: { id: table2.id } },
//     shift: { connect: { id: shift.id } },
//     tip:4000,
//     waiter: {
//       connect: {
//         userId_businessId: { userId: waiterStaff3.userId, businessId: business.id },
//       },
//     },
//     cancelledBy: 0,
//   },
//   select: { id: true, options:true, tip: true },
// });



// await prisma.orderOption.create({
// data:{quantity:6, optionId:option1.id, orderId:order4.id}
// });

// const newPayment3 = await prisma.payment.create({
// data:{
//   amount: 101200,
//   provider:"PAYSTACK",
//   reference:`CHP_${ Date.now()}`,
//  type:"ORDER_PAYMENT",
//   user:{
//     connect:{id:customerUser.id}
//   },
//   providerId: `QQ|${user.id}|${user.id}|${Date.now()}`,
//   orders:{connect:{id: order4.id}}

  
// }
// })

// await prisma.order.update({
// where:{id: order4.id, businessId: business.id},
// data:{status:OrderStatus.ready, paidAt:new Date(), completedAt:new Date(),paymentId: newPayment3.id }
// });


//  ///////////////////////////////// ORDER 5


   
//  const order5 = await prisma.order.create({
//   data: {
//     customer: { connect: { id: customerUser.id } },
//     business: { connect: { id: business.id } },
//     table: { connect: { id: table1.id } },
//     shift: { connect: { id: shift.id } },
//     tip:5000,
//     waiter: {
//       connect: {
//         userId_businessId: { userId: waiterStaff1.userId, businessId: business.id },
//       },
//     },
//     cancelledBy: 0,
//   },
//   select: { id: true, options:true, tip: true },
// });



// await prisma.orderOption.create({
// data:{quantity:7, optionId:option2.id, orderId:order5.id}
// });

// const newPayment4 = await prisma.payment.create({
// data:{
//   amount: 6500,
//   provider:"PAYSTACK",
//   reference:`CHP_${ Date.now()}`,
//  type:"ORDER_PAYMENT",
//   user:{
//     connect:{id:customerUser.id}
//   },
//   providerId: `QQ|${user.id}|${user.id}|${Date.now()}`,
//   orders:{connect:{id: order5.id}}

  
// }
// })

// await prisma.order.update({
// where:{id: order5.id, businessId: business.id},
// data:{status:OrderStatus.delivered, paidAt:new Date(), completedAt:new Date(),paymentId: newPayment4.id }
// });

//  ///////////////////////////////// ORDER 6


   
//  const order6 = await prisma.order.create({
//   data: {
//     customer: { connect: { id: customerUser.id } },
//     business: { connect: { id: business.id } },
//     table: { connect: { id: table2.id } },
//     shift: { connect: { id: shift.id } },
//     tip:6000,
//     waiter: {
//       connect: {
//         userId_businessId: { userId: waiterStaff2.userId, businessId: business.id },
//       },
//     },
//     cancelledBy: 0,
//   },
//   select: { id: true, options:true, tip: true },
// });



// await prisma.orderOption.create({
// data:{quantity:7, optionId:option3.id, orderId:order6.id}
// });

// const newPayment5 = await prisma.payment.create({
// data:{
//   amount: 7200,
//   provider:"PAYSTACK",
//   reference:`CHP_${ Date.now()}`,
//  type:"ORDER_PAYMENT",
//   user:{
//     connect:{id:customerUser.id}
//   },
//   providerId: `QQ|${user.id}|${user.id}|${Date.now()}`,
//   orders:{connect:{id: order6.id}}

  
// }
// })

// await prisma.order.update({
// where:{id: order6.id, businessId: business.id},
// data:{status:OrderStatus.completed, paidAt:new Date(), completedAt:new Date(),paymentId: newPayment5.id }
// });



// }



// main()
//   .catch((e) => {
//     console.error(e);
//     process.exit(1);
//   })
//   .finally(async () => {
//     await prisma.$disconnect();
//   });



