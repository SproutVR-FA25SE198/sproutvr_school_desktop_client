// Payload contains key to be validated
export interface KeyValidatePayload {
  organizationId: string,
  activationKey: string
}

// Bundle retrieved upon successful validation
export interface KeyValidateRetrieve {
  orderId: string,
  organizationId: string,
  maps: MapItemRetrieve[]
}

// Map items inside bundle retrieved
export interface MapItemRetrieve {
    mapId: string,
    mapCode: string,
    mapName: string,
    imageUrl: string,
    downloadUrl: string 
}