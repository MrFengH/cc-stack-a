import { Config } from "@remotion/cli/config";

Config.setVideoImageFormat("jpeg");
Config.setJpegQuality(95);
Config.setCodec("h264");
Config.setCrf(15);
Config.setX264Preset("slow");
// tags + converts to BT.709 limited range (otherwise JPEG frames yield full-range yuvj420p)
Config.setColorSpace("bt709");
Config.setPixelFormat("yuv420p");
Config.setAudioCodec("aac");
Config.setAudioBitrate("320k");
Config.setConcurrency(4);
