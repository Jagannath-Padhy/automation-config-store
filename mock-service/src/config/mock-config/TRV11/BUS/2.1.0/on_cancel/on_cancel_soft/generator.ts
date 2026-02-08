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

function applyCancellation(quote: Quote, cancellationCharges: number): Quote {
  // Parse the current price
  const currentTotal = parseFloat(quote.price.value);

  // Calculate the total refund for items
  const refundAmount = quote.breakup
    .filter((b) => b.title === "BASE_FARE" && b.item)
    .reduce((sum, breakup) => {
      const itemTotal = parseFloat(breakup.price.value);
      return sum + itemTotal;
    }, 0);

  // Create a REFUND breakup for items
  const refundBreakups: Breakup[] = quote.breakup
    .filter((b) => b.title === "BASE_FARE" && b.item)
    .map((baseFare) => ({
      title: "REFUND",
      item: {
        ...baseFare.item!,
        price: {
          ...baseFare.item!.price,
          value: `-${baseFare.item!.price.value}`, // Negative for refund
        },
      },
      price: {
        ...baseFare.price,
        value: `-${baseFare.price.value}`, // Negative for refund
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

  // Update the total price
  const newTotal = currentTotal - refundAmount + cancellationCharges;

  // Return the updated quote
  return {
    price: {
      ...quote.price,
      value: newTotal.toFixed(2),
    },
    breakup: [...quote.breakup, ...refundBreakups, cancellationBreakup],
  };
}

export async function onCancelSoftGenerator(
  existingPayload: any,
  sessionData: any,
) {
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
          delete fulfillment.stops;
          return fulfillment;
        }
        return fulfillment;
      },
    );
  }
  if (sessionData.order_id) {
    existingPayload.message.order.id = sessionData.order_id;
  }

  if (sessionData.quote != null) {
    existingPayload.message.order.quote = applyCancellation(
      sessionData.quote,
      15,
    );
  }
  if (sessionData.cancellation_reason_id) {
    existingPayload.message.order.cancellation.reason.descriptor.code =
      sessionData.cancellation_reason_id;
  }
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
