interface Locations {
    type: 'pickup' | 'drop' | 'warehouse';
    name: string;
}

// Defining the data structure for shipment and trip

interface Shipment {
    pickups: Locations[];
    drops: Locations[];
}

interface Trip {
    locations: Locations[];
}

function validateTrips (shipment: Shipment, trips: Trip[]): boolean {
    const visitedPickups = new Set<string>(); //Initializing sets to track of visited locations 
    const visitedDrops = new Set<string>();  //Initializing sets to track of visited locations 


    for (const trip of trips) {                  //Iterating over each trips
        let currentPickup: Locations | undefined;
        let currentDrop: Locations | undefined;


        for (const location of trip.locations) {   //Iterating over each locations in the whole trip
            if(location.type === "pickup") {
                if (currentPickup || visitedPickups.has(location.name)) {
                    return false;  //If multiple pickups or already visited pickup locations then invalid
                }
                currentPickup = location;
            } else if (location.type === "drop") {
                if (currentDrop || !currentPickup) {
                    return false;  // If multiple drops or dropped before pickup then invalid
                }
                currentDrop = location;
            } else if (location.type === "warehouse") {
                // Visiting warehouse is valid anywhere int the whole trip
            } else {
                return false;  // If location type invalid
            }
        }

        if (currentDrop && currentPickup) {
            visitedPickups.add(currentPickup.name); // Marked visited pickups
            visitedDrops.add(currentDrop.name);  // Marked visited drops
        } else if (currentPickup) {
            return false;    // If pickup without drops then invalid 
        } else if (currentDrop) {
            return false;  // And if drop without pickup then invalid
        }
    }

    //Checking if all the pickup and drop location are visited
    return shipment.pickups.every(pickup => visitedPickups.has(pickup.name)) && shipment.drops.every(drop => visitedDrops.has(drop.name));
    
}