# Monocera

A comprehensive cryptocurrency exploration, analysis, comparison, and portfolio management platform built with Next.js 16, powered by CoinGecko API.

## Features

### 🔍 Exploration
- Browse and search thousands of cryptocurrencies
- Advanced filtering by category, market cap, volume, and price changes
- Real-time market data and price updates
- Detailed coin pages with comprehensive metadata

### 📊 Analysis & Study
- Historical price charts with multiple timeframes
- Market statistics and metrics
- Community and developer data
- Exchange listings and trading pairs
- Links to official resources

### ⚖️ Comparison
- Side-by-side comparison of multiple coins
- Comparative performance charts
- Market cap and volume analysis

### 💼 Portfolio Management
- Create and manage multiple portfolios
- Track buy/sell transactions
- Real-time portfolio valuation
- Profit/loss tracking
- Performance charts

### ⭐ Watchlist
- Save favorite coins for quick access
- Real-time price monitoring
- Custom watchlists

### 🌍 Market Overview
- Global cryptocurrency market statistics
- Bitcoin dominance tracking
- Total market cap and volume
- Trending coins and categories

### 🏦 Exchange Data
- Exchange rankings by volume
- Exchange-specific trading pairs
- Volume charts

## Tech Stack

- **Framework**: Next.js 16.1.6 with App Router
- **UI**: React 19.2.4
- **Styling**: Tailwind CSS + shadcn/ui (black & white theme)
- **Database**: PostgreSQL (Neon)
- **ORM**: Prisma 5.22.0
- **Authentication**: NextAuth.js with Google OAuth
- **API**: CoinGecko Demo API
- **Charts**: Recharts
- **Type Safety**: TypeScript 5
- **Form Handling**: React Hook Form + Zod 4

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- PostgreSQL database (Neon recommended)
- Google OAuth credentials
- CoinGecko API key (free tier)

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd monocera
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:

Create a `.env` file in the root directory with the following variables:

```env
# CoinGecko API
NEXT_PUBLIC_COIN_API_KEY=your_coingecko_api_key

# Database
DATABASE_URL=your_postgresql_connection_string

# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_nextauth_secret
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
```

4. Set up the database:
```bash
npx prisma generate
npx prisma migrate dev
```

5. Run the development server:
```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `NEXT_PUBLIC_COIN_API_KEY` | CoinGecko API key for cryptocurrency data | Yes |
| `DATABASE_URL` | PostgreSQL connection string | Yes |
| `NEXTAUTH_URL` | Base URL for NextAuth (http://localhost:3000 for dev) | Yes |
| `NEXTAUTH_SECRET` | Secret for NextAuth session encryption | Yes |
| `GOOGLE_CLIENT_ID` | Google OAuth client ID | Yes |
| `GOOGLE_CLIENT_SECRET` | Google OAuth client secret | Yes |

### Getting API Keys

- **CoinGecko API**: Sign up at [CoinGecko](https://www.coingecko.com/en/api/pricing) for a free Demo API key
- **Google OAuth**: Create credentials at [Google Cloud Console](https://console.cloud.google.com/)
- **Neon Database**: Create a free PostgreSQL database at [Neon](https://neon.tech/)

## Project Structure

```
monocera/
├── app/
│   ├── api/auth/          # NextAuth API routes
│   ├── dashboard/         # Protected dashboard pages
│   ├── login/             # Authentication page
│   └── layout.tsx         # Root layout
├── components/
│   ├── ui/                # shadcn/ui components
│   └── providers/         # Context providers
├── lib/
│   ├── api/               # API clients and types
│   ├── auth.ts            # NextAuth configuration
│   ├── prisma.ts          # Prisma client
│   └── utils.ts           # Utility functions
├── prisma/
│   └── schema.prisma      # Database schema
└── types/                 # TypeScript type definitions
```

## Database Schema

The application uses the following main models:

- **User**: User accounts (via Google OAuth)
- **Portfolio**: User-created portfolios
- **Transaction**: Buy/sell/transfer records
- **Watchlist**: Saved coins
- **UserPreferences**: User settings

## Features Roadmap

- [x] Google OAuth authentication
- [x] Coin exploration and search
- [x] Detailed coin pages
- [x] Portfolio management
- [x] Watchlist functionality
- [x] Global market overview
- [ ] Price alerts
- [ ] Advanced charting tools
- [ ] Export portfolio data
- [ ] Mobile app

## License

MIT

## Acknowledgments

- Cryptocurrency data provided by [CoinGecko](https://www.coingecko.com/)
- UI components from [shadcn/ui](https://ui.shadcn.com/)
