

export async function statusActiveGenerator(existingPayload: any,sessionData: any){
    // if(sessionData.order_id){
    //     existingPayload.message.order_id = sessionData.order_id
    // }
    existingPayload.message.ref_id = existingPayload?.context?.transaction_id ?? "123456789"
    return existingPayload;
}