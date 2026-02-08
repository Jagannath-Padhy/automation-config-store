import { SessionData } from "../../../../session-types";

export async function updateGenerator(
  existingPayload: any,
  sessionData: SessionData,
) {
  existingPayload.message.order.id = crypto.randomUUID().slice(0, 8).toString();
  const firstBaseFare = 35;
  const secondBaseFare = 25;
  const firstItemQuanity = 50;
  const secondItemQuanity = 40;
  const breakup = [
    {
      title: "BASE_FARE",
      item: {
        id: "I1",
        quantity: {
          selected: {
            count: firstItemQuanity,
          },
        },
      },
      price: {
        currency: "INR",
        value: String(firstItemQuanity * firstBaseFare),
      },
    },
    {
      title: "BASE_FARE",
      item: {
        id: "I2",
        price: {
          currency: "INR",
          value: String(secondBaseFare),
        },
        quantity: {
          selected: {
            count: secondItemQuanity,
          },
        },
      },
      price: {
        currency: "INR",
        value: String(secondBaseFare * secondItemQuanity),
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

  let quotePrice = 0;
  breakup.forEach((item: any) => {
    quotePrice += Number(item?.price?.value || 0);
  });

  const quote = {
    price: {
      value: String(quotePrice),
      currency: "INR",
    },
    breakup,
  };

  existingPayload.message.order.quote = quote;
  return existingPayload;
}
