import * as React from "react";
import { screen } from "@testing-library/react";

import { setup, buildLoginCredentials } from "../../test/test-utils";

import { Login } from "./LoginSubmission";

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
