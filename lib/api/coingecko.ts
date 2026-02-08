import axios, { AxiosInstance } from "axios";

const BASE_URL = "https://api.coingecko.com/api/v3";

class CoinGeckoAPI {
  private client: AxiosInstance;
  private apiKey: string;

  constructor() {
    this.apiKey = process.env.NEXT_PUBLIC_COIN_API_KEY || "";
    this.client = axios.create({
      baseURL: BASE_URL,
      timeout: 10000,
    });
  }

  private getParams(params: Record<string, any> = {}) {
    return {
      ...params,
      x_cg_demo_api_key: this.apiKey,
    };
  }

  // Ping
  async ping() {
    const response = await this.client.get("/ping", {
      params: this.getParams(),
    });
    return response.data;
  }

  // Simple Price
  async getSimplePrice(
    ids: string[],
    vsCurrencies: string[] = ["usd"],
    options: {
      includeMarketCap?: boolean;
      include24hrVol?: boolean;
      include24hrChange?: boolean;
      includeLastUpdatedAt?: boolean;
    } = {}
  ) {
    const response = await this.client.get("/simple/price", {
      params: this.getParams({
        ids: ids.join(","),
        vs_currencies: vsCurrencies.join(","),
        include_market_cap: options.includeMarketCap,
        include_24hr_vol: options.include24hrVol,
        include_24hr_change: options.include24hrChange,
        include_last_updated_at: options.includeLastUpdatedAt,
      }),
    });
    return response.data;
  }

  async getSupportedVsCurrencies() {
    const response = await this.client.get("/simple/supported_vs_currencies", {
      params: this.getParams(),
    });
    return response.data;
  }

  // Coins
  async getCoinsList() {
    const response = await this.client.get("/coins/list", {
      params: this.getParams(),
    });
    return response.data;
  }

  async getCoinsMarkets(
    vsCurrency: string = "usd",
    options: {
      ids?: string[];
      category?: string;
      order?: string;
      perPage?: number;
      page?: number;
      sparkline?: boolean;
      priceChangePercentage?: string;
    } = {}
  ) {
    const response = await this.client.get("/coins/markets", {
      params: this.getParams({
        vs_currency: vsCurrency,
        ids: options.ids?.join(","),
        category: options.category,
        order: options.order || "market_cap_desc",
        per_page: options.perPage || 100,
        page: options.page || 1,
        sparkline: options.sparkline || false,
        price_change_percentage: options.priceChangePercentage,
      }),
    });
    return response.data;
  }

  async getCoinById(
    id: string,
    options: {
      localization?: boolean;
      tickers?: boolean;
      marketData?: boolean;
      communityData?: boolean;
      developerData?: boolean;
      sparkline?: boolean;
    } = {}
  ) {
    const response = await this.client.get(`/coins/${id}`, {
      params: this.getParams({
        localization: options.localization ?? true,
        tickers: options.tickers ?? true,
        market_data: options.marketData ?? true,
        community_data: options.communityData ?? true,
        developer_data: options.developerData ?? true,
        sparkline: options.sparkline ?? false,
      }),
    });
    return response.data;
  }

  async getCoinTickers(id: string, page: number = 1) {
    const response = await this.client.get(`/coins/${id}/tickers`, {
      params: this.getParams({ page }),
    });
    return response.data;
  }

  async getCoinHistory(id: string, date: string) {
    const response = await this.client.get(`/coins/${id}/history`, {
      params: this.getParams({ date }),
    });
    return response.data;
  }

  async getCoinMarketChart(
    id: string,
    vsCurrency: string = "usd",
    days: string | number = "7"
  ) {
    const response = await this.client.get(`/coins/${id}/market_chart`, {
      params: this.getParams({
        vs_currency: vsCurrency,
        days,
      }),
    });
    return response.data;
  }

  async getCoinMarketChartRange(
    id: string,
    vsCurrency: string = "usd",
    from: number,
    to: number
  ) {
    const response = await this.client.get(`/coins/${id}/market_chart/range`, {
      params: this.getParams({
        vs_currency: vsCurrency,
        from,
        to,
      }),
    });
    return response.data;
  }

  async getCoinOHLC(
    id: string,
    vsCurrency: string = "usd",
    days: number = 7
  ) {
    const response = await this.client.get(`/coins/${id}/ohlc`, {
      params: this.getParams({
        vs_currency: vsCurrency,
        days,
      }),
    });
    return response.data;
  }

  // Categories
  async getCategoriesList() {
    const response = await this.client.get("/coins/categories/list", {
      params: this.getParams(),
    });
    return response.data;
  }

  async getCategories(order: string = "market_cap_desc") {
    const response = await this.client.get("/coins/categories", {
      params: this.getParams({ order }),
    });
    return response.data;
  }

  // Search & Trending
  async search(query: string) {
    const response = await this.client.get("/search", {
      params: this.getParams({ query }),
    });
    return response.data;
  }

  async getTrending() {
    const response = await this.client.get("/search/trending", {
      params: this.getParams(),
    });
    return response.data;
  }

  // Global
  async getGlobalData() {
    const response = await this.client.get("/global", {
      params: this.getParams(),
    });
    return response.data;
  }

  async getGlobalDeFi() {
    const response = await this.client.get("/global/decentralized_finance_defi", {
      params: this.getParams(),
    });
    return response.data;
  }

  // Exchanges
  async getExchanges(perPage: number = 100, page: number = 1) {
    const response = await this.client.get("/exchanges", {
      params: this.getParams({ per_page: perPage, page }),
    });
    return response.data;
  }

  async getExchangesList() {
    const response = await this.client.get("/exchanges/list", {
      params: this.getParams(),
    });
    return response.data;
  }

  async getExchangeById(id: string) {
    const response = await this.client.get(`/exchanges/${id}`, {
      params: this.getParams(),
    });
    return response.data;
  }

  async getExchangeTickers(id: string, page: number = 1) {
    const response = await this.client.get(`/exchanges/${id}/tickers`, {
      params: this.getParams({ page }),
    });
    return response.data;
  }

  async getExchangeVolumeChart(id: string, days: number = 1) {
    const response = await this.client.get(`/exchanges/${id}/volume_chart`, {
      params: this.getParams({ days }),
    });
    return response.data;
  }

  // Asset Platforms
  async getAssetPlatforms() {
    const response = await this.client.get("/asset_platforms", {
      params: this.getParams(),
    });
    return response.data;
  }

  // Exchange Rates
  async getExchangeRates() {
    const response = await this.client.get("/exchange_rates", {
      params: this.getParams(),
    });
    return response.data;
  }
}

// Export singleton instance
const coinGeckoAPI = new CoinGeckoAPI();
export default coinGeckoAPI;
