import { POST } from '@/utils/fetch'
import { ITopic } from '@cc98/api'
import Button from '@material-ui/core/Button'
import TextField from '@material-ui/core/TextField'
import { css } from 'emotion'
import React from 'react'
interface Props {
  topic: ITopic
}
interface State {
  value: string
}
const row = css`
  && {
    display: flex;
  }
`
export default class extends React.Component<Props, State> {
  state: State = {
    value: '',
  }

  handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) =>
    this.setState({
      value: event.target.value,
    })
  handleClick = async () => {
    const { topic } = this.props
    const url = `/post/topic/${topic.id}`
    const { value } = this.state
    const content = {
      content: value,
      contentType: 0,
      title: '',
    }
    const contentJson = JSON.stringify(content)
    const postData = await POST(`/topic/${topic.id}/post`, { params: contentJson })
  }

  render() {
    return (
      <div className={row}>
        <TextField
          id="standard-full-width"
          style={{ margin: 8, width: '90%' }}
          placeholder="请输入您的回复内容"
          multiline
          value={this.state.value}
          onChange={this.handleChange}
          margin="normal"
          InputLabelProps={{
            shrink: true,
          }}
        />
        <Button onClick={this.handleClick} variant="contained" color="primary">
          回复
        </Button>
      </div>
    )
  }
}
