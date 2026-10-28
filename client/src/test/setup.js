import "@testing-library/jest-dom";

import { server } from "./server.js";

import dotenv from "dotenv";

dotenv.config();

beforeAll(() => {
  server.listen();
});

afterEach(() => {
  server.resetHandlers();
});

afterAll(() => {
  server.close();
});
