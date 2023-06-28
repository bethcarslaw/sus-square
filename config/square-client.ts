import { Client, Environment } from "square";

const squareClient = new Client({
  accessToken:
    process.env.NODE_ENV === "production"
      ? process.env.SQUARE_API_ACCESS
      : process.env.SQUARE_SANDBOX_API_ACCESS,
  environment:
    process.env.NODE_ENV === "production"
      ? Environment.Production
      : Environment.Sandbox,
});

export { squareClient };
