# Performance baseline

Measured on 2026-07-10 with Playwright Chromium and the readable, non-minified userscript build.

Environment: Intel Core Ultra 9 285H (16 logical CPUs), WSL2 Linux 6.6, Node.js 24.11.0,
Playwright 1.61.1. Wall-clock values naturally vary with browser cold start and system load, so the
tables report the range observed during final validation. The JSON files contain the latest run, while
the CPU profiles are the source of truth for hotspot analysis.

## Reproduce

```bash
npm run profile:performance
npm run profile:performance:real
```

The commands write Chrome CPU profiles and metric summaries to `.test/performance/`:

- `local-ui-profile.cpuprofile`
- `local-ui-profile.json`
- `real-site-startup-profile.cpuprofile`
- `real-site-startup-profile.json`

Open a `.cpuprofile` file in Chrome DevTools Performance or JavaScript Profiler.

## Deterministic stress page

The local profile uses a 180-paragraph chapter and a 5,000-chapter table of contents.

| Measurement                           |              Observed range (3 runs) |
| ------------------------------------- | -----------------------------------: |
| Reader startup wall time              |                       1,176-2,259 ms |
| Load and open 5,000-chapter TOC       |                           192-472 ms |
| Search the 5,000-chapter TOC          |                             14-30 ms |
| Rendered TOC rows                     | 28 initially, 20 after search/scroll |
| Drawer scroll CPU profile wall window |                           319-341 ms |
| Reader scroll CPU profile wall window |                           485-492 ms |
| Interaction task duration             |                           461-933 ms |
| Interaction layout duration           |                            79-128 ms |
| Interaction script duration           |                             25-42 ms |

The scroll loops deliberately wait for animation frames, so their wall times are not CPU times. Across
the three CPU profiles, `handleScroll` used about 14-19 ms self time in total for the complete drawer and
reader stress sequence. The fixed-window TOC kept the live list below 50 rows while processing all 5,000
entries.

## Real Ciweimao startup

Target: `https://www.ciweimao.com/chapter/102930784` through the configured test proxy.

| Measurement                  |         Observed range (2 runs) |
| ---------------------------- | ------------------------------: |
| Navigation to reader mounted |                  2,178-2,804 ms |
| Extracted content            | 3,184 characters, 88 paragraphs |
| Total task duration          |                  1,349-2,003 ms |
| Total script duration        |                      255-530 ms |
| Total layout duration        |                    874-1,160 ms |

Both profiles were dominated by host-page code: `jquery.nicescroll` used 304-489 ms self time, and jQuery
request handling used roughly 192-416 ms. No individual MyNovelReader function exceeded 8.2 ms self time;
the measured entries included `removeAdPatterns`, DOM text-node visiting, and app style application. This
does not justify a riskier parser shortcut that could reduce extraction correctness.

## Build budget

`npm run check:size` enforces the non-minified artifact budget:

- raw: at most 900 KiB
- gzip: at most 250 KiB

The current build is about 821 KiB raw and 229 KiB gzip. Minification is intentionally disabled so the
installed userscript remains inspectable.
