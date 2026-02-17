import TitleHelmet from '@/components/Common/TitleHelmet'
import ProfileCover from '@/components/Pages/UserProfile/ProfileCover'
import { ContactsComponent } from '@/components/Pages/UserProfile/Contacts'

const Contacts = () => {
  return (
    <div>
      <TitleHelmet title="Contacts" />
      <ProfileCover />
      <ContactsComponent />
    </div>
  )
}

export default Contacts
