import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt, usePublicClient } from "wagmi";
import { useState, useEffect } from "react";
import contracts from "../contracts.json";
import DONATION_CERTIFICATE_ABI_STR from "../abis/DonationCertificate.json";
import { Hex, Abi } from "viem";
import toast from "react-hot-toast";

interface Certificate {
  tokenId: bigint;
  tokenURI: string;
}

const CERT_ABI: Abi = JSON.parse(DONATION_CERTIFICATE_ABI_STR as unknown as string) as Abi;

export function useDonationCertificate() {
  const { address } = useAccount();
  const publicClient = usePublicClient();
  const [isTransacting, setIsTransacting] = useState(false);
  const [certificates, setCertificates] = useState<Certificate[]>([]);

  const { writeContract, data: hash, isPending } = useWriteContract();
  const { isLoading: isConfirming } = useWaitForTransactionReceipt({ hash });

  // Fetch certificates via event logs
  useEffect(() => {
    if (!address) return;
    const fetchCertificates = async () => {
      try {
        const logs = await publicClient!.getLogs({
          address: contracts.DonationCertificate as `0x${string}`,
          event: {
            type: "event",
            name: "CertificateMinted",
            inputs: [
              { indexed: true, name: "donor", type: "address" },
              { indexed: false, name: "tokenId", type: "uint256" },
              { indexed: false, name: "uri", type: "string" },
            ],
          } as any,
          fromBlock: "earliest",
          toBlock: "latest",
          args: { donor: address as `0x${string}` },
        });

        const certs: Certificate[] = logs.map((log: any) => ({
          tokenId: BigInt(log.args.tokenId),
          tokenURI: log.args.uri as string,
        }));
        setCertificates(certs);
      } catch (e) {
        console.error("Fetch certificates error", e);
      }
    };

    fetchCertificates();
  }, [address, publicClient]);

  const mintCertificate = async (to: string, uri: string) => {
    if (!address) {
      toast.error("Please connect your wallet");
      return;
    }

    try {
      setIsTransacting(true);

      await writeContract({
        address: contracts.DonationCertificate as `0x${string}`,
        abi: CERT_ABI,
        functionName: "mintCertificate",
        args: [to, uri],
      });

      toast.success("Minting transaction submitted!");
    } catch (error) {
      console.error("Mint error", error);
      toast.error("Mint failed");
    } finally {
      setIsTransacting(false);
    }
  };

  return {
    certificates,
    mintCertificate,
    isTransacting: isTransacting || isPending || isConfirming,
  };
} 