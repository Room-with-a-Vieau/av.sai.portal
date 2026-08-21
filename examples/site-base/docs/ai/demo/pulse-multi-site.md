# Pulse multi-site packs

See [README.md](README.md) in this folder for how to add a Pulse pack for a new demo site.

Packs live in `src/lib/pulse-packs/` and are registered in `src/lib/pulse-packs/index.ts`.
The registry starts empty; `getPulsePack` falls back to `DEFAULT_PULSE_PACK`.
