# <img src="./public/favicon.svg" alt="HNB logo" width="25px" />[HNB](https://www.hnb.hr) exchange rate list

## Table of contents

- [Features](#features)
- [Implemented libraries and frameworks](#implemented)
- [Live demo](#demo)
- [how to run the app locally](#local)
  - [Clone the repository](#clone)
  - [Enter project directory](#dir)
  - [Install dependencies](#dependencies)
  - [Start app](#start)
- [Contribution](#contrib)
- [Licence](#licence)
- [Contact](#contact)

## Features <a name="features" />

- Home page:
  - Provides navigation to the Exchange Rates, Exchange Rate History, and Currency Conversion pages.
  - Displays a chart visualizing the value change of a randomly selected currency.
- Exchange Rate page:
  - Date Selection — Allows users to select a specific date for which exchange rates should be retrieved.
  - Form Submission — Fetches exchange rate data only when the selected date differs from the currently applied date, preventing unnecessary requests.
  - URL State Persistence — Persists the selected date in the URL, allowing the state to be restored automatically after a page refresh or when sharing the URL.
  - Data Display — Presents the retrieved exchange rates in a sortable table, or displays an appropriate error state when the request fails.
  - Sorting — Supports sorting exchange rate data by individual table columns.
  - Filtering — Allows users to filter exchange rates based on the available filtering parameters.
  - Historical Data Navigation — Provides direct navigation from a currency to its historical exchange rate data while preserving the selected date and currency.
- Exchange rate history of selected currency:
  - Currency Selection — Supports selecting one or multiple currencies for historical comparison.
  - Date Range Selection — Allows users to define a start and end date for the historical data.
  - Form Submission — Fetches historical exchange rate data when the selected currencies or date range changes. When the page is initially opened with the current date, submission is performed only after the user changes the selected criteria.
  - URL State Persistence — Stores the selected currencies and date range in the URL, allowing the configuration to be restored after refreshing the page or sharing the URL.
  - Multiple Data Views — Displays historical exchange rate data either as a table or a chart, depending on the selected view.
  - Rate Change Analysis — Calculates and displays the percentage increase or decrease in exchange rates over the selected period.
  - Error Handling — Displays an appropriate error state when historical data cannot be retrieved.
- Currency conversion for selected currencies:
  - Currency Selection — Allows users to select the source and target currencies for conversion.
  - Real-Time Conversion — Automatically recalculates the converted amount when the selected currencies or input amount changes.
  - Latest Rate Information — Displays the exchange rate data used for the conversion, based on the most recent available date.
- PageNotFound: display a 404 page in case an unexisting url is entered

## Implemented libraries and frameworks <a name="implemented" />

- [React + Vite](https://vitejs.dev/guide/)
- [TypeScript](https://www.typescriptlang.org)
- [React Icons](https://react-icons.github.io/react-icons/)
- [Tailwind](https://tailwindcss.com)

## Live demo <a name="demo" />

You can find the web app up and runing by visiting [https://hnb-provjera-tecaja.netlify.app](https://hnb-provjera-tecaja.netlify.app)

## How to run the app locally <a name="local" />

If you want to run the app locally, do the following:

#### 1. Clone the repository <a name="clone" />

- HTTPS:

```bash
git clone https://github.com/Zack1808/hnb-exchange-rate-lists.git
```

- SSH:

```bash
git clone git@github.com:Zack1808/hnb-exchange-rate-lists.git
```

- Git CLI:

```bash
gh repo clone Zack1808/hnb-exchange-rate-lists
```

#### 2. Enter project directory <a name="dir" />

```bash
cd hnb-exchange-rate-lists
```

#### 3. Install dependencies <a name="dependencies" />

```bash
npm install
```

#### 4. Start app <a name="start" />

```bash
npm start
```

After execution, once the server starts running, open a new tab in your browser and enter the url [http://localhost:3000](http://localhost:3000).

## Contribution <a name="contrib" />

Contributions to the project are welcome. If you find any issues or want to add new features, feel free to create a pull request. Make sure to follow the project's coding conventions and provide detailed information about your changes.

## Licence <a name="licence" />

[MIT](https://github.com/Zack1808/hnb-exchange-rate-lists/blob/prebuild/LICENSE)

## Contact <a name="contact" />

- Mail: jeanpierrenovak25@gmail.com
- My portfolio: [jeanpierrenovak.from.hr](https://jeanpierrenovak.from.hr)
