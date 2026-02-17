import TitleHelmet from '@/components/Common/TitleHelmet'
import { AllsGallery } from '@/components/Pages/UserProfile/Gallery'
import ProfileCover from '@/components/Pages/UserProfile/ProfileCover'

const Gallery = () => {
  return (
    <div>
      <TitleHelmet title="Gallery" />
      <ProfileCover />
      <AllsGallery />
    </div>
  )
}

export default Gallery
