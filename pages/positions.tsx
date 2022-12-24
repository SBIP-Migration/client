
import { useEffect, useState } from "react";

const chain  = 'ethereum' //'avalanche'//
const associatedaddr = process.env.NEXT_PUBLIC_associatedaddr 
const ZAPPER_API_KEY = process.env.NEXT_PUBLIC_ZAPPER_API_KEY
const appID ="aave-v2"
const fetchURL =`https://api.zapper.fi/v2/apps/${appID}/balances?addresses%5B%5D=${associatedaddr}&network=${chain}&api_key=${ZAPPER_API_KEY}`//`https://api.zapper.fi/v2/balances?addresses%5B%5D=${associatedaddr}&networks%5B%5D=${chain}&api_key=${ZAPPER_API_KEY}``
console.log('fetchURL',fetchURL)

function Positions(props) {
    const [status, setStatus] = useState()

 
    async function safeParseJSON(response) {
        const body = await response.json();
        try {
            console.log("body",body)
            // return JSON.parse(body);
        } catch (err) {
            console.error("Error:", err);
            console.error("Response body:", body);
            // throw err;
        }
    }
    useEffect(() => {

        setStatus("loading")
        fetch(fetchURL)   
          
            .then((response) => response.json())
            .then((data) => {
                console.log('data',data)
                setStatus("success")
            })
            .catch((error) => {
                setStatus("error")
                console.error("Error:", error);
                // throw err;
                return error.message;
            })

    }, []);

    if (status === "loading") {
        return <div>Loading...</div>
    }
    if (status === "error") {
        return <div>Not Loading...</div>
    }



    return (
        <>
        
            {/* <Chart options={chartConfig} series={inputSeries} width="100%" height={150} /> */}
        </>
    )
}

export default Positions