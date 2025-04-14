import { useEffect, useMemo, useRef, useState } from 'react'
import type { FC } from 'react'
import type { CitationItem } from '../type'
import Popup from './popup'

export type Resources = {
  documentId: string
  documentName: string
  dataSourceType: string
  sources: CitationItem[]
}

type CitationProps = {
  data: CitationItem[]
  showHitInfo?: boolean
  containerClassName?: string
}
const Citation: FC<CitationProps> = ({
  data,
  showHitInfo,
  containerClassName = 'chat-answer-container',
}) => {
  const elesRef = useRef<HTMLDivElement[]>([])
  const [_limitNumberInOneLine, setLimitNumberInOneLine] = useState(0)
  const resources = useMemo(() => data.reduce((prev: Resources[], next) => {
    const documentId = next.document_id
    const documentName = next.document_name
    const dataSourceType = next.data_source_type
    const documentIndex = prev.findIndex(i => i.documentId === documentId)

    if (documentIndex > -1) {
      prev[documentIndex].sources.push(next)
    }
    else {
      prev.push({
        documentId,
        documentName,
        dataSourceType,
        sources: [next],
      })
    }

    return prev
  }, []), [data])

  const handleAdjustResourcesLayout = () => {
    const containerWidth = document.querySelector(`.${containerClassName}`)!.clientWidth - 40
    let totalWidth = 0
    for (let i = 0; i < resources.length; i++) {
      totalWidth += elesRef.current[i].clientWidth

      if (totalWidth + i * 4 > containerWidth!) {
        totalWidth -= elesRef.current[i].clientWidth

        if (totalWidth + 34 > containerWidth!)
          setLimitNumberInOneLine(i - 1)
        else
          setLimitNumberInOneLine(i)

        break
      }
      else {
        setLimitNumberInOneLine(i + 1)
      }
    }
  }

  useEffect(() => {
    handleAdjustResourcesLayout()
  }, [])

  return (
    <div className='-mb-1 mt-3'>
      <div className='text-sm mb-2 flex items-center text-gray-500'>
        引用
        <div className='ml-2 h-[1px] grow bg-gray-300' />
      </div>
      <div className='relative flex flex-wrap'>
        {
          resources.map((res, index) => (
            <div
              key={index}
              className='absolute left-0 top-0 -z-10 mb-1 mr-1 h-7 w-auto max-w-[240px] whitespace-nowrap pl-7 pr-2 text-xs opacity-0'
              ref={(ele: any) => (elesRef.current[index] = ele!)}
            >
              {res.documentName}
            </div>
          ))
        }
        {
          resources.map((res, index) => (
            <div key={index} className='mb-1 mr-1 cursor-pointer'>
              <Popup
                data={res}
                showHitInfo={showHitInfo}
              />
            </div>
          ))
        }
      </div>
    </div>
  )
}

export default Citation
