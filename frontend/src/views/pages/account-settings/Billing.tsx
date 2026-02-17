import TitleHelmet from '@/components/Common/TitleHelmet'
import AccountSettingsNav from '@/components/Pages/AccountSettings/AccountSettingsNav'
import { BillingComponent } from '@/components/Pages/AccountSettings/Billing'

const Billing = () => {
  return (
    <div>
      <TitleHelmet title="Billing" />
      <AccountSettingsNav />
      <BillingComponent />
    </div>
  )
}

export default Billing
