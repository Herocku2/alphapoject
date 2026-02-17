import { Tabs, Tab } from 'react-bootstrap'
import { tabsData } from './data/tabsData'

const NavTabBasic = () => {
  return (
    <div>
      <Tabs defaultActiveKey="home" className="mb-3">
        {tabsData.map(({ eventKey, title, content, disabled }) => (
          <Tab key={eventKey} eventKey={eventKey} title={title} disabled={disabled}>
            {content}
          </Tab>
        ))}
      </Tabs>
    </div>
  )
}

export default NavTabBasic
