import { ethers } from "ethers";
import { useEffect, useState, useContext } from "react";
import { Contract, Provider } from 'ethers-multicall';
import { TOKEN_LIST } from "../Tokenlist"
import { UserContext } from '../index';

function Getbalances(props) {
    const [aTokenBalances, setATokenBalances] = useState([{}]);
    const imported = useContext(UserContext);


    //   useEffect(() => {
    //     if(imported.walletSigner){
    //         console.log("address_Imported",address_Imported)
    //         console.log("props.provider>>>>>",props.provider)
    //         getAllBalances(address_Imported)

    //     }

    //   },[address_Imported ])//stableDebtBalances, variableDebtBalances, current]);
    useEffect(() => {
        console.log("importedwalletSigner", imported.walletSigner)
        console.log("importedprovider", imported.provider)
        // console.log("props.provider", props.provider)  
        console.log("TOKEN_LIST", TOKEN_LIST)

        async function getAllBalances(address1) {
            await getATokenBalances(address1);
            // await getStableDebtBalances(address1);
            // await getVariableDebtBalances(address1);
        }
        if (imported.walletSigner) {
            console.log("props.provider>>>>>", props.provider)
            getAllBalances(imported.walletSigner)

        }
        async function getATokenBalances(address1) {
            const ethcallProvider = new Provider(imported.provider, 42);
            const erc20Abi = [
                'function balanceOf(address account) view returns (uint256)'
            ];
            let callList = [];
            const aTokenList = [];
            for (let i = 0; i < TOKEN_LIST.length; i++) {
                aTokenList.push(TOKEN_LIST[i].aTokenAddress);
            }

            for (let i = 0; i < aTokenList.length; i++) {
                const tokenContract = new Contract(aTokenList[i], erc20Abi);
                console.log(`tokenContract${i}`,tokenContract)
                const tokenBalanceCall = tokenContract.balanceOf(address1);
                console.log(`tokenBalanceCall${i}`,tokenBalanceCall)
                callList.push(tokenBalanceCall);
                console.log("calllist", callList)
            }

            // if (ethcallProvider._provider) {
            //     console.log("ethcallProvider", ethcallProvider)
            //     // const aTokenBalancesHex = await ethcallProvider.all(callList);


            //     const aTokenBalancesList = [];
            //     for (let i = 0; i < aTokenBalancesHex.length; i++) {
            //         if (!aTokenBalancesHex[i].eq(0)) {
            //             // let newBalance = ethers.BigNumber.from(aTokenBalancesHex[i]);
            //             // if (newBalance.lt(100000)) {
            //             //     console.log('Balance too low to be stored');
            //             //     newBalance = ethers.BigNumber.from('0');
            //             // } else {
            //             //     newBalance = newBalance.sub(newBalance.div(100000));
            //             // }

            //             aTokenBalancesList.push({
            //                 'Symbol': 'a' + TOKEN_LIST[i].symbol,
            //                 'ContractAddress': TOKEN_LIST[i].aTokenAddress,
            //                 'tokenAddress': TOKEN_LIST[i].tokenAddress,
            //                 'Balance': newBalance.toString(),
            //                 'Allowance': undefined,
            //                 'balanceInTokenDecimals': ethers.utils.formatUnits(newBalance, TOKEN_LIST[i].decimals)
            //             });
            //         }
            //     }
            //     console.log('aTokenBalances: ', aTokenBalancesList);
            //     setATokenBalances(aTokenBalancesList);
            //     // console.log()

            // }


        }

    }, [imported])
    return (
        <>
            {/* {aTokenBalances} */}
        </>
    )
}

export default Getbalances