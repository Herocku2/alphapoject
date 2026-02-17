import { IntegrationsAvaiable, IntegrationsConnect } from './Components'

const IntegrationsComponent = () => {
  return (
    <div>
      <IntegrationsConnect />
      <hr className="mt-6" />
      <IntegrationsAvaiable />
    </div>
  )
}

export default IntegrationsComponent
