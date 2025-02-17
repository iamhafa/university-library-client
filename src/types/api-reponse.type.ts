export type TResponseResult = "0" | "1";

interface TBasePaginationResponse<T> {
  results: TResponseResult;
  dataPart: {
    data: T;
    page: number;
    limit: number;
    total: number;
  };
}
// The type for api has pagination value
export type TApiPaginationResponse<T> = Promise<TBasePaginationResponse<T>>;

interface TBaseResponse<T> {
  results: TResponseResult;
  dataPart: T;
}
// The type for basic api
export type TApiResponse<T> = Promise<TBaseResponse<T>>;
