import { SessionData } from "../../../../session-types";

export async function confirmGenerator(existingPayload: any, sessionData: any) {
  existingPayload.message.order.provider = sessionData?.init_provider ?? {};
  existingPayload.message.order.items = sessionData?.init_items?.flat() ?? {};
  existingPayload.message.order.fulfillments = sessionData?.on_init_fulfillments
    ?.flat()
    ?.map((fulfillment: any) => {
      if (fulfillment.type === "ROUTE") {
        const { id, type } = fulfillment;
        return {
          id,
          type,
        };
      } else if (fulfillment.type === "AGENT_TICKETING") {
        const { tags, ...rest } = fulfillment;
        return rest;
      }
    });
  existingPayload.message.order.tags = [
    ...sessionData?.init_tags?.flat(),
    ...sessionData?.on_init_tags?.flat(),
  ];
  return existingPayload;
}
