import { Accordion } from 'react-bootstrap'
import accordionData from './data/accordionData'

const AccrodionRevIcon = () => {
  return (
    <div>
      <Accordion className="accordion-rev-icon" defaultActiveKey="0">
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

export default AccrodionRevIcon
