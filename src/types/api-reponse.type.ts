export type TResponseResult = "0" | "1";

interface TBasePaginationResponse<T> {
  results: TResponseResult;
  dataPart: {
    data: T;
    limit: number;
    current_page: number;
    total_items: number;
    total_pages: number;
  };
}
// The type for api has pagination value
export type TApiPaginationResponse<T> = Promise<TBasePaginationResponse<T>>;

interface TBaseResponse<T> {
  results: TResponseResult;
  dataPart: T;
  error: string;
  errorMessage: string[];
}
// The type for basic api
export type TApiResponse<T> = Promise<TBaseResponse<T>>;
