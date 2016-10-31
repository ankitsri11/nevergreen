import React, {Component, PropTypes} from 'react'
import Container from '../../common/Container'
import AvailableProjects from './AvailableProjects'
import TraySettings from './TraySettings'
import Loading from '../../common/loading/Loading'
import Messages from '../../common/messages/Messages'
import ShortcutContainer from '../../common/shortcut/ShortcutContainer'
import moment from 'moment'
import './tray.scss'
import Timer from '../../common/Timer'

const ONE_MINUTE = 60 * 1000

function lastFetched(timestamp) {
  return timestamp ? moment(timestamp).fromNow(true) : '??'
}

class Tray extends Component {
  constructor(props) {
    super(props)
    this.state = {
      showSettings: false,
      hidden: false,
      lastFetched: lastFetched(props.timestamp)
    }
  }

  componentWillReceiveProps(nextProps) {
    this.setState({lastFetched: lastFetched(nextProps.timestamp)})
  }

  componentDidMount() {
    if (this.props.projects.length === 0) {
      this.props.refreshTray(this.props)
    }
  }

  render() {
    const updateFetchedTime = () => this.setState({lastFetched: lastFetched(this.props.timestamp)})
    const updateTray = (trayId, name, url, username, oldPassword, newPassword) => {
      this.setState({showSettings: false})
      this.props.updateTray(trayId, name, url, username, oldPassword, newPassword)
    }
    const toggleSettingsView = () => this.setState({showSettings: !this.state.showSettings})
    const refreshTray = () => this.props.refreshTray(this.props)

    let subContent

    if (this.state.showSettings) {
      subContent = <TraySettings {...this.props} updateTray={updateTray} cancel={toggleSettingsView}/>
    } else {
      if (this.props.errors) {
        subContent = <Messages type='notification' messages={this.props.errors}/>
      } else {
        subContent = <AvailableProjects index={this.props.index}
                                        trayId={this.props.trayId}
                                        projects={this.props.projects}
                                        selected={this.props.selected}
                                        selectProject={this.props.selectProject}/>
      }
    }

    const toggleLabel = this.state.showSettings ? 'Show projects' : 'Show settings'
    const title = this.props.name || this.props.url
    const subTitle = this.props.name ? this.props.url : ''
    const refreshButton = this.state.showSettings || !this.props.loaded ? null :
      <button className='button' onClick={refreshTray}>
        <span className='icon-loop2'/>
        <span className='text-with-icon'>Refresh tray</span>
        <ShortcutContainer hotkeys={[`r ${this.props.index}`]}/>
      </button>
    let refreshLabel
    if (this.state.showSettings) {
      refreshLabel = ''
    } else if (!this.props.loaded) {
      refreshLabel = 'refreshing...'
    } else {
      refreshLabel = `last refreshed ${this.state.lastFetched} ago`
    }

    return (
      <Container title={title} subTitle={subTitle} className='tray'>
        <Timer onTrigger={updateFetchedTime} interval={ONE_MINUTE}/>
        <div>
          <div className='tray-sub-bar'>
            <button className='button' onClick={toggleSettingsView} title='Toggle settings'>
              <span className={'icon-' + (this.state.showSettings ? 'list' : 'cog') }/>
              <span className='text-with-icon'>{toggleLabel}</span>
              <ShortcutContainer hotkeys={[`p ${this.props.index}`]}/>
            </button>
            {refreshButton}
            <span className='tray-refresh-last-fetch'>{refreshLabel}</span>
          </div>
          <div>
            <Loading loaded={this.props.loaded}>
              {subContent}
            </Loading>
          </div>
        </div>
      </Container>
    )
  }
}

Tray.propTypes = {
  loaded: PropTypes.bool,
  errors: PropTypes.arrayOf(PropTypes.string),
  index: PropTypes.number.isRequired,
  trayId: PropTypes.string.isRequired,
  url: PropTypes.string.isRequired,
  name: PropTypes.string,
  username: PropTypes.string,
  password: PropTypes.string,
  projects: PropTypes.arrayOf(PropTypes.object).isRequired,
  timestamp: PropTypes.string,
  selected: PropTypes.arrayOf(PropTypes.string).isRequired,
  removeTray: PropTypes.func.isRequired,
  refreshTray: PropTypes.func.isRequired,
  updateTray: PropTypes.func.isRequired,
  selectProject: PropTypes.func.isRequired
}

export default Tray
