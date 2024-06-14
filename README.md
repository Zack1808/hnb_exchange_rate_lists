# <img src="./public/favicon.svg" alt="HNB logo" width="25px" />[HNB](https://www.hnb.hr) exchange rate list

## Table of contents

- [Features](#features)
- [Implemented libraries and frameworks](#implemented)
- [Live demo](#demo)
- [how to run the app locally](#local)
  - [Clone the repository](#clone)
  - [Enter project directory](#dir)
  - [Change the branch](#branch)
  - [Install dependencies](#dependencies)
  - [Start app](#start)
- [Contribution](#contrib)
- [Licence](#licence)
- [Contact](#contact)

## Features <a name="features" />

- Home page:
  - Displaying routes to the Exchange rate page and the USD Exchange rate history
- Exchange Rate page:
  - Date picking: users can pick a date for which they want to se the exchange rate list
  - Form submition: user can submit the form with the selected date. Submition only happens if the date has changed. After submition the exchange rate list for the selected date is fetched
  - Selected date persistence: the selected date is located in the url. After refreshing the page the date gets inserted as the starting value for the date picker
  - Data display: displays the fetched data in a table if available or displays the error if it exists.
  - Routing to currency exchange rate history: route to the Exchange rate history page with the selected date and currency.
  - Data sorting: sorts the data according to the selected column.
  - Data filtering: filters the data according to the provided parameters
- Exchange rate history of selected currency:
  - Date picking: users can pick a date for which they want to se the exchange rate list if the page was opened with the current date
  - Form submition: user can submit the form with the selected date and the number of days for which he wants to check the exchange rate list. Submition only happens if the date has changed (if the page was opened with the current date) or if the number of days has changed (2-60 days selection). After submition the exchange rate list for the selected date and amount of days is fetched.
  - Selected date and days persistence: the selected date and amount of days are located in the url. After refreshing the page the date and amount of days get inserted as the starting value.
  - Data display: displays the fetched data in a table if available or displays the error if it exists.
  - Rate drop/increase percentage displayed: at the end of the table the percentage amount of the rates increase or decrease is displayed.
- PageNotFound: display a 404 page in case an unexisting url is entered

## Implemented libraries and frameworks <a name="implemented" />

- [React + Vite](https://vitejs.dev/guide/)
- [TypeScript](https://www.typescriptlang.org)
- [Axios](https://axios-http.com/docs/intro)
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

#### 3. Change the branch <a name="branch" />

```bash
git checkout prebuild
```

#### 4. Install dependencies <a name="dependencies" />

```bash
npm install
```

#### 5. Start app <a name="start" />

```bash
npm start
```

After execution, once the server starts running, open a new tab in your browser and enter the url [http://localhost:3000](http://localhost:3000).

## Contribution <a name="contrib" />

Contributions to the project are welcome. If you find any issues or want to add new features, feel free to create a pull request. Make sure to follow the project's coding conventions and provide detailed information about your changes.

## Licence <a name="licence" />

[MIT](https://github.com/Zack1808/hnb-exchange-rate-lists/blob/prebuild/LICENSE)

## Contact <a name="contact" />

- Mail: jeanpierrenovak23@gmail.com
- My portfolio: [jeanpierrenovak.netlify.app](https://jeanpierrenovak.netlify.app)
