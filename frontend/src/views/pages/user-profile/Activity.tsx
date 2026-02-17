import TitleHelmet from '@/components/Common/TitleHelmet'
import ProfileCover from '@/components/Pages/UserProfile/ProfileCover'
import { ActivityComponent } from '@/components/Pages/UserProfile/Activity'

const Activity = () => {
  return (
    <div>
      <TitleHelmet title="Activity" />
      <ProfileCover />
      <ActivityComponent />
    </div>
  )
}

export default Activity
