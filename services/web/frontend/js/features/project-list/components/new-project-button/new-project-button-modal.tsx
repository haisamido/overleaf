import BlankProjectModal from './blank-project-modal'
import ExampleProjectModal from './example-project-modal'
import importOverleafModules from '../../../../../macros/import-overleaf-module.macro'
import { JSXElementConstructor, lazy, Suspense } from 'react'
import { Nullable } from '../../../../../../types/utils'
import { FullSizeLoadingSpinner } from '@/shared/components/loading-spinner'

const UploadProjectModal = lazy(() => import('./upload-project-modal'))

export type NewProjectButtonModalVariant =
  | 'blank_project'
  | 'example_project'
  | 'upload_project'
  | 'import_from_github'

type NewProjectButtonModalProps = {
  modal: Nullable<NewProjectButtonModalVariant>
  onHide: () => void
}

function NewProjectButtonModal({ modal, onHide }: NewProjectButtonModalProps) {
  const [importProjectFromGithubModalWrapper] = importOverleafModules(
    'importProjectFromGithubModalWrapper'
  )
  const ImportProjectFromGithubModalWrapper: JSXElementConstructor<{
    onHide: () => void
  }> = importProjectFromGithubModalWrapper?.import.default

  switch (modal) {
    case 'blank_project':
      return <BlankProjectModal onHide={onHide} />
    case 'example_project':
      return <ExampleProjectModal onHide={onHide} />
    case 'upload_project':
      return (
        <Suspense fallback={<FullSizeLoadingSpinner delay={500} />}>
          <UploadProjectModal onHide={onHide} />
        </Suspense>
      )
    case 'import_from_github':
      return <ImportProjectFromGithubModalWrapper onHide={onHide} />
    default:
      return null
  }
}

export default NewProjectButtonModal
