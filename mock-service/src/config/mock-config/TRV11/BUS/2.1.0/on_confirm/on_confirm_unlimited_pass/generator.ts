import { SessionData } from "../../../../session-types";

export async function onConfirmGenerator(
  existingPayload: any,
  sessionData: any,
) {
  const date = new Date().toISOString();
  existingPayload.context.message_id = sessionData?.message_id;
  existingPayload.message.order.id = crypto.randomUUID().slice(0, 7);
  existingPayload.message.order.provider = sessionData?.on_init_provider ?? {};
  existingPayload.message.order.items =
    sessionData?.on_init_items?.flat() ?? {};
  existingPayload.message.order.fulfillments = sessionData?.on_init_fulfillments
    ?.flat()
    ?.map((fulfillment: any) => {
      return {
        ...fulfillment,
        stops: fulfillment?.stops?.map((stop: any) => {
          return {
            ...stop,
            authorization: {
              type: "QR",
              token: Buffer.from(crypto.randomUUID()).toString("base64"),
              valid_to: (() => {
                const validityDate = new Date();
                validityDate.setFullYear(validityDate.getFullYear() + 1);
                return validityDate.toISOString();
              })(),
              status: "UNCLAIMED",
            },
          };
        }),
        tags: [
          {
            descriptor: {
              code: "TICKET_INFO",
            },
            list: [
              {
                descriptor: {
                  code: "NUMBER",
                },
                value: crypto.randomUUID().slice(0, 7),
              },
            ],
          },
        ],
      };
    });
  existingPayload.message.order.quote = sessionData?.on_init_quote ?? {};
  existingPayload.message.order.billing = sessionData?.billing ?? {};
  existingPayload.message.order.cancellation_terms =
    sessionData?.cancellation_terms?.flat() ?? [];
  existingPayload.message.order.payments =
    sessionData?.confirm_payments?.flat() ?? [];
  existingPayload.message.order.tags = sessionData?.tags?.flat();
  existingPayload.message.order.created_at = date;
  existingPayload.message.order.updated_at = date;
  return existingPayload;
}
