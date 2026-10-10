// Audio-only config for mix QA stems (render with --config=remotion.stems.config.ts --codec=wav).
import { Config } from "@remotion/cli/config";

Config.setCodec("wav");
Config.setConcurrency(4);
