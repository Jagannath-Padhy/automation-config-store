import { SessionData } from "../../../../session-types";

export async function confirmGenerator(existingPayload: any, sessionData: any) {
  existingPayload.message.order.items = sessionData?.selected_items?.flat();
  existingPayload.message.order.fulfillments =
    sessionData?.select_fulfillments?.flat();
  existingPayload.message.order.provider = sessionData?.select_provider;
  existingPayload.message.order.billing = sessionData?.billing ?? {};
  existingPayload.message.order.payments = sessionData?.on_init_payments
    ?.flat()
    ?.map((item: any) => {
      return {
        ...item,
        status: "PAID",
        params: {
          transaction_id: crypto?.randomUUID(),
          currency: "INR",
          amount: sessionData?.on_init_quote?.price?.value ?? "",
        },
      };
    });

  const mergedTags = [
    ...sessionData?.init_tags.flat(),
    ...sessionData?.on_init_tags.flat(),
  ];

  const bapTermsTag = mergedTags.find(
    (tag: any) => tag?.descriptor?.code === "BAP_TERMS",
  );

  if (bapTermsTag && bapTermsTag.list) {
    const hasSettlementWindow = bapTermsTag.list.some(
      (item: any) => item?.descriptor?.code === "SETTLEMENT_WINDOW",
    );

    if (!hasSettlementWindow) {
      bapTermsTag.list.push({
        descriptor: {
          code: "SETTLEMENT_WINDOW",
        },
        value: "PT60M",
      });
    }
  }

  existingPayload.message.order.tags = mergedTags;
  return existingPayload;
}
