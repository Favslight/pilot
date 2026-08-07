import { buildApp } from "./app";
import { env } from "./config/env";

const start = async () => {
  const app = await buildApp();
  await app.listen({ port: env.port, host: "0.0.0.0" });
};

start().catch((error) => {
  console.error(error);
  process.exit(1);
});
