import { useEffect, useState } from 'react'

const chain = 'ethereum' //'avalanche'//
const associatedaddr = process.env.NEXT_PUBLIC_associatedaddr
const ZAPPER_API_KEY = process.env.NEXT_PUBLIC_ZAPPER_API_KEY
const appID = 'aave-v2'
const fetchURL = `https://api.zapper.fi/v2/apps/${appID}/balances?addresses%5B%5D=${associatedaddr}&network=${chain}&api_key=${ZAPPER_API_KEY}` //`https://api.zapper.fi/v2/balances?addresses%5B%5D=${associatedaddr}&networks%5B%5D=${chain}&api_key=${ZAPPER_API_KEY}``
console.log('fetchURL', fetchURL)

enum Status {
  loading = 'loading',
  success = 'success',
  error = 'error',
}

function Gotoapp() {
  const [status, setStatus] = useState<Status>()
  const [data, setData] = useState([])

  useEffect(() => {
    setStatus(Status.loading)
    fetch(fetchURL)
      .then((response) => response.json())
      .then((data_) => {
        console.log('data', data_)
        setData(data)
        setStatus(Status.success)
      })
      .catch((error) => {
        setStatus(Status.error)
        console.error('Error:', error)
        // throw err;
        return error.message
      })
  }, [])

  if (status === 'loading') {
    return <div>Loading...</div>
  }
  if (status === 'error') {
    return <div>Not Loading...</div>
  }

  const tickers = data.forEach((each) => {
    console.log('each', each)
  })

  return (
    <>
      {tickers}
      {/* <Chart options={chartConfig} series={inputSeries} width="100%" height={150} /> */}
    </>
  )
}

export default Gotoapp
