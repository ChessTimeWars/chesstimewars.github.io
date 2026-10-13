# Chess: Time Wars website

Public information, support, and privacy pages only. No game source, keys, payment forms, or external upgrade sales.

## Current Launch Message - October 12, 2026

- Owner-approved public wording is "Coming Autumn 2026," with no specific day
  or October launch window. Android retains its separate "Coming Soon" notice.
- Updated the homepage hero/closing, search/social descriptions, all three
  page footers and the support FAQ. Privacy-policy revision dates and copyright
  years are not launch promises and are preserved.
- Gameplay videos, screenshots, purchase/privacy disclosures and Credits are
  unchanged. Older dated entries below are historical, not the current schedule.
- App Store review and its saved pre-order settings are not modified by this
  website update. After approval, confirm the actual availability/release setting
  with the owner before announcing public downloads or adding a store link.
- Validation: all three HTML pages' assets/internal anchors resolve; no old
  fixed launch window remains in the public pages or homepage metadata. Browser
  checks passed at 1280px, 390px and 320px without horizontal overflow; the new
  download FAQ expands correctly. All three videos and approved Credits remain.

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
- Replace pre-launch wording only after an actual public release; then add the verified App Store link.
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

## Account & Data Deletion - October 13, 2026

- Added `account-deletion.html` with a prominent email request button and instructions that do not require reinstalling. The existing approved support mailbox is used; no message was sent by the test.
- Clearly distinguishes account-free offline Android beta/device records, support correspondence, Apple-held data and locally tested future multiplayer. No public sign-up, guardian form, automatic deletion endpoint, analytics or data collection was added.
- Users are warned never to email passwords, private deletion keys, verification codes, identity documents or child personal details. Email/UID/invite alone is not ownership proof.
- Linked the page from all shared footers, support privacy FAQ and privacy retention section. Actual Apple/Android data-practice disclosures remain unchanged.
- Four-page asset/anchor checks pass; browser checks at 1280, 390 and 320 pixels show no horizontal overflow. The deletion button uses readable dark text on gold; no email was opened or submitted.
