import InputMask from 'react-input-mask'
import { Form } from 'react-bootstrap'

const InputMaskISBN = () => {
  return (
    <div>
      <InputMask mask="999-99-999-9999-9" maskChar={null} className="form-control" />
      <Form.Text>
        Phone format: <code>xxx-xx-xxx-xxxx-x</code>
      </Form.Text>
    </div>
  )
}

export default InputMaskISBN
