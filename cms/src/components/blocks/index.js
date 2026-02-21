import BaseBlock from './BaseBlock.vue'
import Header from './Header.vue'
import Paragraph from './Paragraph.vue'
import VideoPlayer from './VideoPlayer.vue'
import Image from './Image.vue'
import ChartBlock from './ChartBlock.vue'
import TableBlock from './TableBlock.vue'
import SQLInterpreterBlock from './SQLInterpreterBlock.vue'
import DividerBlock from './DividerBlock.vue'
import TabsBlock from './TabsBlock.vue'
import ListBlock from './ListBlock.vue'
import TextSectionBlock from './TextSectionBlock.vue'
import CalloutBlock from './CalloutBlock.vue'

export { BaseBlock }
export const blockComponents = {
  header: Header,
  paragraph: Paragraph,
  video: VideoPlayer,
  image: Image,
  chart: ChartBlock,
  table: TableBlock,
  sql: SQLInterpreterBlock,
  divider: DividerBlock,
  tabs: TabsBlock,
  list: ListBlock,
  text_section: TextSectionBlock,
  callout: CalloutBlock
}
