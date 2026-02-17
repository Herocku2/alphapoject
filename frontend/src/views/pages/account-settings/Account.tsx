import TitleHelmet from "../../../components/Common/TitleHelmet"
import { AccountComponent } from "../../../components/Pages/AccountSettings/Account"
import AccountSettingsNav from "../../../components/Pages/AccountSettings/AccountSettingsNav"
import { useTranslation } from "react-i18next"


const Account = () => {

   const {t} = useTranslation()

  return (
    <div>
      <TitleHelmet title={t("Profile")} />
      <AccountSettingsNav />
      <AccountComponent />
    </div>
  )
}

export default Account
