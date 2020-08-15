import * as React from 'react'
import { useParams, Route } from 'react-router-dom'
import StreamDevices from '../components/devices/stream'
import { useStyletron } from 'baseui'
import { useAuth } from '../hooks/use-auth'
import { db } from '../hooks/use-auth'
import IndexPage from '.'

const DevicesPage: React.FC<{}> = () => {
  const [css, theme] = useStyletron()
  const { id } = useParams()
  console.log('params ne : ', id)
  const { state }: any = useAuth()
  console.log('state ne :', state)
  const [check, setcheck] = React.useState(Boolean)
  React.useEffect(() => {
    const getdata = async () => {
      let docs = db.collection('devices').doc(id)
      docs
        .get()
        .then((doc) => {
          if (!doc.exists) {
            console.log('No such document!')
          } else {
            console.log('Document data:', doc.data())
            setcheck(true)
          }
        })
        .catch((err) => {
          console.log('Error getting document', err)
          setcheck(false)
        })
    }
    getdata()
  }, [])

  return (
    <div
      className={css({
        maxWidth: '999px',
        padding: theme.sizing.scale400,
        margin: `${theme.sizing.scale600} auto`,
      })}
    >
      {check === true ? <StreamDevices /> : React.Fragment}
    </div>
  )
}

export default DevicesPage
