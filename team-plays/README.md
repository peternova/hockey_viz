# Team plays

Tactics board plays in this folder appear in Hockey IQ under **Team plays** (on the
Board page, the Plays page and the home page) for everyone, on every device, and work
with no signal.

**This repository is public: anyone can see the plays in this folder.**

## Add a play

1. In Hockey IQ, open your play on the tactics board and press **Export as a file**.
   You get a file like `hockey-iq-left-side-press.json`.
2. On GitHub, open this folder, choose **Add file → Upload files**, add the file and
   press **Commit changes**.
3. About two minutes later it's in the live app. Phones get it the next time they have
   signal, with a "new version is ready" bar: tap **Reload**.

## Change a play

Open the team play in the app, press **Copy to my tactics board**, change it (keep the
title the same), export it and upload the file again. A file with the same name
replaces the old one.

## Remove a play

Open its file here on GitHub, then **•••** → **Delete file** → **Commit changes**.

## If something goes wrong

Every file is checked before the app is published. If one can't be read, the live app
isn't updated, GitHub emails you that the "Deploy to GitHub Pages" run failed, and the
run's log names the file and the problem. Fix or delete that file and the next upload
publishes as normal.

One file can hold one play, or several (from **Export all my plays**). Files have to
end in `.json`; anything else in this folder (like this README) is ignored.
