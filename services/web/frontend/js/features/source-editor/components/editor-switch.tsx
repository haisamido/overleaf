import { ChangeEvent, FC, memo, useCallback } from 'react'
import useScopeValue from '../../../shared/hooks/use-scope-value'
import Tooltip from '../../../shared/components/tooltip'
import { sendMB } from '../../../infrastructure/event-tracking'
import isValidTeXFile from '../../../main/is-valid-tex-file'
import { useTranslation } from 'react-i18next'
import { PromotionOverlay } from './table-generator/promotion/popover'
import { FeedbackBadge } from '@/shared/components/feedback-badge'

function EditorSwitch() {
  const { t } = useTranslation()
  const [visual, setVisual] = useScopeValue('editor.showVisual')
  const [docName] = useScopeValue('editor.open_doc_name')

  const richTextAvailable = isValidTeXFile(docName)

  const handleChange = useCallback(
    event => {
      const editorType = event.target.value

      switch (editorType) {
        case 'cm6':
          setVisual(false)
          break

        case 'rich-text':
          setVisual(true)
          break
      }

      sendMB('editor-switch-change', { editorType })
    },
    [setVisual]
  )

  return (
    <div className="editor-toggle-switch">
      <fieldset className="toggle-switch">
        <legend className="sr-only">Editor mode.</legend>

        <input
          type="radio"
          name="editor"
          value="cm6"
          id="editor-switch-cm6"
          className="toggle-switch-input"
          checked={!richTextAvailable || !visual}
          onChange={handleChange}
        />
        <label htmlFor="editor-switch-cm6" className="toggle-switch-label">
          <span>{t('code_editor')}</span>
        </label>

        <RichTextToggle
          checked={richTextAvailable && visual}
          disabled={!richTextAvailable}
          handleChange={handleChange}
        />
      </fieldset>

      {richTextAvailable && visual && (
        <FeedbackBadge
          id="visual-editor-feedback"
          url="https://forms.gle/AUqHmKNiEH3DRniPA"
          text={<VisualEditorFeedbackContent />}
        />
      )}
    </div>
  )
}

const VisualEditorFeedbackContent = () => (
  <>
    We have a new Visual Editor!
    <br />
    Click to give feedback
  </>
)

const RichTextToggle: FC<{
  checked: boolean
  disabled: boolean
  handleChange: (event: ChangeEvent<HTMLInputElement>) => void
}> = ({ checked, disabled, handleChange }) => {
  const { t } = useTranslation()

  const toggle = (
    <span>
      <input
        type="radio"
        name="editor"
        value="rich-text"
        id="editor-switch-rich-text"
        className="toggle-switch-input"
        checked={checked}
        onChange={handleChange}
        disabled={disabled}
      />
      <label htmlFor="editor-switch-rich-text" className="toggle-switch-label">
        <span>{t('visual_editor')}</span>
      </label>
    </span>
  )

  if (disabled) {
    return (
      <Tooltip
        description={t('visual_editor_is_only_available_for_tex_files')}
        id="rich-text-toggle-tooltip"
        overlayProps={{ placement: 'bottom' }}
        tooltipProps={{ className: 'tooltip-wide' }}
      >
        {toggle}
      </Tooltip>
    )
  }

  return <PromotionOverlay>{toggle}</PromotionOverlay>
}

export default memo(EditorSwitch)
