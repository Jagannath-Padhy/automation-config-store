import { SessionData } from "../../../../session-types";

export async function onInitGenerator(existingPayload: any, sessionData: any) {
  existingPayload.context.message_id = sessionData?.message_id;
  existingPayload.message.order.provider =
    sessionData?.on_select_provider ?? {};
  existingPayload.message.order.items =
    sessionData?.on_select_items?.flat() ?? {};
  existingPayload.message.order.fulfillments =
    sessionData?.on_select_fulfillments?.flat() ?? {};
  existingPayload.message.order.quote = sessionData?.on_select_quote ?? {};
  existingPayload.message.order.billing = sessionData?.billing ?? {};
  existingPayload.message.order.payments = sessionData?.payments
    ?.flat()
    ?.map((item: any) => {
      return {
        ...item,
        id: crypto.randomUUID(),
      };
    });
  existingPayload.message.order.tags = [
    {
      descriptor: {
        code: "BPP_TERMS",
        name: "BPP Terms of Engagement",
      },
      display: false,
      list: [
        ...sessionData?.init_tags?.flat()[0]?.list,
        {
          descriptor: {
            code: "SETTLEMENT_WINDOW",
          },
          value: "PT60M",
        },
        {
          descriptor: {
            code: "SETTLEMENT_BANK_CODE",
          },
          value: "XXXXXXXX",
        },
        {
          descriptor: {
            code: "SETTLEMENT_BANK_ACCOUNT_NUMBER",
          },
          value: "xxxxxxxxxxxxxx",
        },
      ],
    },
    ...sessionData?.on_select_tags?.flat()
  ];
  return existingPayload;
}
