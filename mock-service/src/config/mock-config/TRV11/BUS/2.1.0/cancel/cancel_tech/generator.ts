
export async function cancelTechGenerator(existingPayload: any,sessionData: any, isSoftcancel?: boolean){
    if (sessionData.order_id) {
        existingPayload.message.order_id = sessionData.order_id;
      }
      if(isSoftcancel){
        existingPayload.message.descriptor.code = "SOFT_CANCEL"
      }
    return existingPayload;
}