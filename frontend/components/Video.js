import { useRef, useState } from 'react'
import Comments from './Comments'
import Footer from './Footer'
import Sidebar from './Sidebar'
import style from '../styles/Video.module.css'


const Video = ({
  url,
  channel,
  description,
  index,
  likes,
  shares,
  likeVideo,
  likesAddress,
  createComment,
  getComments,
  commentCount,
  playNextVideo,
}) => {
  const [playing, setPlaying] = useState(false)
  const [showCommentsModal, setShowCommentsModal] = useState(false)
  const videoRef = useRef(null)

  const onVideoPress = () => {
    if (playing) {
      videoRef.current.pause()
      setPlaying(false)
    } else {
      videoRef.current.play()
      setPlaying(true)
    }
  }

  const hideComments = () => {
    setShowCommentsModal(false)
  }

  const showComments = () => {
    setShowCommentsModal(true)
  }

  return (
    
    <div className={style.wrapper}>
      {/* <video
        className={style.videoPlayer}
        loop
        onClick={onVideoPress}
        ref={videoRef}
        src={url}
        style={{ objectFit: 'cover' }}
      /> */}
        <iframe width="320" height='561' loop onClick={onVideoPress} src={url} ></iframe>
       <Footer channel={channel} description={description} song={index} />
      
       {/* <iframe width="320" height="561" src="https://www.youtube.com/embed/nVhBrCeUC8s" title="Elon Musk taking on Mukesh Ambani 😮" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe> */}

      <Sidebar
        likes={likes}
        shares={shares}
        onShowComments={showComments}
        likeVideo={likeVideo}
        index={index}
        likesAddress={likesAddress}
        messages={commentCount}
        playNextVideo={playNextVideo}
      /> 
      {showCommentsModal && (
        <Comments
          onHide={hideComments}
          index={index}
          createComment={createComment}
          getComments={getComments}
          commentCount={commentCount}
        />
      )}
    </div>
  )
}

export default Video
