require('dotenv').config()
const fs = require('fs')
const jwt = require('jsonwebtoken')
//const contentType = require('content-type')
//const getRawBody = require('raw-body')
//const queryString = require('query-string')
//const url = require('url')
//const nanoId = require('nanoid')
const { HexchainIOTClient } = require('../client-processor')
const { execShell, isDeviceExists } = require('../utils')
//const { time } = require('console')
//const { delete, delete } = require('request')

exports.create_key = async (req, res) => {
  try {
    // const body = req.query;
    // const deviceId = body.device_id;
    const deviceId = req.body.device_id

    await execShell(
      `docker exec sawtooth-shell-default sawtooth keygen ${deviceId}`,
    )
    //set permisison for file key
    await execShell(
      `docker exec sawtooth-shell-default chmod -R 704 /root/.sawtooth/keys`,
    )

    const userprivkeyfile = `${deviceId}.priv`

    const privatekey = fs
      .readFileSync(
        `/home/nhuthuy/HK2-2020/Nien-luan-nganh/hexchain/deploy/.sawtooth/keys/${userprivkeyfile}`,
        { encoding: 'utf8' },
      )
      .trim()
    console.log('priv : ', privatekey)

    res.json({
      message: 'Successful',
      deviceId: deviceId,
      privatekey: privatekey,
    })
  } catch (error) {
    res.status(401).json({ error })
  }
}

exports.device_token = (req, res) => {
  const deviceId = req.body.device_id
  console.log(deviceId)
  if (!deviceId) {
    return res.status(401).json({
      error: 'No device in put',
    })
  }

  if (!isDeviceExists(deviceId)) {
    return res.status(401).json({
      message: 'Device is not exists',
    })
  }

  const token = jwt.sign(
    {
      deviceId,
    },
    process.env.JWT_SERECT,
  )

  return res.status(200).json({
    message: 'Successful',
    token,
  })
}

exports.send_data = async (req, res) => {
  const deviceId = req.device_data.deviceId
  //const data = req.body.data
  const data = req.body
  delete data.token
  let timestamp = new Date(data.timestamp * 1000)
  //timestamp.setUTCSeconds(data.timestamp)

  try {
    const hexchain = new HexchainIOTClient(deviceId)
    const payload = {
      action: 'set',
      data: JSON.stringify({
        ...data,
        timestamp,
        deviceId,
      }),
    }
    console.log(payload)

    hexchain.sendRequest(payload)

    return res.status(200).json({
      message: 'Successful',
      data,
    })
  } catch (error) {
    res.status(401).json({ error })
  }
}

// exports.send_raw_data = async (req, res, next) => {
//   getRawBody(
//     req,
//     {
//       length: req.headers['content-length'],
//       limit: '1mb',
//       encoding: contentType.parse(req).parameters.charset,
//     },
//     function (err, string) {
//       if (err) return res.send(err)
//       let req_json = queryString.parse(string.toString())
//       console.log(req_json)
//       try {
//         const token = req_json.token
//         const decoded = jwt.verify(token, process.env.JWT_SERECT)

//         if (isDeviceExists(decoded.deviceId)) {
//           delete req_json['token']
//           const hexchain = new HexchainIOTClient(decoded.deviceId)
//           const payload = {
//             action: 'set',
//             data: JSON.stringify({
//               timestamp: +new Date(),
//               ...req_json,
//             }),
//           }

//           hexchain.sendRequest(payload)

//           return res.status(200).json({
//             message: 'Successful',
//             ...req_json,
//           })
//         } else {
//           return res.status(401).json({
//             message: 'Device is not exists',
//           })
//         }
//       } catch (error) {
//         return res.status(401).json({
//           message: 'Device auth failed',
//         })
//       }
//     },
//   )
// }

// exports.send_raw = async (req, res) => {
//   let url_parts = url.parse(req.url, true)
//   let req_json = url_parts.query

//   console.log(req_json)
//   try {
//     const token = req_json.token
//     const decoded = jwt.verify(token, process.env.JWT_SERECT)

//     if (isDeviceExists(decoded.deviceId)) {
//       delete req_json['token']
//       const hexchain = new HexchainIOTClient(decoded.deviceId)
//       const payload = {
//         action: 'set',
//         data: JSON.stringify({
//           timestamp: +new Date(),
//           ...req_json,
//         }),
//       }

//       hexchain.sendRequest(payload)

//       return res.status(200).json({
//         message: 'Successful',
//         ...req_json,
//       })
//     } else {
//       return res.status(401).json({
//         message: 'Device is not exists',
//       })
//     }
//   } catch (error) {
//     return res.status(401).json({
//       message: 'Device auth failed',
//     })
//   }
// }
