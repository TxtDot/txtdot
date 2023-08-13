import { IConfigService } from "./config/config.interface";
import { ConfigService } from "./config/config.service";
import express from "express";
import NodeCache from "node-cache";
import { readability } from "./handlers/readability";
import minify from "./handlers/main";

class App {
  config: IConfigService;
  cache: NodeCache;
  constructor() {
    this.config = new ConfigService();
    this.cache = new NodeCache({ stdTTL: 100, checkperiod: 120 });
  }
  init() {
    const app = express();

    app.use((req, res, next) => {
      const url = req.originalUrl || req.url;
      const purge = req.query.purge ? true : false;

      if (purge) {
        this.cache.del(url);
        next();
      }

      const cached = this.cache.get(url);
      if (cached) {
        res.send(cached);
      } else {
        next();
      }
    });

    app.get("/get", (req, res) => {
      const url = (req.query.url || "/nothing") as string;
      const type = (req.query.type || "html") as string;

      minify(url)
        .then((parsed) => {
          const content =
            type === "html" ? parsed?.content : parsed?.textContent;

          this.cache.set(req.originalUrl || req.url, content);
          res.send(content);
        })
        .catch((err) => {
          res.status(500).send({ error: err.message });
        });
    });

    app.get("/readability", async (req, res) => {
      const url = (req.query.url || "/nothing") as string;
      const parsed = await readability(url);

      this.cache.set(req.originalUrl || req.url, parsed);
      res.send(parsed);
    });

    app.listen(this.config.get("PORT"), () => {
      console.log(`Listening on port ${this.config.get("PORT")}`);
    });
  }
}

const app = new App();
app.init();
