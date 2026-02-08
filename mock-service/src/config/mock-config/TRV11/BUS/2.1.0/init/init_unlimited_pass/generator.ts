import { SessionData } from "../../../../session-types";

export async function initUnlimitedPassGenerator(
  existingPayload: any,
  sessionData: any,
) {
  try {
    existingPayload.message.order.items = sessionData?.selected_items?.flat();
    existingPayload.message.order.fulfillments =
      sessionData?.select_fulfillments?.flat();
    existingPayload.message.order.provider = sessionData?.select_provider;
    existingPayload.message.order.billing = {
      name: "John Doe",
      email: "john.doe@example.com",
      phone: "+91-9897867564",
    };
    existingPayload.message.order.payments = [
      {
        collected_by: "BAP",
        status: "NOT-PAID",
        type: "PRE-ORDER",
      },
    ];
    existingPayload.message.order.tags = [
      {
        descriptor: {
          code: "BAP_TERMS",
          name: "BAP Terms of Engagemen",
        },
        display: false,
        list: [
          {
            descriptor: {
              code: "BUYER_FINDER_FEES_PERCENTAGE",
            },
            value: "1",
          },
          {
            descriptor: {
              code: "SETTLEMENT_AMOUNT",
            },
            value: "59",
          },
          {
            descriptor: {
              code: "SETTLEMENT_TYPE",
            },
            value: "NEFT",
          },
          {
            descriptor: {
              code: "DELAY_INTEREST",
            },
            value: "2.5",
          },
          {
            descriptor: {
              code: "STATIC_TERMS",
            },
            value: "https://api.example-bap.com/booking/terms",
          },
          {
            descriptor: {
              code: "MANDATORY_ARBITRATION",
            },
            value: "true",
          },
          {
            descriptor: {
              code: "COURT_JURISDICTION",
            },
            value: "New Delhi",
          },
          {
            descriptor: {
              code: "SETTLEMENT_BASIS",
            },
            value: "Delivery",
          },
        ],
      },
    ];

    //______SETTLEMENT_AMOUNT____________
    const tags = existingPayload?.message?.order?.tags;
    if (!tags) return;

    const collectedBy: string = sessionData?.user_inputs?.collected_by; 
    const price = Number(sessionData?.on_select_quote?.price?.value ?? 0);

    const buyerFinderFeesTag = tags?.find(
      (tag: any) => tag?.descriptor?.code === "BAP_TERMS",
    );

    const feePercentage = Number(
      buyerFinderFeesTag?.list?.find(
        (item: any) =>
          item?.descriptor?.code === "BUYER_FINDER_FEES_PERCENTAGE",
      )?.value ?? 0,
    );

    const feeAmount = (price * feePercentage) / 100;

    let settlementAmount = 0;
    if (collectedBy === "BAP") {
      settlementAmount = price - feeAmount;
    } else if (collectedBy === "BPP") {
      settlementAmount = feeAmount;
    } else {
      settlementAmount = price;
    }

    const settlementTermsTag = tags?.find(
      (tag: any) => tag?.descriptor?.code === "BAP_TERMS",
    );

    const settlementAmountItem = settlementTermsTag?.list?.find(
      (item: any) => item?.descriptor?.code === "SETTLEMENT_AMOUNT",
    );

    if (settlementAmountItem) {
      settlementAmountItem.value = settlementAmount.toString();
    }

    return existingPayload;
  } catch (err) {
    console.error("Error in initUnlimitedPassGenerator:", err);
    throw err; // or return existingPayload if you don't want failures
  }
}
