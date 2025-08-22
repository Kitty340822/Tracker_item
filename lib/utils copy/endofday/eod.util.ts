import {
  EOD_MC_CI10_COND,
  EOD_MC_CI10X_COND,
  EOD_MC_CI50_COND,
  EOD_MC_CI5_COND,
  TMcStateCI05,
  TMcStateCI10,
  TMcStateCI10X,
  TMcStateCI50,
} from "@/constants/cj-market/eod";

interface checkEndOfDayMcStatusParams {
  model: string;
  state: TMcStateCI10X | TMcStateCI10 | TMcStateCI05 | TMcStateCI50;
  noteStatus: string;
  coinStatus: string;
}

const getModelConstant = (model: string) => {
  switch (model) {
    case "CI-10BX":
      return EOD_MC_CI10X_COND;
    case "CI-10B":
      return EOD_MC_CI10_COND;
    case "CI-05B":
      return EOD_MC_CI5_COND;
    case "CI-50B":
      return EOD_MC_CI50_COND;
  }
};

export const checkEndOfDayMcStatus = ({
  model,
  state,
  noteStatus,
  coinStatus,
}: checkEndOfDayMcStatusParams) => {
  try {
    const modelConst = getModelConstant(model);

    if (!modelConst) return false;

    const thisState = modelConst[state as keyof typeof modelConst];

    if (!thisState) return false;

    if (
      (thisState.note as string[]).includes(noteStatus) &&
      (thisState.coin as string[]).includes(coinStatus)
    ) {
      return true;
    }
  } catch (err: any) {
    console.error("[ERROR]", err.message);
  }
  return false;
};
