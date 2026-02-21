import BaseBlock from './BaseBlock.vue'
import Header from './Header.vue'
import Paragraph from './Paragraph.vue'
import VideoPlayer from './VideoPlayer.vue'
import Image from './Image.vue'
import ChartBlock from './ChartBlock.vue'
import TableBlock from './TableBlock.vue'
import SQLInterpreterBlock from './SQLInterpreterBlock.vue'

export { BaseBlock }
export const blockComponents = {
  header: Header,
  paragraph: Paragraph,
  video: VideoPlayer,
  image: Image,
  chart: ChartBlock,
  table: TableBlock,
  sql: SQLInterpreterBlock
}
