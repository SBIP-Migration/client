
import { useEffect, useState } from "react";



function Positions(props) {
    const [status, setStatus] = useState()
    const [data, setData] = useState([])
    const [data_lending, setData_lending] = useState([])

    const chain  = 'ethereum' //'avalanche'//
    const associatedaddr = props.addr//process.env.NEXT_PUBLIC_associatedaddr 
    const ZAPPER_API_KEY = process.env.NEXT_PUBLIC_ZAPPER_API_KEY
    const appID ="aave-v2"
    const fetchURL =`https://api.zapper.fi/v2/apps/${appID}/balances?addresses%5B%5D=${associatedaddr}&network=${chain}&api_key=${ZAPPER_API_KEY}`//`https://api.zapper.fi/v2/balances?addresses%5B%5D=${associatedaddr}&networks%5B%5D=${chain}&api_key=${ZAPPER_API_KEY}``
    console.log('fetchURL',fetchURL)

    useEffect(() => {

        setStatus("loading")
        fetch(fetchURL)   
          
            .then((response) => response.json())
            .then((data_) => {
                // setData(data)
                const nestedProducts = data_.balances[associatedaddr].products
                setData(nestedProducts)
                setData_lending(nestedProducts[0].assets.tokens)
                console.log('nestedProducts',nestedProducts)
                console.log('nestedProducts[0].assets',nestedProducts[0].assets.tokens[0])
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

    // const tickers = data_lending.map((el, index) => {
    //     console.log("data-lending",data_lending)
    //     // console.log("data-rewards",data[1])
    //     // const parsed = JSON.parse(el)
    //     // console.log('parsed',parsed)
    //     const single = data_lending[0]
    //     return (
    //         // {parsed}
    //         <div key={index}>
                
    //             {/* {el} */}
    //         {/* single {single} */}
    //         </div>
    //     )
    // })

    return (
        <>  
            <div>Positions here</div>
            {/* {tickers} */}
            {data_lending[0]}
            {/* <Chart options={chartConfig} series={inputSeries} width="100%" height={150} /> */}
        </>
    )
}

export default Positions