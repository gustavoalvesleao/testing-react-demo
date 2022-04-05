import { screen, waitForElementToBeRemoved } from "@testing-library/react";
import { setupServer } from "msw/node";
import { rest } from "msw";

import { handlers } from "./test/server-handlers";
import { setup, buildLoginCredentials } from "./test/test-utils";

import App from "./App";

const server = setupServer(...handlers);

beforeAll(() => server.listen());
afterAll(() => server.close());
afterEach(() => server.resetHandlers());

test(`logging in displays the user's email`, async () => {
  const { user } = setup(<App />);
  const { email, password } = buildLoginCredentials();

  await user.type(screen.getByLabelText(/email/i), email);
  await user.type(screen.getByLabelText(/password/i), password);
  await user.click(screen.getByRole("button", { name: /submit/i }));

  await waitForElementToBeRemoved(() => screen.queryByLabelText(/loading/i));

  expect(screen.getByText(email)).toBeInTheDocument();
});

test("omitting the password results in an error", async () => {
  const { user } = setup(<App />);
  const { email } = buildLoginCredentials();

  await user.type(screen.getByLabelText(/email/i), email);
  await user.click(screen.getByRole("button", { name: /submit/i }));

  await waitForElementToBeRemoved(() => screen.queryByLabelText(/loading/i));

  expect(screen.getByRole("alert")).toHaveTextContent("password required");
});

test("omitting the email results in an error", async () => {
  const { user } = setup(<App />);
  const { password } = buildLoginCredentials();

  await user.type(screen.getByLabelText(/password/i), password);
  await user.click(screen.getByRole("button", { name: /submit/i }));

  await waitForElementToBeRemoved(() => screen.queryByLabelText(/loading/i));

  expect(screen.getByRole("alert")).toHaveTextContent("email required");
});

test("unknown server error displays the error message", async () => {
  const { user } = setup(<App />);
  const testErrorMessage = "Oh no, something bad happened";

  server.use(
    rest.post("https://reqres.in/api/login", async (req, res, ctx) => {
      return res(ctx.status(500), ctx.json({ message: testErrorMessage }));
    })
  );

  await user.click(screen.getByRole("button", { name: /submit/i }));
  await waitForElementToBeRemoved(() => screen.queryByLabelText(/loading/i));

  expect(screen.getByRole("alert")).toHaveTextContent(testErrorMessage);
});
