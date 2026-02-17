import { ReactNode } from 'react'
import { Helmet } from 'react-helmet'

interface PageTitleProps {
  subName?: string
  title: string
  addedChild?: ReactNode
}
const TitleHelmet = ({ title }: PageTitleProps) => {
  return (
    <div>
      <Helmet>
        <title>{title}</title>
      </Helmet>
    </div>
  )
}

export default TitleHelmet
