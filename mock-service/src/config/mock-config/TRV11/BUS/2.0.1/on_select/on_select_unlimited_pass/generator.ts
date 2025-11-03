import { SessionData } from "../../../../session-types";





export async function onSelectGenerator(
	existingPayload: any,
	sessionData: SessionData
) {

	existingPayload.message.order.items.forEach((item:any) => {
		item.time.timestamp= new Date(Date.now()).toISOString()
		item.time.range.start=new Date(Date.now()).toISOString()
		item.time.range.end=new Date(Date.now()+ 3*60*60*60).toISOString()
	});
	existingPayload.message.order.fulfillments = sessionData.fulfillments.map(fulfillment => ({
		...fulfillment,
		stops: [
		  {
			type: "START",
			location: {
			  descriptor: {
				code: "std:011"
			  },
			  gps: "28.666576, 77.233332"
			},
			id: "1"
		  }
		],
		vehicle: {
		  category: "BUS",
		  variant: "AC"
		}
	  }));
	  
	
	return existingPayload;
}
