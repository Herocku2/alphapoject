import InputMask from 'react-input-mask'
import { Form } from 'react-bootstrap'

const InputMaskDate2 = () => {
  return (
    <div>
      <InputMask mask="99/99/9999" placeholder="Enter birthdate" className="form-control" />
      <Form.Text>
        Phone format: <code>xx/xx/xxxx</code>
      </Form.Text>
    </div>
  )
}

export default InputMaskDate2
