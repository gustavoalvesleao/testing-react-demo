import { render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { build, perBuild } from "@jackfranklin/test-data-bot";
import faker from "faker";

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

export { setup, buildLoginCredentials };
