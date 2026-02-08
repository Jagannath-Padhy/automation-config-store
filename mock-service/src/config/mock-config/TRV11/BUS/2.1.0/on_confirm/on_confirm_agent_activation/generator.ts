import { SessionData } from "../../../../session-types";

export async function onConfirmGenerator(
  existingPayload: any,
  sessionData: any,
) {
  const currentDate = new Date().toISOString();
  existingPayload.context.message_id = sessionData.confirm_message_id;
  existingPayload.message.order.id = crypto.randomUUID().slice(0, 7);
  existingPayload.message.order.provider = sessionData?.on_init_provider ?? {};
  existingPayload.message.order.items =
    sessionData?.on_init_items?.flat() ?? [];
  existingPayload.message.order.fulfillments =
    sessionData?.on_init_fulfillments?.flat()?.map((fulfillment: any) => {
      if (fulfillment.type === "AGENT_TICKETING") {
        return {
          ...fulfillment,
          state: {
            descriptor: {
              code: "ACTIVE",
            },
          },
        };
      }
      return fulfillment;
    }) ?? [];
  existingPayload.message.order.tags = sessionData?.confirm_tags?.flat() ?? [];

  const bapTermsTag = existingPayload.message.order.tags?.find(
    (tag: any) => tag?.descriptor?.code === "BAP_TERMS",
  );

  if (bapTermsTag && bapTermsTag.list) {
    bapTermsTag.list.push({
      descriptor: {
        code: "SETTLEMENT_WINDOW",
      },
      value: "PT60M",
    });
  }

  const itemValidatity =
    existingPayload?.message?.order?.items[0]?.time?.duration;
  let validityEndDate = new Date();

  if (itemValidatity) {
    const daysMatch = itemValidatity.match(/P(?:T)?(\d+)D/);
    if (daysMatch) {
      const days = parseInt(daysMatch[1], 10);
      validityEndDate.setDate(validityEndDate.getDate() + days);
    }
  }

  existingPayload.message.order.items[0].time.timestamp =
    validityEndDate.toISOString();
  existingPayload.message.order.created_at = currentDate;
  existingPayload.message.order.updated_at = currentDate;

  return existingPayload;
}
