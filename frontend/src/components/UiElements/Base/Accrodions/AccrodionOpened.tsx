import { Accordion } from 'react-bootstrap'
import accordionData from './data/accordionData'

const AccrodionDefault = () => {
  return (
    <div>
      <Accordion defaultActiveKey="0" alwaysOpen>
        {accordionData.map(({ id, header, body }) => (
          <Accordion.Item key={id} eventKey={id}>
            <Accordion.Header>{header}</Accordion.Header>
            <Accordion.Body>{body}</Accordion.Body>
          </Accordion.Item>
        ))}
      </Accordion>
    </div>
  )
}

export default AccrodionDefault
