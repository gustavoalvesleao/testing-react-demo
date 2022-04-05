import * as React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import userEvent from "@testing-library/user-event";
import { build, perBuild } from "@jackfranklin/test-data-bot";
import faker from "faker";

import { Login } from "./LoginSubmission";

const buildLoginCredentials = build("User", {
  fields: {
    email: perBuild(() => faker.internet.email()),
    password: perBuild(() => faker.internet.password()),
  },
});

function setup(jsx) {
  return {
    user: userEvent.setup(),
    ...render(jsx),
  };
}

test("submitting the form calls onSubmit with email and password", async () => {
  const handleSubmit = jest.fn();

  const { user } = setup(<Login onSubmit={handleSubmit} />);
  const { email, password } = buildLoginCredentials();

  await user.type(screen.getByLabelText(/email/i), email);
  await user.type(screen.getByLabelText(/password/i), password);
  await user.click(screen.getByRole("button", { name: /submit/i }));
  expect(handleSubmit).toHaveBeenCalledWith({
    email,
    password,
  });
  expect(handleSubmit).toHaveBeenCalledTimes(1);
});
