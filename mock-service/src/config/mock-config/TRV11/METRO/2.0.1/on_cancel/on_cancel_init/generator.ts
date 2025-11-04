
const modifyPayments = (payments: any) => {
    payments.forEach((payment: any) => {
      payment.tags.forEach((tag: any) => {
        if (tag.descriptor?.code === "SETTLEMENT_TERMS") {
          tag.list.forEach((item: any) => {
            if (item.descriptor?.code === "SETTLEMENT_AMOUNT") {
              item.value = "0"
            }
          })
        }
      })
    })
    return payments
  }
export async function onCancelInitGenerator(existingPayload: any,sessionData: any){
    if (sessionData.updated_payments.length > 0) {
		existingPayload.message.order.payments = modifyPayments(sessionData.updated_payments);
	  }
	
	if (sessionData.items.length > 0) {
	existingPayload.message.order.items = sessionData.items;
	}

	if (sessionData.fulfillments.length > 0) {
	existingPayload.message.order.fulfillments = sessionData.fulfillments;
	}
	
	existingPayload.message.order.fulfillments.forEach((fulfillment:any) => {
			fulfillment?.stops.forEach((stop:any) => {
				delete stop.authorization
			});
	});;
	
	if (sessionData.order_id) {
	existingPayload.message.order.id = sessionData.order_id;
	}
	if(sessionData.quote != null){
	existingPayload.message.order.quote = sessionData.quote
	}
	existingPayload.message.order.cancellation={
		cancelled_by:"CONSUMER",
		reason: {
		  descriptor: {
			  "code": sessionData.cancellation_reason_id
		  }
	  }
	  }
	  if(sessionData.provider){
		existingPayload.message.order.provider=sessionData.provider
	}
    existingPayload.message.order.status = "CANCELLATION_INITIATED"
	const now = new Date().toISOString();
  	existingPayload.message.order.created_at = sessionData.created_at
  	existingPayload.message.order.updated_at = now
    return existingPayload;
}