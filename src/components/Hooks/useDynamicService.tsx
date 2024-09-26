import { useEffect, useState } from "react";
import { fetchEventSource } from "@microsoft/fetch-event-source";
import Cookies from "js-cookie";
import { baseURL } from "../Utils/Https";
import { Events, screenActions } from "../contants";

function useDynamicService() {
  const [actionData, setactionData] = useState<{
    data: { amount: number; event: string };
    action: screenActions;
    showAction: boolean;
  }>({
    data: { amount: 0, event: "" },
    action: screenActions.NONE,
    showAction: false,
  });

  const atk = Cookies.get("atk");
  const fetchEvent = async () => {
    await fetchEventSource(`${baseURL}stream`, {
      headers: {
        Authorization: `Bearer ${atk}`,
      },
      onmessage(msg) {
        if (msg.data !== "ping") {
          const data = JSON.parse(msg.data);
          switch (data.event) {
            case Events.LIGHTNING_PAYMENT_SUCCESS:
              return setactionData({
                data: {
                  amount: data.data.sats,
                  event: "Lightning Payment received",
                },
                action: screenActions.LIGHTNING_PAYMENT_RECEIVED,
                showAction: true,
              });
            case Events.LIGHTNING_PAYMENT_FAILED:
              return setactionData({
                data: {
                  amount: data.data.sats,
                  event: "Lightning Payment Failed",
                },
                action: screenActions.LIGHTNING_PAYMENT_FAILED,
                showAction: true,
              });
            case Events.LIGHTNING_PAYMENT_SENT:
              return setactionData({
                data: {
                  amount: data.data.sats,
                  event: "Lightning Payment Sent",
                },
                action: screenActions.LIGHTNING_PAYMENT_SENT,
                showAction: true,
              });
          }
        }
      },
    });
  };

  useEffect(() => {
    fetchEvent();
  });

  return { actionData, setactionData };
}
export default useDynamicService;
