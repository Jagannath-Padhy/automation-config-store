const exampleFullfillment = {
  fulfillments: [
    {
      id: "F1",
      type: "ROUTE",
      stops: [
        {
          type: "START",
          location: {
            descriptor: {
              name: "MOCK_STATION_1",
              code: "MOCKSTATION_1",
            },
            gps: "28.744676, 77.138332",
          },
          id: "1",
        },
        {
          type: "INTERMEDIATE_STOP",
          instructions: {
            name: "Stop 1",
          },
          location: {
            descriptor: {
              name: "MOCK_STATION_2",
              code: "MOCKSTATION_2",
            },
            gps: "28.738416, 77.139132",
          },
          id: "2",
          parent_stop_id: "1",
        },
        {
          type: "INTERMEDIATE_STOP",
          instructions: {
            name: "Stop 2",
          },
          location: {
            descriptor: {
              name: "MOCK_STATION_3",
              code: "MOCKSTATION_3",
            },
            gps: "28.738876, 77.119932",
          },
          id: "3",
          parent_stop_id: "2",
        },
        {
          type: "INTERMEDIATE_STOP",
          instructions: {
            name: "Stop 3",
          },
          location: {
            descriptor: {
              name: "MOCK_STATION_4",
              code: "MOCKSTATION_4",
            },
            gps: "28.738411, 77.131132",
          },
          id: "4",
          parent_stop_id: "3",
        },
        {
          type: "INTERMEDIATE_STOP",
          instructions: {
            name: "Stop 4",
          },
          location: {
            descriptor: {
              name: "MOCK_STATION_5",
              code: "MOCKSTATION_5",
            },
            gps: "28.738176, 77.139932",
          },
          id: "5",
          parent_stop_id: "4",
        },
        {
          type: "INTERMEDIATE_STOP",
          instructions: {
            name: "Stop 5",
          },
          location: {
            descriptor: {
              name: "MOCK_STATION_6",
              code: "MOCKSTATION_6",
            },
            gps: "28.738426, 77.139932",
          },
          id: "6",
          parent_stop_id: "5",
        },
        {
          type: "INTERMEDIATE_STOP",
          instructions: {
            name: "Stop 6",
          },
          location: {
            descriptor: {
              name: "MOCK_STATION_7",
              code: "MOCKSTATION_7",
            },
            gps: "28.718476, 77.129932",
          },
          id: "7",
          parent_stop_id: "6",
        },
        {
          type: "INTERMEDIATE_STOP",
          instructions: {
            name: "Stop 7",
          },
          location: {
            descriptor: {
              name: "MOCK_STATION_8",
              code: "MOCKSTATION_8",
            },
            gps: "28.738576, 77.139532",
          },
          id: "8",
          parent_stop_id: "7",
        },
        {
          type: "INTERMEDIATE_STOP",
          instructions: {
            name: "Stop 8",
          },
          location: {
            descriptor: {
              name: "MOCK_STATION_9",
              code: "MOCKSTATION_9",
            },
            gps: "28.731406, 77.131032",
          },
          id: "9",
          parent_stop_id: "8",
        },
        {
          type: "INTERMEDIATE_STOP",
          instructions: {
            name: "Stop 9",
          },
          location: {
            descriptor: {
              name: "MOCK_STATION_10",
              code: "MOCKSTATION_10",
            },
            gps: "28.718476, 77.133932",
          },
          id: "10",
          parent_stop_id: "9",
        },
        {
          type: "INTERMEDIATE_STOP",
          instructions: {
            name: "Stop 10",
          },
          location: {
            descriptor: {
              name: "MOCK_STATION_11",
              code: "MOCKSTATION_11",
            },
            gps: "28.798416, 77.119902",
          },
          id: "11",
          parent_stop_id: "10",
        },
        {
          type: "INTERMEDIATE_STOP",
          instructions: {
            name: "Stop 11",
          },
          location: {
            descriptor: {
              name: "MOCK_STATION_12",
              code: "MOCKSTATION_12",
            },
            gps: "28.738426, 77.139922",
          },
          id: "12",
          parent_stop_id: "11",
        },
        {
          type: "INTERMEDIATE_STOP",
          instructions: {
            name: "Stop 12",
          },
          location: {
            descriptor: {
              name: "MOCK_STATION_13",
              code: "MOCKSTATION_13",
            },
            gps: "28.738446, 77.139942",
          },
          id: "13",
          parent_stop_id: "12",
        },
        {
          type: "INTERMEDIATE_STOP",
          instructions: {
            name: "Stop 13",
          },
          location: {
            descriptor: {
              name: "MOCK_STATION_14",
              code: "MOCKSTATION_14",
            },
            gps: "28.738477, 77.139937",
          },
          id: "14",
          parent_stop_id: "13",
        },
        {
          type: "INTERMEDIATE_STOP",
          instructions: {
            name: "Stop 14",
          },
          location: {
            descriptor: {
              name: "MOCK_STATION_15",
              code: "MOCKSTATION_15",
            },
            gps: "28.738276, 77.132932",
          },
          id: "15",
          parent_stop_id: "14",
        },
        {
          type: "INTERMEDIATE_STOP",
          instructions: {
            name: "Stop 15",
          },
          location: {
            descriptor: {
              name: "MOCK_STATION_16",
              code: "MOCKSTATION_16",
            },
            gps: "28.738436, 77.139332",
          },
          id: "16",
          parent_stop_id: "15",
        },
        {
          type: "INTERMEDIATE_STOP",
          instructions: {
            name: "Stop 16",
          },
          location: {
            descriptor: {
              name: "MOCK_STATION_17",
              code: "MOCKSTATION_17",
            },
            gps: "28.738126, 77.133432",
          },
          id: "17",
          parent_stop_id: "16",
        },
        {
          type: "INTERMEDIATE_STOP",
          instructions: {
            name: "Stop 17",
          },
          location: {
            descriptor: {
              name: "MOCK_STATION_18",
              code: "MOCKSTATION_18",
            },
            gps: "28.732076, 77.130192",
          },
          id: "18",
          parent_stop_id: "17",
        },
        {
          type: "INTERMEDIATE_STOP",
          instructions: {
            name: "Stop 18",
          },
          location: {
            descriptor: {
              name: "MOCK_STATION_19",
              code: "MOCKSTATION_19",
            },
            gps: "28.611076, 77.212232",
          },
          id: "19",
          parent_stop_id: "18",
        },
        {
          type: "INTERMEDIATE_STOP",
          instructions: {
            name: "Stop 19",
          },
          location: {
            descriptor: {
              name: "MOCK_STATION_20",
              code: "MOCKSTATION_20",
            },
            gps: "28.738176, 77.139132",
          },
          id: "20",
          parent_stop_id: "19",
        },
        {
          type: "INTERMEDIATE_STOP",
          instructions: {
            name: "Stop 20",
          },
          location: {
            descriptor: {
              name: "MOCK_STATION_21",
              code: "MOCKSTATION_21",
            },
            gps: "28.587876, 77.215332",
          },
          id: "21",
          parent_stop_id: "20",
        },
        {
          type: "INTERMEDIATE_STOP",
          instructions: {
            name: "Stop 21",
          },
          location: {
            descriptor: {
              name: "MOCK_STATION_22",
              code: "MOCKSTATION_22",
            },
            gps: "28.567276, 77.210032",
          },
          id: "22",
          parent_stop_id: "21",
        },
        {
          type: "INTERMEDIATE_STOP",
          instructions: {
            name: "Stop 22",
          },
          location: {
            descriptor: {
              name: "MOCK_STATION_23",
              code: "MOCKSTATION_23",
            },
            gps: "28.731976, 77.139032",
          },
          id: "23",
          parent_stop_id: "22",
        },
        {
          type: "INTERMEDIATE_STOP",
          instructions: {
            name: "Stop 23",
          },
          location: {
            descriptor: {
              name: "MOCK_STATION_24",
              code: "MOCKSTATION_24",
            },
            gps: "28.558476, 77.202932",
          },
          id: "24",
          parent_stop_id: "23",
        },
        {
          type: "INTERMEDIATE_STOP",
          instructions: {
            name: "Stop 24",
          },
          location: {
            descriptor: {
              name: "MOCK_STATION_25",
              code: "MOCKSTATION_25",
            },
            gps: "28.547912, 77.203132",
          },
          id: "25",
          parent_stop_id: "24",
        },
        {
          type: "INTERMEDIATE_STOP",
          instructions: {
            name: "Stop 25",
          },
          location: {
            descriptor: {
              name: "MOCK_STATION_26",
              code: "MOCKSTATION_26",
            },
            gps: "28.534276, 77.209432",
          },
          id: "26",
          parent_stop_id: "25",
        },
        {
          type: "INTERMEDIATE_STOP",
          instructions: {
            name: "Stop 26",
          },
          location: {
            descriptor: {
              name: "MOCK_STATION_27",
              code: "MOCKSTATION_27",
            },
            gps: "28.522176, 77.210232",
          },
          id: "27",
          parent_stop_id: "26",
        },
        {
          type: "INTERMEDIATE_STOP",
          instructions: {
            name: "Stop 27",
          },
          location: {
            descriptor: {
              name: "MOCK_STATION_28",
              code: "MOCKSTATION_28",
            },
            gps: "28.524576, 77.185532",
          },
          id: "28",
          parent_stop_id: "27",
        },
        {
          type: "INTERMEDIATE_STOP",
          instructions: {
            name: "Stop 28",
          },
          location: {
            descriptor: {
              name: "MOCK_STATION_29",
              code: "MOCKSTATION_29",
            },
            gps: "28.495976, 77.184832",
          },
          id: "29",
          parent_stop_id: "28",
        },
        {
          type: "INTERMEDIATE_STOP",
          instructions: {
            name: "Stop 29",
          },
          location: {
            descriptor: {
              name: "MOCK_STATION_30",
              code: "MOCKSTATION_30",
            },
            gps: "28.496776, 77.163432",
          },
          id: "30",
          parent_stop_id: "29",
        },
        {
          type: "INTERMEDIATE_STOP",
          instructions: {
            name: "Stop 30",
          },
          location: {
            descriptor: {
              name: "MOCK_STATION_31",
              code: "MOCKSTATION_31",
            },
            gps: "28.496476, 77.139432",
          },
          id: "31",
          parent_stop_id: "30",
        },
        {
          type: "INTERMEDIATE_STOP",
          instructions: {
            name: "Stop 31",
          },
          location: {
            descriptor: {
              name: "MOCK_STATION_32",
              code: "MOCKSTATION_32",
            },
            gps: "28.480976, 77.125932",
          },
          id: "32",
          parent_stop_id: "31",
        },
        {
          type: "INTERMEDIATE_STOP",
          instructions: {
            name: "Stop 32",
          },
          location: {
            descriptor: {
              name: "MOCK_STATION_33",
              code: "MOCKSTATION_33",
            },
            gps: "28.568476, 77.089932",
          },
          id: "33",
          parent_stop_id: "32",
        },
        {
          type: "INTERMEDIATE_STOP",
          instructions: {
            name: "Stop 33",
          },
          location: {
            descriptor: {
              name: "MOCK_STATION_34",
              code: "MOCKSTATION_34",
            },
            gps: "28.778476, 77.199932",
          },
          id: "34",
          parent_stop_id: "33",
        },
        {
          type: "INTERMEDIATE_STOP",
          instructions: {
            name: "Stop 34",
          },
          location: {
            descriptor: {
              name: "MOCK_STATION_35",
              code: "MOCKSTATION_35",
            },
            gps: "28.418476, 77.133268",
          },
          id: "35",
          parent_stop_id: "34",
        },
        {
          type: "INTERMEDIATE_STOP",
          instructions: {
            name: "Stop 35",
          },
          location: {
            descriptor: {
              name: "MOCK_STATION_36",
              code: "MOCKSTATION_36",
            },
            gps: "28.472276, 77.072432",
          },
          id: "36",
          parent_stop_id: "35",
        },
        {
          type: "END",
          location: {
            descriptor: {
              name: "MOCK_STATION_37",
              code: "MOCKSTATION_37",
            },
            gps: "28.459276, 77.072532",
          },
          id: "37",
          parent_stop_id: "36",
        },
      ],
      vehicle: {
        category: "BUS",
      },
      tags: [
        {
          descriptor: {
            code: "ROUTE_INFO",
          },
          list: [
            {
              descriptor: {
                code: "ROUTE_ID",
              },
              value: "242",
            },
          ],
        },
      ],
    },
  ],
};

export function createFullfillment(cityCode: string) {
  const fake = exampleFullfillment.fulfillments;
  let index = 1;
  for (const full of fake) {
    full.stops.forEach((stop: any) => {
      stop.location.descriptor.code = `MOCK_STATION_${index}`;
      index++;
    });
  }
  return { fulfillments: fake };
}
