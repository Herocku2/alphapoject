import TitleHelmet from '@/components/Common/TitleHelmet'
import AccountSettingsNav from '@/components/Pages/AccountSettings/AccountSettingsNav'
import { IntegrationsComponent } from '@/components/Pages/AccountSettings/Integrations'

const Integrations = () => {
  return (
    <div>
      <TitleHelmet title="Integrations" />
      <AccountSettingsNav />
      <IntegrationsComponent />
    </div>
  )
}

export default Integrations
