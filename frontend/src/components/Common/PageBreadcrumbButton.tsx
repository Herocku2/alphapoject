import { Stack } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import PageBreadcrumb from './PageBreadcrumb'

interface PageTitleProps {
  subName?: string
  title: string
  url: string
}
const PageBreadcrumbButton = ({ title, subName, url }: PageTitleProps) => {
  return (
    <div>
      <Stack direction="horizontal" className="justify-content-between">
        <PageBreadcrumb title={title} subName={subName} />
        <Stack gap={2} direction="horizontal" className="mt-2 mb-4 mb-md-6">
          <Link to={url} target="_black" className="btn btn-primary ">
            Offical Docs
          </Link>
        </Stack>
      </Stack>
    </div>
  )
}

export default PageBreadcrumbButton
