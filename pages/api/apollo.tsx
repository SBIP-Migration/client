import { ApolloClient, InMemoryCache, ApolloProvider, gql } from '@apollo/client';

let userAddress = "0x14e6b828AdB52153E5BF7C740A1a7312ef4B8711"
let lowerC = userAddress.toLowerCase()
console.log("lowerC",lowerC)
const client = new ApolloClient({
    uri: 'https://api.thegraph.com/subgraphs/name/aave/protocol-v2', //'https://api.thegraph.com/subgraphs/name/aave/protocol-v2',//'https://flyby-gateway.herokuapp.com/',
    cache: new InMemoryCache(),
  });


client
.query({
    query: gql
    `
    {
        userReserves(where: { user: "0x14e6b828adb52153e5bf7c740a1a7312ef4b8711"}) {
          id
          reserve{
            id
            symbol
          }
          user {
            id
          }
        }
      }
      `
    }
////

//         {
//   query: gql`
//     query GetLocations {
//       locations {
//         id
//         name
//         description
//         photo
//       }
//     }
//   `,
// }
)
.then((result) => console.log(result));

function Apollo(props) {
    return (
        <>
    
        </>
    )
}

export default Apollo