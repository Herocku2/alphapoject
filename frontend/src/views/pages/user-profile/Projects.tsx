import TitleHelmet from '@/components/Common/TitleHelmet'
import ProfileCover from '@/components/Pages/UserProfile/ProfileCover'
import { ProjectsComponent } from '@/components/Pages/UserProfile/Projects'

const Projects = () => {
  return (
    <div>
      <TitleHelmet title="Projects" />
      <ProfileCover />
      <ProjectsComponent />
    </div>
  )
}

export default Projects
