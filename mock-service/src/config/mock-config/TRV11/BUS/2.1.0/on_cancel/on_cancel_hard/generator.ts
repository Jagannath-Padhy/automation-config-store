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
function stripTicketAuthorizations(order: any) {
  if (!order.fulfillments) return order;

  order.fulfillments = order.fulfillments.map((fulfillment: any) => {
    if (fulfillment.type === "TICKET") {
      // remove stops entirely
      const { stops, ...rest } = fulfillment;
      return rest;
    }
    return fulfillment;
  });

  return order;
}
function updateSettlementAmount(order: any, sessionData: SessionData) {
  if (!order?.payments || !order?.quote?.price?.value) return order;

  const quoteValue = parseFloat(order.quote.price.value);
  const buyerFinderFee = parseFloat(sessionData.buyer_app_fee || "3");
  const newSettlementAmount = ((quoteValue * buyerFinderFee) / 100).toFixed(2);

  order.payments = order.payments.map((payment: any) => {
    if (!payment.tags) return payment;

    payment.tags = payment.tags.map((tag: any) => {
      if (
        tag.descriptor?.code === "SETTLEMENT_TERMS" &&
        Array.isArray(tag.list)
      ) {
        tag.list = tag.list.map((item: any) => {
          if (item.descriptor?.code === "SETTLEMENT_AMOUNT") {
            return {
              ...item,
              value: newSettlementAmount,
            };
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

export async function onCancelHardGenerator(
  existingPayload: any,
  sessionData: SessionData,
) {
  if (sessionData.updated_payments.length > 0) {
    existingPayload.message.order.payments = sessionData.updated_payments;
  }
  if (sessionData.items.length > 0) {
    existingPayload.message.order.items = sessionData.items;
  }

  if (sessionData.fulfillments.length > 0) {
    existingPayload.message.order.fulfillments = sessionData.fulfillments;
    existingPayload.message.order = stripTicketAuthorizations(
      existingPayload.message.order,
    );
  }
  if (sessionData.order_id) {
    existingPayload.message.order.id = sessionData.order_id;
  }
  if (sessionData.quote != null) {
    existingPayload.message.order.quote = sessionData.quote;
  }
  if (sessionData.cancellation_reason_id) {
    existingPayload.message.order.cancellation.reason.descriptor.code =
      sessionData.cancellation_reason_id;
  }

  existingPayload.message.order.cancellation.reason.descriptor.short_desc =
    "Cancelled by the consumer";

  existingPayload.message.order.status = "CANCELLED";
  existingPayload.message.order = updateSettlementAmount(
    existingPayload.message.order,
    sessionData,
  );
  existingPayload.message.order.tags = sessionData.tags.flat();
  const now = new Date().toISOString();
  existingPayload.message.order.created_at = sessionData.created_at;
  existingPayload.message.order.updated_at = now;
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
  return existingPayload;
}
