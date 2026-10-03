# Chess: Time Wars website

Public information, support, and privacy pages only. No game source, keys, payment forms, or external upgrade sales.

- Website: https://chesstimewars.github.io/
- Support: https://chesstimewars.github.io/support.html
- Privacy: https://chesstimewars.github.io/privacy.html
- Contact: supportchesstimewars@gmail.com

Plain HTML/CSS; no dependencies, analytics, remote fonts, or build step. Serve locally with `python3 -m http.server 4173`. GitHub Pages publishes the default branch root.

## Screenshot provenance

- `assets/gameplay-2026-10-03.png`: captured from the current app on October 3, 2026 using `MarketingScreenshotsTests.testCaptureCurrentGameplayAndTutorialForWebsite` (app commit `a2a7dde`). Shows the corrected opponent battery placement above the capture tray. The dated filename prevents cached copies of the old screenshot from being reused.

## Release checklist

- Owner reviews privacy policy against the final SDK configuration and App Store privacy disclosures.
- Replace Coming Soon only after an actual public release; then add the verified App Store link.
- Screenshots are real development-build captures; refresh them when UI changes.
- All upgrades stay inside Apple's in-app purchase flow, not on this website.
- Artwork and screenshots are provided for this game's promotional site; no open-source license is granted to game assets.

## October 3 launch refresh

- Public release window: October 26-30, 2026. Keep this a planned window until the App Store release is confirmed.
- Public copy is player-facing, not beta/testing instructions; no board-resize advertising FAQ.
- Discreet homepage credits acknowledge Patrick Quilty and Winter Quilty with the owner-provided kitchen-table line.
- app-ads.txt authorizes the verified AdMob publisher. The App Store Marketing URL must remain the branded root URL for discovery after publication.
- Home, support, privacy, Credits navigation and FAQ expansion checked in the browser. Layout checked at 1280px, 390px and 320px; no horizontal overflow.
