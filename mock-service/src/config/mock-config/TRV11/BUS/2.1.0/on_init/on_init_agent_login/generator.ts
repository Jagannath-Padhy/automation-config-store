import { SessionData } from "../../../../session-types";

export async function onInitGenerator(existingPayload: any, sessionData: any) {
  existingPayload.context.message_id = sessionData.message_id;
  existingPayload.message.order.items[0].id = sessionData?.init_item_id ?? "";
  existingPayload.message.order.fulfillments =
    existingPayload.message.order.fulfillments
      ?.flat()
      ?.map((fulfillment: any) => {
        if (fulfillment.type === "AGENT_TICKETING") {
          return {
            ...fulfillment,
            agent: sessionData?.init_fulfillments?.flat()?.[0]?.agent ?? {},
          };
        }
        return fulfillment;
      });
  existingPayload.message.order.provider.id =
    sessionData?.init_provider?.id ?? "";
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
  ];
  return existingPayload;
}
