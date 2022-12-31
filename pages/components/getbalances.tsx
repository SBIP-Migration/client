import { ethers } from "ethers";
import { useEffect, useState, useContext } from "react";
// import { Contract, Provider } from 'ethers-multicall';
import { TOKEN_LIST } from "../Tokenlist"
import { UserContext } from '../index';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

function Getbalances(props) {
    const [aTokenBalances, setATokenBalances] = useState([{}]);
    const imported: any = useContext(UserContext);
    const { walletSigner, provider } = imported

    //   useEffect(() => {
    //     if(imported.walletSigner){
    //         console.log("address_Imported",address_Imported)
    //         console.log("props.provider>>>>>",props.provider)
    //         getAllBalances(address_Imported)

    //     }

    //   },[address_Imported ])//stableDebtBalances, variableDebtBalances, current]);
    useEffect(() => {

        async function getAllBalances(address1) {
            await getATokenBalances(address1);
            // await getStableDebtBalances(address1);
            // await getVariableDebtBalances(address1);
        }
        if (walletSigner.length && typeof (provider) !== "undefined") {

            console.log("TOKEN_LIST", TOKEN_LIST)
            console.log("walletSigner>>>>>", walletSigner)
            getAllBalances(walletSigner)

        }

        async function getATokenBalances(address1) {
            const erc20Abi = [
                'function balanceOf(address account) view returns (uint256)'
            ];
            let callList = [];
            const aTokenList = [];
            for (let i = 0; i < TOKEN_LIST.length; i++) {
                aTokenList.push(TOKEN_LIST[i].aTokenAddress);
            }

            for (let i = 0; i < aTokenList.length; i++) {
                console.log("address1", address1)
                console.log(`aTokenList[i]${i}`, aTokenList[i])
                const tokenContract = new ethers.Contract(aTokenList[i], erc20Abi, provider);
                console.log(`tokenContract${i}`, tokenContract)
                const tokenBalanceCall = await tokenContract.balanceOf(address1);

                console.log(`tokenBalanceCall${i}`, tokenBalanceCall)

                const bigNumber = parseInt(tokenBalanceCall)// 29803630.997051883414242659

                console.log(`bigNumber${i}`, bigNumber)
                // const etherutils = ethers.utils.formatUnits(bigNumber.toString(), TOKEN_LIST[i].decimals)
                callList.push(bigNumber);
                console.log("calllist", callList)
            }

            const aTokenBalancesList = [];
            for (let i = 0; i < aTokenList.length; i++) {
                // if (!aTokenBalancesHex[i].eq(0)) {
                //     // let newBalance = ethers.BigNumber.from(aTokenBalancesHex[i]);
                //     // if (newBalance.lt(100000)) {
                //     //     console.log('Balance too low to be stored');
                //     //     newBalance = ethers.BigNumber.from('0');
                //     // } else {
                //     //     newBalance = newBalance.sub(newBalance.div(100000));
                //     // }

                aTokenBalancesList.push({
                    'Symbol': 'a' + TOKEN_LIST[i].symbol,
                    'ContractAddress': TOKEN_LIST[i].aTokenAddress,
                    // 'tokenAddress': TOKEN_LIST[i].tokenAddress,
                    // 'Balance': newBalance.toString(),
                    'Allowance': undefined,
                    'balanceInTokenDecimals': ethers.utils.formatUnits(callList[i].toString(), TOKEN_LIST[i].decimals)
                });
            }
            console.log('aTokenBalances: ', aTokenBalancesList);
            setATokenBalances(aTokenBalancesList)
        }

    }, [walletSigner, provider])

    const Tickers = aTokenBalances.map((el, index) => {
        return (
            <>

                    <tr>
                        <td>{el.Symbol} : </td>
                        <td>{el.balanceInTokenDecimals}</td>
                    </tr>

            </>
        )
    })
    return (
        <>
            {Tickers}
        </>
    )
}

export default Getbalances