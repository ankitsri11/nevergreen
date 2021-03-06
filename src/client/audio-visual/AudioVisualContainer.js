import {connect} from 'react-redux'
import {
  setBrokenBuildSoundFx,
  playBrokenBuildSoundFx,
  showBrokenBuildTime,
  showTrayName
} from '../actions/AudioVisualActions'
import AudioVisual from './AudioVisual'

function mapDispatchToProps(dispatch) {
  return {
    setShowBrokenBuildTime(value) {
      dispatch(showBrokenBuildTime(value))
    },
    setPlayBrokenBuildSoundFx(value) {
      dispatch(playBrokenBuildSoundFx(value))
    },
    setBrokenBuildSoundFx(value) {
      dispatch(setBrokenBuildSoundFx(value))
    },
    setShowTrayName(value) {
      dispatch(showTrayName(value))
    }
  }
}

function mapStateToProps(store) {
  return store.get('audioVisual').toJS()
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AudioVisual)
