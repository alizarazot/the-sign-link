/// <reference no-default-lib="true"/>
/// <reference lib="esnext" />
/// <reference lib="webworker" />

import * as logging from "../pkg/logging";

const log = logging.setDefaultLogger(
  new logging.Logger("Service-Worker", logging.Level.Debug),
);

log.debug("Service worker for: The Sign Link.");
