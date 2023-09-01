import {SignUp} from './SignUp';
import Video from './Video'
import { useEffect, useState } from 'react'
import { useWallet } from '@solana/wallet-adapter-react'
import { SOLANA_HOST } from '../utils/const'
import { getProgramInstance } from '../utils/utils'
import { TOKEN_PROGRAM_ID } from '@solana/spl-token'

import useAccount from '../hooks/useAccount'
import useChingari from '../hooks/useChingari'
import UploadModal from './UploadModal'
import BottomBar from './BottomBar'

import style from '../styles/MainView.module.css'

const anchor = require('@project-serum/anchor')
const utf8 = anchor.utils.bytes.utf8
const { BN, web3 } = anchor
const { SystemProgram } = web3

const defaultAccounts = {
  tokenProgram: TOKEN_PROGRAM_ID,
  clock: anchor.web3.SYSVAR_CLOCK_PUBKEY,
  systemProgram: SystemProgram.programId,
}

const MainView = () => {
  const [isAccount, setAccount] = useState(false)
  const wallet = useWallet()
  const connection = new anchor.web3.Connection(SOLANA_HOST)

  const program = getProgramInstance(connection, wallet)

 const [chingari, setChingari] = useState([]);
 const [newVideoShow, setNewVideoShow] = useState(false)
 const [description, setDescription] = useState('')
 const [videoUrl, setVideoUrl] = useState('')
 const [userDetail, setUserDetail] = useState()
 const [currentVideoIndex, setCurrentVideoIndex] = useState(0);

  const playNextVideo = () => {
    console.log('next video btn pressed!!')
    const nextIndex = (currentVideoIndex + 1) % chingari.length;
    setCurrentVideoIndex(nextIndex);
  };

  const currentVideo = chingari[currentVideoIndex];

  const { signup } = useAccount();
  const { getChingari, likeVideo, createComment, newVideo, getComments } =
    useChingari(
      setChingari,
      userDetail,
      videoUrl,
      description,
      setDescription,
      setVideoUrl,
      setNewVideoShow,
    )
      
  useEffect(() => {
    if (wallet.connected) {
      checkAccount();
      getChingari();
    }
  }, [wallet.connected])

  useEffect(() => {
    const intervalId = setInterval(() => {
    }, 3000)

   // clear interval on re-render to avoid memory leaks
    return () => clearInterval(intervalId)
  })

  const checkAccount = async () => {
    let [user_pda] = await anchor.web3.PublicKey.findProgramAddress(
      [utf8.encode('user'), wallet.publicKey.toBuffer()],
      program.programId,
    )

    try {
      const userInfo = await program.account.userAccount.fetch(user_pda)
      console.log(userInfo)
      setUserDetail(userInfo)
      setAccount(true)
    } catch (e) {
      setAccount(false)
    }
  }
    // let isAccount = false;

  return (
    <>
       {isAccount ? (
        <div>
          {newVideoShow && (
            <UploadModal
              description={description}
              videoUrl={videoUrl}
              newVideo={newVideo}
              setDescription={setDescription}
              setVideoUrl={setVideoUrl}
              setNewVideoShow={setNewVideoShow}
            />
          )}
          <div className={style.appVideos}>
         {chingari.length === 0 ? (
              <div>No videos</div>
            ) : (<>
            <Video
              playNextVideo={playNextVideo}
              url={currentVideo.account.videoUrl}
              channel={currentVideo.account.creatorName}
              index={currentVideo.account.index.toNumber()}
              likes={currentVideo.account.likes}
              description={currentVideo.account.description}
              shares={currentVideo.account.remove.toNumber()}
              likeVideo={likeVideo}
              likesAddress={currentVideo.account.peopleWhoLiked}
              createComment={createComment}
              getComments={getComments}
              commentCount={currentVideo.account.commentCount.toNumber()}
            />
            
            </> 
            )}
          </div>
          <BottomBar
            setNewVideoShow={setNewVideoShow}
            getChingari={getChingari}
          />
          
        </div>
      ) : (
        <SignUp signup={signup} wallet={wallet.publicKey.toBase58()} />
      )}
    </> 
  )
}
export default MainView