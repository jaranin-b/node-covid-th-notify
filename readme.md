# Daily Covid Thailand cases notification [Node JS]

Simple node js application using for daily notification of Covid 19 cases in Thailand. The data is provided from SUNDAY TECHNOLOGIES via public API.

API ref: https://static.easysunday.com/covid-19/getTodayCases.json

Credit: https://easysunday.com/labs-covid-19

The notification supports only Slack webhook and Line notify.

## Installation
1. Configure required variables in the env file:
```bash
LINE_GROUP_TOKENS=["{your_target_line_group_token_1}, {your_target_line_group_token_2}"] // incase you need to notify many groups
SLACK_WEB_HOOK_URLS=["{your_target_slack_webhook_url}"]
```
2. Install library dependencies:
```bash
npm install
```
3. If you have experience on k8s cronjob, you can use cron.yaml to apply the job scheduling.


## Run the app (send notification)
```bash
npm run start
```

## Sample Slack notification
<img src="https://github.com/jaranin-b/node-covid-th-notify/blob/main/samples/slack-noti.png" width="75%">

## Sample Line notification
<img src="https://github.com/jaranin-b/node-covid-th-notify/blob/main/samples/line-noti.jpg" width="60%">
