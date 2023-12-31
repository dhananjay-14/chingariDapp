import { TOKEN_PROGRAM_ID } from '@solana/spl-token'
import { useWallet } from '@solana/wallet-adapter-react'
import { SOLANA_HOST } from '../utils/const'
import { getProgramInstance } from '../utils/utils'
const anchor = require('@project-serum/anchor')
const utf8 = anchor.utils.bytes.utf8
const { BN, web3 } = anchor
const { SystemProgram } = web3

const defaultAccounts = {
  tokenProgram: TOKEN_PROGRAM_ID,
  clock: anchor.web3.SYSVAR_CLOCK_PUBKEY,
  systemProgram: SystemProgram.programId,
}
const useChingari = (
    setChingari,
    userDetail,
    videoUrl,
    description,
    setDescription,
    setVideoUrl,
    setNewVideoShow,
  ) => {
    const wallet = useWallet()
    const connection = new anchor.web3.Connection(SOLANA_HOST)
    const program = getProgramInstance(connection, wallet)
    const getChingari = async () => {
      console.log('fetching');
  
      const videos = await program.account.videoAccount.all()
      console.log(videos);
  
      // const res = await axios.get(
      //   'https://ipfs.io/ipfs/QmS28E89P3Gz2LZimkKSuJgXGuZEtXG6dhyzxkSbpv6mKU/tiktoks.json',
      // )
      // setChingari(res.data);
      setChingari(videos)
    }
    const likeVideo = async index => {
        let [video_pda] = await anchor.web3.PublicKey.findProgramAddress(
          [utf8.encode('video'), new BN(index).toArrayLike(Buffer, 'be', 8)],
          program.programId,
        )
    
        const tx = await program.rpc.likeVideo({
          accounts: {
            video: video_pda,
            authority: wallet.publicKey,
            ...defaultAccounts,
          },
        })
    
        console.log(tx)
      }
    
      const createComment = async (index, count, comment) => {
        let [video_pda] = await anchor.web3.PublicKey.findProgramAddress(
          [utf8.encode('video'), new BN(index).toArrayLike(Buffer, 'be', 8)],
          program.programId,
        )
    
        let [comment_pda] = await anchor.web3.PublicKey.findProgramAddress(
          [
            utf8.encode('comment'),
            new BN(index).toArrayLike(Buffer, 'be', 8),
            new BN(count).toArrayLike(Buffer, 'be', 8),
          ],
          program.programId,
        )
    
        if (userDetail) {
          const tx = await program.rpc.createComment(
            comment,
            userDetail.userName,
            userDetail.userProfileImageUrl,
            {
              accounts: {
                video: video_pda,
                comment: comment_pda,
                authority: wallet.publicKey,
                ...defaultAccounts,
              },
            },
          )
          console.log(tx)
        }
      }
      
      const newVideo = async () => {
           const randomKey = anchor.web3.Keypair.generate().publicKey; 
           console.log(randomKey.toString());
        // let [state_pda] = anchor.web3.PublicKey.findProgramAddressSync(
        //         [utf8.encode('state')],
        //         program.programId,
        // )
       
        // const stateInfo = await program.account.stateAccount.fetch(state_pda)      
        
            const programAddressResult = await anchor.web3.PublicKey.findProgramAddress(
                [utf8.encode('video'), randomKey.toBuffer()],
                program.programId
              );
              
              const video_pda = programAddressResult[0]; // Access the first value from the result
              console.log(video_pda);
        
        
        
         
                
                    const tx = await program.rpc.createVideo(
                        description,  
                        videoUrl,
                        userDetail.userName,
                        userDetail.userProfileImageUrl,
                        {
                          accounts: {
                            video: video_pda,
                            randomkey:randomKey,
                            authority: wallet.publicKey,
                            ...defaultAccounts,
                          },
                        },
                      )
               
    
        
    
        console.log(tx);
    
        setDescription('')
        setVideoUrl('')
        setNewVideoShow(false)
      }
      const getComments = async (index, count) => {
        let commentSigners = []
    
        for (let i = 0; i < count; i++) {
          let [commentSigner] = await anchor.web3.PublicKey.findProgramAddress(
            [
              utf8.encode('comment'),
              new BN(index).toArrayLike(Buffer, 'be', 8),
              new BN(i).toArrayLike(Buffer, 'be', 8),
            ],
            program.programId,
          )
    
          commentSigners.push(commentSigner)
        }
    
        const comments = await program.account.commentAccount.fetchMultiple(
          commentSigners,
        )
        console.log(comments)
        return comments
      }
      return { getChingari, likeVideo, createComment, newVideo, getComments }
}
export default useChingari