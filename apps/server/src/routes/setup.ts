import { jwt } from "@elysiajs/jwt";
import Elysia from "elysia";

export const basePath = "/api";

export const jwtAccessSetup = new Elysia({ name: "jwtAccess" }).use(
  jwt({
    name: "jwt",
    secret: process.env.JWT_SECRET_KEY!,
    exp: "1h",
  })
);
