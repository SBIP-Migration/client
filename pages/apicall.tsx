import {v2 } from '@aave/protocol-js';

// Fetch poolReservesData from GQL Subscription
// Fetch rawUserReserves from GQL Subscription
// Fetch ethPriceUSD from GQL Subscription

let userAddress = "0x14e6b828AdB52153E5BF7C740A1a7312ef4B8711"

let userSummary = v2.formatUserSummaryData(
    //poolReservesData,
     //rawUserReserves,
      userAddress.toLowerCase(), 
      1200,
      Math.floor(Date.now() / 1000)
      )

console.log("userSummary",userSummary)