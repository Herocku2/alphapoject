import TitleHelmet from '@/components/Common/TitleHelmet'
import AccountSettingsNav from '@/components/Pages/AccountSettings/AccountSettingsNav'
import { NotificationsComponent } from '@/components/Pages/AccountSettings/Notifications'

const Notifications = () => {
  return (
    <div>
      <TitleHelmet title="Notifications" />
      <AccountSettingsNav />
      <NotificationsComponent />
    </div>
  )
}

export default Notifications
