import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type UiActionState = {
  amountData: {
    amount: string;
    withAmount: boolean;
  };
  addressData: {
    address: string;
    withAddress: boolean;
  };
  satsCalculatorData: {
    address: string;
    amount: string;
    action: "sats" | "btc" | "none";
    withSatsCalculatorDataFlow: boolean;
  };
  kycFlow: {
    step: number;
    drawerIsOpen: boolean;
  };
};

const initialState: UiActionState = {
  addressData: {
    withAddress: false,
    address: "",
  },
  amountData: {
    amount: "0",
    withAmount: false,
  },
  satsCalculatorData: {
    amount: "0",
    address: "",
    action: "none",
    withSatsCalculatorDataFlow: false,
  },
  kycFlow: {
    step: 0,
    drawerIsOpen: false,
  },
};

const uiActionSlice = createSlice({
  name: "uiActions",
  initialState,
  reducers: {
    setAmountData: (
      state,
      { payload }: PayloadAction<{ amount: string; withAmount: boolean }>,
    ) => {
      state.amountData = payload;
    },
    setAddressData: (
      state,
      { payload }: PayloadAction<{ address: string; withAddress: boolean }>,
    ) => {
      state.addressData = payload;
    },
    setSatsCalculatorData: (
      state,
      {
        payload,
      }: PayloadAction<{
        amount: string;
        address: string;
        action: "sats" | "btc" | "none";
        withSatsCalculatorDataFlow: boolean;
      }>,
    ) => {
      state.satsCalculatorData = payload;
    },
    updateKycFlow: (
      state,
      { payload }: PayloadAction<{ step: number; drawerIsOpen: boolean }>,
    ) => {
      state.kycFlow = payload;
    },
  },
});

const { actions, reducer: UiActionReducer } = uiActionSlice;

export const {
  setAddressData,
  setAmountData,
  setSatsCalculatorData,
  updateKycFlow,
} = actions;
export default UiActionReducer;
