
import { useEffect, useState } from "react";

const chain  = 'ethereum'
const associatedaddr = '0x14e6b828AdB52153E5BF7C740A1a7312ef4B8711'
function Positions(props) {
    const [status, setStatus] = useState()

    const ZAPPER_API_KEY = 'b6c41b98-a976-4243-ad1c-987542eb68da'  

    //TO TEST FETCH OUTPUT
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
        fetch('https://api.zapper.fi/v2/apps/llama-airforce/balances?addresses%5B%5D=0x14e6b828AdB52153E5BF7C740A1a7312ef4B8711&networks%5B%5D=ethereum&api_key=b6c41b98-a976-4243-ad1c-987542eb68da'//`https://api.zapper.fi/v2/balances?addresses%5B%5D=${associatedaddr}&networks%5B%5D=${chain}&api_key=${ZAPPER_API_KEY}`   
          )
            .then((response) => //IF YOU BRACKET IT , IT DOESNT WORK
                response.json()
            //}
            )
            .then((dailyprices) => {
                console.log('dailyprices',dailyprices)
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