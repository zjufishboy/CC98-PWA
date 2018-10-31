import { css, cx } from 'emotion'
import React from 'react'

import resolveMarkdown from '@/services/resolveMarkdown'
import { IPost, IPostUtil, IUser } from '@cc98/api'
import UBB from '@cc98/ubb-react'
import {
  Avatar,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Collapse,
  Divider,
  IconButton,
  Typography,
} from '@material-ui/core'
import Menu from '@material-ui/core/Menu'
import MenuItem from '@material-ui/core/MenuItem'
import { StyleRules, withStyles } from '@material-ui/core/styles'
import { ClassNameMap } from '@material-ui/core/styles/withStyles'
import EditIcon from '@material-ui/icons/bordercolor'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import GradeIcon from '@material-ui/icons/grade'
import Quote from '@material-ui/icons/rotateleft'
import DislikeIcon from '@material-ui/icons/thumbdown'
import LikeIcon from '@material-ui/icons/thumbup'
import { navigate } from '@reach/router'

const root = css`
  margin-top: 6px;
  background-color: #ccc;
`

const floor = css`
  margin-right: 4px;
  font-size: 14px;
`

const expand = css`
  transform: rotate(0deg);
  transition-property: transform;
  /* transition-duration:  */
`

const expandOpen = css`
  transform: rotate(180deg);
`

interface Props {
  /**
   * 帖子信息
   */
  postInfo: IPost
  /**
   * 用户信息
   */
  userInfo: IUser | null
  /**
   * 方法
   */
  util?: IPostUtil
}

interface State {
  /**
   * 签名档是否展开
   */
  expanded: boolean
  // tslint:disable-next-line:no-any
  anchorEl: any
}
const CursorStyle = css`
  cursor: pointer;
`

const styles: StyleRules = {
  actionsRoot: {
    display: 'flex',
    width: '100%',
    height: '2rem',
  },
  action: {
    flexGrow: 1,
  },
  hr: {
    border: '#555 solid thin',
    height: '1rem',
  },
  headerAction: {
    display: 'flex',
    flexDirection: 'column',
  },
  iconRoot: {
    padding: '5px',
  },
  menuItemRoot: {
    width: '3rem',
  },
}
export default withStyles(styles)(
  class extends React.PureComponent<Props & { classes: ClassNameMap }, State> {
    state: State = {
      expanded: false,
      anchorEl: null,
    }

    onExpandClick = () => {
      this.setState({
        expanded: !this.state.expanded,
      })
    }

    // tslint:disable-next-line:no-any
    handleClick = (event: any) => {
      this.setState({ anchorEl: event.currentTarget });
    }
    handleClose = () => {
      this.setState({ anchorEl: null });
    }
    render() {
      const { postInfo, userInfo, classes, util } = this.props
      const { anchorEl } = this.state
      const open = Boolean(anchorEl);

      if (postInfo.isDeleted) {
        return null
      }
      let text = UBB(postInfo.content)
      if (postInfo.contentType === 1) {
        text = resolveMarkdown(postInfo.content)
      }

      return (
        <Card square elevation={0} className={root}>
          <CardHeader
            classes={{ action: classes.headerAction }}
            avatar={
              <Avatar
                className={CursorStyle}
                onClick={() => {
                  navigate(`/user/${postInfo.userId}`)
                }}
                src={userInfo ? userInfo.portraitUrl : undefined}
              >
                匿
              </Avatar>
            }
            title={
              <div
                className={CursorStyle}
                onClick={() => {
                  navigate(`/user/${postInfo.userId}`)
                }}
              >
                {postInfo.userName}
              </div>
            }
            subheader={new Date(postInfo.time).toLocaleString()}
            action={
              [<IconButton key="floor" classes={{ root: classes.iconRoot }}>
                <span className={floor}>{`${postInfo.floor} L`}</span>
              </IconButton>,
              // tslint:disable-next-line:ter-indent
              <div key="options">
                <IconButton
                  key="option"
                  classes={{ root: classes.iconRoot }}
                  aria-label="More"
                  aria-owns={open ? 'long-menu' : undefined}
                  aria-haspopup="true"
                  onClick={this.handleClick}
                >
                  <ExpandMoreIcon fontSize="small" />
                </IconButton>
                <Menu
                  id="long-menu"
                  anchorEl={anchorEl}
                  open={open}
                  onClose={this.handleClose}
                  PaperProps={{
                    style: {
                      maxHeight: 48 * 4.5,
                      width: '5rem',
                    },
                  }}
                >
                  {['追踪', '编辑'].map(option => (
                    <MenuItem
                      key={option}
                      onClick={this.handleClose}
                      classes={{ root: classes.menuItemRoot }}
                    >
                      {option}
                    </MenuItem>
                  ))}
                </Menu>

              </div>]}
          />

          <CardContent>
            <Typography component="div">{text}</Typography>
          </CardContent>

          <CardActions classes={{ root: classes.actionsRoot }}>
            <IconButton classes={{ root: classes.action }}>
              <Quote fontSize="small" />
            </IconButton >
            <Divider classes={{ root: classes.hr }} />
            <IconButton classes={{ root: classes.action }}>
              <GradeIcon fontSize="small" />
            </IconButton>
            <Divider classes={{ root: classes.hr }} />
            <IconButton classes={{ root: classes.action }}>
              <LikeIcon fontSize="small" />
              <span
                style={{ fontSize: '0.9rem', marginLeft: '0.875rem', color: 'rgba(0, 0, 0, 0.54)' }}
              >{postInfo.likeCount}
              </span>
            </IconButton>
            <Divider classes={{ root: classes.hr }} />
            <IconButton classes={{ root: classes.action }}>
              <DislikeIcon fontSize="small" />
              <span
                style={{ fontSize: '0.9rem', marginLeft: '0.875rem', color: 'rgba(0, 0, 0, 0.54)' }}
              >{postInfo.dislikeCount}
              </span>
            </IconButton>
          </CardActions>
          {/* <CardActions>
          {userInfo && userInfo.signatureCode && <IconButton
            className={cx(expand, {
              [expandOpen]: this.state.expanded,
            })}
            onClick={this.onExpandClick}
          >
            <ExpandMoreIcon />
          </IconButton>}
        </CardActions>

        <Collapse in={this.state.expanded} timeout="auto" unmountOnExit>
          <CardContent>
            <Typography> {userInfo && UBB(userInfo.signatureCode)} </Typography>
          </CardContent>
        </Collapse> */}
        </Card>
      )
    }
  }
)
