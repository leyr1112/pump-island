import React, { useState, useEffect, useRef } from 'react'
import '../App.css'
import '../styles/MainContainer.css'
import Input from '../components/Input.tsx'
import TextArea from '../components/TextArea.tsx'
import { toast } from 'react-hot-toast'
import Footer from '../components/Footer.jsx'
import 'react-datepicker/dist/react-datepicker.css'
import TopBar from '../components/TopBar.jsx'
import LogoUploadBox from '../components/LogoUploadBox.jsx'
import { Tooltip } from 'react-tooltip'
import { ConnectButton, useCurrentWallet } from '@mysten/dapp-kit'
import { useCreate, useGetPools, useTrade } from '../hooks/index.ts'

const CreateToken = () => {
  const { digest, createToken, creatPool } = useCreate()
  const { buy } = useTrade()
  const [logoPreview, setLogoPreview] = useState<string | null>(null)
  const [logoFile, setLogoFile] = useState<File | null>(null)
  const logoFileInput = useRef<HTMLInputElement>(null)
  const [tokenName, setTokenName] = useState('')
  const [tokenSymbol, setTokenSymbol] = useState('')
  const [tokenDescription, setTokenDescription] = useState('')
  let [loading, setLoading] = useState(false)
  let [creating, setCreating] = useState(false)
  const [website, setWebsite] = useState('')
  const [telegram, setTelegram] = useState('')
  const [twitter, setTwitter] = useState('')

  useEffect(() => {
    if (loading === true) {
      setTimeout(function () {
        setLoading(false)
      }, 3000)
    }
  }, [loading])

  const onBlackPumpCreate = async () => {
    try {
      setCreating(true)
      // createToken()
      creatPool()
      // buy()
    } catch (err) {
      setCreating(false)
      console.error(err)
      toast.error(
        'There is a problem with your Black Pump create. Please try again later'
      )
    }
  }

  const [, setImageLogoFile] = useState(null)

  const handleImageLogoChange = file => {
    setImageLogoFile(file)
  }

  const LogoImageUpload = ({ onChange, className, style }) => {
    const handleLogoImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const selectedFile = e.target.files![0]
      setLogoFile(selectedFile)
      setLogoPreview(URL.createObjectURL(selectedFile))
      onChange(selectedFile)
    }
    const onButtonClick = () => {
      if (logoFileInput.current) {
        logoFileInput.current.click()
      }
    }
    return (
      <div style={{ width: '100%', position: 'relative' }}>
        <input
          type="file"
          ref={logoFileInput}
          accept="image/*"
          onChange={handleLogoImageChange}
          style={{ display: 'none' }}
        />
        <LogoUploadBox
          imageUrl={logoPreview}
          handleClick={onButtonClick}
          className={className}
          style={style}
        />
      </div>
    )
  }

  const { isConnected } = useCurrentWallet();

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
                      <>
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
                        <section className="flex flex-col sm:flex-row w-[90%]">
                          <section className="flex flex-col gap-4 w-full sm:w-[40%]">
                            <div className="LpBalance">
                              <p className="Text1 flex">
                                Upload Logo
                                <span className="flex" style={{ color: 'red' }}>
                                  *
                                </span>
                                <a
                                  className="flex pl-12"
                                  id="my-anchor-element"
                                >
                                  <Tooltip
                                    anchorSelect="#my-anchor-element"
                                    className="w-64 md:w-80 lg:w-96 max-w-sm"
                                    content="Please upload only images in .png, .jpg. The ideal size for uploads is 256x256 pixels for optimal quality and fit."
                                  />
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                    strokeWidth={2}
                                    className="h-5 w-5 cursor-pointer text-blue-gray-500"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z"
                                    />
                                  </svg>
                                </a>
                              </p>
                            </div>
                            <section className="inputPanel">
                              <section className="inputPanelHeader w-full">
                                <LogoImageUpload
                                  onChange={handleImageLogoChange}
                                  className="h-auto sm:h-[175px]"
                                  style={undefined}
                                />
                              </section>
                            </section>
                          </section>
                        </section>
                        <section className="flex flex-col gap-4 w-[90%]">
                          <p className="Text1">
                            Description (Max 1000 characters)
                            <span style={{ color: 'red' }}>*</span>
                          </p>
                          <section className="inputPanel">
                            <section className="inputPanelHeader w-full">
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
                        <br />
                      </>
                      <div
                        className="text-[#00f3ef] w-[90%] text-[18px]"
                        style={{
                          maxWidth: '90%',
                          margin: '0',
                          fontSize: '14px',
                          textAlign: 'center',
                          width: '100%'
                        }}
                      >
                        <>
                          Launch Cost
                        </>
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
                            // disabled={!tokenName || !tokenSymbol || !tokenDescription || !logoFile}
                            onClick={onBlackPumpCreate}
                            className="CreateButton flex justify-center items-center"
                          >
                            {/* {!tokenName || !tokenSymbol || !tokenDescription || !logoFile ? (
                              'Please Enter Details'
                            ) : creating === false ? (
                              'Create'
                            ) : (
                              <ClipLoader
                                color={'#222'}
                                loading={creating}
                                size={30}
                                aria-label="Loading Spinner"
                                data-testid="loader"
                              />
                            )} */}
                            Create
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
