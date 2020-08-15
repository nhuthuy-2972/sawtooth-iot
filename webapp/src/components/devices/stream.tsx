import * as React from 'react'
import { DeepstreamClient } from '@deepstream/client'
import { useStyletron } from 'baseui'
import { Button } from 'baseui/button'
import moment from 'moment';
import axios from 'axios'
import { useParams, } from "react-router-dom";
import { db } from '../../hooks/use-auth'
import Display from './display'
import { Settings } from 'react-feather';
import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalButton,
  FocusOnce,
} from 'baseui/modal';
import { Input, SIZE } from "baseui/input";
moment().zone(7)

const StreamDevices: React.FC<{}> = () => {
  const [css, theme] = useStyletron();
  const [data, setData]: any = React.useState(Object)
  const { id } = useParams()
  const [history, sethistory] = React.useState(Object)
  const [fields, setfields] = React.useState(Array);
  const [private_key, setPrivate_key] = React.useState(Array);
  const [token, setToken] = React.useState(Array);
  const [device, setdevice] = React.useState(Object)
  const [isOpen, setOpen] = React.useState(false)
  React.useEffect(() => {

    const client = new DeepstreamClient('localhost:6020')
    client.login()
    const record = client.record.getRecord('news')
    function getds() {
      record.subscribe(`news/${id}`, async (value: any) => {
        await setData(value)
        axios({
          method: 'post',
          url: 'http://localhost:8877/api/getdata',
          // url: 'http://6a5d8441b61a.ngrok.io/api/getdata',
          data: {
            device_id: id,
            timestamp: value.timestamp
          }
        }).then(data => {
          console.log("Postgres", data.data.rows)
          let res = [...data.data.rows]
          sethistory(res)
        })
          .catch(er => { console.log("hhh", er) })
      })
    }
    getds();

    return () => {
      record.unsubscribe(`news/${id}`, () => console.log('offline'))
    }
  }, [])



  React.useEffect(() => {
    console.log("set fields")
    const getdata = async () => {
      let docs = db.collection('devices').doc(id);

      await docs.get().then(async doc => {
        if (!doc.exists) {
          console.log('No such document!');
        } else {
          // console.log('Document data:', doc.get('data_fields'));
          let field = doc.get('data_fields')
          setPrivate_key(doc.get('privateKey'))
          setToken(doc.get('token'))
          setfields(field)
          setdevice({ name: doc.get('name'), desc: doc.get('desc') })
        }
      })
        .catch(err => {
          console.log('Error getting document', err);
        });
    }
    getdata()
  }, [])



  //console.log("fields", fields)
  console.log("name", device)
  console.log("history", history)
  return (
    < div className={css({})} >
      <div
        className={css({
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        })}
      >
        <div className={css({ ...theme.typography.font550 })}>
          {`${device.name || "X iot"} (${device.desc || ""})`} Batery : {data.batery} %
        </div>
        <Button
          onClick={() => setOpen(true)}
          kind="secondary"
          startEnhancer={() => (
            <Settings color={theme.colors.mono700} size={18} />
          )}
          overrides={{
            BaseButton: {
              style: {
                borderTopLeftRadius: theme.sizing.scale400,
                borderBottomRightRadius: theme.sizing.scale400,
              },
            },
          }}
        >
          Chi tiết
        </Button>
        <Modal onClose={() => setOpen(false)} isOpen={isOpen}>
          <FocusOnce>
            <ModalHeader>Chi tiết</ModalHeader>
          </FocusOnce>
          <ModalBody>
            <div>Private key</div>
            <Input value={private_key.toString()}
              disabled
              size={SIZE.mini}
            />
            <div>Token</div>
            <Input
              value={token.toString()}
              disabled
              size={SIZE.mini}
            />

          </ModalBody>
          <ModalFooter>
          </ModalFooter>
        </Modal>

      </div>

      <div
        className={css({
          marginTop: theme.sizing.scale800,
          marginBottom: theme.sizing.scale800,
          display: 'grid',
          gridTemplateColumns: '0.35fr 1fr',
        })}
      >
        {
          fields!.map((ite: any, i) => { return <Display key={Math.random() * 10 + i} field={ite} data={data} history={history} ></Display> })
        }
      </div>
    </div >
  )
}

export default StreamDevices
