import { SessionData } from "../../../../session-types";

type Price = {
  value: string;
  currency: string;
};

type Item = {
  id: string;
  price: Price;
  quantity: {
    selected: {
      count: number;
    };
  };
};

type Breakup = {
  title: string;
  item?: Item;
  price: Price;
};

type Quote = {
  price: Price;
  breakup: Breakup[];
};
export function updateCancellationTimestamp(payload: any) {
  // deep clone to avoid mutating input
  const clone =
    typeof structuredClone === "function"
      ? structuredClone(payload)
      : JSON.parse(JSON.stringify(payload));

  const order = clone?.message?.order;
  if (!order || !order.cancellation) return clone;

  order.cancellation.time = new Date().toISOString();

  return clone;
}
export function updateSettlementAmount(order: any, sessionData: SessionData) {
  if (!order?.payments || !order?.quote?.price?.value) return order;

  const quoteValue = parseFloat(order.quote.price.value);
  if (Number.isNaN(quoteValue)) return order;

  const buyerFinderFee = parseFloat(sessionData.buyer_app_fee ?? "3");
  const buyerFinderAmount =
    (quoteValue * (isNaN(buyerFinderFee) ? 3 : buyerFinderFee)) / 100;

  // formatted strings to store in payload
  const buyerFinderAmountStr = buyerFinderAmount.toFixed(2);
  const remainderAmountStr = (quoteValue - buyerFinderAmount).toFixed(2);

  const sessionCollector = (sessionData.collected_by || "").toUpperCase();

  order.payments = order.payments.map((payment: any) => {
    if (!payment?.tags || !Array.isArray(payment.tags)) return payment;

    payment.tags = payment.tags.map((tag: any) => {
      if (
        tag.descriptor?.code === "SETTLEMENT_TERMS" &&
        Array.isArray(tag.list)
      ) {
        tag.list = tag.list.map((item: any) => {
          if (item.descriptor?.code === "SETTLEMENT_AMOUNT") {
            if (sessionCollector === "BPP") {
              return { ...item, value: buyerFinderAmountStr };
            }
            return { ...item, value: remainderAmountStr };
          }
          return item;
        });
      }
      return tag;
    });

    return payment;
  });

  return order;
}

function applyCancellation(quote: Quote, cancellationCharges: number): Quote {
  const currentTotal = parseFloat(quote.price.value);
  const refundAmount = quote.breakup
    .filter((b) => b.title === "BASE_FARE" && b.item)
    .reduce((sum, breakup) => {
      const itemTotal = parseFloat(breakup.price.value);
      return sum + itemTotal;
    }, 0);

  const refundBreakups: Breakup[] = quote.breakup
    .filter((b) => b.title === "BASE_FARE" && b.item)
    .map((baseFare) => ({
      title: "REFUND",
      item: {
        ...baseFare.item!,
        price: {
          ...baseFare.item!.price,
          value: `-${baseFare.item!.price.value}`,
        },
      },
      price: {
        ...baseFare.price,
        value: `-${baseFare.price.value}`,
      },
    }));

  // Create a CANCELLATION_CHARGES breakup
  const cancellationBreakup: Breakup = {
    title: "CANCELLATION_CHARGES",
    price: {
      currency: "INR",
      value: cancellationCharges.toFixed(2),
    },
  };

  const newTotal = currentTotal - refundAmount + cancellationCharges;

  return {
    price: {
      ...quote.price,
      value: newTotal.toFixed(2),
    },
    breakup: [...quote.breakup, ...refundBreakups, cancellationBreakup],
  };
}

export async function onCancelGenerator(
  existingPayload: any,
  sessionData: SessionData,
  isSoft_oncancel?: boolean,
) {
  existingPayload.message.order.cancellation.reason = {
    descriptor: {
      code: sessionData?.cancellation_reason_id ?? "000",
    },
  };
  existingPayload.message.order.cancellation_terms =
    sessionData?.cancellation_terms.flat();
  delete existingPayload.message.order.provider.time;
  if (sessionData.updated_payments.length > 0) {
    existingPayload.message.order.payments = sessionData.updated_payments;
  }

  if (sessionData.items.length > 0) {
    existingPayload.message.order.items = sessionData.items;
  }

  if (sessionData.fulfillments.length > 0) {
    existingPayload.message.order.fulfillments = sessionData.fulfillments?.map(
      (fulfillment: any) => {
        if (fulfillment.type === "TICKET") {
          const { stops, ...rest } = fulfillment;
          return rest;
        } else return fulfillment;
      },
    );
  }
  if (sessionData.order_id) {
    existingPayload.message.order.id = sessionData.order_id;
  }
  existingPayload.message.order.status = isSoft_oncancel
    ? "SOFT_CANCEL"
    : "CANCELLED";
  if (sessionData.quote != null) {
    existingPayload.message.order.quote =
      existingPayload.message.order.status === "CANCELLED"
        ? sessionData?.quote
        : applyCancellation(sessionData.quote, 0);
  }
  existingPayload.message.order = updateSettlementAmount(
    existingPayload.message.order,
    sessionData,
  );
  existingPayload = updateCancellationTimestamp(existingPayload);
  const now = new Date().toISOString();
  existingPayload.message.order.created_at = sessionData.created_at;
  existingPayload.message.order.updated_at = now;
  existingPayload.message.order.tags = sessionData.tags.flat();

  //______SETTLEMENT_AMOUNT____________
  const tags = existingPayload?.message?.order?.tags;
  if (!tags) return;

  const collectedBy = existingPayload.message.order.payments[0]?.collected_by; // "BAP" | "BPP"
  const price = Number(existingPayload?.message?.order?.quote?.price?.value);

  const buyerFinderFeesTag = tags?.find(
    (tag: any) => tag?.descriptor?.code === "BAP_TERMS",
  );

  const feePercentage = Number(
    buyerFinderFeesTag?.list?.find(
      (item: any) => item?.descriptor?.code === "BUYER_FINDER_FEES_PERCENTAGE",
    )?.value ?? 0,
  );

  const feeAmount = (price * feePercentage) / 100;

  let settlementAmount = 0;
  if (collectedBy === "BAP") {
    settlementAmount = price - feeAmount;
  } else if (collectedBy === "BPP") {
    settlementAmount = feeAmount;
  } else {
    settlementAmount = price;
  }

  const settlementTermsTag = tags?.find(
    (tag: any) => tag?.descriptor?.code === "BAP_TERMS",
  );

  const settlementAmountItem = settlementTermsTag?.list?.find(
    (item: any) => item?.descriptor?.code === "SETTLEMENT_AMOUNT",
  );

  if (settlementAmountItem) {
    settlementAmountItem.value = settlementAmount.toString();
  }

  const bppTermsTag = existingPayload.message.order.tags?.find(
    (item: any) => item.descriptor.code === "BPP_TERMS",
  );

  if (bppTermsTag) {
    const bppSettlementAmountItem = bppTermsTag.list?.find(
      (i: any) => i.descriptor.code === "SETTLEMENT_AMOUNT",
    );

    if (bppSettlementAmountItem) {
      bppSettlementAmountItem.value = settlementAmount.toString();
    }
  }
  delete existingPayload.message.order.cancellation.time;

  return existingPayload;
}
