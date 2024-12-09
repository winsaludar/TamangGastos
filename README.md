# Tamang Gastos

Web application designed to help users manage their finances by tracking income and expenses, categorizing transactions, and providing insightful analytics to improve financial planning.

## Environment Variables

To run this project, you will need to add the following environment variables to your .env file.
Make sure to create the file under the `api` folder (same directory where your `package.json` is located).

```bash
APP_BASE_URL=
APP_FORGOT_PASSWORD_URL=
APP_CONFIRM_EMAIL_URL=

BREVO_API_KEY=

DB_USER=
DB_PASS=
DB_HOST=
DB_PORT=
DB_DATABASE_NAME=

JWT_ACCESS_TOKEN_EXPIRY=
JWT_FORGOT_PASSWORD_TOKEN_EXPIRY=
JWT_CONFIRM_EMAIL_TOKEN_EXPIRY=
JWT_SECRET=

REGISTRATION_EMAIL_CONFIRMATION_SUBJECT="Your Tamang Gastos Registration is Almost Complete"
FORGOT_PASSWORD_SUBJECT="Password Reset Request for Your Tamang Gastos Account"

SMTP_SERVER=
SMTP_PORT=
SMTP_LOGIN=
SMTP_PASSWORD=
SMTP_SENDER_FROM_EMAIL=
SMTP_SENDER_FROM_NAME="TAMANG GASTOS"
```

## Run Locally

Clone the project

```bash
  git clone https://github.com/winsaludar/tamang-gastos.git
```

Go to the project directory

```bash
  cd tamang-gastos/api
```

Install dependencies

```bash
  npm install
```

Start the server

```bash
  npm run start
```

## Running Tests

To run tests, run the following command

```bash
  npm run test
```
