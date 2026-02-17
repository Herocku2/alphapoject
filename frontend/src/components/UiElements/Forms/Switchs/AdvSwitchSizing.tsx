import React from 'react'
import Form from 'react-bootstrap/Form'

const switches = [
  { size: 'sm', label: 'Small' },
  { size: '', label: 'Default' },
  { size: 'lg', label: 'Large' },
]

const squareSwitches = [
  { size: 'sm', label: 'Small Square', className: 'switch switch-square' },
  { size: '', label: 'Default Square', className: 'switch switch-square' },
  { size: 'lg', label: 'Large Square', className: 'switch switch-square' },
]

const AdvSwitchSizing = () => {
  return (
    <div>
      {switches.map(({ size, label }, index) => (
        <div key={index}>
          <Form.Check.Label className={`switch${size ? ` switch-${size}` : ''}`}>
            <Form.Check.Input
              type="checkbox"
              className="switch-input"
              defaultChecked={size === 'sm'}
            />
            <span className="switch-toggle-slider">
              <span className="switch-on">
                <i className="ti ti-check"></i>
              </span>
              <span className="switch-off">
                <i className="ti ti-x"></i>
              </span>
            </span>
            <span className="switch-label">{label}</span>
          </Form.Check.Label>
          <br />
          <br />
        </div>
      ))}
      <hr className="my-4" />
      {squareSwitches.map(({ size, label, className }, index) => (
        <div key={index}>
          <Form.Check.Label
            className={`switch${size ? ` switch-${size}` : ''}${className ? ` ${className}` : ''}`}
          >
            <Form.Check.Input
              type="checkbox"
              className="switch-input"
              defaultChecked={size === 'sm'}
            />
            <span className="switch-toggle-slider">
              <span className="switch-on">
                <i className="ti ti-check"></i>
              </span>
              <span className="switch-off">
                <i className="ti ti-x"></i>
              </span>
            </span>
            <span className="switch-label">{label}</span>
          </Form.Check.Label>
          <br />
          <br />
        </div>
      ))}
    </div>
  )
}

export default AdvSwitchSizing
