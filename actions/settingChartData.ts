import { gettingDate } from "./getDate";

interface PriceData extends Array<[number, number]> {}  // Each item is a tuple [timestamp, price]

interface Dataset {
  label?: string;
  data: number[];
  borderWidth: number;
  fill: boolean;
  backgroundColor: string;
  tension: number;
  borderColor: string;
  pointRadius: number;
  yAxisID: string;
}

export const settingChartData = (
  setChartData: (data: { labels: string[]; datasets: Dataset[] }) => void, 
  prices1: PriceData | undefined, 
  prices2?: PriceData
): void => {
  if (prices2) {
    setChartData({
      labels: prices1?.map((data) => gettingDate(data[0])) || [],
      datasets: [
        {
          label: "Crypto 1",
          data: prices1?.map((data) => data[1]) || [],
          borderWidth: 1,
          fill: false,
          backgroundColor: "rgba(58, 128, 233,0.1)",
          tension: 0.25,
          borderColor: "#3a80e9",
          pointRadius: 0,
          yAxisID: "crypto1",
        },
        {
            label: "Crypto 2",
            data: prices2?.map((data) => data[1]) || [],
            borderWidth: 1,
            fill: false,
            tension: 0.25,
            borderColor: "#61c96f",
            pointRadius: 0,
            yAxisID: "crypto2",
            backgroundColor: "rgba(58, 128, 233,0.1)"
        },
      ],
    });
  } else {
    setChartData({
      labels: prices1?.map((data) => gettingDate(data[0])) || [],
      datasets: [
        {
          data: prices1?.map((data) => data[1]) || [],
          borderWidth: 1,
          fill: true,
          backgroundColor: "rgba(58, 128, 233,0.1)",
          tension: 0.25,
          borderColor: "#3a80e9",
          pointRadius: 0,
          yAxisID: "crypto1",
        },
      ],
    });
  }
};
