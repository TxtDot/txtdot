import { Engine } from "@txtdot/sdk";
import questions from "./questions";
import users from "./users";

const StackOverflow = new Engine(
  "StackOverflow",
  "Engine for 'StackOverflow' and other 'Stack' sites. Available routes: '/questions/' and '/users/'",
  [
    "stackoverflow.com",
    "*.stackoverflow.com",
    "*.stackexchange.com",
    "askubuntu.com",
    "stackapps.com",
    "mathoverflow.net",
    "superuser.com",
    "serverfault.com",
  ]
);

StackOverflow.route("/questions/:id/*slug", questions);
StackOverflow.route("/users/:id/*slug", users);

export default StackOverflow;
