import { SessionData } from "../../../../session-types";

function updateItemTimestamps(payload: any) {
  const validityDate = new Date();
  validityDate.setDate(validityDate.getDate() + 2); // Add 2 days
  const twoDaysFromNow = validityDate.toISOString();

  const providers = payload?.message?.catalog?.providers;
  if (!Array.isArray(providers)) return payload;

  providers.forEach((provider: any) => {
    if (!Array.isArray(provider.items)) return;

    provider.items.forEach((item: any) => {
      if (
        item?.time &&
        typeof item.time === "object" &&
        "timestamp" in item.time
      ) {
        item.time.timestamp = twoDaysFromNow;
      }
    });
  });

  return payload;
}

export async function onSearchCatalogGenerator(
  existingPayload: any,
  sessionData: SessionData,
) {
  delete existingPayload.context.location.city.code;
  existingPayload.message.catalog.providers =
    existingPayload?.message?.catalog?.providers?.map((item: any) => {
      return {
        ...item,
        payments: [
          {
            collected_by: sessionData?.collected_by ?? "BAP",
          },
        ],
      };
    });
  existingPayload = updateItemTimestamps(existingPayload);
  return existingPayload;
}
