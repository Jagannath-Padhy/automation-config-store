import { SessionData } from "../../../../session-types";

export async function confirmGenerator(existingPayload: any, sessionData: any) {
  existingPayload.message.order.items = sessionData?.init_items?.flat() ?? [];
  existingPayload.message.order.fulfillments =
    sessionData?.init_fulfillments?.flat() ?? [];
  existingPayload.message.order.provider = sessionData?.init_provider ?? {};
  existingPayload.message.order.tags = [
    ...sessionData.init_tags?.flat(),
    ...sessionData.on_init_tags?.flat(),
  ];
  return existingPayload;
}
