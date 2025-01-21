import * as React from 'react'
import { useSignMessage } from 'wagmi'
import { recoverMessageAddress } from 'viem'
import { apiUrl } from '../utils/constants.ts'
import { toast } from 'react-hot-toast'
import { ConnectButton, useCurrentWallet } from '@mysten/dapp-kit'

export function SignMessage({ ChadAddress, sender, content, timestamp }) {
  const {
    data: signMessageData,
    isLoading,
    signMessage,
    variables,
    reset
  } = useSignMessage()
  const { isConnected } = useCurrentWallet()
  React.useEffect(() => {
    ; (async () => {
      if (variables?.message && signMessageData) {
        const recoveredAddress = await recoverMessageAddress({
          message: variables?.message,
          signature: signMessageData
        })
        if (recoveredAddress) {
          const sendData = {
            ChadAddress: ChadAddress,
            sender: sender,
            content: variables?.message,
            timestamp: timestamp
          }
          const response = await fetch(apiUrl + '/api/add', {
            method: 'POST',
            mode: 'cors',
            cache: 'no-cache',
            headers: {
              'Content-Type': 'application/json'
            },
            redirect: 'error',
            body: JSON.stringify(sendData)
          })
          reset()
          document.getElementById('message').value = ''
          if (response.status !== 200) {
            const { error } = await response.json()
            throw new Error(error)
          }
          toast.success('Message signed and sent successfully!')
        }
      }
    })()
  }, [signMessageData, variables?.message])

  return (
    <form
      onSubmit={event => {
        event.preventDefault()
        const formData = new FormData(event.target)
        const message = formData.get('message')
        signMessage({ message: message })
      }}
    >
      <div className="TextAreaContainer">
        <textarea
          style={{ width: '-webkit-fill-available' }}
          rows={6}
          id="message"
          name="message"
          placeholder="Type your message here"
          className="rounded-[25px] p-6 text-white"
        />
      </div>
      <div className='flex justify-center'>
        {isConnected ? (
          <button
            disabled={isLoading || !isConnected}
            className="SendButton rounded-full text-[#FFFF] py-2"
          >
            {isLoading ? 'Check Wallet' : 'Send Message'}
          </button>
        ) : (
          <ConnectButton connectText="Connect Wallet First" className='w-full h-12' style={{
            backgroundColor: '#cd8e60',
            color: 'white',
            padding: '8px 16px',
            borderRadius: '8px',
          }} />
        )}
      </div>
    </form>
  )
}
