

export async function updateEndStopGenerator(existingPayload: any,sessionData: any){
  
	
	
	if (sessionData.order_id) {
	existingPayload.message.order.id = sessionData.order_id;
}
existingPayload.message.order.fulfillments.forEach((fulfillment:any) => {
      fulfillment.stops.forEach((stop:any) => {
           stop.location.descriptor.code = sessionData.user_inputs?.end_code
           stop.location.descriptor.name = sessionData.user_inputs?.end_code
      });
});
	
 
    return existingPayload;
}