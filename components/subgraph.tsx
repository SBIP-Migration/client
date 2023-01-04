const userAddress = "0x14e6b828AdB52153E5BF7C740A1a7312ef4B8711"

async function callApi() {
    const data = JSON.stringify({
      query: `  userReserves(where: { user: ${userAddress.toLowerCase()}}) {
        id
        reserve{
          id
          symbol
        }
        user {
          id
        }
      }`,
    });
  
    const response = await fetch(
      'https://api.thegraph.com/subgraphs/name/aave/protocol-multy-raw',
      {
        method: 'post',
        body: data,
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': data.length.toString(),
        },
      }
    );
  
    return response.json()
  }
  
  const output = Promise.resolve(callApi());

export { callApi }