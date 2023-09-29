interface Entity {
    geomodifier: string;
    address: {
        line1: string;
        line2: string;
        city: string;
        postalCode: string;
    };
    c_pagesURL: string;
}


export type nearByLocation = {
    entities: object;
    response: { entities?: Entity[] }
}