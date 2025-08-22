import {
  EOD_MC_CI10X_CJ_COND,
  TMcStateCI10XCJ,
} from "@/constants/cj-market/eod-cj";

interface checkEndOfDayMcStatusCJParams {
  model: string;
  state: TMcStateCI10XCJ;
  noteStatus: string;
  coinStatus: string;
}

const getModelCJConstant = (model: string) => {
  switch (model) {
    case "CI-10BX":
      return EOD_MC_CI10X_CJ_COND;
  }
};

export const checkEndOfDayCJMcStatus = ({
  model,
  state,
  noteStatus,
  coinStatus,
}: checkEndOfDayMcStatusCJParams) => {
  try {
    const modelConst = getModelCJConstant(model);

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
