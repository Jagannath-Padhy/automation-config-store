

export async function statusTechCancelGenerator(existingPayload: any,sessionData: any){
    console.log('++++++++++');
    if(sessionData.transaction_id){
        console.log('sessionData.transaction_id---->>>>>>>>>',sessionData.transaction_id);
        existingPayload.message.ref_id = sessionData?.transaction_id ?? "123456789"
    }
    return existingPayload;
}