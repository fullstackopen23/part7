import { useDispatch, useSelector } from 'react-redux'
import { Alert } from 'react-bootstrap'
const Notification = () => {
  const notification = useSelector((state) => state.notification)

  if (!notification) {
    return
  }

  return <Alert variant="warning">{notification}</Alert>
}
export default Notification
