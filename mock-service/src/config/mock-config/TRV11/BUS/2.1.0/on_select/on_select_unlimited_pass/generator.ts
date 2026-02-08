import { SessionData } from "../../../../session-types";

export async function onSelectUnlimitedPassesGenerator(
  existingPayload: any,
  sessionData: any,
) {
  const basePrice = 100;
  const duration = "P7D";
  const currentDate = new Date();
  const validityEndDate = new Date();
  existingPayload.context.message_id = sessionData?.message_id;
  existingPayload.message.order.provider.id =
    sessionData.select_provider_id ?? "";
  existingPayload.message.order.fulfillments = [
    {
      id: sessionData?.select_fulfillments?.flat()[0]?.id ?? "",
      type: sessionData?.select_fulfillments?.flat()[0]?.type ?? "",
      customer: sessionData?.select_fulfillments?.flat()[0]?.customer ?? {},
      stops: [
        {
          type: "START",
          location: {
            descriptor: {
              code: "std:011",
            },
            gps: "28.666576, 77.233332",
          },
          id: "1",
        },
      ],
      vehicle: {
        category: "BUS",
        variant: "AC",
      },
    },
  ];

  existingPayload.message.order.items = [
    {
      id: sessionData?.selected_items?.flat()[0]?.id ?? "",
      descriptor: {
        name: "Weekly Pass",
        code: "PASS",
        images: [
          {
            url: "https://dtc.delhi.gov.in/sites/default/files/DTC/logo/dtc_logo_2.png",
            size_type: "xs",
          },
        ],
      },
      fulfillment_ids: existingPayload?.message?.order?.fulfillments?.map(
        (fulfillment: any) => fulfillment?.id,
      ),
      price: {
        currency: "INR",
        value: String(basePrice),
      },
      quantity: sessionData?.selected_items?.flat()[0]?.quantity ?? {},
      time: (() => {
        const daysMatch = duration.match(/P(?:T)?(\d+)D/);
        if (daysMatch) {
          const days = parseInt(daysMatch[1], 10);
          validityEndDate.setDate(validityEndDate.getDate() + (days - 1));
        }

        return {
          label: "Validity",
          duration: duration,
          timestamp: currentDate.toISOString(),
          range: {
            start: currentDate.toISOString(),
            end: validityEndDate.toISOString(),
          },
        };
      })(),
    },
  ];
  const breakup = [
    {
      title: "BASE_FARE",
      item: {
        id: existingPayload?.message?.order?.items[0]?.id ?? "",
        price: {
          currency: "INR",
          value: existingPayload?.message?.order?.items[0]?.price?.value ?? "",
        },
        quantity: existingPayload?.message?.order?.items[0]?.quantity ?? {},
      },
      price: {
        currency: "INR",
        value: String(
          Number(existingPayload?.message?.order?.items[0]?.price?.value || 0) *
            Number(
              existingPayload?.message?.order?.items[0]?.quantity?.selected
                ?.count || 1,
            ),
        ),
      },
    },
    {
      title: "OFFER",
      price: {
        currency: "INR",
        value: "0",
      },
    },
    {
      title: "TOLL",
      price: {
        currency: "INR",
        value: "0",
      },
    },
    {
      title: "TAX",
      price: {
        currency: "INR",
        value: "0",
      },
      item: {
        tags: [
          {
            descriptor: {
              code: "TAX",
            },
            list: [
              {
                descriptor: {
                  code: "CGST",
                },
                value: "0",
              },
              {
                descriptor: {
                  code: "SGST",
                },
                value: "0",
              },
            ],
          },
        ],
      },
    },
    {
      title: "OTHER_CHARGES",
      price: {
        currency: "INR",
        value: "0",
      },
      item: {
        tags: [
          {
            descriptor: {
              code: "OTHER_CHARGES",
            },
            list: [
              {
                descriptor: {
                  code: "SURCHARGE",
                },
                value: "0",
              },
            ],
          },
        ],
      },
    },
  ];

  let totalQuotePrice = 0;
  breakup.forEach((item: any) => {
    totalQuotePrice += Number(item?.price?.value || 0);
  });

  existingPayload.message.order.quote = {
    price: {
      value: String(totalQuotePrice),
      currency: "INR",
    },
    breakup,
  };
  return existingPayload;
}
