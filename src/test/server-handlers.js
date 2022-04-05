import { rest } from "msw";

const delay = 100;
const LOGIN_URL = "https://reqres.in/api/login";

const handlers = [
  rest.post(LOGIN_URL, async (req, res, ctx) => {
    if (!req.body.password) {
      return res(
        ctx.delay(delay),
        ctx.status(400),
        ctx.json({ error: "password required" })
      );
    }
    if (!req.body.email) {
      return res(
        ctx.delay(delay),
        ctx.status(400),
        ctx.json({ error: "email required" })
      );
    }
    return res(ctx.delay(delay), ctx.json({ email: req.body.email }));
  }),
];

export { handlers };
