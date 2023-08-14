import axios from "axios";

export default axios.create({
  headers: {
    "User-Agent": "txtdot",
  },
});
