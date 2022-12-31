import { ethers } from "ethers";
import { useEffect, useState } from "react";
import { TOKEN_LIST } from "../Tokenlist"
import { Flex, Text } from "@chakra-ui/react";
import { useWallets } from "@web3-onboard/react";
import { getWeb3Provider } from "../../utils/ethers";

type Props = {}

type aTokenType = {
    symbol: string
    contractAddress: string
    allowance?: string
    balance?: string
    tokenAddress: string
    balanceInTokenDecimals: string
}


const Balances = ({} : Props) => {
    const [aTokenBalances, setATokenBalances] = useState<aTokenType[]>([]);
    const [wallet] = useWallets()
    const provider = getWeb3Provider(wallet)
    const walletSigner = wallet.accounts?.[0].address

    //   useEffect(() => {
    //     if(imported.walletSigner){
    //         console.log("address_Imported",address_Imported)
    //         console.log("props.provider>>>>>",props.provider)
    //         getAllBalances(address_Imported)

    //     }

    //   },[address_Imported ])//stableDebtBalances, variableDebtBalances, current]);
    useEffect(() => {
        async function getAllBalances(address: string) {
            await getATokenBalances(address);
            // await getStableDebtBalances(address1);
            // await getVariableDebtBalances(address1);
        }

        if (walletSigner.length && provider != null) {
            getAllBalances(walletSigner)
        }

        async function getATokenBalances(address: string) {
            const erc20Abi = [
                'function balanceOf(address account) view returns (uint256)'
            ];
            let callList = [];
            const aTokenList = [];
            for (let i = 0; i < TOKEN_LIST.length; i++) {
                aTokenList.push(TOKEN_LIST[i].aTokenAddress);
            }

            for (let i = 0; i < aTokenList.length; i++) {
                const tokenContract = new ethers.Contract(aTokenList[i], erc20Abi, provider);
                const tokenBalanceCall = await tokenContract.balanceOf(address);
                const bigNumber = parseInt(tokenBalanceCall)// 29803630.997051883414242659
                // const etherutils = ethers.utils.formatUnits(bigNumber.toString(), TOKEN_LIST[i].decimals)
                callList.push(bigNumber);
                console.log("calllist", callList)
            }

            const aTokenBalancesList: Array<aTokenType> = [];
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
                    symbol: `a${TOKEN_LIST[i].symbol}`,
                    contractAddress: TOKEN_LIST[i].aTokenAddress,
                    tokenAddress: TOKEN_LIST[i].tokenAddress,
                    // balance: newBalance.toString(),
                    allowance: undefined,
                    balanceInTokenDecimals: ethers.utils.formatUnits(callList[i].toString(), TOKEN_LIST[i].decimals)
                });
            }
            setATokenBalances(aTokenBalancesList)
        }

    }, [walletSigner, provider])

    return (
        <Flex flexDir="column">
        {aTokenBalances.map((el) => (
            <Flex key={el.symbol}>
                <Text>{el.symbol}: {el.balanceInTokenDecimals} </Text>
            </Flex>
        ))}
        </Flex>
    )
}

export default Balances