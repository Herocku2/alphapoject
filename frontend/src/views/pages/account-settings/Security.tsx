import TitleHelmet from "../../../components/Common/TitleHelmet"
import AccountSettingsNav from "../../../components/Pages/AccountSettings/AccountSettingsNav"
import { SecurityComponent } from "../../../components/Pages/AccountSettings/Security"


const Security = () => {
  return (
    <div>
      <TitleHelmet title="Security" />
      <AccountSettingsNav />
      <SecurityComponent />
    </div>
  )
}

export default Security
