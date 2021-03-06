<div align="center"><img src="./packages/web/public/logo.svg" width="100" height="100" /></div>

# DARE-SAM

DARE-SAM (_DARE - Sentiment Analysis and Monitoring_) is a tool that helps social teams to analyze their audience through post interactions.

## Features

- Analyze Facebook Pages and Instagram Profiles
- For each published post, retrieve various metrics, including:
  - post likes
  - post share count
  - post comments count
- For each comment received, perform Sentiment Analysis using Azure Text Analytics

## How does it work

You first have to sign up. To do that, you have to input a valid email into the login form and verify it (passwordless signin).

After that, you can connect your social profiles through the Account page ([/account](https://crystalball.vercel.app/account)):

<div align="center"><img src="./screenshots/account-full.png"/></div>

Once you have done that, the system will start analyzing your Facebook Page and/or Instagram Profile and report the data to the Dashboard page ([/dashboard](https://crystalball.vercel.app/dashboard)):

<div align="center"><img src="./screenshots/dashboard-table.png"/></div>
