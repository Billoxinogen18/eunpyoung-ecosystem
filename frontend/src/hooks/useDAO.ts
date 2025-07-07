import { useAccount, useWriteContract, useWaitForTransactionReceipt, usePublicClient } from "wagmi";
import { Abi } from "viem";
import contracts from "../contracts.json";
import EUN_DAO_ABI_STR from "../abis/EunDAO.json";
import { useEffect, useState, useCallback } from "react";
import toast from "react-hot-toast";

const DAO_ABI: Abi = JSON.parse(EUN_DAO_ABI_STR as unknown as string) as Abi;

export interface DaoProposal {
  id: bigint;
  proposer: string;
  description: string;
  eta: bigint;
  startBlock: bigint;
  endBlock: bigint;
  status: string;
}

export function useDAO() {
  const { address } = useAccount();
  const publicClient = usePublicClient();
  const { writeContract, data: hash, isPending } = useWriteContract();
  const { isLoading: isConfirming } = useWaitForTransactionReceipt({ hash });
  const [proposals, setProposals] = useState<DaoProposal[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch proposals via ProposalCreated events
  const fetchProposals = useCallback(async () => {
    setIsLoading(true);
    try {
      const logs = await publicClient!.getLogs({
        address: contracts.EunDAO as `0x${string}`,
        event: {
          type: "event",
          name: "ProposalCreated",
          inputs: [
            { indexed: true, name: "proposalId", type: "uint256" },
            { indexed: true, name: "proposer", type: "address" },
            { indexed: false, name: "targets", type: "address[]" },
            { indexed: false, name: "values", type: "uint256[]" },
            { indexed: false, name: "signatures", type: "bytes[]" },
            { indexed: false, name: "calldatas", type: "bytes[]" },
            { indexed: false, name: "startBlock", type: "uint256" },
            { indexed: false, name: "endBlock", type: "uint256" },
            { indexed: false, name: "description", type: "string" },
          ],
        } as any,
        fromBlock: "earliest",
        toBlock: "latest",
      });

      const all = await Promise.all(
        logs.map(async (log: any) => {
          const proposalId = log.args.proposalId as bigint;
          // Read state
          const state = (await publicClient!.readContract({
            address: contracts.EunDAO as `0x${string}`,
            abi: DAO_ABI,
            functionName: "state",
            args: [proposalId],
          })) as number;

          const statusMap: Record<number, string> = {
            0: "Pending",
            1: "Active",
            2: "Canceled",
            3: "Defeated",
            4: "Succeeded",
            5: "Queued",
            6: "Expired",
            7: "Executed",
          };

          return {
            id: proposalId,
            proposer: log.args.proposer,
            description: log.args.description as string,
            startBlock: log.args.startBlock as bigint,
            endBlock: log.args.endBlock as bigint,
            eta: BigInt(0),
            status: statusMap[state] || "Unknown",
          } as DaoProposal;
        })
      );
      setProposals(all.reverse());
    } catch (e) {
      console.error("Fetch proposals error", e);
    } finally {
      setIsLoading(false);
    }
  }, [publicClient]);

  useEffect(() => {
    fetchProposals();
  }, [fetchProposals]);

  const createProposal = async (
    targets: `0x${string}`[],
    values: bigint[],
    calldatas: `0x${string}`[],
    description: string
  ) => {
    if (!address) {
      toast.error("Connect wallet");
      return;
    }
    try {
      await writeContract({
        address: contracts.EunDAO as `0x${string}`,
        abi: DAO_ABI,
        functionName: "propose",
        args: [targets, values, calldatas, description],
      });
      toast.success("Proposal submitted");
    } catch (e) {
      console.error(e);
      toast.error("Proposal failed");
    }
  };

  const castVote = async (proposalId: bigint, support: number) => {
    if (!address) {
      toast.error("Connect wallet");
      return;
    }
    try {
      await writeContract({
        address: contracts.EunDAO as `0x${string}`,
        abi: DAO_ABI,
        functionName: "castVote",
        args: [proposalId, support],
      });
      toast.success("Vote submitted");
    } catch (e) {
      console.error(e);
      toast.error("Vote failed");
    }
  };

  return {
    proposals,
    isLoading,
    createProposal,
    castVote,
    refetch: fetchProposals,
    isTransacting: isPending || isConfirming,
  };
} 