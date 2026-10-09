# Chess: Time Wars website

Public information, support, and privacy pages only. No game source, keys, payment forms, or external upgrade sales.

## Android Announcement - October 9, 2026

- The homepage introduction and launch section now say "Android coming soon."
- Android is in development, with no announced release date or Google Play link.
- The support FAQ and shared footer repeat the announcement and distinguish it
  from the Apple launch window. Search/social descriptions also mention Android.
- The planned October 26-30, 2026 Apple launch window, gameplay videos, purchase
  details, and privacy policy body are unchanged.
- WebKit checks passed at 1280px, 390px, and 320px, including enlarged Android
  announcement text, working FAQ expansion, and no horizontal overflow.

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

## Gameplay videos (October 6, 2026)

- `/#gameplay-videos` contains three approved, real-gameplay clips, one for each ruleset. The hero, navigation and support essentials link to this section.
- `assets/videos/*.mp4` are compressed 1080x1920 website exports (about 4.5 MB total). The high-bitrate 886x1920 App Store originals remain in the private app project's `Release/AppPreview/Rulesets/` directory.
- Each native player has controls, inline playback, a real-footage poster, `preload="none"`, and no autoplay. No third-party video hosting, scripts, cookies or analytics were added.
- English WebVTT captions include the on-screen explanations and sound cues. Captions are also burned into the footage so the videos remain understandable muted.
- Forward Time is labeled as free; Causal Collapse and Alternate Realities are optional in-app unlocks. The release window and all existing purchase/privacy disclosures are unchanged.

## October 3 launch refresh

- Public release window: October 26-30, 2026. Keep this a planned window until the App Store release is confirmed.
- Public copy is player-facing, not beta/testing instructions; no board-resize advertising FAQ.
- Discreet homepage credits acknowledge Patrick Quilty and Winter Quilty with the owner-provided kitchen-table line.
- app-ads.txt authorizes the verified AdMob publisher. The App Store Marketing URL must remain the branded root URL for discovery after publication.
- Home, support, privacy, Credits navigation and FAQ expansion checked in the browser. Layout checked at 1280px, 390px and 320px; no horizontal overflow.
