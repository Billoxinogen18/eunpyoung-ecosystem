import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { parseUnits, formatUnits } from "viem";
import { useState } from "react";
import contracts from "../contracts.json";
import ERC20_ABI from "../abis/ERC20.json";
import DONATION_ABI from "../abis/DonationConverter.json";
import toast from "react-hot-toast";

export interface DonationProject {
  id: number;
  name: string;
  description: string;
  goal: number;
  raised: number;
  category: string;
  active: boolean;
  progress: number;
}

export function useDonations() {
  const { address } = useAccount();
  const [isTransacting, setIsTransacting] = useState(false);
  
  const { writeContract, data: hash, isPending } = useWriteContract();
  const { isLoading: isConfirming } = useWaitForTransactionReceipt({ hash });

  // Read project count
  const { data: projectCountData, refetch: refetchProjectCount } = useReadContract({
    address: contracts.DonationConverter as `0x${string}`,
    abi: DONATION_ABI,
    functionName: "projectCount",
    query: {
      refetchInterval: 10000,
    },
  });

  // Read conversion rate
  const { data: conversionRateData } = useReadContract({
    address: contracts.DonationConverter as `0x${string}`,
    abi: DONATION_ABI,
    functionName: "conversionRate",
    query: {
      refetchInterval: 30000,
    },
  });

  // Read EUN token allowance for donation converter
  const { data: allowanceData, refetch: refetchAllowance } = useReadContract({
    address: contracts.EunCoin as `0x${string}`,
    abi: ERC20_ABI,
    functionName: "allowance",
    args: address ? [address, contracts.DonationConverter] : undefined,
    query: {
      enabled: !!address,
      refetchInterval: 5000,
    },
  });

  const projectCount = projectCountData ? Number(projectCountData) : 0;
  const conversionRate = conversionRateData ? Number(formatUnits(conversionRateData as bigint, 18)) : 1;
  const allowance = allowanceData ? Number(formatUnits(allowanceData as bigint, 18)) : 0;

  // Fetch project details for all projects
  const useProjectDetails = (projectId: number) => {
    const { data: projectData } = useReadContract({
      address: contracts.DonationConverter as `0x${string}`,
      abi: DONATION_ABI,
      functionName: "getProject",
      args: [BigInt(projectId)],
      query: {
        enabled: projectId >= 0 && projectId < projectCount,
        refetchInterval: 10000,
      },
    });

    if (projectData && Array.isArray(projectData)) {
      const [name, description, goal, raised, category, active] = projectData as [string, string, bigint, bigint, string, boolean];
      const goalNumber = Number(formatUnits(goal, 18));
      const raisedNumber = Number(formatUnits(raised, 18));
      
      return {
        id: projectId,
        name,
        description,
        goal: goalNumber,
        raised: raisedNumber,
        category,
        active,
        progress: goalNumber > 0 ? (raisedNumber / goalNumber) * 100 : 0,
      } as DonationProject;
    }
    return null;
  };

  const convertToNanum = async (amount: string) => {
    if (!address) {
      toast.error("Please connect your wallet");
      return;
    }

    try {
      setIsTransacting(true);
      const amountWei = parseUnits(amount, 18);

      // Check if approval is needed
      if (allowanceData && (allowanceData as bigint) < amountWei) {
        toast("Approving EUN for conversion...", { icon: "ℹ️" });
        
        // First approve
        await writeContract({
          address: contracts.EunCoin as `0x${string}`,
          abi: ERC20_ABI,
          functionName: "approve",
          args: [contracts.DonationConverter, amountWei],
        });

        setTimeout(() => {
          refetchAllowance();
        }, 2000);
        
        toast.success("Approval successful! Now converting...");
      }

      // Then convert
      await writeContract({
        address: contracts.DonationConverter as `0x${string}`,
        abi: DONATION_ABI,
        functionName: "convertToNanum",
        args: [amountWei],
      });

      toast.success("Conversion transaction submitted!");
      
    } catch (error) {
      console.error("Conversion error:", error);
      toast.error("Conversion failed. Please try again.");
    } finally {
      setIsTransacting(false);
    }
  };

  const donateToProject = async (projectId: number, amount: string) => {
    if (!address) {
      toast.error("Please connect your wallet");
      return;
    }

    try {
      setIsTransacting(true);
      const amountWei = parseUnits(amount, 18);

      // Check if approval is needed (using NANUM token for donations)
      const { data: nanumAllowanceData } = await useReadContract({
        address: contracts.NanumCoin as `0x${string}`,
        abi: ERC20_ABI,
        functionName: "allowance",
        args: [address, contracts.DonationConverter],
      });

      if (nanumAllowanceData && (nanumAllowanceData as bigint) < amountWei) {
        toast("Approving NANUM for donation...", { icon: "ℹ️" });
        
        await writeContract({
          address: contracts.NanumCoin as `0x${string}`,
          abi: ERC20_ABI,
          functionName: "approve",
          args: [contracts.DonationConverter, amountWei],
        });

        toast.success("Approval successful! Now donating...");
      }

      // Then donate
      await writeContract({
        address: contracts.DonationConverter as `0x${string}`,
        abi: DONATION_ABI,
        functionName: "donateToProject",
        args: [BigInt(projectId), amountWei],
      });

      toast.success("Donation transaction submitted!");
      
    } catch (error) {
      console.error("Donation error:", error);
      toast.error("Donation failed. Please try again.");
    } finally {
      setIsTransacting(false);
    }
  };

  const createProject = async (name: string, description: string, goal: string, category: string) => {
    if (!address) {
      toast.error("Please connect your wallet");
      return;
    }

    try {
      setIsTransacting(true);
      const goalWei = parseUnits(goal, 18);

      await writeContract({
        address: contracts.DonationConverter as `0x${string}`,
        abi: DONATION_ABI,
        functionName: "createProject",
        args: [name, description, goalWei, category],
      });

      toast.success("Project creation transaction submitted!");
      
      setTimeout(() => {
        refetchProjectCount();
      }, 3000);
      
    } catch (error) {
      console.error("Project creation error:", error);
      toast.error("Project creation failed. Please try again.");
    } finally {
      setIsTransacting(false);
    }
  };

  return {
    projectCount,
    conversionRate,
    allowance,
    convertToNanum,
    donateToProject,
    createProject,
    isTransacting: isTransacting || isPending || isConfirming,
    useProjectDetails,
    refetchAllowance,
  };
}