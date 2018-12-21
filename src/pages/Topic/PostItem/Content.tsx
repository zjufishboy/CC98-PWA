import React from 'react'
import styled from 'styled-components'

import { Typography } from '@material-ui/core'

import { IPost } from '@cc98/api'

import { UBBReact } from '@/UBB'
import remark from 'remark'
import remark2react from 'remark-react'

function Markdown(content: string) {
  return remark()
    .use(remark2react)
    .processSync(content).contents
}

const Content = styled(Typography)`
  && {
    margin: 12px 16px;
    margin-bottom: 4px;

    /* for <img> in markdown */
    img {
      max-width: 100%;
    }
  }
`

interface Props {
  /**
   * 帖子信息
   */
  postInfo: IPost
}

export default ({ postInfo }: Props) => {
  const content =
    postInfo.contentType === 0 ? UBBReact(postInfo.content) : Markdown(postInfo.content)

  return <Content>{content}</Content>
}
