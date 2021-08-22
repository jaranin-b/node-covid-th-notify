require('dotenv').config()
const axios = require('axios')
const queryString = require('querystring');

const toCommaFormat = number => {
  let n = number
  if (typeof n === 'number') {
    n = number.toString()
  }
  return n.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
}

const getMessage = ({ NewConfirmed, NewRecovered, NewHospitalized, NewDeaths, UpdateDate }) => {
	return {
    "text": "🦠 Covid-19 Thailand Today",
    "blocks": [
      {
        "type": "header",
        "text": {
          "type": "plain_text",
          "text": "🦠 Covid-19 Thailand",
          "emoji": true
        }
      },
      {
        "type": "section",
        "fields": [
          {
            "type": "mrkdwn",
            "text": `*NewConfirmed 🤒:* ${toCommaFormat(NewConfirmed)}`
          },
          {
            "type": "mrkdwn",
            "text": `*NewDeaths 😔:* ${toCommaFormat(NewDeaths)}`
          }
        ]
      },
      {
        "type": "section",
        "fields": [
          {
            "type": "mrkdwn",
            "text": `*NewHospitalized 🏥:* ${toCommaFormat(NewHospitalized)}`
          },
          {
            "type": "mrkdwn",
            "text": `*NewRecovered 😷:* ${toCommaFormat(NewRecovered)}`
          }
        ]
      },
      {
        "type": "section",
        "fields": [
          {
            "type": "mrkdwn",
            "text": `*UpdateDate:* ${UpdateDate}`
          },
          {
            "type": "mrkdwn",
            "text": "*Data By:* SUNDAY TECHNOLOGIES"
          }
        ]
      },
      {
        "type": "section",
        "text": {
          "type": "mrkdwn",
          "text": `<${process.env.COVID_DATA_WEB_REF}|More detail>`
        }
      }
	  ]
  }
}

const getLineMessage = ({ NewConfirmed, NewRecovered, NewHospitalized, NewDeaths, UpdateDate }) => {
  return `\n\n🦠 ยอด Covid-19 ประเทศไทย วันนี้ (${UpdateDate})\n\nผู้ป่วยรายใหม่ 🤒: ${toCommaFormat(NewConfirmed)}\nเสียชีวิต 😔: ${toCommaFormat(NewDeaths)}\nผู้ป่วยรักษาอยู่ 🏥: ${toCommaFormat(NewHospitalized)}\nหายป่วย 😷: ${toCommaFormat(NewRecovered)}\n\nข้อมูลจาก: SUNDAY TECHNOLOGIES`
}

const main = async () => {
  try {
    const { data } = await axios.get(process.env.COVID_DATA_API_URL)
    const slackMessage = getMessage(data)
    const SlackHookUrls = JSON.parse(process.env.SLACK_WEB_HOOK_URLS)

    console.log(typeof process.env.LINE_GROUP_TOKENS)

    // slack notify
    SlackHookUrls.forEach(async(url) => {
      const slackResult = await axios.post(
        url,
        JSON.stringify(slackMessage),
        {
          headers: {
            'Content-type': 'application/json',
          },
        }
      )
      console.log(`SLACK notified done for ${url}, result: `, slackResult.data)
    })

    // line notify
    const tokens = JSON.parse(process.env.LINE_GROUP_TOKENS)

    tokens.forEach(async(token) => {
      const lineMessage = getLineMessage(data)
      const lineResult = await axios.post(
        'https://notify-api.line.me/api/notify',
        queryString.stringify({ message: lineMessage }),
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/x-www-form-urlencoded'
          },
        }
      )
      console.log(`LINE notified done for ${token}, result: `, lineResult.data)
    })
  } catch (error) {
    console.log(error)
  }
}

main()