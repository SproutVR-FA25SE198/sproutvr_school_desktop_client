export interface Status {
  key: number;
  name: string;
}

export interface RetrieveAllResponse<T> {
  totalItems: number;
  items: T[];
}
