
export async function updateEndStopGenerator(existingPayload: any,sessionData: any){
  
    if (sessionData.order_id) {
    existingPayload.message.order.id = sessionData.order_id;
    }
    return existingPayload;
}