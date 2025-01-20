import React, { useState } from 'react'
import '../App.css'
import '../styles/MainContainer.css'
import Input from '../components/Input.tsx'
import TextArea from '../components/TextArea.tsx'
import { toast } from 'react-hot-toast'
import Footer from '../components/Footer.jsx'
import 'react-datepicker/dist/react-datepicker.css'
import TopBar from '../components/TopBar.jsx'
import { ConnectButton, useCurrentWallet } from '@mysten/dapp-kit'
import { useCreate } from '../hooks/index.ts'

const CreateToken = () => {
  const { isConnected } = useCurrentWallet();

  const { createToken } = useCreate()
  const [loading, setLoading] = useState(false)

  const [tokenName, setTokenName] = useState('Name')
  const [tokenSymbol, setTokenSymbol] = useState('Symbol')
  const [tokenDescription, setTokenDescription] = useState('Description')
  const [tokenLogo, setTokenLogo] = useState('Logo')
  const [website, setWebsite] = useState('https://www.popisland.it')
  const [telegram, setTelegram] = useState('https://t.me')
  const [twitter, setTwitter] = useState('https://x.com')

  const onBlackPumpCreate = async () => {
    try {
      setLoading(true)
      createToken(tokenName, tokenSymbol, tokenDescription, tokenLogo, website, telegram, twitter)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <div className="GlobalContainer">
        {
          <div style={{ zIndex: 1 }}>
            <TopBar />
            <div className="max-w-7xl m-auto pt-36 pb-24 px-4 sm:px-12 sm:py-10">
              <section className="lg:mx-auto pt-8 lg:py-[30px] w-full lg:w-[741px] min-w-0">
                <>
                  <section>
                    <section className="my-4">
                      <p className="ContractContentTextTitle h1">
                        Create Token
                      </p>
                    </section>
                    <div className="flex flex-col justify-center items-center gap-[10px] bg-[#121212] rounded-[25px] py-[45px] px-3 sm:px-[25px]">
                      <section className="flex flex-col gap-4 w-[90%]">
                        <div className="LpBalance">
                          <p className="Text1">
                            Name<span style={{ color: 'red' }}>*</span>
                          </p>
                        </div>
                        <section className="inputPanel">
                          <section className="inputPanelHeader w-full text-white">
                            <Input
                              placeholder="Enter Name"
                              label=""
                              type="text"
                              changeValue={setTokenName}
                              value={tokenName}
                            />
                          </section>
                        </section>
                      </section>
                      <section className="flex flex-col gap-4 w-[90%]">
                        <div className="LpBalance">
                          <p className="Text1">
                            Symbol<span style={{ color: 'red' }}>*</span>
                          </p>
                        </div>
                        <section className="inputPanel">
                          <section className="inputPanelHeader w-full">
                            <Input
                              placeholder="Enter Symbol"
                              label=""
                              type="text"
                              changeValue={setTokenSymbol}
                              value={tokenSymbol}
                            />
                          </section>
                        </section>
                      </section>
                      <section className="flex flex-col gap-4 w-[90%]">
                        <div className="LpBalance">
                          <p className="Text1">
                            Logo Url<span style={{ color: 'red' }}>*</span>
                          </p>
                        </div>
                        <section className="inputPanel">
                          <section className="inputPanelHeader w-full">
                            <Input
                              placeholder="Enter Logo Url"
                              label=""
                              type="text"
                              changeValue={setTokenLogo}
                              value={tokenLogo}
                            />
                          </section>
                        </section>
                      </section>
                      <section className="flex flex-col gap-4 w-[90%]">
                        <p className="Text1">
                          Description (Max 1000 characters)
                          <span style={{ color: 'red' }}>*</span>
                        </p>
                        <section className="inputPanel">
                          <section className="inputPanelHeader w-full text-white">
                            <TextArea
                              rows={6}
                              placeholder="Enter Token Description"
                              changeValue={setTokenDescription}
                              value={tokenDescription}
                            />
                          </section>
                        </section>
                      </section>
                      <section className="flex flex-col gap-4 w-[90%]">
                        <div className="LpBalance">
                          <p className="Text1">Website</p>
                        </div>
                        <section className="inputPanel">
                          <section className="inputPanelHeader w-full">
                            <Input
                              placeholder="https://"
                              label=""
                              type="text"
                              changeValue={setWebsite}
                              value={website}
                            />
                          </section>
                        </section>
                      </section>
                      <section className="flex flex-col gap-4 w-[90%]">
                        <div className="LpBalance">
                          <p className="Text1">Telegram</p>
                        </div>
                        <section className="inputPanel">
                          <section className="inputPanelHeader w-full">
                            <Input
                              placeholder="https://"
                              label=""
                              type="text"
                              changeValue={setTelegram}
                              value={telegram}
                            />
                          </section>
                        </section>
                      </section>
                      <section className="flex flex-col gap-4 w-[90%]">
                        <div className="LpBalance">
                          <p className="Text1">Twitter</p>
                        </div>
                        <section className="inputPanel">
                          <section className="inputPanelHeader w-full">
                            <Input
                              placeholder="https://"
                              label=""
                              type="text"
                              changeValue={setTwitter}
                              value={twitter}
                            />
                          </section>
                        </section>
                      </section>
                      <div className="text-[#00f3ef] w-[90%] w-max-[90%] m-0 text-[14px] flex justify-between">
                        <span>Deployment Fee:</span>
                        <span>0.01 SUI</span>
                      </div>
                      <div
                        style={{
                          display: 'flex',
                          justifyContent: 'center',
                          flexDirection: 'column',
                          width: '100%'
                        }}
                      >
                        {isConnected ? (
                          <button
                            disabled={!tokenName || !tokenSymbol || !tokenDescription || !tokenLogo || loading}
                            onClick={onBlackPumpCreate}
                            className="CreateButton flex justify-center items-center"
                          >
                            {loading ? 'Creating...' : 'Create'}
                          </button>
                        ) : (
                          <div className="justify-center flex">
                            <ConnectButton />
                          </div>
                        )}
                      </div>

                    </div>
                  </section>
                </>
              </section>
            </div>
          </div>
        }
      </div>
      <Footer />
    </div>
  )
}

export default CreateToken
