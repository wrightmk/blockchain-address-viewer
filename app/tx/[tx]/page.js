import { getTx, getTxBlock, getTxReceipt, getTxStatus } from "@/app/requests";
import InvalidEntry from "../../components/InvalidEntry";
import { formatEther, formatUnits } from "ethers";
import React from "react";
import Link from "next/link";

async function buildDataset(
  getBlockchainTxStatus,
  getBlockchainTxReceipt,
  getBlockchainTxBlock,
  currency,
  blockchainData,
  tx,
  blockchain
) {
  const [statusResult, receiptResult, blockResult] = await Promise.all([
    getBlockchainTxStatus(tx, blockchain),
    getBlockchainTxReceipt(tx, blockchain),
    getBlockchainTxBlock(blockchainData.result.blockNumber, blockchain),
  ]);

  blockchainData.result.effectiveGasPrice =
    receiptResult.result.effectiveGasPrice;
  blockchainData.result.gasUsed = receiptResult.result.gasUsed;

  blockchainData.result.timeStamp = blockResult.result.timestamp;

  blockchainData.result.currency = currency;

  blockchainData.result.status = statusResult.result.status;

  return blockchainData.result;
}

async function txLookup(tx) {
  let validTx = true;
  let data = [];
  let etherAmount;
  let maticAmount;

  try {
    const [etherscanData, polyscanData] = await Promise.all([
      getTx(tx, "ethereum"),
      getTx(tx, "polygon"),
    ]);

    if (
      etherscanData.result !== null &&
      !etherscanData.result &&
      polyscanData.result !== null &&
      !polyscanData.result
    ) {
      return {
        data,
        validTx: false,
      };
    }

    if (etherscanData.result) {
      data = await buildDataset(
        getTxStatus,
        getTxReceipt,
        getTxBlock,
        "eth",
        etherscanData,
        tx,
        "ethereum"
      );
    }

    if (polyscanData.result) {
      data = await buildDataset(
        getTxStatus,
        getTxReceipt,
        getTxBlock,
        "matic",
        polyscanData,
        tx,
        "polygon"
      );
    }

    return {
      data,
      validTx,
    };
  } catch (e) {
    return {
      data: [],
      validTx: false,
    };
  }
}

function determineConfirmationStatus(status) {
  switch (status) {
    case "1":
      return "Successful";
    case "0":
      return "Failed";
    default:
      return "Loading";
  }
}

export default async function Transaction({ params }) {
  const { data, validTx } = await txLookup(params.tx);

  if (!validTx) {
    return <InvalidEntry text="This TX is Invalid" />;
  }
  const link =
    data.currency === "eth"
      ? `https://etherscan.io/tx/${params.tx}`
      : `https://polygonscan.com/tx/${params.tx}`;
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-5 md:p-24 w-full">
      <div className="bg-slate-50 border-solid border-2 border-slate-200 rounded-lg mb-4 p-4 gap-2 flex flex-col max-w-7xl lg:w-[1040px]">
        <h5 className="break-all">TX Hash: {params.tx}</h5>
        <h5 className="break-all">
          Timestamp: {String(new Date(data.timeStamp * 1000))}
        </h5>
        {data.value && (
          <h5 className="break-all">
            Amount: {formatEther(data.value)}{" "}
            <span className="uppercase">{data.currency}</span>
          </h5>
        )}
        {data.status === "1" && (
          <h5 className="break-all">
            Fee:{" "}
            {formatEther(
              formatUnits(data.gasUsed, "wei") *
                formatUnits(data.effectiveGasPrice, "wei")
            )}{" "}
            <span className="uppercase">{data.currency}</span>
          </h5>
        )}
        <h5 className="break-all">
          Confirmation Status: {determineConfirmationStatus(data.status)}
        </h5>

        <Link
          className="text-xl underline"
          target="_blank"
          rel="noopener noreferrer"
          href={link}
        >
          Block Explorer
        </Link>
      </div>
    </main>
  );
}
