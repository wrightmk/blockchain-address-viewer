import Image from "next/image";
import { formatEther } from "ethers";
import Link from "next/link";
import InvalidEntry from "../components/InvalidEntry";
import { getAddress, getAmount } from "../requests";

function buildDataset(currency, data) {
  let normalizedData = [];

  for (const d of data) {
    d.currency = currency;
    d.value = formatEther(d.value);
    normalizedData = [...normalizedData, d];
  }

  return normalizedData;
}

async function addressLookup(params) {
  let validAddress = true;
  let data = [];
  let etherAmount;
  let maticAmount;
  try {
    const [etherscanData, polyscanData] = await Promise.all([
      getAddress(params.address, "ethereum"),
      getAddress(params.address, "polygon"),
    ]);

    if (etherscanData.status !== "1" && polyscanData.status !== "1") {
      return {
        data: [],
        validAddress: false,
      };
    }

    if (etherscanData.status === "1") {
      const data = await getAmount(params.address, "ethereum");
      etherAmount = data.result;
    }

    if (polyscanData.status === "1") {
      const data = await getAmount(params.address, "polygon");
      maticAmount = data.result;
    }

    const normalizedEthereumData = buildDataset("eth", etherscanData.result);
    const normalizedPolyscanData = buildDataset("matic", polyscanData.result);

    return {
      data: [...normalizedEthereumData, ...normalizedPolyscanData],
      validAddress,
      etherAmount,
      maticAmount,
    };
  } catch (e) {
    return {
      data: [],
      validAddress: false,
      etherAmount: null,
      maticAmount: null,
    };
  }
}

export default async function Home({ params }) {
  const { data, validAddress, etherAmount, maticAmount } = await addressLookup(
    params
  );

  if (!validAddress) {
    return <InvalidEntry text="This Address is Invalid" />;
  }
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-5 md:p-24 w-full">
      <div className="bg-slate-50 border-solid border-2 border-slate-200 rounded-lg mb-4 p-4 gap-2 flex flex-col max-w-7xl lg:w-[1000px]">
        <h3 className="break-all">{params.address}</h3>
        {etherAmount && (
          <>
            <h4 className="break-all">Ethereum Mainnet Balance:</h4>
            <h4 className="break-all uppercase">
              {formatEther(etherAmount)} eth
            </h4>
          </>
        )}
        {maticAmount && (
          <>
            <h4 className="break-all">Polygon Mainnet Balance:</h4>
            <h4 className="break-all uppercase">
              {formatEther(maticAmount)} matic
            </h4>
          </>
        )}
      </div>

      {data
        .sort((a, b) => b.timeStamp - a.timeStamp)
        .map((d) => (
          <div
            key={d.hash}
            className="bg-slate-50 border-solid border-2 border-slate-200 rounded-lg mb-4 p-4 gap-2 flex flex-col max-w-7xl lg:w-[1000px]"
          >
            <h5 className="break-all">TX Hash: {d.hash}</h5>
            <h5 className="break-all">
              Timestamp: {String(new Date(d.timeStamp * 1000))}
            </h5>
            <h5 className="break-all">
              Value: {d.value} {d.currency}
            </h5>
            <h5 className="break-all">
              Blockchain: {d.currency === "eth" ? "Ethereum" : "Polygon"}
            </h5>
            <Link className="text-xl underline" href={`tx/${d.hash}`}>
              See More
            </Link>
          </div>
        ))}
    </main>
  );
}
