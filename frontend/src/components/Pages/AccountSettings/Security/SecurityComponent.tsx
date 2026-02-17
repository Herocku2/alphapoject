import { Card, Form } from 'react-bootstrap'

import { AcPassword } from './Components'

const SecurityComponent = () => {
  return (
    <div>
      <Card className="mb-3 mb-md-4">
        <Card.Body>
            <AcPassword />
            <hr className="my-6 my-md-12" />
        
        </Card.Body>
      </Card>
    </div>
  )
}

export default SecurityComponent
