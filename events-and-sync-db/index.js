require("dotenv").config();
const WebSocket = require("ws");
const base64 = require("js-base64").Base64;
const { DeepstreamClient } = require("@deepstream/client");
const axios = require("axios");
const {
  PresenceHandler,
} = require("@deepstream/client/dist/presence/presence-handler");

const client = new DeepstreamClient("localhost:6020");
client.login();
const record = client.record.getRecord("news");

const subscribe = {
  action: "subscribe",
  address_prefixes: ["fc3c28"],
};
const ws = new WebSocket("ws://localhost:8008/subscriptions");
ws.onopen = () => {
  ws.send(JSON.stringify(subscribe));
};

ws.onmessage = async (event) => {
  const res = JSON.parse(event.data);
  if (res.block_num !== "0") {
    console.log(res);
    const payload = base64.decode(res.state_changes[0]["value"]);
    console.log("Payload : " + payload);
    let datacl = JSON.parse(payload);
    record.set(`news/${datacl.deviceId}`, datacl);

    axios({
      method: "post",
      url: process.env.resturl,
      // url: 'http://localhost:8877/api/insertdata',
      data: {
        ...datacl,
      },
    })
      .then((data) => {
        console.log("Postgress", data.rows);
      })
      .catch((er) => {
        console.log(er);
      });
  }
};

ws.onclose = () => {
  console.log("close");
  ws.close();
};
