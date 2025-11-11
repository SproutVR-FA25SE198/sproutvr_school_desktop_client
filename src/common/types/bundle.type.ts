// Payload contains key to be validated
export interface KeyValidatePayload {
  activationKey: string,
  organizationId: string,
}

// Key validation success response
export interface KeyValidateResponse {
  orderId: string,
  organizationId: string,
}

/**
 * Represents a single map within a bundle.
 * This matches your API response.
 */
export interface MapPayload {
  orderItemId: string;
  mapId: string;
  mapCode: string;
  mapName: string;
  imageUrl: string;
  downloadUrl: string;
  isDownloaded: boolean;
}

/**
 * Represents a single bundle (an "order")
 * This also matches your API response.
 */
export interface BundlePayload {
  orderId: string;
  organizationId: string;
  mapCount: number;
  maps: MapPayload[];
}