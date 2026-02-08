import { SessionData } from "../../../../session-types";

export async function initGenerator(existingPayload: any, sessionData: any) {
  try {
    existingPayload.message.order.items[0].id =
      sessionData?.agent_activation_item_id;
    const fulfillment = sessionData?.on_select_fulfillments
      ?.flat()
      ?.find((fulfillment: any) => {
        return (
          fulfillment.agent?.person?.id ===
          sessionData?.fulfillment_agent?.person?.id
        );
      });
    const routeFulfillmentId = fulfillment?.tags
      ?.find((i: any) => i?.descriptor?.code === "INFO")
      ?.list?.find((i: any) => i?.descriptor?.code === "PARENT_ID")?.value;

    const { tags, ...rest } = fulfillment;
    existingPayload.message.order.fulfillments = [
      {
        id: routeFulfillmentId,
        type: "ROUTE",
      },
      rest,
    ];

    existingPayload.message.order.provider.id = sessionData?.agent_provider_id;
    existingPayload.message.order.tags = existingPayload.message.order.tags;
    return existingPayload;
  } catch (err) {
    console.error("Error in initUnlimitedPassGenerator:", err);
    throw err;
  }
}
