import { SessionData } from "../../../../session-types";

export async function onSelectGenerator(
  existingPayload: any,
  sessionData: any,
) {
  existingPayload.context.message_id = sessionData?.select_message_id
  existingPayload.message.order.items[0].id =
    sessionData?.agent_activation_item_id || "";
  existingPayload.message.order.provider.id =
    sessionData?.agent_provider_id || ""
  existingPayload.message.order.fulfillments =
    existingPayload.message.order.fulfillments?.map((fulfillment: any) => {
      if (fulfillment.type === "AGENT_TICKETING") {
        return {
          ...fulfillment,
          agent: sessionData?.fulfillment_agent || {},
        };
      }
      return fulfillment;
    });
  return existingPayload;
}
