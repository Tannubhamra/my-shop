export interface salesChart{
    months: string[];
    salesByCategory: {
    [key: string]: number[];
    laptop: number[];
    smartphone: number[];
    headphone: number[];
    tablet: number[];
  };
}
