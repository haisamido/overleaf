import { Panel, PanelGroup } from 'react-resizable-panels'
import { VerticalResizeHandle } from '@/features/ide-react/components/resize/vertical-resize-handle'
import { FileTree } from '@/features/ide-react/components/file-tree'
import classNames from 'classnames'
import { useLayoutContext } from '@/shared/context/layout-context'
import { OutlineContainer } from '@/features/outline/components/outline-container'
import { useOutlinePane } from '@/features/ide-react/hooks/use-outline-pane'

export default function EditorSidebar() {
  const { view } = useLayoutContext()

  const { outlineDisabled, outlineRef } = useOutlinePane()

  return (
    <aside
      className={classNames('ide-react-editor-sidebar', {
        hidden: view === 'history',
      })}
    >
      <PanelGroup autoSaveId="ide-editor-sidebar-layout" direction="vertical">
        <Panel
          defaultSize={50}
          minSize={25}
          className="ide-react-file-tree-panel"
          id="panel-file-tree"
          order={1}
        >
          <FileTree />
        </Panel>

        <VerticalResizeHandle disabled={outlineDisabled} />

        <Panel
          defaultSize={50}
          maxSize={75}
          id="panel-outline"
          order={2}
          collapsible
          ref={outlineRef}
          style={{ minHeight: 32 }} // keep the header visible
        >
          <OutlineContainer />
        </Panel>
      </PanelGroup>
    </aside>
  )
}
