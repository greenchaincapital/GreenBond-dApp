import Head from "next/head";
import { ethers } from "ethers";
import type { NextPage } from "next";
import { InformationCircleIcon } from "@heroicons/react/24/outline";
import { useScaffoldContractRead } from "~~/hooks/scaffold-eth";

const VaultStats: NextPage = () => {

  const { data: currentAmount } = useScaffoldContractRead({
    contractName: "LSD",
    functionName: "totalAssets",
  });

  const { data: cost } = useScaffoldContractRead({
    contractName: "CURVE",
    functionName: "get_virtual_price",
  });

  const { data: balance } = useScaffoldContractRead({
    contractName: "LSD",
    functionName: "totalSupply",
  });

  const customFormatEther = (x: any) => {
    const value = ethers.utils.formatEther(x);
    const digits = parseInt(value).toString().length;
    if (digits >= 7) {
      return [value, Number(value).toFixed(0)];
    } else {
      return [value, Number(value).toFixed(7 - digits)];
    }
  };

  const { data: usdtwithdrawamount } = useScaffoldContractRead({
    contractName: "CURVE",
    functionName: "calc_withdraw_one_coin",
    args: [
      balance == undefined
        ? ethers.utils.parseEther("0")
        : balance,
        ethers.utils.parseEther("0.000000000000000001"),
    ],
  });

  return (
    <>
      <Head>
        <title>GreenBond - Vault Stats</title>
        <meta
          name="description"
          content="GreenBond provides liquid staking derivatives and leverage staking derivatives on your usd!"
        />
        <link rel="shortcut icon" href="/greenbond-logo-32.png" />
      </Head>

      <div className="flex flex-col mt-8">
        <div className="flex flex-row flex-wrap">
          <div className="card bg-base-100 shadow-xl flex-1 m-4">
            <div className="flex flex-col items-center card-body p-6 pb-4">
            <span className="text-5xl">
                {balance == undefined ? (
                  <button className="btn btn-ghost loading"></button>
                ) : (
                  <div className="tooltip tooltip-secondary" data-tip={customFormatEther(balance)[0]}>
                    <button>{customFormatEther(balance)[1]}</button>
                  </div>
                )}
              </span>
              <span className="mt-4">Issued GreenBond</span>
            </div>
          </div>
          <div className="card bg-base-100 shadow-xl flex-1 m-4">
            <div className="flex flex-col items-center card-body p-6 pb-4">
              <span className="text-5xl">
                {usdtwithdrawamount == undefined ? (
                  <button className="btn btn-ghost loading"></button>
                ) : (
                  <div className="tooltip tooltip-secondary" data-tip={ethers.utils.formatUnits(usdtwithdrawamount, 6)}>
                    <button>{Number(ethers.utils.formatUnits(usdtwithdrawamount, 6))}</button>
                  </div>
                )}
              </span>
              <span className="mt-4">Currently Withdrawable USDT</span>
            </div>
          </div>
        </div>
        <div className="flex flex-row flex-wrap">
          <div className="card bg-base-100 shadow-xl flex-1 m-4">
            <div className="flex flex-col items-center card-body p-6 pb-4">
              <span className="text-3xl">~ 10%</span>
              <div className="flex flex-row">
                <span className="mt-2">APY</span>
                <div
                  className="tooltip tooltip-secondary mt-2 ml-2"
                  data-tip="This is a hardcoded APY value based on the liquid and leverage staking derivate as of building this project. This will be updated with auto calculation of APY in some time!"
                >
                  <button>
                    <InformationCircleIcon className="h-4 w-4 mr-0.5 mt-1" />
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="card bg-base-100 shadow-xl flex-1 m-4">
            <div className="flex flex-col items-center card-body p-6 pb-4">
              <span className="text-3xl">
                {cost == undefined ? (
                  <button className="btn btn-ghost loading"></button>
                ) : (
                  <div className="tooltip tooltip-secondary" data-tip={customFormatEther(cost)[0]}>
                    <button>{customFormatEther(cost)[1]}</button>
                  </div>
                )}
              </span>
              <span className="mt-2">Current Cost Of GreenBond</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default VaultStats;
